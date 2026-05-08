# Primodium Contribution Audit for `polarzero`

Audit date: 2026-05-08  
Audited user identities in git history: `polarzero <0xpolarzero@gmail.com>`, `0xpolarzero <0xpolarzero@gmail.com>`, and `polarzero <99199454+0xpolarzero@users.noreply.github.com>`  
Local repositories inspected:

- `/Users/polarzero/code/primodium/dex-server` (`primodiumxyz/dex-server`)
- `/Users/polarzero/code/primodium/tub` (`primodiumxyz/tub`)
- `/Users/polarzero/code/primodium/empires` (`primodiumxyz/empires`)
- `/Users/polarzero/code/primodium/primodium` (`primodiumxyz/primodium`)

## Executive summary

Conservative shipped contribution span, using commits reachable from `origin/main`: **2024-05-02 through 2025-02-06**.

Broader local workspace contribution span, using all local refs: **2024-05-02 through 2025-02-07**.

The one-day difference is from `/Users/polarzero/code/primodium/tub`, whose current branch `0xpolarzero/pri-1618-tub-add-indexer-database-diagram` contains `c029be56` (`2025-02-07`, `docs: indexer and database diagram`). That commit is present in local/all-ref history but not in the `origin/main` shipped-count summary I used. I would describe that as **worked on/contributed**, not shipped, unless there is deployment or merge evidence outside this local checkout.

The strongest evidence of shipped work is local `origin/main` history and merge commits named `Merge pull request #... from primodiumxyz/0xpolarzero/...`. The GitHub CLI was used, but several historical PRs are not resolvable from the current public GitHub state; see "GitHub CLI findings and uncertainty".

## What can be claimed without overclaiming

### Shipped / merged to main

It is fair to say that `polarzero` shipped or materially shipped end-to-end work in these areas:

- **Primodium game client and core systems**: alliance UI work, click/hover layering fixes, building placement/movement animation and interaction fixes, deferred rendering/chunk visibility for asteroids, coordinates/ENS labels, sync-stack/indexer upgrades, reactive table integration, sync/core fixes, package build fixes, documentation and OSS cleanup.
- **Empires client/game/support tooling**: reactive-table devtools, core package build setup, cheatcodes framework and cheatcode UI, historical point-price chart, Phaser/HUD/client visual work, transaction feedback and UI improvements, art/animation integrations, keeper service/infrastructure, Base Sepolia/playtest deployment, pre-audit invariant work, and OSS formatting/docs cleanup.
- **Tub app/indexer/dashboard/GQL/iOS/server work**: token explorer/dashboard work, Solana DEX/indexer parsers, Hasura native queries and schema work, Helius/QuickNode/geyser indexing work, iOS query/subscription integration, token price/balance/candle analytics, server-side buy/sell/transaction analytics, cache and benchmark work, Timescale/materialized/continuous aggregate optimization, documentation and package cleanup.
- **Dex server split/package work**: server-side pieces corresponding to Tub server/GQL/cache analytics work, including buy/sell, SOL/USD price subscription/caching, Jupiter fetch error handling, analytics refactors, Hasura/cache URL refactor, Docker/package/workflow fixes, npm/GHCR packaging and docs.

### Worked on / contributed, but not safe to call shipped from this evidence alone

These are visible in local history, branches, or all-ref logs, but I would avoid claiming them as independently shipped unless corroborated by release/deployment notes or a merge to current main:

- Tub `0xpolarzero/pri-1618-tub-add-indexer-database-diagram` (`2025-02-07`) documentation/diagram work.
- Any local feature branch in `tub` not reachable from `origin/main`, even when branch names are descriptive and contain substantial `polarzero` commits.
- Merge commits authored by `polarzero` that merge other users' branches, such as `nab5/token-keeper`, `release/v0.5`, `emersonhsieh/pri-1483-testflight-release-v150`, or `0xhank/...`. These show integration/merge responsibility, not sole feature authorship.
- Areas where local commits are mostly formatting, docs, lockfile, deployment trigger, cleanup, or "wip/temp" commits. These count as contribution, but should not be described as feature ownership.

## Contribution span and counts

Counts below are local git commit counts for the audited identity patterns. They include merge commits unless explicitly stated otherwise.

