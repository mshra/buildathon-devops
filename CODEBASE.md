# CODEBASE.md

Detailed technical reference for the Agentic DevOps codebase.

## Architecture

Monorepo with two independent components connected via a backend API (frontend currently uses mock data):

```
agentic_devops/     Python backend — AI agent + AWS/GitHub services
ui/                 React/TypeScript frontend — terminal-style UI
```

No shared runtime; the frontend would call backend REST endpoints in production.

---

## Backend: `agentic_devops/`

### Directory Layout

```
src/
  __init__.py           Public API facade, re-exports all symbols
  cli.py                Argparse CLI entry point
  core/
    __init__.py          Re-exports
    config.py            Singleton config manager
    context.py           DevOpsContext pydantic model
    credentials.py       CredentialManager singleton
    guardrails.py        OpenAI Agents SDK input/output guardrails
  aws/
    __init__.py          Re-exports EC2 models + tools
    base.py              AWSBaseService, error hierarchy, @aws_operation
    ec2.py               EC2Service (inherits AWSBaseService)
    ec2_models.py        Pydantic models for Agents SDK
    ec2_tools.py         @function_tool async functions for Agents SDK
  github/
    __init__.py          Re-exports GitHub models + tools
    github.py            GitHubService (standalone)
    github_models.py     Pydantic models for Agents SDK
    github_tools.py      @function_tool async functions for Agents SDK
tests/
  aws/                   test_ec2.py, test_base.py
  core/                  test_config.py, test_credentials.py
  github/                test_github.py
  custom/                Agent integration tests
pytest.ini               Config: asyncio_mode=auto, markers
setup.py                 Package setup (devops-agent)
requirements.txt         Dependencies
```

### Module Dependencies

```
cli.py ──→ aws.ec2 ──→ aws.base ──→ core.credentials
                     ──→ core.config                     ──→ core.config
       ──→ github.github ──→ core.credentials            core.context
                            core.config              guardrails ← agents SDK
       ──→ core.config
          core.credentials

ec2_tools.py ──→ ec2_models.py ──→ pydantic
              ──→ core.context
              ──→ agents SDK (@function_tool)

github_tools.py ──→ github_models.py ──→ pydantic
                 ──→ core.context
                 ──→ PyGithub
                 ──→ agents SDK (@function_tool)
```

Circular import avoidance: `ec2.py` imports `github.github` locally inside `deploy_from_github()`, not at module level.

---

### Core Layer

#### `config.py` — Configuration Management

- Singleton pattern via module-level `_config` dict and `_config_loaded` flag
- `load_config()` merges: `DEFAULT_CONFIG` → config file (YAML/JSON) → env vars
- Env var convention: `DEVOPS_AWS__REGION` → `{"aws": {"region": value}}` (double underscore = nesting)
- `_convert_value()` auto-casts strings to `bool`, `int`, `float`, `list` (comma-separated)
- `get_config_value("aws.region")` — dot-path access into nested dict
- `set_config_value("aws.tags.Project", "x")` — creates intermediate dicts as needed
- Default config path: `~/.devops/config.yaml` (overridden by `DEVOPS_CONFIG_FILE` env var)

#### `credentials.py` — Credential Resolution

**`AWSCredentials(BaseModel)`** — holds `access_key_id`, `secret_access_key`, `session_token`, `region`, `profile`. Has `get_session()` method returning a boto3 `Session`.

**`GitHubCredentials(BaseModel)`** — holds `token`, `api_url`.

**`CredentialManager`** — singleton (`get_credential_manager()` / `set_credential_manager()`):
- AWS credential resolution priority:
  1. `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` env vars
  2. `AWS_PROFILE` env var → boto3 profile lookup
  3. Default boto3 credential chain (`~/.aws/credentials`)
  4. Falls back to empty credentials (region-only)
- GitHub credential resolution:
  1. `GITHUB_TOKEN` env var
  2. `~/.devops/credentials.json` file → `{"github": {"token": "..."}}`
  3. Raises `CredentialError` if neither found

#### `context.py` — DevOpsContext

