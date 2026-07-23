# Branch Sync Runbook

This runbook defines how to keep specialized template branches synced with the shared boilerplate branch.

## Model

- `minimal` is the baseline for reusable JS/TS boilerplate.
- Template branches (for example `nuxt`) build on top of `minimal`.
- Sync strategy is hybrid:
  - regular baseline merges
  - selective cherry-picks when only some branches need a change

## Fork setup

In a forked project, configure remotes once:

```sh
# this is done automatically when you run the init script (see README.md)
git remote -v
git remote add upstream https://github.com/Sioood/hornet_security-test.git
git fetch upstream
```

- `origin`: your fork.
- `upstream`: source template repository.

## Baseline sync

Use the merge helper to bring a full baseline branch into a target branch.

```sh
pnpm run sync:merge -- --source-remote upstream --source-branch minimal --target nuxt
```

This command:

- fetches the source remote
- checks for a clean working tree
- checks out target branch
- merges `<source-remote>/<source-branch>` into target branch

## Selective sync

Use selective picks for optional changes.

Single commit:

```sh
pnpm run sync:pick -- --source-remote upstream --source-branch minimal --target nuxt --commit <sha>
```

Range:

```sh
pnpm run sync:pick -- --source-remote upstream --source-branch minimal --target nuxt --range <start>..<end>
```

Path-focused workflow (manual):

```sh
git fetch upstream
git checkout nuxt
git checkout upstream/minimal -- <path_to_folder_or_file>
```

## Conflict recovery

Merge conflicts:

```sh
git status
git add <resolved_files>
git merge --continue
```

Abort merge:

```sh
git merge --abort
```

Cherry-pick conflicts:

```sh
git status
git add <resolved_files>
git cherry-pick --continue
```

Skip problematic commit:

```sh
git cherry-pick --skip
```

Abort cherry-pick sequence:

```sh
git cherry-pick --abort
```

## Validation checklist

Run after every sync:

```sh
pnpm check-types
pnpm lint
pnpm format:check
pnpm build
```

## Commit and PR conventions

- Keep sync commits separate from feature work.
- Recommended titles:
  - `chore(sync): merge minimal into nuxt`
  - `chore(sync): cherry-pick minimal commits into nuxt`
- Open a dedicated PR per sync wave when possible.
