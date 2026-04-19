# Examples

This directory contains lightweight helper scripts that showcase how to use the Agentic DevOps CLI and confirm environment prerequisites.

## CLI Helpers

- `run_cli.py` – Execute the CLI entry point directly from source code
- `run_cli_help.py` – Display top-level CLI help
- `run_cli_github_help.py` – Display GitHub sub-command help

These scripts simply adjust `sys.argv` and delegate to `agentic_devops.src.cli.main()`. Use them as references for invoking the CLI programmatically.

### Example Usage

```bash
# Show CLI help
python examples/run_cli_help.py

# Show GitHub command help
python examples/run_cli_github_help.py

# Call the CLI directly
python examples/run_cli.py docker deploy --repo owner/repo --branch main --port 8080
```

## Agents Environment Check

- `check_agents_module.py` – Verifies that the OpenAI Agents SDK is importable and prints diagnostic information. Run this before executing custom agent workflows that rely on the `agents` package.

```bash
python examples/check_agents_module.py
```

## Tips

- Install the backend in editable mode (`pip install -e agentic_devops`) before running the scripts
- Set `GITHUB_TOKEN` if you plan to interact with private repositories
- Ensure the Docker daemon socket is accessible (e.g., `/var/run/docker.sock` on Linux)