**`DevOpsContext(BaseModel)`** carries operational context through the agent system:
- `user_id: str` (required)
- `aws_region: Optional[str]`
- `github_org: Optional[str]`
- `environment: str = "dev"`
- `metadata: Dict[str, Any]` — extensible key-value store
- Immutable helpers: `with_aws_region()`, `with_github_org()`, `with_environment()` return copies via `model_copy()`
- Passed to OpenAI Agents SDK via `RunContextWrapper[DevOpsContext]`

#### `guardrails.py` — Security Guardrails

Two OpenAI Agents SDK guardrails using regex pattern matching:

**`security_guardrail`** (`@input_guardrail`) — blocks:
- Destructive shell commands (`rm -rf /`, fork bombs, `wget | bash`, `mkfs`, `shutdown`)
- Credential strings (`AWS_ACCESS_KEY_ID`, `GITHUB_TOKEN`, `ghp_*` patterns)
- Private keys (`-----BEGIN RSA PRIVATE KEY-----`, etc.)

**`sensitive_info_guardrail`** (`@output_guardrail`) — prevents leaking:
- AWS access keys (`AKIA*`), secret key patterns
- GitHub tokens (`ghp_*`, `github_pat_*`)
- Private keys
- Internal IP ranges (10.x, 172.16-31.x, 192.168.x)
- Passwords, API keys, JDBC connection strings

Both return `GuardrailFunctionOutput` with `tripwire_triggered=bool`.

---

### AWS Layer

#### `base.py` — Foundation

**Error hierarchy:**
```
AWSServiceError(Exception)
  ├── ResourceNotFoundError     — adds resource_type, resource_id fields
  ├── PermissionDeniedError      — suggests checking IAM
  ├── ValidationError           — suggests checking input params
  ├── RateLimitError             — optional wait_time field
  └── ResourceLimitError         — suggests requesting limit increase
```
All exceptions include a `suggestion` field with remediation guidance.

**`AWSBaseService`** — abstract base class:
- `SERVICE_NAME` class attribute must be set by subclasses (e.g., `"ec2"`)
- `DEFAULT_TAGS = {'ManagedBy': 'DevOpsAgent'}` auto-applied to created resources
- `__init__(credentials, region, profile_name, endpoint_url)` — resolves creds, creates boto3 session/client/resource, verifies access
- `_verify_access()` — STS `get_caller_identity` call by default; subclasses override (EC2 calls `describe_instances`)
- `_init_clients()` — creates `self.client` and `self.resource` from session
- `handle_error(error, operation)` — translates `ClientError` error codes into typed exceptions
- `paginate(method, **kwargs)` — boto3 paginator wrapper returning flattened results
- `wait_for(waiter_name, waiter_args)` — wraps boto3 waiters with configurable `max_attempts`/`delay`
- `tag_resource()` / `get_tags()` — NotImplementedError stubs for subclasses

**`@aws_operation(operation_name)`** decorator:
- Wraps methods on `AWSBaseService` subclasses
- Catches unknown exceptions and routes through `self.handle_error()`
- Re-raises known `AWSServiceError` subtypes as-is

#### `ec2.py` — EC2Service

`EC2Service(AWSBaseService)` with `SERVICE_NAME = "ec2"`:

| Method | Description |
|--------|-------------|
| `list_instances(filters, instance_ids)` | `describe_instances` with optional filters/IDs |
| `get_instance(instance_id)` | Single instance lookup, raises `ResourceNotFoundError` |
| `create_instance(name, instance_type, ami_id, ...)` | `run_instances` with tags, wait for running |
| `start_instance(instance_id, wait)` | Start + optional waiter |
| `stop_instance(instance_id, force, wait)` | Stop + optional waiter |
| `terminate_instance(instance_id, wait)` | Terminate + optional waiter |
| `reboot_instance(instance_id)` | Reboot with 10s sleep |
| `resize_instance(instance_id, instance_type, wait)` | Stop → modify_instance_attribute → start |
| `list_security_groups / create / delete` | Security group CRUD with ingress/egress rules |
| `list_key_pairs / create / delete` | Key pair management, optional save to file |
| `list_amis / get_ami / create_ami / deregister_ami` | AMI management |
| `deploy_from_github(instance_id, repo, branch, ...)` | Generates shell script, runs via SSM SendCommand; falls back to user data |