| Repo         | Reachable from `origin/main` | First main commit                                                          | Last main commit                                                   | All refs count | All refs first        | All refs last                                              |
| ------------ | ---------------------------: | -------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------: | --------------------- | ---------------------------------------------------------- |
| `primodium`  |                          231 | 2024-05-02 `68219581f` `fix: convert target entity to address for tx args` | 2025-02-06 `202c6f8cf` `fix: remove core package release`          |            231 | same                  | same                                                       |
| `empires`    |                          784 | 2024-07-02 `74e0af57` `chore: prettier sort imports + tailwind classnames` | 2025-02-06 `46be7dae` `chore: update docker image name`            |            784 | same                  | same                                                       |
| `tub`        |                          950 | 2024-09-27 `ebd92b26` `feat: docs`                                         | 2025-02-04 `33dd3180` `fix: wrong indentation`                     |           1087 | 2024-09-27 `ebd92b26` | 2025-02-07 `c029be56` `docs: indexer and database diagram` |
| `dex-server` |                           98 | 2024-09-27 `449e9bc` `feat: single env & root pnpm dev`                    | 2025-02-04 `8b97ea1` `docs: better context on npm & ghcr packages` |             98 | same                  | same                                                       |

## Repository findings

### `primodiumxyz/primodium`

Local path: `/Users/polarzero/code/primodium/primodium`  
Remote: `git@github.com:primodiumxyz/primodium.git`  
Default branch observed via `gh`: `main`, public repository  
Main-branch contribution span: **2024-05-02 to 2025-02-06**  
All-ref contribution span: **2024-05-02 to 2025-02-06**

Primary touched areas from non-merge commits on `origin/main`:

| Path area            | File-change hits | Approx additions | Approx deletions |
| -------------------- | ---------------: | ---------------: | ---------------: |
| `packages/client`    |              554 |            5,911 |            4,080 |
| `packages/core`      |              281 |            1,774 |            1,894 |
| `packages/game`      |               91 |              348 |              331 |
| `packages/engine`    |               69 |              502 |              256 |
| `packages/contracts` |               20 |              965 |            1,035 |
| `packages/assets`    |               16 |               46 |               25 |
| `README.md`          |                8 |               99 |              203 |

Merged/shipped PR evidence visible on `origin/main`:

- `#1229` `pri-614-upgrade-sync-stack-indexer` (2024-05-07): upgraded sync-stack/indexer packages.
- `#1237` `pri-597-layers-for-clicking-on-buttons-is-buggy-clicks-the-layer` (2024-05-08): fixed DOM/game-layer click propagation and tooltip/hover behavior.
- `#1245` `pri-608-cannot-move-building` (2024-05-14): building movement/placement interaction and animation fixes.
- `#1277` `pri-602-numeric-hotkeys-override-user-entry-in-modal` (2024-05-16): hotkey disablement inside modals.
- `#1250` `pri-631-load-other-players-asteroids-on-first-render` (2024-05-18): deferred asteroid rendering, chunk visibility, initial asteroid and fleet render fixes.
- `#1289` `pri-698-add-coordinates-component-for-user-as-well` (2024-05-19): coordinates display in asteroid/starmap contexts.
- `#1314` `pri-715-some-spawned-asteroids-dont-appear-until-refresh` (2024-05-20): spawned asteroid visibility fixes.
- `#1324` `pri-741-show-ens-on-label` (2024-05-25): ENS display on labels.
- `#1333` `pri-527-integrate-reactive-tables-wrapper-into-primodium` (2024-06-12): integrated RETA/reactive tables across lib/network/hooks/queries/sync/systems.
- `#1343` `pri-781-fix-sync-core-package` (2024-06-26): sync/core package fixes.
- `#1346` `pri-804-fix-update-stream` (2024-06-26): update stream fix.
- `#1348` `pri-807-include-contract-types-in-core-build` (2024-06-27): core build/package fixes including contract/ABI typing.
- `#1350` `pri-810-fix-top-level-await` (2024-06-27): top-level await/build fix.
- `#1356` `pri-1611-clean-up-readmes` (2025-02-06): OSS cleanup/docs.
- `#1359` `pri-1612-format` (2025-02-06): formatting/package cleanup.

