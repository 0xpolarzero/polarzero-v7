# Contribution audit: evmts/guillotine-mini

Audit date: 2026-05-08

Repository audited: https://github.com/evmts/guillotine-mini

Local clone audited: `/Users/polarzero/code/tevm/guillotine-mini`

Requested identity: `0xpolarzero` / `polarzero`

## Executive conclusion

Using the strict GitHub/user identity requested, the confirmed contribution span is:

- First confirmed GitHub contribution: 2025-11-07 15:36:12 UTC, issue #33 (`bug: zig build`).
- First confirmed code commit: 2025-11-07 18:11:45 UTC, CI workflow commit for PR #35.
- Last confirmed merged/shipped PR activity: 2026-02-06 10:43:35 UTC, PR #35 merged.
- Last observed local/fork work under the requested identity: 2026-03-19 12:06:00 +01:00, local branch `codex/fix-create-address-multibyte-nonce`.

So the strict observed span is 2025-11-07 through 2026-03-19 when local/fork-only work is included. The strict merged upstream code span is narrower: two authored commits from 2025-11-07, merged into upstream on 2026-02-06.

Confirmed merged contribution areas:

- GitHub Actions CI: added `.github/workflows/ci.yml` with checkout/submodules, Zig 0.15.1 setup, cargo cache, `zig build`, and `zig build test`.
- WASI/WASM build repair: added a no-op exported `main` symbol in `src/root_c.zig` for `wasm32-wasi` linking.
- Bug reporting/triage: opened build and test failure issues #33 and #34 before the two PRs.

Related ported-lineage note:

- The strict `0xpolarzero` history in `evmts/guillotine-mini` does not show the tracing implementation itself. However, `0xpolarzero` did extensive MinimalEvm tracing/debugging work in `evmts/guillotine` across debug hooks, memory tracing, prestate/debugging tracers, CLI/devtool execution views, log/call-result surfacing, and MinimalEvm execution/spec-debug infrastructure. `guillotine-mini` later gained tracing code under other authors as part of the split/port. Public wording can therefore mention this as tracing/debugging work originally developed in `guillotine` and later carried into `guillotine-mini`, but should not present the tracing commits in `guillotine-mini` as directly authored there by `0xpolarzero`.

Observed but not confirmed merged upstream:

- March 2026 local/fork `codex/*` branches for EVM CREATE address handling, system-call buffer lifetime, spec runner sender derivation, engine JSON-RPC quantity parsing/aliasing, txpool test expectations, and TypeScript trie empty-root behavior.

Important identity caveat:

- The repository contains a much larger history by `William Cory`, `Will Cory`, and GitHub user `roninjin10`. That history is not counted as the requested `0xpolarzero` / `polarzero` contribution unless an external identity mapping is supplied. The local clone strongly exposes those identities, but GitHub profile evidence only shows `roninjin10` as `Will Cory`, while `0xpolarzero` has profile name `polarzero`. I therefore exclude the William/roninjin10 work from the strict contribution total and list it only under uncertainty.

## Identity model

Included as strict matches:

- GitHub login `0xpolarzero`.
- GitHub login `Polarzero` / `polarzero` checked separately; no PRs or issues found in this repo.
- Git author `0xpolarzero <0xpolarzero@gmail.com>`.

Excluded unless explicitly aliased later:

- GitHub login `roninjin10`, profile name `Will Cory`.
- Git authors `William Cory <willcory10@gmail.com>`, `William Cory <williamcory@Williams-Mac-mini.local>`, `Will Cory <willcory10@gmail.com>`.
- Bot commits using `willcory10@gmail.com`.

The exclusion matters because the local repository has 1,375 commits reachable from `upstream/main` matching William/Will/Cory-style identities, plus 314 more matching that broad identity set outside `upstream/main`. Those are far larger than the strict `0xpolarzero` contribution set and would materially change the audit if they were intentionally part of the requested identity.

## Confirmed GitHub contributions

### Issues