`EC2Service.__init__` accepts `skip_verification=True` for testing (bypasses `_verify_access`).

#### `ec2_models.py` — Pydantic Models for Agents SDK

- **`EC2InstanceFilter`** — region (required), optional state/instance_type/tags/instance_ids. Has `to_aws_filters()` converting to boto3 filter format.
- **`EC2StartStopRequest`** — instance_ids (required), region (required), force (default False).
- **`EC2CreateRequest`** — image_id, instance_type, region (required); optional key_name, security_group_ids, subnet_id, user_data, tags, etc.
- **`EC2Instance`** — normalized instance model. Has `from_aws_instance()` classmethod that extracts Tags → dict, State → string, Placement → availability_zone.

#### `ec2_tools.py` — OpenAI Agents SDK Tools

Four `@function_tool()` async functions accepting `RunContextWrapper[DevOpsContext]`:
- `list_ec2_instances(ctx, filter_params: EC2InstanceFilter) → List[EC2Instance]`
- `start_ec2_instances(ctx, request: EC2StartStopRequest) → Dict`
- `stop_ec2_instances(ctx, request: EC2StartStopRequest) → Dict`
- `create_ec2_instance(ctx, request: EC2CreateRequest) → Dict`

These create boto3 clients directly from the request's `region` field, not via `EC2Service` class. This is the interface that AI agents call.

---

### GitHub Layer

#### `github.py` — GitHubService

Standalone class (no `AWSBaseService` inheritance). Uses `requests` library directly.

**Error hierarchy:**
```
GitHubError(Exception)
  ├── ResourceNotFoundError
  ├── AuthenticationError
  ├── ValidationError
  └── RateLimitError
```

**`GitHubService.__init__(token, api_url, organization, use_agent_endpoint, agent_url)`**:
- Resolves token: argument → `CredentialManager.get_github_credentials()`
- Sets `self.cache: Dict[str, Dict[str, Any]]` for response caching
- Calls `_verify_access()` on init (GET /user endpoint)

**`_make_request(method, endpoint, params, data, headers, use_cache, cache_ttl, raw_response)`**:
- Constructs full URL from `api_url` or `agent_url`
- Cache key: `{method}:{url}:{params_json}`, TTL default 60s
- Sets headers: `Accept: application/vnd.github.v3+json`, `User-Agent: DevOpsAgent/0.1.0`
- Error mapping: 404→`ResourceNotFoundError`, 401→`AuthenticationError`, 403 rate limit→`RateLimitError`, 403 other→`GitHubError`
- Returns parsed JSON (or raw response object if `raw_response=True`)

**Repository methods:**
| Method | API Call |
|--------|----------|
| `list_repositories(org, user, type, sort, direction, per_page)` | `GET /orgs/{org}/repos` or `GET /users/{user}/repos` with pagination |
| `get_repository(repo, owner)` | `GET /repos/{owner}/{repo}` |
| `create_repository(name, description, private, ...)` | `POST /orgs/{org}/repos` or `POST /user/repos` |
| `delete_repository(repo, owner)` | `DELETE /repos/{owner}/{repo}` |

**Content methods:** `get_readme`, `get_content`, `create_file`, `update_file`, `delete_file` — all use base64 encoding for content.

**Branch methods:** `list_branches`, `get_branch`, `create_branch(name, sha)`.

**`deploy_to_aws(repo, service, config)`** — bridges GitHub → EC2/S3 deployment.

#### `github_models.py` — Pydantic Models

- `GitHubRepoRequest(owner, repo)` — minimal request
- `GitHubIssueRequest` — owner, repo, state, labels, assignee, creator, sort, direction, since
- `GitHubCreateIssueRequest` — owner, repo, title, body, labels, assignees, milestone
- `GitHubPRRequest` — owner, repo, state, head, base, sort, direction
- `GitHubRepository` — normalized repo: name, full_name, description, url, default_branch, stars, forks, etc.
- `GitHubIssue` — number, title, body, state, dates, labels, assignees, milestone
- `GitHubPullRequest` — number, title, head_branch, base_branch, merge status, additions/deletions

#### `github_tools.py` — OpenAI Agents SDK Tools