Other concrete contribution areas visible in main history:

- Alliance UI and management screens: commits on 2024-05-03 through 2024-05-06 mention radio buttons/text area, alliance modal, alliances list/search, invites screen, alliance management actions, promote/demote/kick hints.
- Game-object interaction fixes: DOM button click propagation, hover entity retention, modal/widget tooltip behavior.
- Rendering and performance: deferred render containers, chunk-based rendering, geometric culling, asteroid/fleet visibility and update behavior.
- Sync and data ingestion: initial/secondary query split, live sync gating, sync source tracking, update stream, player hydration, reactive-table integration.
- Developer/docs/OSS work: package docs, README updates, assets terms, formatting, dependency cleanup.

Conservative wording: `polarzero` contributed substantially to client/core rendering, sync, UI, and package infrastructure in `primodium`. The local evidence supports shipped/merged work in those areas, but not sole ownership of the whole game or all surrounding features.

### `primodiumxyz/empires`

Local path: `/Users/polarzero/code/primodium/empires`  
Remote: `git@github.com:primodiumxyz/empires.git`  
Default branch observed via `gh`: `main`, public repository  
Main-branch contribution span: **2024-07-02 to 2025-02-06**  
All-ref contribution span: **2024-07-02 to 2025-02-06**

Primary touched areas from non-merge commits on `origin/main`:

| Path area            | File-change hits | Approx additions | Approx deletions |
| -------------------- | ---------------: | ---------------: | ---------------: |
| `apps/web`           |              846 |           19,464 |           10,921 |
| `packages/assets`    |              762 |           39,869 |           33,671 |
| `packages/core`      |              359 |            2,046 |            1,719 |
| `packages/game`      |              250 |            3,435 |            2,390 |
| `packages/contracts` |              161 |          215,005 |            6,946 |
| `apps/keeper`        |               84 |            3,183 |            2,760 |
| `.github/workflows`  |               46 |               80 |               74 |
| `packages/engine`    |               25 |              166 |              226 |

Merged/shipped PR evidence visible on `origin/main`:

- `#5` `pri-812-integrate-reactive-tables-dev-tools` (2024-07-03): RETA/reactive-table devtools.
- `#9` `pri-819-core-package-build` (2024-07-10): core package build/import restructure.
- `#8` `pri-817-cheatcodes-framework` (2024-07-11): cheatcodes framework.
- `#10` `pri-835-format` (2024-07-11): formatting/prettier/eslint work.
- `#24` `pri-834-cheatcodes` (2024-07-12): cheatcode implementation and UI.
- `#36` `pri-858-clientcontracts-historical-price-chart` (2024-07-17): historical points price/cost chart and contract-side historical price tests.
- `#40` `pri-862-client-phaser-components` (2024-07-17): Phaser/HUD/client visual components.
- `#67` `pri-911-fix-dropdown` (2024-07-29): dropdown/number input fixes.
- `#77` `pri-925-ui-improvements-remove-blockchain-units` (2024-07-31): UI improvements around blockchain units, tooltips, prices, time display.
- `#72` `pri-912-fix-tx-failure` (2024-08-01): transaction success/failure handling and user-friendly errors.
- `#79` `pri-926-ui-improvements-turn-insight-and-feedback` (2024-08-02): turn insight/feedback UI.
- `#87` `pri-948-ui-improvements-fix-tx-feedback` (2024-08-02): transaction feedback fixes.
- `#93` `pri-951-magnet-client-cheatcodes` (2024-08-06): magnet/client cheatcodes.
- `#103` `pri-962-client-fix-cheatcodes-scroll` (2024-08-06): cheatcode scrolling.
- `#102` `pri-961-format-game-package` (2024-08-07): game package formatting.
- `#111` `pri-970-magnet-client-integrate-art` (2024-08-09): magnet art integration.
- `#117` `pri-976-overheat-integrate-art-animations` (2024-08-09): overheat art/animation integration.
- `#125` `pri-984-ux-improvement-magnet-selection` (2024-08-12): magnet selection UX.
- `#128` `pri-991-client-fix-tx-feedback` (2024-08-12): transaction feedback.
- `#126` `pri-985-client-empires-config` (2024-08-12): Empires client config.
- `#137` `pri-986-client-override-icons` (2024-08-14): override icons.
- `#139` `pri-997-client-override-points` (2024-08-14): override points.
- `#141` `pri-1001-client-remove-overheat` (2024-08-15): remove overheat.
- `#132` `pri-996-ux-improvement-transaction-status` (2024-08-15): transaction status UX.
- `#109` `pri-946-em-storms-client` (2024-08-15): storms client.
- `#144` `pri-1002-airdrop-client` (2024-08-15): airdrop client.
- `#147` `pri-1009-fix-quick-trade-selection` (2024-08-15): quick trade selection fix.
- `#162` `pri-987-client-citadel-visuals` (2024-08-21): citadel visuals.
- `#163` `pri-1024-client-planet-summary-redesign` (2024-08-21): planet summary redesign.
- `#161` `pri-1022-client-animation-queue` (2024-08-23): animation queue.
- `#173` `pri-988-client-shield-eater-animations` (2024-08-28): shield eater animations.
- `#176` `pri-1036-client-gold-treasure-planet` (2024-08-28): gold/treasure planet UI.
- `#177` `pri-1037-client-acid-rain` (2024-08-28): acid rain.
- `#179` `pri-1041-client-banner` (2024-08-28): banner.
- `#193` `pri-1058-client-cheatcodes-withdraw-rake-indicator` (2024-09-05): withdraw/rake cheatcode indicators.
- `#192` `pri-1053-client-battle-animations` (2024-09-06): battle animations.
- `#195` `pri-1059-client-sync-queries` (2024-09-06): sync queries.
- `#182` `pri-1044-client-fixes-improvements` (2024-09-06): client fixes/improvements.
- `#203` `pri-1067-base-sepolia-deployment` (2024-09-10): Base Sepolia deployment/config.
- `#208` `pri-1072-client-sell-points-call-reverts` (2024-09-11): sell-points call/revert handling.
- `#201` `pri-1065-infra-keeper` (2024-09-12): keeper service/infrastructure.
- `#214` `pri-1085-playtest-deployment` (2024-09-16): playtest deployment.
- `#220` `pri-1101-client-cheatcodes-dead-empire` (2024-09-19): defeated empire cheatcodes and related UI/logic.
- `#212` `pri-1078-pre-audit-invariants` (2024-09-27): pre-audit invariant tests/logging.
- `#260` `pri-1614-oss-1-formatting` (2025-02-06): OSS formatting.
- `#261` `pri-1615-oss-2-cleanup-docs` (2025-02-06): OSS cleanup/docs.

Other concrete contribution areas visible in main history:

- Cheatcodes: framework, modal, context plumbing, config cheatcodes, reset/update game config, defeated empire, keeper password.
- Contracts/tests: historical point cost/price, invariant tests, handler purchase calls and sell points, pot invariants.
- UI/gameplay: shields UI/actions, point price chart/table, mouse grid, HUD/dashboard, faction summary, planet pane, turn/time cards, action logs, animations and art integration.
- Infrastructure/deployment: keeper service, bearer token/password handling, workflows/Docker deployment attempts, Base Sepolia chain/deployment config, RPC/indexer URLs.

Conservative wording: `polarzero` shipped a large amount of Empires client/UI/tooling/infrastructure work and contributed to contract test/audit preparation. Do not claim sole ownership of Empires; many merged branches from other contributors are present and some `polarzero` commits are integration or cleanup.

### `primodiumxyz/tub`

Local path: `/Users/polarzero/code/primodium/tub`  
Remote: `git@github.com:primodiumxyz/tub.git`  
GitHub CLI repository resolution: `gh repo view primodiumxyz/tub` failed with `Could not resolve to a Repository`  
Main-branch contribution span: **2024-09-27 to 2025-02-04**  
All-ref contribution span: **2024-09-27 to 2025-02-07**

Primary touched areas from non-merge commits on `origin/main`:

