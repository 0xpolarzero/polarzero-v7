# Tevm Contribution Audit for polarzero

Date of audit: 2026-05-08

This report audits Tevm-related contribution evidence for GitHub user `0xpolarzero` / `polarzero` in:

- Local repo `/Users/polarzero/code/tevm/tevm-monorepo`, GitHub `evmts/tevm-monorepo`
- Local repo `/Users/polarzero/code/tevm/guillotine`, GitHub `evmts/guillotine`
- GitHub `evmts/chop`, via `gh` only

The goal is to determine the actual contribution span without overclaiming, and to distinguish shipped end-to-end work from work that was opened, explored, closed, stacked, or still open.

## Executive Summary

The strongest defensible claim is:

> polarzero had substantial Tevm-related contribution evidence from 2025-03-20 through 2025-10-13, with shipped/merged work landing from 2025-03-20 through 2025-12-21 because several authored PRs were merged months after the apparent active work period.

Breakdown:

- `evmts/tevm-monorepo`: first merged PR authored by `0xpolarzero` was opened on 2025-03-20 and merged on 2025-03-20. Local authored commit history on `origin/main` spans 2025-03-21 through 2025-12-21, but the December 2025 commits correspond to earlier long-lived PRs merging late. Local branch/WIP evidence for the open compiler API work extends active work to 2025-10-13.
- `evmts/guillotine`: merged PRs authored by `0xpolarzero` span 2025-07-29 through 2025-10-05 by merge date; local authored commits on `origin/main` also span 2025-07-29 through 2025-10-05.
- `evmts/chop`: accessible via `gh`, but I found no PRs or commits authored by `0xpolarzero` with the commands used. I would not claim contribution to `chop` based on this audit.

Counts from GitHub PR metadata:

| Repo                  | Merged PRs | Closed/unmerged PRs | Open PRs |
| --------------------- | ---------: | ------------------: | -------: |
| `evmts/tevm-monorepo` |         67 |                  21 |        1 |
| `evmts/guillotine`    |         58 |                  52 |        2 |
| `evmts/chop`          |          0 |                   0 |        0 |

## Identity and Attribution

Evidence links these identities:

- GitHub authenticated account: `0xpolarzero`
- GitHub profile name in PR metadata: `polarzero`
- Commit author names/emails seen locally:
  - `0xpolarzero <0xpolarzero@gmail.com>`
  - `polarzero <99199454+0xpolarzero@users.noreply.github.com>`

I treated those as the same contributor for this report.

## Span Conclusions

### Shipped / Landed Span

This is the span where authored work is visible as merged PRs or commits on `origin/main`.

| Repo                  |             First shipped evidence |                      Last shipped evidence | Notes                                                                                                                      |
| --------------------- | ---------------------------------: | -----------------------------------------: | -------------------------------------------------------------------------------------------------------------------------- |
| `evmts/tevm-monorepo` | 2025-03-20, PR #1567 opened/merged | 2025-12-21, PRs #1728, #1730, #1995 merged | December merges appear to be late landings of work opened May/October 2025, not necessarily fresh December implementation. |
| `evmts/guillotine`    |  2025-07-29, PR #289 opened/merged |          2025-10-05, PR #836 opened/merged | Local `origin/main` authored commit span agrees with this range.                                                           |
| `evmts/chop`          |                         none found |                                 none found | No authored PRs or commits found through `gh`.                                                                             |

### Active Work Span

This is a more conservative estimate of when implementation work appears to have happened, using PR creation dates, local branch commits, and local authored commit dates.

| Repo                  |          Active work evidence | Basis                                                                                                                                        |
| --------------------- | ----------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `evmts/tevm-monorepo` | 2025-03-20 through 2025-10-13 | Merged PR creation dates from 2025-03-20 through 2025-10-07, plus local authored commits on the open compiler API branch through 2025-10-13. |
| `evmts/guillotine`    | 2025-07-29 through 2025-10-05 | Merged PR creation/merge dates and local `origin/main` authored commits.                                                                     |
| `evmts/chop`          |                    none found | No contribution evidence found.                                                                                                              |

I would avoid saying “worked on Tevm through December 2025” unless the statement is explicitly about merge/landing dates. A safer wording is: “authored Tevm work that landed as late as December 2025, with direct implementation evidence through October 2025.”

## Work Shipped End-to-End

I use “shipped end-to-end” here to mean authored PRs that reached `MERGED` state, especially when the file list shows implementation, tests, docs, or release metadata. This does not prove sole authorship of every line after review or merge conflict resolution, but it is strong evidence that the user drove the change to a merged state.

### `evmts/tevm-monorepo`

#### Solc Storage Layout Types

Shipped in:

- PR #1567, `feat: add storage layout types to solc integration`, opened/merged 2025-03-20
- PR #1588, `solc: fix storage layout output type`, opened/merged 2025-03-24

Concrete areas/files:

- `bundler-packages/solc/src/solcTypes.ts`
- `bundler-packages/solc/src/solcTypes.spec.ts`
- `bundler-packages/solc/src/index.ts`
- generated docs under `bundler-packages/solc/docs/...`

Assessment: shipped end-to-end.

#### Call, Transaction, and Debug Trace Behavior

Shipped in:

- PR #1625, `fix: parsing caller parameter on a call`, opened/merged 2025-04-22
- PR #1632, `feat: prestateTracer & additional debug_ methods`, opened 2025-04-24, merged 2025-04-28
- PR #1636, `fix: account/tx nonce in createTransaction`, opened/merged 2025-04-27/28
- PR #1637, `fix: blockchain deep copy in vm.deepCopy`, opened/merged 2025-04-27/28
- PR #1643, `refactor: debug_x methods consistent with geth`, opened 2025-04-29, merged 2025-05-02
- PR #1664, `fix: txpool events`, opened 2025-05-15, merged 2025-05-16
- PR #1727, `fix: skip balance & nonce in mineHandler`, opened 2025-05-27, merged 2025-05-28
- PRs #1779, #1780, #1813, #1829, #1882-#1886, #1892, #1976 for revert handling, decoding, error code standardization, debug trace exports, `getBalance`, `getBlock`, and failed transaction handling.

Concrete areas/files:

- `packages/actions/src/Call/*`
- `packages/actions/src/CreateTransaction/createTransaction.js`
- `packages/actions/src/Mine/mineHandler.spec.ts`
- `packages/actions/src/debug/*`
- `packages/actions/src/internal/runCallWithPrestateTrace.js`
- `packages/actions/src/internal/runCallWithCallTrace.js`
- `packages/actions/src/internal/serializeTraceResult.js`
- `packages/vm/src/actions/runTx.ts`
- `packages/txpool/src/TxPool.ts`
- `packages/errors/src/ethereum/RevertError.js`
- docs under `tevm/docs/actions/...`

Assessment: shipped end-to-end across several related Tevm runtime/API fixes and debug tracing improvements.

#### MUD Plugin and Example

Shipped in:

- PR #1728, `feat: mud plugin`, opened 2025-05-27, merged 2025-12-21
- PR #1729, `refactor: make mud plugin work correctly`, opened/merged 2025-05-27/2025-06-02
- PR #1730, `init: mud example`, opened 2025-05-27, merged 2025-12-21

Concrete areas/files:

- `bundler-packages/mud/src/createOptimisticHandler.ts`
- `bundler-packages/mud/src/internal/FieldLayout.ts`
- `bundler-packages/mud/src/internal/decorators/*`
- `bundler-packages/mud/src/internal/mud/*`
- `bundler-packages/mud/src/react/*`
- `examples/mud/...`

Assessment: shipped, but note the long lag between authoring/opening and final merge for #1728/#1730. It is fair to say the user authored and shipped the MUD plugin/example; it is less safe to claim December 2025 active work solely from the merge date.

#### `@tevm/test-matchers`

Shipped in:

- PR #1746, `init: @tevm/test-matchers`, opened 2025-05-29, merged 2025-06-03
- PR #1748, base matchers, opened 2025-05-29, merged 2025-06-15
- PR #1775, chainable Vitest matchers, opened 2025-06-03, merged 2025-06-15
- PR #1776, event matchers, opened 2025-06-03, merged 2025-06-15
- PR #1823, error matchers, opened 2025-06-10, merged 2025-06-18
- PRs #1876, #1878-#1881, #1887-#1905, #1936-#1940, #1995, #1996 for state, balance, token balance, contract function, test adoption, docs, and release/publish integration.

Concrete areas/files:

- `extensions/test-matchers/package.json`
- `extensions/test-matchers/README.md`
- `extensions/test-matchers/src/index.ts`
- `extensions/test-matchers/src/chainable/*`
- `extensions/test-matchers/src/matchers/utils/*`
- `extensions/test-matchers/src/matchers/events/*`
- `extensions/test-matchers/src/matchers/errors/*`
- `extensions/test-matchers/src/matchers/state/*`
- `extensions/test-matchers/src/matchers/balance/*`
- `extensions/test-matchers/src/matchers/contract/*`
- adoption in `packages/actions`, `packages/blockchain`, `packages/contract`, `packages/memory-client`, and `packages/state` tests.

Assessment: shipped end-to-end. This is one of the clearest sustained contribution areas.

#### `@tevm/test-node` and RPC Snapshot Testing

Shipped in:

- PR #1909, `init: test-node extension`, opened 2025-06-24, merged 2025-07-09
- PR #1910, `feat: add RPC request caching to test-node`, opened 2025-06-24, merged 2025-10-05
- PR #1995, `test: implement @tevm/test-matchers & @tevm/test-node`, opened 2025-10-05, merged 2025-12-21
- PR #1996, `feat: test-node, test-matchers and 4byte tracer`, opened/merged 2025-10-06
- PR #1999, `feat: make test-node snapshots same structure as vitest and support bun`, opened/merged 2025-10-07

Concrete areas/files:

- `extensions/test-node/src/createTestSnapshotClient.ts`
- `extensions/test-node/src/createTestSnapshotNode.ts`
- `extensions/test-node/src/createTestSnapshotTransport.ts`
- `extensions/test-node/src/snapshot/SnapshotManager.ts`
- `extensions/test-node/src/snapshot/createCachedTransport.ts`
- `extensions/test-node/src/internal/resolveVitestTestSnapshotPath.ts`
- `extensions/test-node/src/internal/resolveBunTestSnapshotPath.ts`
- RPC snapshot fixtures under `extensions/test-node/src/test/methods/__rpc_snapshots__/...`
- docs under `extensions/test-node/docs/...`

Assessment: shipped end-to-end, with some lower-level stacked PRs closed rather than individually merged because their work appears to have been absorbed into aggregate PRs.

#### Debug Tracers: `callTracer` and `4byteTracer`

Shipped in:

- PR #1937, `feat: debug tracer "callTracer"`, opened 2025-07-03, merged 2025-10-05
- PR #1938, `feat: fourbyte tracer`, opened 2025-07-03, merged 2025-10-05
- PR #1939, `feat: enhance FourbyteTraceResult with calldata mapping`, opened 2025-07-03, merged 2025-10-05
- PR #1996, aggregate publishing PR.

Concrete areas/files:

- `packages/actions/src/internal/runCallWithCallTrace.js`
- `packages/actions/src/internal/runCallWithCallTrace.spec.ts`
- `packages/actions/src/debug/*`
- snapshot files under `packages/actions/src/debug/__snapshots__/...`
- docs under `tevm/docs/actions/...`

Assessment: shipped end-to-end.

#### Build / CI / Dependency Migration

Shipped in:

- PR #1981, `chore: pnpm up --latest -r`
- PR #1982, `chore: upgrade biome config files`
- PR #1983, `chore: remove React imports from CLI components`
- PR #1984, `refactor: migrate to nx and fix various build issues`
- PR #1985, `fix: CI`
- PR #1986, `chore: pnpm up --latest`
- PR #1989, `chore: changeset & remove deprecated packages from changeset ignore list`
- PR #1992, `fix: workspace cargo config`

Assessment: shipped, but these are broad mechanical/build-system changes. They are valid contributions, but I would not foreground them as product-feature authorship.

### `evmts/guillotine`

#### Devtool UI and Build Stabilization

Shipped in:

- PR #289, `chore: devtool typescript config & formatting`, opened/merged 2025-07-29
- PR #290, `chore: solid import aliases`, opened/merged 2025-07-29
- PR #294, `feat: artisan hand-crafted design`, opened/merged 2025-07-30
- PRs #297-#312, macOS menubar/shortcuts, Swift menu conversion, load-on-mount, cleanup, combobox fix, build path fix
- PR #513, `fix: devtool build`, opened 2025-08-14, merged 2025-08-15
- PR #517, `refactor: switch debugger to new analysis-first evm`, opened/merged 2025-08-14/15
- PR #523, `fix: incorrect sample bytecodes`, opened 2025-08-14, merged 2025-08-31
- PR #529, `feat: add evm.zig tests to build system`, opened/merged 2025-08-15
- PR #530, `fix: compilation errors from test-evm-core`, opened/merged 2025-08-15
- PR #578, `fix: calling conventions after zig 0.14 -> 0.15 breaking devtool build`, opened 2025-08-26, merged 2025-08-31

