/**
 * Parse a command string into its components
 * @param input The command string to parse
 * @returns An object containing the command, subCommand, and args
 */
export const parseCommand = (input: string) => {
  const parts = input.trim().toUpperCase().split(' ');
  const command = parts[0];
  const subCommand = parts[1] || '';
  const args = parts.slice(2);
  
  return { command, subCommand, args };
};

/**
 * Check if a command is a valid DevOps command
 * @param command The command to check
 * @returns True if the command is a valid DevOps command
 */
export const isDevOpsCommand = (command: string): boolean => {
  const devOpsCommands = ['EC2', 'S3', 'IAM', 'GITHUB', 'DEPLOY'];
  return devOpsCommands.includes(command.toUpperCase());
};

/**
 * Get help text for a specific command
 * @param command The command to get help for
 * @returns An array of help text strings
 */
export const getCommandHelp = (command: string): string[] => {
  const commandUpper = command.toUpperCase();
  
  switch (commandUpper) {
    case 'EC2':
      return [
        'EC2 Commands:',
        'EC2 LIST - List EC2 instances',
        'EC2 CREATE <type> <zone> - Create EC2 instance',
        'EC2 START <id> - Start EC2 instance',
        'EC2 STOP <id> - Stop EC2 instance'
      ];
    case 'GITHUB':
      return [
        'GitHub Commands:',
        'GITHUB REPOS - List GitHub repositories',
        'GITHUB BRANCHES <owner> <repo> - List branches in a repository',
        'GITHUB COMMITS <owner> <repo> <branch> - List commits in a branch'
      ];
    case 'DEPLOY':
      return [
        'Deployment Commands:',
        'DEPLOY GITHUB-TO-EC2 <owner> <repo> <branch> <instance-id> - Deploy from GitHub to EC2',
        'DEPLOY GITHUB-TO-S3 <owner> <repo> <branch> <bucket> - Deploy from GitHub to S3'
      ];
    default:
      return [
        'Available commands:',
        'HELP - Show this help',
        'CLEAR - Clear screen',
        'VERSION - System info',
        'EC2 - AWS EC2 operations',
        'GITHUB - GitHub operations',
        'DEPLOY - Deployment operations',
        'EXIT - Close terminal',
        '',
        'Type HELP <command> for more information on a specific command.'
      ];
  }
};