| Path area             | File-change hits | Approx additions | Approx deletions |
| --------------------- | ---------------: | ---------------: | ---------------: |
| `packages/gql`        |            1,353 |           30,728 |           23,842 |
| `apps/ios`            |              999 |           33,501 |           32,751 |
| `apps/indexer`        |              364 |           19,804 |           19,757 |
| `apps/dashboard`      |              327 |            4,915 |            4,428 |
| `apps/server`         |              147 |            1,284 |              709 |
| `apps/explorer`       |              146 |            4,065 |              757 |
| `.github/workflows`   |               60 |              155 |              343 |
| `apps/web`            |               36 |              953 |              363 |
| `apps/keeper`         |               33 |          314,715 |        1,099,843 |
| `packages/indexer-db` |               28 |              399 |              219 |

Merged/shipped PR evidence visible on `origin/main`:

- `#21` `nab5/token-keeper` (2024-10-01): merge authored by `polarzero`, but branch authored by another contributor; count as integration/merge responsibility, not sole authored feature.
- `#27` `pri-1119-poc-pumping-tokens-explorer` (2024-10-09): pumping/formatted tokens explorer, price data, Solana trade parsing, initial indexer/explorer.
- `#39` `pri-1135-gqlindexer-aggregate-pumping-tokens` (2024-10-09): GQL/indexer aggregate formatted tokens.
- `#44` `pri-1145-hasura-integrate-formatted-tokens-native-query` (2024-10-10): Hasura formatted tokens native query.
- `#37` `pri-1134-indexer-handle-process-exit-and-restart` (2024-10-11): indexer restart/error handling.
- `#40` `pri-1131-indexer-integrate-remaining-major-dexes` (2024-10-11): DEX parser integrations.
- `#52` `pri-1137-indexer-helius-websocket-and-paid-plan` (2024-10-15): Helius websocket/indexer work.
- `#68` `pri-1168-token-price-change` (2024-10-18): token price change/balance queries and formatting.
- `#78` `pri-1182-ios-backgrounds-and-gradients` (2024-10-18): iOS background/gradient UI.
- `#58` `pri-1162-gql-refactor-schema-for-indexer` (2024-10-22): GQL schema refactor for indexer.
- `#83` `pri-1191-ios-integrate-new-queries` (2024-10-23): iOS new query/subscription integration.
- `#85` `pri-1196-ios-use-lamports-for-balances` (2024-10-23): iOS balance unit fix.
- `#86` `pri-1198-ios-fix-filtered-tokens-array` (2024-10-24): iOS filtered-token fix.
- `#97` `pri-1204-ios-block-swipe-up-on-first-token` (2024-10-25): iOS swipe behavior fix.
- `#99` `pri-1194-explorer-dashboard` (2024-10-31): explorer dashboard.
- `#104` `pri-1211-dashboard-pumping-tokens-at-historical-times` (2024-10-31): dashboard historical token snapshots.
- `#113` `pri-1213-dashboard-filtered-tokens-performance` (2024-10-31): dashboard filtered-token performance.
- `#100` `pri-1209-project-dashboard` (2024-10-31): project dashboard.
- `#121` `pri-1235-dashboardgql-integrate-new-schema` (2024-11-01): dashboard/GQL schema integration.
- `#110` `pri-1221-prepare-for-testflight-build` (2024-11-01): TestFlight build preparation.
- `#118` `pri-1227-indexer-pumpfun-tokens-metadata` (2024-11-04): Pump.fun token metadata indexing.
- `#98` `pri-1187-indexer-aws-instance-fix-stop-indexing` (2024-11-04): indexer AWS stop-indexing fix.
- `#123` `pri-1231-ios-integrate-new-query` (2024-11-04): iOS query integration.
- `#128` `pri-1229-gql-calculate-volume` (2024-11-05): GQL volume calculation.
- `#129` `pri-1242-ios-fix-constants-file` (2024-11-06): iOS constants fix.
- `#133` `pri-1247-ios-better-chart-scale` (2024-11-09): iOS chart scaling.
- `#142` `pri-1271-indexer-refactor-for-low-batch-sizes` (2024-11-09): indexer batch-size refactor.
- `#145` `pri-1277-testflight-4-loading-screen-takes-a-long-time` (2024-11-10): loading-screen performance.
- `#153` `pri-1305-indexer-fix-db-insertions` (2024-11-12): indexer database insertion fixes.
- `#167` `pri-1318-codex-top-tokens-prices-on-dashboard` (2024-11-18): Codex/top-token prices on dashboard.
- `#187` `pri-1348-ios-price-chart` (2024-11-20): iOS price chart.
- `#242` `pri-1386-ios-integrate-new-design` (2024-12-08): iOS design integration.
- `#245` `pri-1420-gql-add-token-decimals` (2024-12-09): token decimals in GQL.
- `#254` `pri-1435-server-handle-error-on-jupiter-fetch` (2024-12-10): Jupiter fetch error handling.
- `#255` `pri-1436-merge-real-token-balances-into-server-organization` (2024-12-10): server organization and real token balances.
- `#256` `pri-1437-indexer-increase-batches-for-jupiter` (2024-12-10): Jupiter batch-size increase.
- `#282` `pri-1473-ios-use-gateway-for-ipfs-links` (2025-01-06): IPFS gateway usage.
- `#285` `pri-1479-gqlios-other-analytics-refactor` (2025-01-06): GQL/iOS analytics refactor.
- `#292` `pri-1481-gql-fix-candles-query` (2025-01-06): candles query fix.
- `#294` `pri-1484-indexer-retrieve-token-supply` (2025-01-09): token supply retrieval.
- `#296` `pri-1482-gql-caching-on-top-of-hasura` (2025-01-09): GQL cache server on top of Hasura.
- `#299` `pri-1491-gql-fix-candles-query-aggregating` (2025-01-09): candles aggregation fix.
- `#305` `pri-1501-gql-fix-candles` (2025-01-16): candle query fixes.
- `#308` `pri-1510-gql-optimize-tokens-metadata-live-data` (2025-01-17): token metadata/live data optimization via materialized views/rolling stats/cron refresh.
- `#309` `pri-1517-server-fix-docker-image` (2025-01-17): server Docker/cache/dev fixes.
- `#313` `pri-1523-ios-fix-tx-parsing` (2025-01-22): iOS transaction parsing.
- `#321` `pri-1531-ios-fix-sharing` (2025-01-24): sharing image/text fixes.
- `#312` `pri-1518-dashboard-user-trades-analytics` (2025-01-27): dashboard user trade analytics.
- `#293` `emersonhsieh/pri-1483-testflight-release-v150` (2025-01-29): merge authored by `polarzero`, branch by another contributor; count as release/integration involvement.
- `#291` `release/v0.5` (2025-01-29): release merge; count as release/integration involvement.
- `#324` `pri-1542-tub-gql-documentation-indexer-library` (2025-01-31): GQL docs and indexer library work.
- `#326` `pri-1603-2-port-gql` (2025-01-31): port GQL.
- `#327` `pri-1604-3-port-dashboard` (2025-01-31): port dashboard.
- `#328` `pri-1605-4-ios-documentation` (2025-01-31): iOS documentation.
- `#330` `pri-1613-formatting` (2025-02-04): formatting.