Four `@function_tool()` async functions using `PyGithub`:
- `get_repository(ctx, request) → GitHubRepository`
- `list_issues(ctx, request) → List[GitHubIssue]`
- `create_issue(ctx, request) → GitHubIssue`
- `list_pull_requests(ctx, request) → List[GitHubPullRequest]`

Token resolution: `ctx.context.github_token` (from DevOpsContext metadata).

---

### CLI (`cli.py`)

Argparse-based CLI with colored output using ANSI escape codes:

```
agentic-devops ec2 list-instances [--state] [--region] [--output json|table]
agentic-devops ec2 get-instance <id> [--region] [--output]
agentic-devops ec2 create-instance --name --type --ami-id [--subnet-id] [--security-group-ids] [--key-name] [--region] [--wait]
agentic-devops ec2 start-instance <id> [--region] [--wait]
agentic-devops ec2 stop-instance <id> [--force] [--region] [--wait]
agentic-devops ec2 terminate-instance <id> [--region] [--wait]
agentic-devops ec2 deploy-from-github --instance-id --repo [--branch] [--path] [--setup-script] [--region]
agentic-devops github list-repos [--org] [--user] [--output]
agentic-devops github get-repo <repo> [--owner] [--output]
agentic-devops github get-readme <repo> [--owner] [--ref]
agentic-devops github list-branches <repo> [--owner] [--output]
agentic-devops deploy github-to-ec2 --repo --instance-id [--branch] [--path] [--setup-script] [--region]
agentic-devops deploy github-to-s3 --repo --bucket [--branch] [--source-dir] [--region]  (not yet implemented)
```

Error handling: `handle_cli_error()` maps exception types (CredentialError, GitHubError, AWSServiceError) to colored terminal messages with suggestions.

---

### Testing

**`pytest.ini`** configuration:
- `pythonpath = .` (imports from `src/`)
- `asyncio_mode = auto`
- Markers: `aws`, `github`, `integration`, `unit`, `slow`
- Log CLI enabled at INFO level

**Test pattern:**
```python
os.environ['AWS_ACCESS_KEY_ID'] = 'testing'    # Module-level mock env vars
os.environ['AWS_SECRET_ACCESS_KEY'] = 'testing'

@pytest.fixture
def aws_credentials():
    return AWSCredentials(access_key_id='testing', ...)

@pytest.fixture
def ec2_service(aws_credentials):
    return EC2Service(credentials=aws_credentials, skip_verification=True)

@mock_aws
def test_list_instances_empty(ec2_service):
    instances = ec2_service.list_instances()
    assert instances == []
```

Tests use `moto`'s `@mock_aws` decorator to mock AWS services, `pytest-mock` for patching, and `responses` for HTTP mocking.

---

## Frontend: `ui/`

### Tech Stack

- **Vite 5** with `@vitejs/plugin-react-swc` (SWC compiler)
- **React 18** + **TypeScript** (strict mode, but `noImplicitAny: false`, `strictNullChecks: false`)
- **TailwindCSS 3** with `tailwindcss-animate` plugin
- **shadcn/ui** — 49 components in `src/components/ui/`
- **React Router 6** for routing
- **TanStack Query** for data fetching
- **Path alias**: `@/` → `./src/`

### Directory Layout

```
src/
  main.tsx              Entry point
  App.tsx                Root with providers + routes
  App.css / index.css    Global styles + Tailwind
  contexts/
    DevOpsContext.tsx     React context for app state
  services/
    api.ts               fetchWithAuth<T>() — currently mock data
    ec2Service.ts        EC2 operations — mock data
    githubService.ts     GitHub operations — delegates to api.ts
  components/
    CommandPrompt.tsx    Terminal input interface
    NavigationMenu.tsx    Sidebar/navigation
    InstanceList.tsx     EC2 instance table
    RepositoryList.tsx   GitHub repo cards
    NotificationPanel.tsx System notifications
    LoadingScreen.tsx    Loading spinner
    NavButton.tsx        Navigation button
    NotificationCard.tsx  Single notification
    RuvServiceDetail.tsx Service detail view
    Timer.tsx            Timer component
    ui/                  49 shadcn/ui primitives (do not edit)
  pages/
    Index.tsx            Main dashboard
    EC2Dashboard.tsx      EC2 management page
    NotFound.tsx         404 page
  hooks/                 Custom React hooks
  utils/                 Utility functions
```

