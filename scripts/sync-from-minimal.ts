#!/usr/bin/env node

import { spawnSync, type SpawnSyncReturns } from 'node:child_process'

import consola from 'consola'
import minimist from 'minimist'

type GitResult = SpawnSyncReturns<string>
type GitOptions = { capture?: boolean }

type CliArgs = {
  'source-remote': string
  'source-branch': string
  target: string
}

function runGit(args: string[], options: GitOptions = {}): GitResult {
  return spawnSync('git', args, {
    encoding: 'utf8',
    stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  })
}

function runGitOrThrow(args: string[], errorMessage: string, options: GitOptions = {}): GitResult {
  const result = runGit(args, options)
  if (result.status !== 0) {
    if (options.capture && result.stderr) consola.error(result.stderr.trim())
    throw new Error(errorMessage)
  }
  return result
}

function ensureCleanWorktree(): void {
  const result = runGitOrThrow(['status', '--porcelain'], 'Failed to read git status.', {
    capture: true,
  })
  if (result.stdout.trim()) {
    throw new Error('Working tree is not clean. Commit or stash your changes before syncing.')
  }
}

function ensureRemoteBranchExists(remote: string, branch: string): void {
  const result = runGit(['ls-remote', '--heads', remote, branch], { capture: true })
  if (result.status !== 0 || !result.stdout.trim()) {
    throw new Error(`Remote branch '${remote}/${branch}' does not exist or is not reachable.`)
  }
}

function ensureLocalBranchExists(branch: string): void {
  const result = runGit(['show-ref', '--verify', '--quiet', `refs/heads/${branch}`])
  if (result.status !== 0) {
    throw new Error(`Local target branch '${branch}' does not exist.`)
  }
}

function printUsage(): void {
  consola.box(`
Usage:
  pnpm run sync:merge -- --source-remote upstream --source-branch minimal --target nuxt

Options:
  --source-remote   Source remote name (default: origin)
  --source-branch   Source branch name (required)
  --target          Target local branch name (required)
`)
}

function parseArgs(): CliArgs {
  const args = minimist(process.argv.slice(2), {
    string: ['source-remote', 'source-branch', 'target'],
    alias: { r: 'source-remote', s: 'source-branch', t: 'target' },
    default: { 'source-remote': 'origin' },
  }) as unknown as CliArgs

  if (!args['source-branch'] || !args.target) {
    printUsage()
    throw new Error('Missing required arguments.')
  }

  return args
}

function main(): void {
  const args = parseArgs()
  const sourceRemote = args['source-remote']
  const sourceBranch = args['source-branch']
  const targetBranch = args.target

  consola.start(`Fetching '${sourceRemote}'...`)
  runGitOrThrow(['fetch', sourceRemote], `Failed to fetch remote '${sourceRemote}'.`)

  consola.start('Validating repository state...')
  ensureCleanWorktree()
  ensureRemoteBranchExists(sourceRemote, sourceBranch)
  ensureLocalBranchExists(targetBranch)

  consola.start(`Checking out '${targetBranch}'...`)
  runGitOrThrow(['checkout', targetBranch], `Failed to checkout '${targetBranch}'.`)

  const sourceRef = `${sourceRemote}/${sourceBranch}`
  consola.start(`Merging '${sourceRef}' into '${targetBranch}'...`)
  const merge = runGit(['merge', sourceRef])
  if (merge.status !== 0) {
    consola.error('Merge failed. Resolve conflicts, then run:')
    consola.info('  git add <resolved_files>')
    consola.info('  git merge --continue')
    consola.info('Or abort with:')
    consola.info('  git merge --abort')
    process.exit(1)
  }

  consola.success(`Baseline sync complete: merged '${sourceRef}' into '${targetBranch}'.`)
  consola.info('Run verification:')
  consola.info('  pnpm check-types')
  consola.info('  pnpm lint')
  consola.info('  pnpm format:check')
  consola.info('  pnpm build')
}

try {
  main()
} catch (error) {
  consola.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