Concrete areas/files:

- `src/devtool/solid/App.tsx`
- `src/devtool/solid/components/evm-debugger/*`
- `src/devtool/solid/components/ui/*`
- `src/devtool/solid/styles/tailwind.css`
- `src/devtool/main.zig`
- `src/devtool/webui/*`
- `src/devtool/debug_state.zig`
- `src/devtool/evm.zig`

Assessment: shipped end-to-end for devtool setup, UI, build integration, and stabilization. Several later tracing/debugger PRs were closed without merge, so I would not claim the full closed tracing stack shipped unless separately verified in main.

#### Guillotine CLI

Shipped in:

- PR #621, `chore: delete src/cli`, opened/merged 2025-09-02
- PR #622, `feat: add terminal UI with Bubbletea framework for CLI`, opened/merged 2025-09-02
- PR #651, `prompt: use CLAUDE.md for cli instructions`, opened/merged 2025-09-04
- PR #652, `feat: add EVM call execution to CLI with interactive parameter editing`, opened 2025-09-04, merged 2025-09-09
- PR #653, `feat: add call history and contract deployments to CLI with state persistence & better structure`, opened 2025-09-04, merged 2025-09-15
- PR #666, `feat: show logs table in call result and history`, opened 2025-09-05, merged 2025-09-16
- PR #690, `refactor: move src/cli to apps/cli`, opened/merged 2025-09-08
- PR #717, `feat: add bytecode disassembly to CLI with interactive block navigation`, opened 2025-09-09, merged 2025-09-18

Concrete areas/files:

- `apps/cli/internal/app/*`
- `apps/cli/internal/config/*`
- `apps/cli/internal/core/evm/*`
- `apps/cli/internal/core/history/*`
- `apps/cli/internal/core/state/*`
- `apps/cli/internal/core/bytecode/*`
- `apps/cli/internal/ui/*`
- `apps/cli/internal/types/*`
- earlier `src/cli/...` before the move.

Assessment: shipped end-to-end.

#### Go, C, WASM, and TypeScript SDK Work

Shipped in:

- PR #624, `feat: update C api and Go bindings & add comprehensive Go tests`, opened 2025-09-02, merged 2025-09-08
- PR #684, `refactor: move Go SDK from src/guillotine-go to sdks/go`, opened/merged 2025-09-08
- PR #689, `refactor: use correct API in sdks/go tests`, opened 2025-09-08, merged 2025-09-13
- PR #728, `refactor: restructure WASM build for C API compatibility`, opened 2025-09-10, merged 2025-09-13
- PR #729, `feat: add TypeScript SDK build setup and fix most issues`, opened 2025-09-10, merged 2025-09-13
- PR #741, `feat: big TypeScript SDK update with full FFI integration and extensive test coverage`, opened 2025-09-10, merged 2025-09-18

Concrete areas/files:

- `src/evm_c_api.zig`
- `src/evm_c.zig`
- `build/bindings/wasm.zig`
- `build/steps/wasm.zig`
- `sdks/go/*`
- `sdks/typescript/src/*`
- `sdks/typescript/src/wasm/*`
- `sdks/typescript/test/*`

Assessment: shipped end-to-end across SDK bindings and tests.

#### EVM Semantics, Call Results, Access Lists, Logs, Selfdestruct, Opcode Fixes

Shipped in:

- PR #742, self-transfer value accounting bug
- PR #748, access list data into `CallResult`
- PR #749, self-destruct records in `CallResult`
- PR #750, REVERT data preservation and error handling
- PR #753, log support in REVM wrapper and differential testing framework
- PR #754, EOA code retrieval in database layer
- PR #757, redundant self-transfer check
- PR #760, intrinsic gas deduction
- PR #761, EIP-2929 warm/cold access tracking in minimal EVM
- PR #762, memory bounds checking and `OutOfBounds`
- PR #763, RETURN/REVERT memory expansion and INVALID gas consumption
- PR #788, operand order in EXP/LT/GT/SLT/SGT
- PR #789, stack operand order and EXP gas
- PR #795, hardfork-specific opcode validation
- PR #796, JUMP/JUMPI destination validation

Concrete areas/files:

- `src/evm.zig`
- `src/evm/evm.zig`
- `src/frame/frame.zig`
- `src/frame/frame_handlers.zig`
- `src/instructions/handlers_arithmetic.zig`
- `src/instructions/handlers_comparison.zig`
- `src/storage/access_list.zig`
- `src/storage/self_destruct.zig`
- `src/tracer/minimal_evm.zig`
- `src/tracer/minimal_frame.zig`
- tests under `test/evm/...`, `test/differential/...`, and `test/root.zig`

Assessment: shipped end-to-end for many focused semantics/fix PRs. For the larger closed MinimalEvm stack, see the “worked on but not shipped as-is” section below.

#### Gas Accounting, Execution Spec Fixtures, Prague/EIP-7623 Testing

Shipped in:

- PR #767, `[MinimalEvm] feat: implement hardfork-aware gas accounting and refunds`, opened 2025-09-16, merged 2025-09-23
- PR #820, `[Draft] feat: add execution spec fixtures and zig runner`, opened/merged 2025-09-23
- PR #824, `docs: add crash-bisection debugging command`, opened 2025-09-24, merged 2025-09-29
- PR #825, `feat: implement floor gas + calldata gas and improve gas calculation`, opened 2025-09-24, merged 2025-09-30
- PR #836, `feat: spec tests for prague for gas consumption`, opened/merged 2025-10-05

Concrete areas/files:

- `src/eips_and_hardforks/eips.zig`
- `src/primitives/gas_constants.zig`
- `src/evm.zig`
- `src/tracer/minimal_evm.zig`
- `src/tracer/minimal_frame.zig`
- `test/minimal_evm_revm_differential_test.*`
- `test/execution-spec-tests/*`
- `scripts/fetch-test-fixtures.sh`
- `scripts/fetch_test_fixtures.py`
- `specs/cases/eest/prague/eip7623_increase_calldata_cost/*`
- `specs/runner.zig`