### Component Architecture

**`App.tsx`** wraps the app in this provider stack:
```
QueryClientProvider → TooltipProvider → DevOpsProvider → BrowserRouter
```

Routes: `/` → `Index`, `/ec2` → `EC2Dashboard`, `*` → `NotFound`.

**`DevOpsContext.tsx`** — React context providing:
- `ec2Instances` / `setEc2Instances` — EC2 state
- `repositories` / `setRepositories` — GitHub state
- `loading` / `setLoading` — async operation flag
- `error` / `setError` — error message

Accessed via `useDevOps()` hook (throws if used outside `DevOpsProvider`).

### Service Layer (Mock Data)

**`api.ts`** — `fetchWithAuth<T>(endpoint, options)` matches endpoints against a `mockResponses` dict. Contains 3 mock EC2 instances, 1 mock EC2 metrics payload (60 data points per metric), and 3 mock GitHub repos. Real `fetch()` calls are commented out.

**`ec2Service.ts`** — Functions return hardcoded mock data:
- `listInstances()` → 3 instances (web-server-1 running, db-server-1 stopped, dev-server running)
- `getInstance(id)` → single mock instance
- `createInstance(data)` → generates random ID, returns pending instance
- `startInstance/stopInstance/terminateInstance` → `{ success: true }`
- `getInstanceMetrics(id)` → 4 arrays of 60 random data points (cpu, memory, network, disk)

**`githubService.ts`** — `listRepositories()`, `getRepository()`, `listBranches()`, `getCommits()` delegate to `fetchWithAuth`.

### Theme System

Defined in `tailwind.config.ts`:
- **Colors**: `cyber-black (#111111)`, `cyber-darkgray (#222222)`, `cyber-neon (#d2ff3a)`, `cyber-muted (rgba(210,255,58,0.7))`, `cyber-dim (rgba(210,255,58,0.4))`
- **Fonts**: `font-mono` → JetBrains Mono, `font-micro` → VT323
- **Animations**: `animate-pulse-neon` (opacity 1→0.7→1, 2s), `animate-float-in` (opacity 0→1, translateY 10→0, 0.6s), `animate-glow` (textShadow pulse, 3s)
- **CSS variables**: shadcn/ui uses `hsl(var(--*))` pattern for `--background`, `--foreground`, `--primary`, etc.

---

## Two Invocation Paths

### 1. CLI Path (Direct Python)
```
User → shell command → cli.py → argparse
  → CredentialManager.get_aws_credentials() / get_github_credentials()
  → EC2Service(credentials=creds) or GitHubService(token=token)
  → boto3 / requests → AWS/GitHub API
  → format_output() → colored terminal output
```

### 2. AI Agent Path (OpenAI Agents SDK)
```
User prompt → OpenAI Agents SDK Runner
  → Agent picks @function_tool from ec2_tools.py / github_tools.py
  → RunContextWrapper[DevOpsContext] provides context
  → Guardrails check input (security_guardrail)
  → Tool executes: boto3 client or PyGithub
  → Guardrails check output (sensitive_info_guardrail)
  → Agent returns result to user
```

---

## Key Design Patterns

1. **Service class pattern**: AWS services extend `AWSBaseService`, set `SERVICE_NAME`, get client/resource/waiter/pagination/error-handling for free
2. **Dual interface**: Every operation has both a class method (for CLI/programmatic use) and a `@function_tool` async function (for AI agent use)
3. **Typed exceptions with suggestions**: All errors carry both a message and a remediation `suggestion` string
4. **Singleton config/credentials**: `get_config()` and `get_credential_manager()` are module-level singletons; `set_*()` allows injection for testing
5. **Pydantic models as SDK boundaries**: Agent tools use typed Pydantic request/response models, not raw dicts
6. **Frontend mock-first**: All service functions return hardcoded data with real `fetch()` calls commented out, enabling UI development before backend integration
7. **Credential resolution chain**: Multiple fallback sources (env vars → profiles → files → defaults) with clear error messages when all fail