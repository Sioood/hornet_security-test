#!/usr/bin/env node
/// <reference types="node" />

import { spawnSync, type SpawnSyncReturns } from 'node:child_process'

import consola from 'consola'
import minimist from 'minimist'

type GitResult = SpawnSyncReturns<string>
type GitOptions = { capture?: boolean }

type CliArgs = {
  'source-remote': string
  'source-branch': string
  target: string
  commit?: string
  range?: string
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
    throw new Error(
      'Working tree is not clean. Commit or stash your changes before cherry-picking.',
    )
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

function commitExistsInSource(commit: string, sourceRef: string): boolean {
  const result = runGit(['branch', '--remote', '--contains', commit], { capture: true })
  if (result.status !== 0) return false
  return result.stdout.split('\n').some((line) => line.replace('*', '').trim() === sourceRef)
}

function parseCommits(args: CliArgs): string[] {
  if (args.commit && args.range) {
    throw new Error('Use either --commit or --range, not both.')
  }

  if (args.commit) return [args.commit]

  if (args.range) {
    const list = runGitOrThrow(
      ['rev-list', '--reverse', args.range],
      `Invalid commit range '${args.range}'.`,
      {
        capture: true,
      },
    )
    const commits = list.stdout
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    if (!commits.length) throw new Error(`No commits found for range '${args.range}'.`)
    return commits
  }

  throw new Error('Missing commit selector. Use --commit <sha> or --range <start>..<end>.')
}

function printUsage(): void {
  consola.box(`
Usage:
  pnpm run sync:pick -- --source-remote upstream --source-branch minimal --target nuxt --commit <sha>
  pnpm run sync:pick -- --source-remote upstream --source-branch minimal --target nuxt --range <start>..<end>

Options:
  --source-remote   Source remote name (default: origin)
  --source-branch   Source branch name (required)
  --target          Target local branch name (required)
  --commit          Single commit SHA to pick
  --range           Commit range (start..end)
`)
}

function parseArgs(): CliArgs {
  const args = minimist(process.argv.slice(2), {
    string: ['source-remote', 'source-branch', 'target', 'commit', 'range'],
    alias: { r: 'source-remote', s: 'source-branch', t: 'target', c: 'commit' },
    default: { 'source-remote': 'origin' },
  }) as unknown as CliArgs

  if (!args['source-branch'] || !args.target) {
    printUsage()
    throw new Error('Missing required branch arguments.')
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

  const sourceRef = `${sourceRemote}/${sourceBranch}`
  const commits = parseCommits(args)

  for (const commit of commits) {
    if (!commitExistsInSource(commit, sourceRef)) {
      throw new Error(`Commit '${commit}' is not contained in '${sourceRef}'.`)
    }
  }

  consola.start(`Checking out '${targetBranch}'...`)
  runGitOrThrow(['checkout', targetBranch], `Failed to checkout '${targetBranch}'.`)

  for (const commit of commits) {
    consola.start(`Cherry-picking '${commit}' onto '${targetBranch}'...`)
    const pick = runGit(['cherry-pick', commit])
    if (pick.status !== 0) {
      consola.error(`Cherry-pick failed on '${commit}'. Resolve conflicts, then run:`)
      consola.info('  git add <resolved_files>')
      consola.info('  git cherry-pick --continue')
      consola.info('Or skip/abort:')
      consola.info('  git cherry-pick --skip')
      consola.info('  git cherry-pick --abort')
      process.exit(1)
    }
  }

  consola.success(
    `Selective sync complete: picked ${commits.length} commit(s) into '${targetBranch}'.`,
  )
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