| Issue | State | Created | Area | Evidence |
| --- | --- | ---: | --- | --- |
| #33 `bug: zig build` | Open | 2025-11-07 15:36:12 UTC | Build failure triage | Reported `zig build` failing in the `wasm32-wasi` executable link with `undefined symbol: main`. |
| #34 `bug: zig build test` | Open | 2025-11-07 15:36:41 UTC | Test failure triage | Reported `zig build test` with 452/513 passed, 61 failed, and 19 leaked. |

Issue #33 directly lines up with the later WASI build fix in PR #36.

### Pull requests

| PR | State | Created | Merged | Files | Net diff | Area |
| --- | --- | ---: | ---: | --- | ---: | --- |
| #35 `chore: add ci` | Merged | 2025-11-07 18:12:50 UTC | 2026-02-06 10:43:35 UTC | `.github/workflows/ci.yml` | +30 / -0 | CI workflow |
| #36 `fix: WASI build` | Merged | 2025-11-07 18:22:18 UTC | 2026-02-06 10:42:57 UTC | `src/root_c.zig` | +13 / -0 | WASI/WASM build |

No PRs authored by `Polarzero` were found.

No open PRs authored by `0xpolarzero` were found.

Both PRs had no comments, reviews, or status check rollup entries returned by `gh pr view`.

## Confirmed merged/shipped code

These commits are reachable from `upstream/main` and have author `0xpolarzero <0xpolarzero@gmail.com>`.

| Commit | Authored | Subject | Files | Net diff | Contribution area |
| --- | ---: | --- | --- | ---: | --- |
| `5566035833b23f97931a49c944462cbdc399b306` | 2025-11-07 19:11:45 +01:00 | `chore: add ci workflow` | `.github/workflows/ci.yml` | +30 / -0 | Added GitHub Actions CI on push and PR, running on `macos-latest`, checking out submodules recursively, installing Zig 0.15.1, caching cargo, then running `zig build` and `zig build test`. |
| `2bd1b5f72950b9bdb9ff8b71374b125342d606c5` | 2025-11-07 19:19:40 +01:00 | `fix: export main function for wasi` | `src/root_c.zig` | +13 / -0 | Added a WASI-only no-op `main(int, char**)` export so the WASI libc link succeeds while leaving non-WASI builds untouched. |

Upstream merge commits present in local `upstream/main`:

- `5d8b5f619c4440dd8f9c242afd5653729cf3c894`, 2026-02-06 02:42:57 -08:00: `Merge pull request #36 from 0xpolarzero/11-07-fix-wasm-build`.
- `dd0f240cd6727872786704f5f7600f0146523210`, 2026-02-06 02:43:34 -08:00: `Merge pull request #35 from 0xpolarzero/11-07-add-ci-workflow`.

There is a minor GitHub/local mismatch: `gh pr list` returned different `mergeCommit.oid` values for PR #35 and #36 than the merge commits currently reachable from fetched `upstream/main`. The PRs are still clearly reported as merged by GitHub, and local `upstream/main` contains the two `0xpolarzero` authored changes plus merge commits referencing the PR numbers.

## Worked-on but not confirmed merged upstream

These strict `0xpolarzero <0xpolarzero@gmail.com>` commits are visible locally or in the user fork but are not reachable from `upstream/main` as of the fetched state on 2026-05-08.

