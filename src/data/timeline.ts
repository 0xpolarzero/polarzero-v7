export type TimelineCategory = "work" | "experiments" | "writing" | "education" | "research";

export type TimelineLinkKey = "website" | "github" | "twitter" | "article" | "docs";

export type TimelineLinkMap = Partial<Record<TimelineLinkKey, string>>;

export type TimelineItem = {
  title: string;
  category: TimelineCategory;
  from: string;
  to?: string | null;
  caption: string;
  description: string[];
  descriptionLinks?: Record<string, string>;
  links?: TimelineLinkMap;
};

export type TimelineYear = {
  year: string;
  items: TimelineItem[];
};

export const TIMELINE: TimelineYear[] = [
  {
    year: "2026",
    items: [
      {
        title: "svvy",
        category: "work",
        from: "2026-04",
        caption: "A strategic coding workbench for directing bounded, workflow-backed agent work",
        description: [
          "svvy: organizes coding work around orchestrator sessions that hold product intent, route implementation into bounded threads, and reconcile durable results from structured, inspectable workflows those threads supervise without bloating orchestrator context, while letting you steer at any layer.",
          "electrobun-browser-tools: shipped an inspection and driving bridge for Electrobun apps, exposing windows, views, layout trees, DOM state, logs, events, screenshots, and Playwright-style locators to agents.",
          "electrobun-e2e: shipped shared end-to-end infrastructure for running Electrobun desktop apps headlessly in OrbStack Linux environments.",
          "Built with Electrobun, Svelte, Pi, and Smithers.",
        ],
        links: {
          github: "https://github.com/0xpolarzero/svvy",
        },
        descriptionLinks: {
          svvy: "https://github.com/0xpolarzero/svvy",
          "electrobun-browser-tools": "https://github.com/0xpolarzero/electrobun-browser-tools",
          "electrobun-e2e": "https://github.com/0xpolarzero/electrobun-e2e",
        },
      },
    ],
  },
  {
    year: "2025",
    items: [
      {
        title: "Tevm",
        category: "work",
        from: "2025-04",
        caption: "Contributing to a multi-language library for running an EVM in every environment",
        description: [
          "@tevm/compiler: shipped a Solidity & Vyper compiler around Foundry compilers for Typescript.",
          "tevm-monorepo: contributed to call/debug and tracing methods, a MUD plugin for optimistic updates, storage layout and pre/post-state tooling, and various other runtime, API, build, and documentation contributions.",
          "guillotine: contributed to a Zig EVM, including a Zig devtool and BubbleTea CLI for call disassembly and step-by-step tracing, Go/C/WASM/TypeScript SDK bindings, EVM semantics fixes, and research-heavy work on hardfork support, gas accounting, and execution spec fixtures.",
          "guillotine-mini: contributed WASI/WASM build and bindings, and research-heavy EVM tracing/debugging work around WASM constraints, threading, debugger architecture, and dispatch-level execution hooks.",
          "@tevm/test-matchers: shipped a Javascript library that extends Vitest with EVM-related test matchers.",
          "@tevm/test-node: shipped a Javascript library to snapshot EVM JSON-RPC calls in Vitest/Bun.",
        ],
        links: {
          website: "https://tevm.sh",
          github: "https://github.com/evmts",
          twitter: "https://x.com/tevmtools",
        },
        descriptionLinks: {
          "@tevm/compiler": "https://github.com/evmts/compiler/blob/main/libs/compiler/README.md",
          "tevm-monorepo": "https://github.com/evmts/tevm-monorepo",
          guillotine: "https://github.com/evmts/guillotine",
          "guillotine-mini": "https://github.com/evmts/guillotine-mini",
          "@tevm/test-matchers":
            "https://github.com/evmts/tevm-monorepo/tree/main/extensions/test-matchers",
          "@tevm/test-node":
            "https://github.com/evmts/tevm-monorepo/tree/main/extensions/test-node",
        },
      },
      {
        title: "Primodium",
        category: "work",
        from: "2024-04",
        to: "2025-03",
        caption: "Worked at a startup exploring onchain games and crypto user-facing products",
        description: [
          "DEX Indexer: shipped a Yellowstone gRPC Typescript indexer for Solana DEX trades.",
          "DEX GraphQL: shipped a Hasura + Timescale GraphQL client for querying DEX activity & analytics on Solana.",
          "DEX Server: contributed server/package work around buy/sell flows, SOL/USD price caching, transaction analytics, Hasura/cache integration, Docker/package workflows, and docs.",
          "Tub: contributed across the Solana indexer, GraphQL/Hasura/Timescale layer, dashboard/explorer, server analytics, and iOS query/chart/transaction integration surfaces.",
          "Gasless server: shipped a MUD-compatible gasless server library for EVM chains.",
          "Primodium Empires: contributed client UI/game tooling, cheatcodes, transaction feedback, keeper/deployment infrastructure, and contract test/audit-prep work, while owning the artist handoff loop for integrating art and animations into the game.",
          "Reactive Tables: shipped a state management library for onchain games built on MUD for Typescript & React.",
          "Primodium v0.11: took ownership of the sync/indexer and database stack, and shipped client/core rendering work, game-object interaction fixes, reactive-table integration, package/build fixes, and browser profiling-driven performance optimizations.",
          "Open-source release: owned the public release pass for the work above, including documentation for each package and shipping the open-sourced libraries and containers.",
        ],
        links: {
          website: "https://primodium.com",
          github: "https://github.com/primodiumxyz",
          twitter: "https://x.com/primodiumgame",
        },
        descriptionLinks: {
          "DEX Indexer": "https://github.com/primodiumxyz/dex-indexer-stack",
          "DEX GraphQL": "https://github.com/primodiumxyz/dex-indexer-stack/tree/main/packages/gql",
          "DEX Server": "https://github.com/primodiumxyz/dex-server",
          Tub: "https://github.com/primodiumxyz/tub-ios",
          "Gasless server": "https://github.com/primodiumxyz/gasless",
          "Primodium Empires": "https://github.com/primodiumxyz/empires",
          "Reactive Tables": "https://github.com/primodiumxyz/reactive-tables",
          "Primodium v0.11": "https://github.com/primodiumxyz/primodium",
        },
      },
      {
        title: "evmstate",
        category: "experiments",
        from: "2025-03",
        to: "2025-05",
        caption:
          "A TypeScript library for tracing and visualizing EVM state changes with detailed human-readable labeling",
        description: [
          "@polareth/evmstate traces all state changes after a transaction execution in a local VM, or by watching transactions in incoming blocks.",
          "It retrieves and labels storage slots with semantic insights and provides a detailed diff of all changes. Built with Tevm and Whatsabi.",
        ],
        links: {
          github: "https://github.com/polareth/evmstate",
          docs: "https://evmstate.polareth.org",
        },
        descriptionLinks: {
          "@polareth/evmstate": "https://npmjs.com/package/@polareth/evmstate",
        },
      },
      {
        title: "nightwatch",
        category: "experiments",
        from: "2025-04-13",
        to: "2025-04-20",
        caption: "A public archive of onchain scam investigations",
        description: [
          "Nightwatch catalogs research from onchain sleuths on Twitter & Telegram, as a public archive and convenient research tool.",
          "Built with Remix, Neon, and Deno.",
        ],
        links: {
          website: "https://nightwatch.polareth.org",
          github: "https://github.com/polareth/nightwatch",
          twitter: "https://twitter.com/polarethorg",
        },
      },
    ],
  },
  {
    year: "2024",
    items: [
      {
        title: "savvy",
        category: "experiments",
        from: "2024-02-03",
        to: "2024-04-01",
        caption: "A browser interface to simulate and visualize EVM activity",
        description: [
          "savvy exposes an interface to fork a chain and tweak its network conditions, to simulate complex onchain interactions and visualize results & gas usage, both on L1 and L2 EVM chains.",
          "Built with Tevm, Whatsabi, and Next.js.",
        ],
        links: {
          website: "https://svvy.sh",
          github: "https://github.com/polareth/savvy",
          twitter: "https://x.com/polarethorg",
        },
      },
      {
        title: "Research: EVM gas benchmarks",
        category: "research",
        from: "2024-02",
        to: "2024-03",
        caption: "Various research projects on EVM gas usage and tooling",
        description: [
          "airdrop gas benchmarks: a series of tests to benchmark gas usage across ERC20/721/1155 patterns with batched, merkle, and claim style drops, picked from popular airdrop contracts — comes with an interactive dashboard to analyze costs based on airdrop parameters.",
          "gas metering comparison: cross-validated gas reports from popular tooling against live executions with Foundry, Hardhat, and Tevm on identical calldata sets, and documented discrepancies.",
        ],
        descriptionLinks: {
          "airdrop gas benchmarks":
            "https://polarzero.xyz/gas-visualizer?author=0xpolarzero&repo=airdrop-gas-benchmarks",
          "gas metering comparison": "https://github.com/0xpolarzero/gas-metering-comparison",
        },
      },
    ],
  },
  {
    year: "2023",
    items: [
      {
        title: "Research: EVM security",
        category: "research",
        from: "2023-11",
        to: "2023-12",
        caption: "Various research projects on EVM security and tooling",
        description: [
          "Glider: joined Secureum workshop sessions to battle-test Glider on live exploit scenarios, and submitted documentation fixes and clarified flows for security researchers.",
          "storage collision: a reference research for verifying smart contract assumptions using fuzzing & formal verification tools (here exhibiting storage collision) with Foundry, Halmos, and Certora.",
          "ERC1155A: a reference fuzzing test suite on a token extension to verify assumptions and surface edge cases.",
        ],
        descriptionLinks: {
          Glider: "https://glide.r.xyz",
          "storage collision":
            "https://github.com/0xpolarzero/storage-collision-formal-verification",
          ERC1155A: "https://github.com/0xpolarzero/superform-erc1155a-fuzzing/",
        },
      },
      {
        title: "Experiments: web-based 3D & spatial audio",
        category: "experiments",
        from: "2023-01",
        to: "2023-05",
        caption: "Various projects with Three.js/React Three Fiber and 3D spatial audio engines",
        description: [
          "echoes: a contemplative yet interactive onchain collectible, made of particles, as part of an immersive audiovisual experience.",
          "poligraph: a 3D graph to help visualize political relationships in the French Assemblée Nationale.",
          "metaverse: a virtual world on the browser with interactive 3D audio sources — built while alpha-testing Atmoky spatial audio engine and as part of a research paper on immersive audio in virtual worlds.",
          "esthesis: a multi-platform 3D visualizer for music NFTs.",
        ],
        descriptionLinks: {
          echoes: "https://echoes.polarzero.xyz/",
          poligraph: "https://poligraph.polarzero.xyz/",
          metaverse: "https://immersiveaudio.polarzero.xyz/",
          esthesis: "https://esthesis.polarzero.xyz/",
        },
      },
      {
        title: "cascade",
        category: "experiments",
        from: "2023-05-22",
        to: "2023-06-11",
        caption:
          "(Just another attempt at a) decentralized automated crowdfunding platform, with automated and flexible recurring payments",
        description: [
          "An interface between founders and contributors, where the latter can plan their contributions over a specified period, give out their funds to a secured contract, let the payments be sent automatically, and still pull back if they don't feel confident anymore at some point.",
          "Built during Chainlink Fall 2023 hackathon.",
        ],
        links: {
          website: "https://devpost.com/software/cascade-u14fdb",
          github: "https://github.com/0xpolarzero/decentralized-autonomous-crownfunding",
          docs: "https://youtu.be/4tHtIcdVorY",
        },
      },
      {
        title: "Chainlink Functions",
        category: "work",
        from: "2023-01-23",
        to: "2023-03-07",
        caption: "Tested Chainlink Functions across alpha and beta releases with public examples",
        description: [
          "Tested Chainlink Functions during Alpha (01-03/2023) and Beta (09/2023); provided some now outdated examples and demo for showcasing during release.",
          "Next.js starter.",
          "cross-chain ERC20 balance verification.",
          "onchain Twitter verifier.",
        ],
        links: {
          website: "https://chain.link/functions",
          docs: "https://youtu.be/N5jvHRSJVME",
        },
        descriptionLinks: {
          "Next.js starter": "https://github.com/0xpolarzero/chainlink-functions-next-starter",
          "cross-chain ERC20 balance verification":
            "https://github.com/0xpolarzero/cross-chain-ERC20-balance-verification",
          "onchain Twitter verifier":
            "https://github.com/0xpolarzero/twitter-verifier-chainlink-functions",
        },
      },
      {
        title: "Blockchain, but for real",
        category: "writing",
        from: "2023-10-27",
        to: "2023-11-07",
        caption: "An article on blockchain fundamentals, misconceptions, and future outlooks",
        description: [
          "Blockchain, but for real (EN): some explanations about blockchain — current perception, what it actually is, how it works, perspectives for the future, and what to do now.",
          "La blockchain, mais pour de vrai (FR): quelques explications sur la blockchain : perceptions actuelles, ce que c'est réellement, fonctionnement, perspectives futures, ce qu'on peut faire maintenant.",
        ],
        links: {
          article: "https://medium.com/@0xpolarzero/blockchain-but-for-real-e1d8c0e0ebfc",
        },
        descriptionLinks: {
          "Blockchain, but for real (EN)":
            "https://medium.com/@0xpolarzero/blockchain-but-for-real-e1d8c0e0ebfc",
          "La blockchain, mais pour de vrai (FR)":
            "https://medium.com/@0xpolarzero/la-blockchain-mais-pour-de-vrai-0fed9b951af9",
        },
      },
      {
        title: "Decentralized systems, end the cycle of indifference",
        category: "writing",
        from: "2023-10-12",
        to: "2023-10-17",
        caption: "An article on democracies, delegation and decentralized systems",
        description: [
          "How traditional democracies tend to favor indifference, through delegation of knowledge and awareness, and how decentralized systems can help by incentivizing active participation in governance.",
        ],
        links: {
          article:
            "https://medium.com/@0xpolarzero/decentralized-systems-end-the-cycle-of-indifference-8c19d7167778",
        },
      },
      {
        title: "Chainlink's new dawn",
        category: "writing",
        from: "2023-09-22",
        to: "2023-10-02",
        caption: "An article on Chainlink after CCIP",
        description: [
          "A reflection on Chainlink's latest milestones, and key aspects from a developer's perspective.",
        ],
        links: {
          article: "https://medium.com/@0xpolarzero/chainlinks-new-dawn-725d7a6881cb",
        },
      },
      {
        title: "Smart contract security, terminology of a review",
        category: "writing",
        from: "2023-09-17",
        to: "2023-09-18",
        caption: "An article on smart contract security terminology",
        description: [
          "Navigating the rambling world of smart contract security, and specifically the terminology/technical jargon, from the perspective of a newcomer.",
        ],
        links: {
          article:
            "https://medium.com/@0xpolarzero/smart-contract-security-terminology-of-a-review-99b9203c9824",
        },
      },
      {
        title: "Lesson #0, fundamentals of Solidity storage",
        category: "writing",
        from: "2023-06-28",
        to: "2023-06-29",
        caption: "An article on the fundamentals of Solidity storage",
        description: [
          "The storage layout in the EVM, how data is meticulously stored and managed with Solidity.",
        ],
        links: {
          website: "https://medium.com/@0xpolarzero/fundamentals-of-solidity-storage-581ba0551b3",
          twitter: "https://twitter.com/0xpolarzero",
        },
      },
      {
        title: "Alchemy University",
        category: "education",
        from: "2023-01-03",
        to: "2023-02-12",
        caption: "online",
        description: [
          "A seven-week Ethereum bootcamp on cryptography fundamentals, data structures, EVM internals, UTXO/account-based models, smart contracts...",
        ],
        links: {
          website: "https://university.alchemy.com/overview/ethereum",
          github: "https://github.com/0xpolarzero/AU-ethereum-bootcamp",
        },
      },
    ],
  },
  {
    year: "2022",
    items: [
      {
        title: "Three.js Journey",
        category: "education",
        from: "2022-11-27",
        to: "2022-12-06",
        caption: "online",
        description: [
          "An extensive introduction to Web-based 3D with WebGL, using Three.js and React Three Fiber: physics, modeling, interactions, shaders, post-processing, optimization, R3F and Drei...",
        ],
        links: {
          website: "https://threejs-journey.xyz/",
          github: "https://github.com/0xpolarzero/three-js-journey",
        },
      },
      {
        title: "promise",
        category: "experiments",
        from: "2022-10-17",
        to: "2022-11-19",
        caption: "An onchain app to help keep founders accountable for their promises",
        description: [
          "A decentralized app that allows founders to create and get involved into promises, that will be forever recorded and associated to their identity. Won Chainlink Top Quality Projects and QuickNode 1st Prize.",
        ],
        links: {
          website: "https://devpost.com/software/promise-erftax",
          github: "https://github.com/0xpolarzero/chainlink-fall-2022-hackathon",
          docs: "https://polarzero.gitbook.io/promise",
        },
      },
      {
        title: "Fullstack Solidity/JavaScript course",
        category: "education",
        from: "2022-09-23",
        to: "2022-10-15",
        caption: "online",
        description: [
          "A comprehensive introduction to all the core concepts related to blockchain, and developing smart contracts with JavaScript and Solidity by Patrick Collins.",
        ],
        links: {
          website: "https://github.com/smartcontractkit/full-blockchain-solidity-course-js",
          github: "https://github.com/0xpolarzero/full-blockchain-solidity-course-js",
        },
      },
      {
        title: "What is the metaverse anyway?",
        category: "writing",
        from: "2022-05-10",
        to: "2022-05-14",
        caption: "A short article to try to define the metaverse",
        description: [
          "Breaking through some of the most common misconceptions, in an article derived from my research on immersive virtual worlds.",
        ],
        links: {
          article: "https://blog.polarzero.xyz/what-is-the-metaverse-anyway",
        },
      },
      {
        title: "The Odin Project",
        category: "education",
        from: "2022-02-05",
        to: "2022-06-12",
        caption: "online",
        description: [
          "An open-source fullstack Javascript curriculum for learning web development with JavaScript, Node.js, Express, MongoDB, React...",
        ],
        links: {
          website: "https://www.theodinproject.com/",
        },
      },
      {
        title: "Master in Music and Music Production",
        category: "education",
        from: "2020",
        to: "2022",
        caption: "SAE Institute, Paris, France",
        description: [
          "Master's degree in sound engineering, music theory, mixing, mastering, arrangement and orchestration.",
          "Wrote a Master's thesis on immersive audio integration in virtual worlds.",
          "Une place pour l’audio immersif dans le Web 3.0 : intégration dans le métavers; adaptation à un nouveau modèle, immersion dans un espace en pleine expansion, expériences immersives accessibles et avancées...",
          "Paper (online).",
          "Paper (PDF).",
        ],
        links: {
          website: "https://www.sae.edu/fra/courses/master-musique/",
        },
        descriptionLinks: {
          "Paper (online)":
            "https://polarzero.notion.site/M-moire-de-M2-Antton-Lepretre-51e31e37f8124a09a948322dac59a124",
          "Paper (PDF)": "https://drive.google.com/file/d/1r0_ZjVGLb32tfxoBmrERJypyCV6No36u/view",
        },
      },
    ],
  },
  {
    year: "2020",
    items: [
      {
        title: "Bachelor in Music and Sound Engineering",
        category: "education",
        from: "2019",
        to: "2020",
        caption: "Université Gustave Eiffel, Paris, France",
        description: [
          "Bachelor's degree in music and sound engineering, musicology, harmony, acoustics, recording, sound design.",
        ],
        links: {
          website:
            "https://lact.univ-gustave-eiffel.fr/formations/licences/musique-et-metiers-du-son",
        },
      },
    ],
  },
  {
    year: "2019",
    items: [
      {
        title: "Advanced Technician Certificate in Audiovisual Production",
        category: "education",
        from: "2017",
        to: "2019",
        caption: "Lycée Suger, Paris, France",
        description: [
          "Majoring in Sound Engineering; audio recording, sound design, post-production (editing, mixing), applied physics and acoustics... (~Associate's degree).",
        ],
        links: {
          website: "https://suger.fr/?page_id=638",
        },
      },
    ],
  },
];
