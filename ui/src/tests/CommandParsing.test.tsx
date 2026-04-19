import { describe, it, expect } from 'vitest';
import { parseCommand, isDevOpsCommand, getCommandHelp } from '../utils/commandParser';

describe('Command Parsing', () => {
  it('should correctly parse simple commands', () => {
    const result = parseCommand('HELP');
    expect(result.command).toBe('HELP');
    expect(result.subCommand).toBe('');
    expect(result.args).toEqual([]);
  });

  it('should correctly parse DevOps commands', () => {
    const result = parseCommand('EC2 LIST');
    expect(result.command).toBe('EC2');
    expect(result.subCommand).toBe('LIST');
    expect(result.args).toEqual([]);
  });

  it('should correctly parse commands with arguments', () => {
    const resultWithArgs = parseCommand('EC2 CREATE t2.micro us-east-1');
    expect(resultWithArgs.command).toBe('EC2');
    expect(resultWithArgs.subCommand).toBe('CREATE');
    expect(resultWithArgs.args).toEqual(['T2.MICRO', 'US-EAST-1']);
  });

  it('should handle extra whitespace', () => {
    const result = parseCommand('  GITHUB   REPOS  ');
    expect(result.command).toBe('GITHUB');
    expect(result.subCommand).toBe('REPOS');
    expect(result.args).toEqual([]);
  });

  it('should handle lowercase input', () => {
    const result = parseCommand('github repos');
    expect(result.command).toBe('GITHUB');
    expect(result.subCommand).toBe('REPOS');
    expect(result.args).toEqual([]);
  });
});

describe('DevOps Command Validation', () => {
  it('should identify valid DevOps commands', () => {
    expect(isDevOpsCommand('EC2')).toBe(true);
    expect(isDevOpsCommand('GITHUB')).toBe(true);
    expect(isDevOpsCommand('DEPLOY')).toBe(true);
  });

  it('should identify invalid DevOps commands', () => {
    expect(isDevOpsCommand('HELP')).toBe(false);
    expect(isDevOpsCommand('VERSION')).toBe(false);
    expect(isDevOpsCommand('UNKNOWN')).toBe(false);
  });

  it('should handle case insensitivity', () => {
    expect(isDevOpsCommand('ec2')).toBe(true);
    expect(isDevOpsCommand('Github')).toBe(true);
  });
});

describe('Command Help Text', () => {
  it('should return general help when no command is specified', () => {
    const help = getCommandHelp('');
    expect(help).toContain('Available commands:');
    expect(help.length).toBeGreaterThan(5);
  });

  it('should return EC2 specific help', () => {
    const help = getCommandHelp('EC2');
    expect(help).toContain('EC2 Commands:');
    expect(help).toContain('EC2 LIST - List EC2 instances');
  });

  it('should return GitHub specific help', () => {
    const help = getCommandHelp('GITHUB');
    expect(help).toContain('GitHub Commands:');
    expect(help).toContain('GITHUB REPOS - List GitHub repositories');
  });

  it('should return Deploy specific help', () => {
    const help = getCommandHelp('DEPLOY');
    expect(help).toContain('Deployment Commands:');
    expect(help).toContain('DEPLOY GITHUB-TO-EC2');
  });
});