Concrete contribution areas visible in main history:

- Indexer: Solana transaction parsing, Raydium/Jupiter/Meteora/Orca/Whirlpool/CPMM parsers, websocket restart/error handling, Helius/QuickNode/geyser work, Pump.fun metadata, DB insertions, batch sizing, token supply retrieval.
- GQL/Hasura/Timescale: formatted tokens native query, account/token balances, subscriptions, price changes, candles, volume, token decimals, Timescale schemas/materialized views/continuous aggregates, cached GraphQL server.
- Dashboard/explorer: token explorer, filtered/formatted/pumping tokens tables, performance, historical token views, top token prices, user trade analytics.
- iOS: query/subscription integration, price chart, loading performance, transaction parsing, sharing, IPFS links, design integration.
- Server: buy/sell, short-lived Codex token work, SOL/USD price caching/subscription, Jupiter error handling, transaction analytics, Docker image fixes.
- Docs/package cleanup: README/env docs, package docs, indexer/GQL documentation, formatting.

Conservative wording: `polarzero` was a major contributor across Tub's indexer, GraphQL, dashboard, server, and iOS integration surfaces. Since `primodiumxyz/tub` is not currently resolvable via `gh`, shipped claims should be grounded in local `origin/main` merge commits and not in GitHub PR pages.