| Commit | Authored | Branch/ref evidence | Files | Net diff | Area |
| --- | ---: | --- | --- | ---: | --- |
| `289748a5b88eb42b6b90eb951d19e64d8b52f4ef` | 2026-03-19 11:04:02 +01:00 | `codex/fix-engine-quantity-reexport`, `codex/fix-engine-quantity-alias` | `client/engine/api.zig` | +23 / -21 | Restored engine `Quantity` struct alias. |
| `0edd37264aa3e53d3f07cdbd280c7c4053a87a09` | 2026-03-19 11:15:41 +01:00 | `codex/fix-trie-empty-root-effect-mismatch` | `client-ts/trie/NodeLoader.ts`, `client-ts/trie/NodeStorage.ts` | +5 / -4 | Restored pure empty trie root checks in the TypeScript trie implementation. |
| `6daee0f38184def3e9bcc175499122cbaaca7a31` | 2026-03-19 11:17:46 +01:00 | `codex/fix-txpool-invalid-config-expectation`, `codex/fix-engine-api-quantity-test-construction` | `client-ts/txpool/TxPool.test.ts` | +1 / -3 | Kept invalid txpool config assertion on `TxPoolLive`. |
| `506693a9bb937af4957b9e3b93522e2fb67afd7c` | 2026-03-19 11:28:58 +01:00 | `codex/fix-spec-runner-secret-key-sender`, `codex/fix-engine-transition-config-jsonrpc-quantity` | `client/engine/api.zig` | +26 / -22 | Built engine API JSON-RPC wrappers through the typed parser. |
| `db39f8fad16a00382138dd93091c41ad7b88d400` | 2026-03-19 11:58:30 +01:00 | `origin/codex/fix-state-spec-secretkey-sender-derivation`, local same branch | `test/specs/runner.zig` | +50 / -44 | Derived spec sender from secret key in the spec runner. |
| `76d822463c6637b675fc5d583b54ae982b51b1cf` | 2026-03-19 12:03:16 +01:00 | `codex/fix-system-call-buffer-lifetime` | `src/instructions/handlers_system.zig` | +0 / -18 | Removed early frees/deferred buffer release in system handlers so call/init buffers live for the frame lifetime. |
| `6a35c872b4ad81307cde798bf2824afe1dccbc01` | 2026-03-19 12:06:00 +01:00 | `HEAD -> codex/fix-create-address-multibyte-nonce` | `src/evm.zig` | +1 / -55 | Replaced manual CREATE address RLP/keccak logic with shared `computeCreateAddress`, specifically addressing multi-byte nonce behavior. |

Two additional non-upstream commit hashes are PR-head equivalents of merged changes:

- `3580a72997d1b01ce01fc1ae5c4c3405e9847f4c`, on `origin/11-07-add-ci-workflow`, same subject and timestamp as the shipped CI commit but not the hash reachable from `upstream/main`.
- `819e9b3b5e8e3dc8a4397cc8cfd0f4deed60a4c6`, on `origin/11-07-fix-wasm-build`, same subject and timestamp as the shipped WASI commit but not the hash reachable from `upstream/main`.

I treat these as semantically shipped through PR #35 and #36, not as separate unmerged work.

## Contribution areas by evidence

### Build and CI

Strict shipped work:

- Added first-party CI workflow for build and test.
- Installed Zig 0.15.1 in CI.
- Ensured submodules are available in CI through recursive checkout.
- Cached cargo directories and `target`.
- Ran `zig build` and `zig build test` in CI.

Strict triage:

- Opened `zig build` and `zig build test` bug reports.

### WASI/WASM

Strict shipped work:

- Diagnosed the WASI libc link failure caused by missing `main`.
- Added a WASI-only exported no-op `main` in `src/root_c.zig`.
- Kept the fix scoped with a compile-time `builtin.target.os.tag == .wasi` guard.

### EVM correctness and runtime behavior

Observed unmerged work:

- CREATE address calculation for multi-byte nonces via shared helper.
- System opcode handler buffer lifetime changes for CREATE/CALL-like operations.

### Engine API and JSON-RPC typing

Observed unmerged work:

- Engine `Quantity` alias restoration.
- JSON-RPC wrapper construction through typed parser in `client/engine/api.zig`.

### Test/spec infrastructure

Observed unmerged work:

- Spec runner sender derivation from secret key.
- Txpool invalid config expectation correction.

### TypeScript trie behavior

Observed unmerged work:

- Empty trie root checks in `client-ts/trie/NodeLoader.ts` and `client-ts/trie/NodeStorage.ts`.

## Excluded larger repository history

The repository has extensive work by identities that may be adjacent to the local environment but are not the requested strict identity:

- `William Cory <willcory10@gmail.com>`
- `William Cory <williamcory@Williams-Mac-mini.local>`
- `Will Cory <willcory10@gmail.com>`
- GitHub user `roninjin10`, profile name `Will Cory`