Assessment: shipped end-to-end for the merged subset. Two related PRs remain open and should be described as ongoing/unshipped unless they merge.

## Worked On / Contributed, But Not Shipped As-Is

These are still real contribution evidence, but I would avoid saying they “shipped” unless the same changes can be traced into a later merged PR.

### `evmts/tevm-monorepo`

- PR #991, Next.js Tevm usage example, opened 2024-03-06 and closed unmerged 2024-03-25. This is the earliest GitHub PR evidence in this audit, but it did not ship.
- PR #1624, Solidity debugger PoC, opened 2025-04-22 and closed unmerged 2025-05-29.
- PR #1669 and #1713 were closed/unmerged, then appear superseded by later merged PRs #1728 and #1727 respectively.
- PRs #1912-#1926 were a stacked `test-node` sequence closed in October 2025. Because related aggregate PRs #1910, #1995, #1996, and #1999 merged, this looks like work that contributed to the shipped `test-node` effort, but the individual PRs did not ship as-is.
- PRs #1958-#1960, devtools extension / React example / prompt scaffolding, were closed unmerged.
- PR #1979, `poc: shadow contract`, was closed unmerged.
- PR #1987, `[wip] new compiler api`, is still open. Local logs show active commits on this branch from 2025-09-30 through 2025-10-13. It includes substantial compiler/shadow compilation work, but I would not claim it shipped.

Open compiler API concrete areas:

- `bundler-packages/compiler/src/compiler/new/*`
- `compiler/src/*`
- shadow compilation functions such as `compileSourceWithShadow`, `compileFilesWithShadow`, `compileSourcesWithShadow`
- AST/instrumentation internals such as `instrumentAst`, `createShadowContract`, `extractContractsFromAstNodes`, validation and defaults helpers.

### `evmts/guillotine`

- PRs #518-#522 and #528-#542 show work on devtool bytecode visualization, gas tracking, error surfacing, speed control, tracing prompts, debug hooks, memory tracer, and differential tracing. They were closed unmerged. Some concepts may have informed later work, but I did not treat them as shipped.
- PRs #576-#591 show another tracing/prestate/devtool stack. Only #578 from that area merged. The rest were closed unmerged.
- PR #619, JSONRPCTracer implementation plan, closed unmerged.
- PR #626, CLI call PoC, closed unmerged before later CLI PRs shipped.
- PRs #665 and #669 were closed/unmerged but seem related to later bytecode disassembly work in #668 and #717.
- PRs #686, #743-#747, #751, #759, #769, #775, #790-#794, #797-#802, and #804-#817 were closed/unmerged. Many are MinimalEvm or EVM correctness investigations/fixes. Some overlap conceptually with merged fixes, but I did not count them as shipped as-is.
- PR #826 and PR #830 are open. They contain related gas/spec-runner/blob gas work, but remain unshipped as of this audit.

Open Guillotine concrete areas:

- PR #826: EIP-7623/floor gas/effective gas/spec-runner work, files include `src/evm.zig`, `specs/...`, and gas calculation areas.
- PR #830: EIP-4844 blob gas pricing and transaction validation, files include blob gas/transaction validation related areas.

## `evmts/chop`

`gh repo view evmts/chop` succeeded:

- URL: `https://github.com/evmts/chop`
- Created: 2025-10-17
- Default branch: `main`
- Last pushed according to `gh repo view`: 2026-02-09

But:

- `gh pr list --repo evmts/chop --author 0xpolarzero --state all` returned `[]`.
- `gh api 'repos/evmts/chop/commits?author=0xpolarzero&per_page=100'` returned no commits.

Conclusion: accessible, but no contribution evidence for `0xpolarzero` was found with the commands used. Do not claim `chop` contribution without additional evidence.

## Important Uncertainties

- GitHub PR authorship does not prove sole authorship of every changed line. It does show authored PR ownership and merge status.
- Some stacked PRs were closed after aggregate PRs merged. I treated those as “worked on/contributed to the area,” not individually shipped.
- Some merged PRs had very large generated files, snapshots, docs, lockfiles, or generated WASM/test fixtures. Additions/deletions should not be interpreted as hand-written code volume.
- December 2025 merge dates in `evmts/tevm-monorepo` are real landing dates, but the underlying PRs were opened months earlier. I did not infer active December implementation from merge dates alone.
- Local worktrees were dirty at audit time:
  - `tevm-monorepo`: `bundler-packages/compiler/src/compile/CompileBaseResult.ts` modified.
  - `guillotine`: `build.zig.zon` modified, plus untracked `lib/c-kzg-4844/` and `lib/zig/`.
    I did not inspect these dirty changes as contribution evidence and did not modify them.
- I used `git fetch --all --tags --prune` in both local repos to update remote metadata. This changes Git metadata but not tracked working tree files.

## Commands and Sources Used

Local status and remotes:

```sh
pwd && git status --short
git remote -v
git status --short
```

Metadata refresh:

```sh
git fetch --all --tags --prune
```

Local commit span checks:

```sh
git log origin/main --date=short --regexp-ignore-case --author='\(0xpolarzero\|polarzero\)' --format='%ad%x09%H%x09%an%x09%ae%x09%s'
git log origin/main --regexp-ignore-case --author='\(0xpolarzero\|polarzero\)' --name-only --pretty=format: | sed '/^$/d' | sort | uniq -c | sort -nr | head
```

GitHub auth/repo access:

```sh
gh auth status
gh repo view evmts/chop --json nameWithOwner,description,url,defaultBranchRef,pushedAt,createdAt,updatedAt
```

GitHub PR inventory:

```sh
gh pr list --repo evmts/tevm-monorepo --author 0xpolarzero --state all --limit 500 --json number,title,state,createdAt,mergedAt,closedAt,headRefName,baseRefName,additions,deletions,changedFiles,url
gh pr list --repo evmts/guillotine --author 0xpolarzero --state all --limit 500 --json number,title,state,createdAt,mergedAt,closedAt,headRefName,baseRefName,additions,deletions,changedFiles,url
gh pr list --repo evmts/chop --author 0xpolarzero --state all --limit 500 --json state
```

GitHub issue inventory:

```sh
gh issue list --repo evmts/tevm-monorepo --author 0xpolarzero --state all --limit 100 --json number,title,state,createdAt,closedAt,url
gh issue list --repo evmts/guillotine --author 0xpolarzero --state all --limit 100 --json number,title,state,createdAt,closedAt,url
```