### `primodiumxyz/dex-server`

Local path: `/Users/polarzero/code/primodium/dex-server`  
Remote: `git@github.com:primodiumxyz/dex-server.git`  
Default branch observed via `gh`: `main`, public repository  
Main-branch contribution span: **2024-09-27 to 2025-02-04**  
All-ref contribution span: **2024-09-27 to 2025-02-04**

Primary touched areas from non-merge commits on `origin/main`:

| Path area            | File-change hits | Approx additions | Approx deletions |
| -------------------- | ---------------: | ---------------: | ---------------: |
| `apps/server`        |              147 |            1,243 |              684 |
| `.tsconfigs/tsc`     |                6 |              146 |                0 |
| `package.json`       |                5 |               23 |               15 |
| `.github/workflows`  |                5 |              113 |               31 |
| `.tsconfigs/bundler` |                4 |               94 |                0 |
| `pnpm-lock.yaml`     |                4 |            6,571 |            2,188 |
| `src/services`       |                4 |               26 |              166 |
| `README.md`          |                3 |               80 |               99 |

Merged/shipped PR evidence visible on `origin/main`:

- `#21` `nab5/token-keeper` (2024-10-01): merge authored by `polarzero`, branch by another contributor; count as integration/merge responsibility.
- `#27` `pri-1119-poc-pumping-tokens-explorer` (2024-10-09): initial explorer/indexer-related server work mirrored from Tub history.
- `#44` `pri-1145-hasura-integrate-formatted-tokens-native-query` (2024-10-10): Hasura/formatted tokens query integration.
- `#254` `pri-1435-server-handle-error-on-jupiter-fetch` (2024-12-10): Jupiter fetch error handling.
- `#255` `pri-1436-merge-real-token-balances-into-server-organization` (2024-12-10): server organization and real token balances.
- `#285` `pri-1479-gqlios-other-analytics-refactor` (2025-01-06): analytics refactor.
- `#296` `pri-1482-gql-caching-on-top-of-hasura` (2025-01-09): cache layer over Hasura.
- `#308` `pri-1510-gql-optimize-tokens-metadata-live-data` (2025-01-17): metadata/live data optimization.
- `#309` `pri-1517-server-fix-docker-image` (2025-01-17): Docker image/dev/cache fixes.
- `#312` `pri-1518-dashboard-user-trades-analytics` (2025-01-27): user trade analytics.
- `#291` `release/v0.5` (2025-01-29): release merge; integration evidence, not sole authorship.
- `#324` `pri-1542-tub-gql-documentation-indexer-library` (2025-01-31): GQL/docs/indexer library related work.
- `#330` `pri-1613-formatting` (2025-02-04): formatting/package cleanup.

Concrete contribution areas visible in main history:

- `apps/server`: buy/sell support, SOL/USD price caching/subscriptions, analytics endpoints, transaction queries, cache URL/Hasura refactor, Jupiter API handling.
- Build/package/release: Dockerfile fixes, TypeScript config, npm/GHCR publishing workflow and README/docs.

Conservative wording: `polarzero` contributed and shipped server/package work in `dex-server`, largely corresponding to extracted or mirrored Tub server/GQL/cache functionality. Avoid presenting this as a separate full product build unless external evidence confirms the repo split/release context.

## GitHub CLI findings and uncertainty

Commands using `gh` were run and produced mixed results:

- `gh auth status` succeeded for account `0xpolarzero` with `repo` and `read:org` scopes.
- `gh repo view primodiumxyz/primodium --json nameWithOwner,isPrivate,visibility,url,defaultBranchRef` succeeded and showed a public repo with default branch `main`.
- `gh repo view primodiumxyz/empires --json nameWithOwner,isPrivate,visibility,url,defaultBranchRef` succeeded and showed a public repo with default branch `main`.
- `gh repo view primodiumxyz/dex-server --json nameWithOwner,isPrivate,visibility,url,defaultBranchRef` succeeded and showed a public repo with default branch `main`.
- `gh repo view primodiumxyz/tub --json nameWithOwner,isPrivate,visibility,url,defaultBranchRef` failed: `Could not resolve to a Repository with the name 'primodiumxyz/tub'`.
- `gh pr list --repo ... --author 0xpolarzero --state all ...` returned `[]` for accessible repos.
- Direct `gh pr view` calls for local historical PR numbers such as `primodiumxyz/primodium#1237`, `primodiumxyz/empires#24`, and `primodiumxyz/dex-server#44` failed with `Could not resolve to a PullRequest`.