Examples of excluded areas from those identities include the initial mini EVM extraction, EVM implementation work, spec test generation, hardfork fixes, TypeScript SDK work, FFI/native build work, primitives/Voltaire migrations, JSON-RPC/server work, txpool work, and many documentation/reporting commits. These are not included in the strict `0xpolarzero` / `polarzero` contribution span.

If `roninjin10` or the William/Will Cory commit identities are intentionally part of the same user identity, the span changes dramatically to at least 2025-09-30 through 2026-05-03 on `upstream/main`, with 1,375 matching commits reachable from upstream main in the local clone. That broader interpretation is not used for the headline conclusion because the requested identity was `0xpolarzero/polarzero` and GitHub profile checks did not prove the alias.

## Uncertainty and limitations

- GitHub user `polarzero` resolves as `Polarzero` and had no PRs or issues in this repo from the commands run. GitHub user `0xpolarzero` has profile name `polarzero`, so this audit treats `0xpolarzero` as the active requested GitHub identity.
- The `gh pr list` `mergeCommit.oid` values for PR #35/#36 were not present in the fetched local object database, while local `upstream/main` has merge commits referencing the same PRs and contains the authored changes. This may reflect force-push/rewrite, stale PR metadata, or incomplete pull-ref fetching. It does not change the conclusion that both PRs are merged and shipped.
- Local `git log --all --not upstream/main` includes PR-head commits whose patches are already present in upstream under different hashes. I separated those from truly unmerged March 2026 local work.
- I did not run builds or tests. This was an attribution and history audit, not a functional validation.
- The website repository already had unrelated local state; this audit only added this markdown file.
- `git fetch --all --prune` was run in the guillotine-mini clone to update remote refs before analysis.

## Commands and sources used

Local repository and remotes:

```sh
pwd
ls -la /Users/polarzero/code/tevm/guillotine-mini
git -C /Users/polarzero/code/tevm/guillotine-mini remote -v
git -C /Users/polarzero/code/tevm/guillotine-mini status --short --branch
git -C /Users/polarzero/code/tevm/guillotine-mini fetch --all --prune
git -C /Users/polarzero/code/tevm/guillotine-mini branch -r --sort=committerdate
```

GitHub authentication and repository metadata:

```sh
gh auth status
gh repo view evmts/guillotine-mini --json nameWithOwner,defaultBranchRef,createdAt,updatedAt,url,description
gh api users/0xpolarzero --jq '{login,name,email,company,bio,created_at,html_url}'
gh api users/polarzero --jq '{login,name,email,company,bio,created_at,html_url}'
gh api users/roninjin10 --jq '{login,name,email,company,bio,created_at,html_url}'
```

PR and issue metadata:

```sh
gh pr list -R evmts/guillotine-mini --author 0xpolarzero --state all --limit 200 --json number,title,state,createdAt,updatedAt,mergedAt,closedAt,headRefName,baseRefName,url,isDraft,additions,deletions,changedFiles,mergeCommit,labels
gh pr list -R evmts/guillotine-mini --author polarzero --state all --limit 200 --json number,title,state,createdAt,updatedAt,mergedAt,closedAt,headRefName,baseRefName,url,isDraft,additions,deletions,changedFiles,mergeCommit,labels
gh pr list -R evmts/guillotine-mini --state all --limit 200 --json number,title,state,author,createdAt,mergedAt,closedAt,headRefName,baseRefName,url,isDraft,additions,deletions,changedFiles
gh pr view 35 -R evmts/guillotine-mini --json number,title,state,createdAt,mergedAt,author,url,headRefName,baseRefName,additions,deletions,changedFiles,files,commits
gh pr view 36 -R evmts/guillotine-mini --json number,title,state,createdAt,mergedAt,author,url,headRefName,baseRefName,additions,deletions,changedFiles,files,commits
gh pr view 35 -R evmts/guillotine-mini --comments --json reviews,comments,statusCheckRollup
gh pr view 36 -R evmts/guillotine-mini --comments --json reviews,comments,statusCheckRollup
gh search prs --repo evmts/guillotine-mini --author 0xpolarzero --state open --json number,title,state,createdAt,closedAt,url --limit 100
gh search prs --repo evmts/guillotine-mini --author 0xpolarzero --state closed --json number,title,state,createdAt,closedAt,url --limit 100
gh search prs --repo evmts/guillotine-mini --author Polarzero --state open --json number,title,state,createdAt,closedAt,url --limit 100
gh search prs --repo evmts/guillotine-mini --author Polarzero --state closed --json number,title,state,createdAt,closedAt,url --limit 100
gh issue list -R evmts/guillotine-mini --author 0xpolarzero --state all --limit 100 --json number,title,state,createdAt,closedAt,url,labels
gh issue list -R evmts/guillotine-mini --author Polarzero --state all --limit 100 --json number,title,state,createdAt,closedAt,url,labels
gh issue view 33 -R evmts/guillotine-mini --json number,title,state,createdAt,author,url,body,comments
gh issue view 34 -R evmts/guillotine-mini --json number,title,state,createdAt,author,url,body,comments
```