Selected PR file inspection:

```sh
gh pr view <number> --repo evmts/tevm-monorepo --json files --jq '.files[].path'
gh pr view <number> --repo evmts/guillotine --json files --jq '.files[].path'
```

`chop` commit check:

```sh
gh api 'repos/evmts/chop/commits?author=0xpolarzero&per_page=100'
```

## Appendix: Complete PR Inventory Used

### `evmts/tevm-monorepo`

|    PR | State  |    Created |     Merged | Title                                                                                 |
| ----: | ------ | ---------: | ---------: | ------------------------------------------------------------------------------------- |
| #1999 | MERGED | 2025-10-07 | 2025-10-07 | feat: make test-node snapshots same structure as vitest and support bun               |
| #1996 | MERGED | 2025-10-06 | 2025-10-06 | feat: test-node, test-matchers and 4byte tracer                                       |
| #1995 | MERGED | 2025-10-05 | 2025-12-21 | test: implement @tevm/test-matchers & @tevm/test-node                                 |
| #1992 | MERGED | 2025-10-04 | 2025-10-04 | fix: workspace cargo config                                                           |
| #1989 | MERGED | 2025-10-02 | 2025-10-02 | chore: changeset & remove deprecated packages from changeset ignore list              |
| #1987 | OPEN   | 2025-10-01 |            | [wip] new compiler api                                                                |
| #1986 | MERGED | 2025-10-01 | 2025-10-02 | chore: pnpm up --latest                                                               |
| #1985 | MERGED | 2025-10-01 | 2025-10-01 | fix: CI                                                                               |
| #1984 | MERGED | 2025-09-26 | 2025-09-26 | refactor: migrate to nx and fix various build issues                                  |
| #1983 | MERGED | 2025-09-26 | 2025-09-26 | chore: remove React imports from CLI components                                       |
| #1982 | MERGED | 2025-09-26 | 2025-09-26 | chore: upgrade biome config files                                                     |
| #1981 | MERGED | 2025-09-26 | 2025-09-26 | chore: pnpm up --latest -r                                                            |
| #1979 | CLOSED | 2025-09-25 |            | poc: shadow contract                                                                  |
| #1976 | MERGED | 2025-09-25 | 2025-09-25 | fix: error handling in callHandler for failed transactions                            |
| #1960 | CLOSED | 2025-08-13 |            | init: devtools react example                                                          |
| #1959 | CLOSED | 2025-08-13 |            | prompt: devtools scaffolding                                                          |
| #1958 | CLOSED | 2025-08-13 |            | init: devtools extension                                                              |
| #1940 | MERGED | 2025-07-03 | 2025-10-05 | feat: add contract function call matchers                                             |
| #1939 | MERGED | 2025-07-03 | 2025-10-05 | feat: enhance FourbyteTraceResult with calldata mapping                               |
| #1938 | MERGED | 2025-07-03 | 2025-10-05 | feat: fourbyte tracer                                                                 |
| #1937 | MERGED | 2025-07-03 | 2025-10-05 | feat: debug tracer "callTracer"                                                       |
| #1936 | MERGED | 2025-07-03 | 2025-10-05 | feat: add AdvancedContract with MathHelper for slightly complex contract interactions |
| #1926 | CLOSED | 2025-07-02 |            | test: add snapshot tests to actions package                                           |
| #1925 | CLOSED | 2025-07-02 |            | feat: createTestSnapshotTransport                                                     |
| #1924 | CLOSED | 2025-07-02 |            | feat: createTestSnapshotNode                                                          |
| #1922 | CLOSED | 2025-07-01 |            | chore: add test-node package to memory-client                                         |
| #1921 | CLOSED | 2025-07-01 |            | feat: add generic type parameters to TestSnapshotClient                               |
| #1920 | CLOSED | 2025-07-01 |            | docs: update readme with latest API                                                   |
| #1919 | CLOSED | 2025-07-01 |            | feat: add autosave option to test snapshot client                                     |
| #1915 | CLOSED | 2025-06-27 |            | fix: memory-client snapshots                                                          |
| #1914 | CLOSED | 2025-06-27 |            | fix: precompiles dependencies                                                         |
| #1913 | CLOSED | 2025-06-26 |            | feat: support all eth methods (tests)                                                 |
| #1912 | CLOSED | 2025-06-24 |            | feat: support all eth methods                                                         |
| #1911 | MERGED | 2025-06-24 | 2025-07-09 | feat: EthBlobBaseFeeJsonRpcProcedure type                                             |
| #1910 | MERGED | 2025-06-24 | 2025-10-05 | feat: add RPC request caching to test-node                                            |
| #1909 | MERGED | 2025-06-24 | 2025-07-09 | init: test-node extension                                                             |
| #1908 | MERGED | 2025-06-24 | 2025-06-24 | chore: remove console.log                                                             |
| #1905 | MERGED | 2025-06-23 | 2025-10-05 | docs: full readme & jsdoc for test matchers                                           |
| #1904 | MERGED | 2025-06-23 | 2025-10-05 | test: use test matchers in memory-client package                                      |
| #1903 | MERGED | 2025-06-23 | 2025-10-05 | test: use test matchers in contract package                                           |
| #1902 | MERGED | 2025-06-23 | 2025-10-05 | test: use test matchers in blockchain package                                         |
| #1901 | MERGED | 2025-06-23 | 2025-10-05 | chore: install test-matchers in consumer packages                                     |
| #1900 | MERGED | 2025-06-23 | 2025-10-05 | feat: toChangeTokenBalances test matchers                                             |
| #1899 | MERGED | 2025-06-23 | 2025-10-05 | feat: toChangeTokenBalance test matcher                                               |
| #1898 | MERGED | 2025-06-23 | 2025-10-05 | feat: toChangeBalances test matcher                                                   |
| #1892 | MERGED | 2025-06-19 | 2025-07-09 | fix: return updated VM after forking and caching block                                |
| #1887 | MERGED | 2025-06-18 | 2025-10-05 | feat: toChangeBalance matcher                                                         |
| #1886 | MERGED | 2025-06-18 | 2025-06-18 | fix: return updated VM after forking and caching block                                |
| #1885 | MERGED | 2025-06-18 | 2025-07-09 | refactor: export debug trace procedures                                               |
| #1884 | MERGED | 2025-06-18 | 2025-06-18 | fix: bytes encoded block number in getBlock                                           |
| #1883 | MERGED | 2025-06-18 | 2025-06-18 | fix: getBalance handling of block numbers and missing state                           |
| #1882 | MERGED | 2025-06-18 | 2025-06-18 | fix: getBalanceHandler with block hash                                                |
| #1881 | MERGED | 2025-06-17 | 2025-10-05 | feat: toHaveStorageAt matcher                                                         |
| #1880 | MERGED | 2025-06-17 | 2025-10-05 | test: use toHaveState matcher in packages/actions                                     |
| #1879 | MERGED | 2025-06-17 | 2025-10-05 | feat: toHaveState test matcher                                                        |
| #1878 | MERGED | 2025-06-16 | 2025-10-05 | feat: toBeInitializedAccount test matcher                                             |
| #1877 | MERGED | 2025-06-16 | 2025-06-18 | feat: integrate-test-matcher interactive prompt                                       |
| #1876 | MERGED | 2025-06-16 | 2025-10-05 | test: use @tevm/test-matchers in packages/actions                                     |
| #1875 | MERGED | 2025-06-16 | 2025-06-18 | docs: add "Ask DeepWiki" badge to readme                                              |
| #1871 | MERGED | 2025-06-14 | 2025-06-15 | refactor: correct config for consumption                                              |
| #1870 | MERGED | 2025-06-14 | 2025-06-15 | docs: prompt & reference for matchers                                                 |
| #1829 | MERGED | 2025-06-11 | 2025-06-12 | refactor: standardize error codes                                                     |
| #1825 | CLOSED | 2025-06-10 |            | fix: contract build                                                                   |
| #1824 | MERGED | 2025-06-10 | 2025-06-10 | fix: ci failure                                                                       |
| #1823 | MERGED | 2025-06-10 | 2025-06-18 | feat: @tevm/test-matchers - Errors matchers                                           |
| #1813 | MERGED | 2025-06-09 | 2025-06-15 | fix: decoding evm reverts                                                             |
| #1780 | MERGED | 2025-06-05 | 2025-06-05 | fix: revert (changeset)                                                               |
| #1779 | MERGED | 2025-06-05 | 2025-06-05 | fix: revert error & tx receipt                                                        |
| #1776 | MERGED | 2025-06-03 | 2025-06-15 | feat: @tevm/test-matchers - Events matchers                                           |
| #1775 | MERGED | 2025-06-03 | 2025-06-15 | feat: @tevm/test-matchers - Chainable vitest matchers                                 |
| #1748 | MERGED | 2025-05-29 | 2025-06-15 | feat: @tevm/test-matchers - Base matchers                                             |
| #1746 | MERGED | 2025-05-29 | 2025-06-03 | init: @tevm/test-matchers                                                             |
| #1730 | MERGED | 2025-05-27 | 2025-12-21 | init: mud example                                                                     |
| #1729 | MERGED | 2025-05-27 | 2025-06-02 | refactor: make mud plugin work correctly                                              |
| #1728 | MERGED | 2025-05-27 | 2025-12-21 | feat: mud plugin                                                                      |
| #1727 | MERGED | 2025-05-27 | 2025-05-28 | fix: skip balance & nonce in mineHandler                                              |
| #1713 | CLOSED | 2025-05-21 |            | fix: skip balance & nonce in mineHandler                                              |
| #1669 | CLOSED | 2025-05-16 |            | feat: mud plugin                                                                      |
| #1664 | MERGED | 2025-05-15 | 2025-05-16 | fix: txpool events                                                                    |
| #1643 | MERGED | 2025-04-29 | 2025-05-02 | refactor: debug_x methods consistent with geth                                        |
| #1637 | MERGED | 2025-04-27 | 2025-04-28 | fix: blockchain deep copy in vm.deepCopy                                              |
| #1636 | MERGED | 2025-04-27 | 2025-04-28 | fix: account/tx nonce in createTransaction                                            |
| #1635 | CLOSED | 2025-04-27 |            | fix: account/tx nonce in createTransaction                                            |
| #1632 | MERGED | 2025-04-24 | 2025-04-28 | feat: prestateTracer & additional debug\_ methods                                     |
| #1625 | MERGED | 2025-04-22 | 2025-04-22 | fix: parsing caller parameter on a call                                               |
| #1624 | CLOSED | 2025-04-22 |            | PoC: Solidity debugger                                                                |
| #1588 | MERGED | 2025-03-24 | 2025-03-24 | solc: fix storage layout output type                                                  |
| #1567 | MERGED | 2025-03-20 | 2025-03-20 | feat: add storage layout types to solc integration                                    |
|  #991 | CLOSED | 2024-03-06 |            | Feat: Add example of Tevm usage in a Next.js app                                      |