Interpretation: current GitHub public metadata does not fully expose the historical PR objects referenced by local merge commits. This may be because PRs were from a private/internal repo state, because history was moved/rewritten, because PR metadata is not retained on the current public repo, or because some repositories/PRs are inaccessible despite the local remotes. Therefore, this audit treats local `origin/main` merge commits as the primary shipped evidence, and treats GitHub CLI results as source/context plus an uncertainty note rather than as the authoritative PR list.

## Commands and sources used

Primary local git commands:

```sh
git -C /Users/polarzero/code/primodium/<repo> remote -v
git -C /Users/polarzero/code/primodium/<repo> status --short
git -C /Users/polarzero/code/primodium/<repo> log --all --author='polarzero' --date=short --pretty=format:'%h%x09%ad%x09%an%x09%ae%x09%s' --reverse
git -C /Users/polarzero/code/primodium/<repo> log --all --author='polarzero\|0xpolarzero' --date=short --pretty=format:'%ad%x09%h%x09%an%x09%s' --reverse
git -C /Users/polarzero/code/primodium/<repo> log origin/main --author='polarzero\|0xpolarzero' --date=short --pretty=format:'%ad%x09%h%x09%an%x09%s' --reverse
git -C /Users/polarzero/code/primodium/<repo> log origin/main --merges --grep='Merge pull request' --author='polarzero\|0xpolarzero' --date=short --pretty=format:'%ad%x09%h%x09%s' --reverse
git -C /Users/polarzero/code/primodium/<repo> log origin/main --author='polarzero\|0xpolarzero' --no-merges --numstat --pretty=format:
git -C /Users/polarzero/code/primodium/<repo> shortlog -sne --all
git -C /Users/polarzero/code/primodium/<repo> branch -r --list
git -C /Users/polarzero/code/primodium/<repo> branch -a --contains HEAD
```

GitHub CLI commands:

```sh
gh auth status
gh repo view primodiumxyz/primodium --json nameWithOwner,isPrivate,visibility,url,defaultBranchRef
gh repo view primodiumxyz/empires --json nameWithOwner,isPrivate,visibility,url,defaultBranchRef
gh repo view primodiumxyz/dex-server --json nameWithOwner,isPrivate,visibility,url,defaultBranchRef
gh repo view primodiumxyz/tub --json nameWithOwner,isPrivate,visibility,url,defaultBranchRef
gh pr list --repo primodiumxyz/<repo> --author 0xpolarzero --state all --limit 200 --json number,title,state,createdAt,updatedAt,mergedAt,headRefName,baseRefName,url,additions,deletions,changedFiles
gh pr view <number> --repo primodiumxyz/<repo> --json number,title,author,state,createdAt,mergedAt,headRefName,baseRefName,url,files
```

Local repository state during audit:

- `/Users/polarzero/code/primodium/dex-server`: clean working tree.
- `/Users/polarzero/code/primodium/tub`: clean working tree; current branch observed as `0xpolarzero/pri-1618-tub-add-indexer-database-diagram`.
- `/Users/polarzero/code/primodium/empires`: clean working tree.
- `/Users/polarzero/code/primodium/primodium`: clean working tree.

## Final conservative attribution

`polarzero`'s demonstrable Primodium contribution period spans **May 2024 through February 2025**.

For public/profile wording, the most defensible phrasing is:

> Contributed across Primodium, Empires, Tub, and Dex Server from May 2024 to February 2025, shipping client/game UI, reactive data/sync infrastructure, Solana token indexer/GQL/dashboard/server work, deployment tooling, and documentation/OSS cleanup.

Avoid stronger wording such as "built Primodium", "owned all Tub infrastructure", or "solely shipped Empires" unless supplemented by non-git evidence. The local evidence supports a major contributor role with multiple shipped feature areas, not sole ownership of the full products.