Git author and reachability analysis:

```sh
git -C /Users/polarzero/code/tevm/guillotine-mini shortlog -sne --all
git -C /Users/polarzero/code/tevm/guillotine-mini log --all --author='0xpolarzero\|polarzero\|William Cory\|Will Cory\|willcory10@gmail.com\|0xpolarzero@gmail.com' --date=iso-strict --format='%H%x09%aI%x09%cI%x09%an%x09%ae%x09%d%x09%s'
git -C /Users/polarzero/code/tevm/guillotine-mini log upstream/main --author='0xpolarzero\|0xpolarzero@gmail.com' --format='%H %aI %an <%ae> %s'
git -C /Users/polarzero/code/tevm/guillotine-mini log upstream/main --author='0xpolarzero\|0xpolarzero@gmail.com' --numstat --format='COMMIT %H %s'
git -C /Users/polarzero/code/tevm/guillotine-mini log --all --not upstream/main --author='0xpolarzero\|0xpolarzero@gmail.com' --format='%H%x09%aI%x09%D%x09%s'
git -C /Users/polarzero/code/tevm/guillotine-mini log --all --not upstream/main --author='0xpolarzero\|0xpolarzero@gmail.com' --numstat --format='COMMIT %H %s'
git -C /Users/polarzero/code/tevm/guillotine-mini log upstream/main --grep='pull request #3[56]' --format='%H%x09%aI%x09%an%x09%ae%x09%s'
git -C /Users/polarzero/code/tevm/guillotine-mini branch -r --contains <commit>
```

Diff inspection:

```sh
git -C /Users/polarzero/code/tevm/guillotine-mini show --stat --oneline --no-renames 6a35c872b4ad81307cde798bf2824afe1dccbc01 76d822463c6637b675fc5d583b54ae982b51b1cf db39f8fad16a00382138dd93091c41ad7b88d400 506693a9bb937af4957b9e3b93522e2fb67afd7c 6daee0f38184def3e9bcc175499122cbaaca7a31 0edd37264aa3e53d3f07cdbd280c7c4053a87a09 289748a5b88eb42b6b90eb951d19e64d8b52f4ef 2bd1b5f72950b9bdb9ff8b71374b125342d606c5 5566035833b23f97931a49c944462cbdc399b306
git -C /Users/polarzero/code/tevm/guillotine-mini show --format=fuller --no-ext-diff 2bd1b5f72950b9bdb9ff8b71374b125342d606c5 -- src/root_c.zig
git -C /Users/polarzero/code/tevm/guillotine-mini show --format=fuller --no-ext-diff 5566035833b23f97931a49c944462cbdc399b306 -- .github/workflows/ci.yml
git -C /Users/polarzero/code/tevm/guillotine-mini show --format=fuller --no-ext-diff 6a35c872b4ad81307cde798bf2824afe1dccbc01 76d822463c6637b675fc5d583b54ae982b51b1cf -- src/evm.zig src/instructions/handlers_system.zig
```