### `evmts/guillotine`

|   PR | State  |    Created |     Merged | Title                                                                                               |
| ---: | ------ | ---------: | ---------: | --------------------------------------------------------------------------------------------------- |
| #836 | MERGED | 2025-10-05 | 2025-10-05 | feat: spec tests for prague for gas consumption                                                     |
| #830 | OPEN   | 2025-09-24 |            | feat: implement EIP-4844 blob gas pricing and transaction validation                                |
| #826 | OPEN   | 2025-09-24 |            | feat: implement EIP-7623 floor gas, effective gas price, and improve gas calculation                |
| #825 | MERGED | 2025-09-24 | 2025-09-30 | feat: implement floor gas + calldata gas and improve gas calculation                                |
| #824 | MERGED | 2025-09-24 | 2025-09-29 | docs: add crash-bisection debugging command                                                         |
| #820 | MERGED | 2025-09-23 | 2025-09-23 | [Draft] feat: add execution spec fixtures and zig runner                                            |
| #817 | CLOSED | 2025-09-22 |            | [MinimalEvm] feat: journaling snapshots for reverting on error/revert                               |
| #816 | CLOSED | 2025-09-22 |            | [MinimalEvm] feat: implement EIP-1153 transient storage                                             |
| #810 | CLOSED | 2025-09-22 |            | [MinimalEvm] feat: add accessed addresses/storage to CallResult                                     |
| #809 | CLOSED | 2025-09-22 |            | [MinimalEvm] feat: implement SELFDESTRUCT                                                           |
| #808 | CLOSED | 2025-09-22 |            | [MinimalEvm] fix: set created_address in contract creation result                                   |
| #806 | CLOSED | 2025-09-22 |            | [MinimalEvm] feat: implement log emission                                                           |
| #805 | CLOSED | 2025-09-22 |            | [MinimalEvm] refactor: improve error handling with standardized CallResult                          |
| #804 | CLOSED | 2025-09-22 |            | [MinimalEvm] feat: implement static context validation                                              |
| #802 | CLOSED | 2025-09-20 |            | Update ci.yml                                                                                       |
| #800 | CLOSED | 2025-09-19 |            | [MinimalEvm] feat: implement call & execute functions                                               |
| #798 | CLOSED | 2025-09-19 |            | feat: add missing static context validation to MinimalEvm                                           |
| #797 | CLOSED | 2025-09-19 |            | fix: Enable LLVM backend on x86_64 for tail call support                                            |
| #796 | MERGED | 2025-09-19 | 2025-09-19 | fix: add JUMP/JUMPI destination validation to MinimalFrame                                          |
| #795 | MERGED | 2025-09-19 | 2025-09-19 | feat: add hardfork-specific opcode validation                                                       |
| #794 | CLOSED | 2025-09-19 |            | [MinimalEvm] refactor: add hardfork-aware gas costs for account access opcodes                      |
| #792 | CLOSED | 2025-09-18 |            | fix: update zbench dependency hash from 0.11.1 to 0.11.2                                            |
| #791 | CLOSED | 2025-09-18 |            | [MinimalEvm] feat: add BLS12-381 precompiles and improve precompile gas calculation                 |
| #790 | CLOSED | 2025-09-18 |            | feat: update BLS12-381 precompile addresses and implement MSM operations                            |
| #789 | MERGED | 2025-09-18 | 2025-09-19 | fix: correct stack operand order and fix EXP gas calculation                                        |
| #788 | MERGED | 2025-09-18 | 2025-09-18 | fix: correct stack operand order in EXP, LT, GT, SLT, SGT opcodes                                   |
| #775 | CLOSED | 2025-09-17 |            | [MinimalEvm] feat: improve CALL family gas accounting                                               |
| #773 | CLOSED | 2025-09-17 |            | fix: rename test to test_config and fix bytecode initialization                                     |
| #769 | CLOSED | 2025-09-16 |            | [MinimalEvm] feat: implement full SSTORE/SLOAD gas metering                                         |
| #767 | MERGED | 2025-09-16 | 2025-09-23 | [MinimalEvm] feat: implement hardfork-aware gas accounting and refunds                              |
| #763 | MERGED | 2025-09-15 | 2025-09-18 | [MinimalEvm] fix: charge memory expansion for RETURN/REVERT and consume all gas on INVALID          |
| #762 | MERGED | 2025-09-15 | 2025-09-18 | [MinimalEvm] fix: add OutOfBounds error and improve memory bounds checking                          |
| #761 | MERGED | 2025-09-15 | 2025-09-16 | [MinimalEvm] feat: implement EIP-2929 warm/cold access tracking in minimal EVM                      |
| #760 | MERGED | 2025-09-15 | 2025-09-15 | fix: deduct intrinsic gas from total gas in MinimalEvm execute function                             |
| #759 | CLOSED | 2025-09-15 |            | feat: implement warm/cold access gas tracking in minimal EVM with access list                       |
| #757 | MERGED | 2025-09-15 | 2025-09-15 | fix: remove redundant self-transfer check in balance transfers                                      |
| #754 | MERGED | 2025-09-12 | 2025-09-13 | fix: Handle EOA code retrieval correctly in database layer                                          |
| #753 | MERGED | 2025-09-11 | 2025-09-13 | feat: log support in REVM wrapper and differential testing framework                                |
| #751 | CLOSED | 2025-09-10 |            | fix: Implement EIP-214 static context enforcement for STATICCALL                                    |
| #750 | MERGED | 2025-09-10 | 2025-09-13 | fix: REVERT opcode data preservation and error handling                                             |
| #749 | MERGED | 2025-09-10 | 2025-09-16 | feat: extract self-destruct records in CallResult                                                   |
| #748 | MERGED | 2025-09-10 | 2025-09-18 | feat: extract access list data into CallResult                                                      |
| #747 | CLOSED | 2025-09-10 |            | fix: DELEGATECALL storage context bug                                                               |
| #746 | CLOSED | 2025-09-10 |            | fix: Revert logs on transaction failure                                                             |
| #745 | CLOSED | 2025-09-10 |            | Fix: Replace debug assertions with proper error handling in EVM instruction handlers                |
| #744 | CLOSED | 2025-09-10 |            | fix: Persist storage changes from frame execution to main database                                  |
| #743 | CLOSED | 2025-09-10 |            | test: LOG opcode topic ordering tests                                                               |
| #742 | MERGED | 2025-09-10 | 2025-09-13 | fix: self-transfer bug that incorrectly increased account balance                                   |
| #741 | MERGED | 2025-09-10 | 2025-09-18 | feat: big TypeScript SDK update with full FFI integration and extensive test coverage               |
| #729 | MERGED | 2025-09-10 | 2025-09-13 | feat: add TypeScript SDK build setup and fix most issues                                            |
| #728 | MERGED | 2025-09-10 | 2025-09-13 | refactor: restructure WASM build for C API compatibility                                            |
| #720 | MERGED | 2025-09-09 | 2025-09-10 | fix: use getTailCallModifier in getTracedOpcodeHandlers                                             |
| #719 | MERGED | 2025-09-09 | 2025-09-10 | fix: add explicit usize casting for slice operations with u64 lengths                               |
| #718 | MERGED | 2025-09-09 | 2025-09-10 | fix: use platform-adaptive usize for pointer metadata in packed structs                             |
| #717 | MERGED | 2025-09-09 | 2025-09-18 | feat: add bytecode disassembly to CLI with interactive block navigation                             |
| #716 | MERGED | 2025-09-09 | 2025-09-13 | refactor: getStats and metadata related functions from bytecode                                     |
| #690 | MERGED | 2025-09-08 | 2025-09-08 | refactor: move src/cli to apps/cli                                                                  |
| #689 | MERGED | 2025-09-08 | 2025-09-13 | refactor: use correct API in sdks/go tests                                                          |
| #688 | MERGED | 2025-09-08 | 2025-09-08 | bug: STATICCALL doesn't properly fail on state modification attempts                                |
| #687 | MERGED | 2025-09-08 | 2025-09-13 | bug: DELEGATECALL incorrectly modifies delegate's storage instead of caller's storage               |
| #686 | CLOSED | 2025-09-08 |            | bug: segfault when call depth limit is reached with small max_call_depth                            |
| #684 | MERGED | 2025-09-08 | 2025-09-08 | refactor: move Go SDK from src/guillotine-go to sdks/go                                             |
| #669 | CLOSED | 2025-09-05 |            | feat: add bytecode disassembly to CLI contract details                                              |
| #668 | MERGED | 2025-09-05 | 2025-09-16 | feat: add optimized bytecode disassembly API                                                        |
| #666 | MERGED | 2025-09-05 | 2025-09-16 | feat: show logs table in call result and history                                                    |
| #665 | CLOSED | 2025-09-04 |            | feat: add bytecode disassembly C API with Go integration                                            |
| #662 | CLOSED | 2025-09-04 |            | fix: syntax errors in function call parentheses and type references                                 |
| #654 | CLOSED | 2025-09-04 |            | fix: comptime parameter errors in opcode handler generation                                         |
| #653 | MERGED | 2025-09-04 | 2025-09-15 | feat: add call history and contract deployments to CLI with state persistence & better structure    |
| #652 | MERGED | 2025-09-04 | 2025-09-09 | feat: add EVM call execution to CLI with interactive parameter editing                              |
| #651 | MERGED | 2025-09-04 | 2025-09-04 | prompt: use CLAUDE.md for cli instructions                                                          |
| #626 | CLOSED | 2025-09-02 |            | feat: poc for various types of calls in CLI                                                         |
| #624 | MERGED | 2025-09-02 | 2025-09-08 | feat: update C api and Go bindings & add comprehensive Go tests                                     |
| #623 | MERGED | 2025-09-02 | 2025-09-02 | refactor: return unpadded 20-byte contract address from CREATE/CREATE2                              |
| #622 | MERGED | 2025-09-02 | 2025-09-02 | feat: add terminal UI with Bubbletea framework for CLI                                              |
| #621 | MERGED | 2025-09-02 | 2025-09-02 | chore: delete src/cli                                                                               |
| #619 | CLOSED | 2025-09-01 |            | feat: add JSONRPCTracer enhanced data capture implementation plan                                   |
| #591 | CLOSED | 2025-08-29 |            | feat: implement comprehensive prestate tracer with account state tracking                           |
| #590 | CLOSED | 2025-08-29 |            | feat: add EVM execution tracing infrastructure                                                      |
| #583 | CLOSED | 2025-08-28 |            | wip: surface errors in devtool ui                                                                   |
| #582 | CLOSED | 2025-08-27 |            | feat: add dynamic gas cost tracking to EVM debugger                                                 |
| #581 | CLOSED | 2025-08-27 |            | feat: add breakpoint management UI to devtool                                                       |
| #580 | CLOSED | 2025-08-27 |            | refactor: replace storage panel with state diff in devtool                                          |
| #579 | CLOSED | 2025-08-27 |            | feat: rewrite devtool with DebuggingTracer and breakpoint support                                   |
| #578 | MERGED | 2025-08-26 | 2025-08-31 | fix: calling conventions after zig 0.14 -> 0.15 breaking devtool build                              |
| #577 | CLOSED | 2025-08-26 |            | feat: implement execution tracing with pause/resume support                                         |
| #576 | CLOSED | 2025-08-25 |            | feat: add prestate tracer and tracing hooks                                                         |
| #542 | CLOSED | 2025-08-16 |            | feat: shadow execution with differential tracing for EVM validation                                 |
| #537 | CLOSED | 2025-08-15 |            | feat: enhanced memory tracer with execution control, step-by-step debugging, and step/message hooks |
| #536 | CLOSED | 2025-08-15 |            | feat: add EVM execution tracing system with standard memory tracer                                  |
| #531 | CLOSED | 2025-08-15 |            | feat: add debug hooks for EVM execution tracing and control                                         |
| #530 | MERGED | 2025-08-15 | 2025-08-15 | fix: compilation errors from test-evm-core                                                          |
| #529 | MERGED | 2025-08-15 | 2025-08-15 | feat: add evm.zig tests to build system                                                             |
| #528 | CLOSED | 2025-08-15 |            | feat: add devtool tracing PR prompts                                                                |
| #523 | MERGED | 2025-08-14 | 2025-08-31 | fix: incorrect sample bytecodes                                                                     |
| #522 | CLOSED | 2025-08-14 |            | feat: implement speed control in devtool                                                            |
| #520 | CLOSED | 2025-08-14 |            | feat: surface EVM execution errors in devtool UI                                                    |
| #519 | CLOSED | 2025-08-14 |            | feat: increase buffer size and add dynamic gas tracking in EVM debugger                             |
| #518 | CLOSED | 2025-08-14 |            | feat: add bytecode visualization in EVM debugger                                                    |
| #517 | MERGED | 2025-08-14 | 2025-08-15 | refactor: switch debugger to new analysis-first evm                                                 |
| #514 | CLOSED | 2025-08-14 |            | fix: correctly track execution and disable buttons at STOP/REVERT/RETURN                            |
| #513 | MERGED | 2025-08-14 | 2025-08-15 | fix: devtool build                                                                                  |
| #312 | MERGED | 2025-08-01 | 2025-08-01 | fix: absolute paths in build                                                                        |
| #311 | MERGED | 2025-08-01 | 2025-08-01 | fix: combobox                                                                                       |
| #310 | MERGED | 2025-08-01 | 2025-08-01 | refactor: small cleanup                                                                             |
| #300 | MERGED | 2025-07-31 | 2025-08-01 | chore: add assets.zig to gitignore                                                                  |
| #299 | MERGED | 2025-07-31 | 2025-08-01 | refactor: load bytecode on mount                                                                    |
| #298 | MERGED | 2025-07-31 | 2025-08-01 | refactor: convert c native menu to swift                                                            |
| #297 | MERGED | 2025-07-31 | 2025-07-31 | feat: macos menubar & shortcuts                                                                     |
| #294 | MERGED | 2025-07-30 | 2025-07-30 | feat: artisan hand-crafted design                                                                   |
| #290 | MERGED | 2025-07-29 | 2025-07-29 | chore: solid import aliases                                                                         |
| #289 | MERGED | 2025-07-29 | 2025-07-29 | chore: devtool typescript config & formatting                                                       |
