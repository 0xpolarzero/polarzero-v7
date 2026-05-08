import PDFDocument from "pdfkit";

import { PROFILE } from "@/data/profile";
import { TIMELINE, type TimelineCategory, type TimelineItem } from "@/data/timeline";

const PAGE = {
  size: "A4" as const,
  width: 595.28,
  height: 841.89,
  margin: 30,
};

const COLORS = {
  paper: "#ffffff",
  ink: "#17191f",
  muted: "#626772",
  quiet: "#8b8173",
  line: "#d5cab9",
  accent: "#f97316",
  link: "#1f4da8",
};

const BODY_WIDTH = PAGE.width - PAGE.margin * 2;
const COLUMN_GAP = 22;
const COLUMN_WIDTH = (BODY_WIDTH - COLUMN_GAP) / 2;
const BOTTOM = PAGE.height - PAGE.margin - 16;
const TOP = 35;

type PdfDoc = InstanceType<typeof PDFDocument>;
type TimelineItemWithYear = TimelineItem & { year: string };
type PdfEntry = {
  title: string;
  date: string;
  caption: string;
  bullets: string[];
  descriptionLinks?: Record<string, string>;
  links?: Record<string, string>;
};
type Flow = {
  column: 0 | 1;
  top?: number;
  y: number;
};
type PdfSummary = {
  caption?: string;
  bullets?: string[];
};

const CATEGORY_LABELS: Record<TimelineCategory, string> = {
  work: "Work",
  research: "Research",
  experiments: "Experiments",
  writing: "Writing",
  education: "Education",
};

const PDF_SUMMARIES: Record<string, PdfSummary> = {
  svvy: {
    caption: "Agent coding workbench for bounded, workflow-backed implementation",
    bullets: [
      "Built svvy with Electrobun, Svelte, Pi, and Smithers to route implementation through bounded, inspectable agent workflows.",
      "Shipped Electrobun browser tooling and E2E infra for headless desktop app inspection, driving, logs, screenshots, and tests.",
    ],
  },
  Tevm: {
    caption: "Multi-language EVM tooling across TypeScript, Zig, WASM, Go, and C",
    bullets: [
      "Shipped @tevm/compiler: Solidity and Vyper compilation around Foundry compilers for TypeScript.",
      "Contributed Tevm call/debug, tracing, MUD optimistic updates, storage layout, pre/post-state tooling, APIs, builds, and docs.",
      "Contributed to Zig EVM guillotine: tracing CLI/devtool, Go/C/WASM/TS SDK bindings, semantics, hardforks, gas, fixtures.",
    ],
  },
  Primodium: {
    caption:
      "Onchain games and crypto products at Alliance, Paradigm, and A16Z-backed startup",
    bullets: [
      "Shipped Solana DEX indexer, Hasura + Timescale GraphQL client, and server work for buy/sell flows, analytics, caching, Docker.",
      "Built across Tub indexer, GraphQL, dashboard/explorer, server analytics, and iOS query, chart, and transaction surfaces.",
      "Owned Primodium sync/indexer and DB stack; shipped React/MUD state tools, gasless server, game UI/tooling, perf, docs, release.",
    ],
  },
  "Chainlink Functions": {
    caption: "Alpha and beta testing for Chainlink Functions with public developer examples",
    bullets: [
      "Tested Alpha/Beta releases and published examples: Next.js starter, cross-chain ERC20 balance verification, and Twitter verifier.",
    ],
  },
  evmstate: {
    caption: "EVM state tracing and visualization library for transaction diffs",
    bullets: [
      "Traces local VM or live block transactions, labels storage slots, and outputs semantic state diffs.",
    ],
  },
  nightwatch: {
    caption: "Public research archive for onchain scam investigations",
    bullets: [
      "Catalogs Twitter and Telegram sleuth research in a Remix, Neon, and Deno research tool.",
    ],
  },
  savvy: {
    caption: "Browser tool for simulating and visualizing EVM activity",
    bullets: [
      "Built with Tevm, Whatsabi, and Next.js to fork EVM chains and visualize interactions and gas usage.",
    ],
  },
  "Research: EVM gas benchmarks": {
    caption: "EVM gas benchmarking across airdrops and tooling",
    bullets: [
      "Benchmarked ERC20/721/1155 airdrops and cross-validated Foundry, Hardhat, and Tevm gas reports.",
    ],
  },
  "Research: EVM security": {
    caption: "EVM security research using fuzzing and formal verification",
    bullets: [
      "Tested Glider, storage collision, and ERC1155A cases with Foundry, Halmos, and Certora.",
    ],
  },
  "Experiments: web-based 3D & spatial audio": {
    caption: "Web 3D and spatial audio experiments",
    bullets: [
      "Built Three.js/R3F projects for onchain collectibles, political graphs, virtual worlds, and music NFT visuals.",
    ],
  },
  cascade: {
    caption: "Decentralized crowdfunding with automated recurring payments",
    bullets: [
      "Built a Chainlink Fall 2023 hackathon app for secured, flexible contributor payments to founders.",
    ],
  },
  promise: {
    caption: "Onchain accountability app for founder commitments",
    bullets: [
      "Built a dapp that records founder promises onchain and ties them to identity.",
      "Won Chainlink Top Quality Projects and QuickNode 1st Prize.",
    ],
  },
  "Blockchain, but for real": {
    caption: "Blockchain fundamentals, misconceptions, and future outlooks",
    bullets: ["Bilingual publication: English and French versions."],
  },
  "Decentralized systems, end the cycle of indifference": {
    caption: "Decentralized governance, delegation, and civic participation",
    bullets: [],
  },
  "Chainlink's new dawn": {
    caption: "Developer perspective on Chainlink after CCIP",
    bullets: [],
  },
  "Smart contract security, terminology of a review": {
    caption: "Smart contract security review terminology for newcomers",
    bullets: [],
  },
  "Lesson #0, fundamentals of Solidity storage": {
    caption: "Solidity storage layout and EVM data management fundamentals",
    bullets: [],
  },
  "What is the metaverse anyway?": {
    caption: "Research-based explainer on immersive virtual worlds",
    bullets: [],
  },
  "Alchemy University": {
    caption: "Ethereum bootcamp: cryptography, data structures, EVM, smart contracts",
    bullets: ["Seven-week online Ethereum bootcamp with public GitHub coursework."],
  },
  "Three.js Journey": {
    caption: "WebGL/Three.js course: R3F, shaders, physics, optimization",
    bullets: ["Built web-based 3D projects with React Three Fiber and Drei."],
  },
  "Fullstack Solidity/JavaScript course": {
    caption: "Solidity/JavaScript smart contract course by Patrick Collins",
    bullets: ["Covered core blockchain concepts and fullstack smart contract development."],
  },
  "The Odin Project": {
    caption: "Open-source fullstack JavaScript curriculum: Node, Express, React",
    bullets: ["Covered JavaScript, Node.js, Express, MongoDB, and React."],
  },
  "Master in Music and Music Production": {
    caption: "Master's degree, SAE Institute Paris: music and music production",
    bullets: ["Thesis on immersive audio integration in virtual worlds and Web 3.0."],
  },
  "Bachelor in Music and Sound Engineering": {
    caption: "Bachelor's degree, Universite Gustave Eiffel: music and sound engineering",
    bullets: ["Musicology, harmony, acoustics, recording, and sound design."],
  },
  "Advanced Technician Certificate in Audiovisual Production": {
    caption: "Advanced Technician Certificate, Lycee Suger: audiovisual production",
    bullets: ["Sound engineering major with recording, sound design, post-production, and acoustics."],
  },
};

const range = (item: TimelineItem) => {
  return `${item.from}\n${item.to ?? "now"}`;
};

const timelineItems = (): TimelineItemWithYear[] => {
  return TIMELINE.flatMap((group) => group.items.map((item) => ({ ...item, year: group.year })));
};

const entriesFor = (category: TimelineCategory): PdfEntry[] => {
  return timelineItems()
    .filter((item) => item.category === category)
    .map((item) => {
      const summary = PDF_SUMMARIES[item.title];
      const useOriginalText = category === "work";

      return {
        title: item.title,
        date: range(item),
        caption: useOriginalText ? item.caption : (summary?.caption ?? item.caption),
        bullets: useOriginalText ? item.description : category === "writing" ? [] : (summary?.bullets ?? item.description),
        descriptionLinks: item.descriptionLinks,
        links: {
          ...(item.links ?? {}),
          ...(item.title === "Master in Music and Music Production"
            ? {
                thesis: item.descriptionLinks?.["Paper (online)"] ?? "",
                pdf: item.descriptionLinks?.["Paper (PDF)"] ?? "",
              }
            : {}),
        },
      };
    });
};

const columnX = (column: Flow["column"]) => {
  return PAGE.margin + column * (COLUMN_WIDTH + COLUMN_GAP);
};

const writeBackground = (doc: PdfDoc) => {
  doc.rect(0, 0, PAGE.width, PAGE.height).fill(COLORS.paper);
};

const newPage = (doc: PdfDoc, flow: Flow) => {
  doc.addPage();
  writeBackground(doc);
  flow.column = 0;
  flow.y = TOP;
};

const nextColumn = (doc: PdfDoc, flow: Flow) => {
  if (flow.column === 0) {
    flow.column = 1;
    flow.y = flow.top ?? TOP;
    return;
  }

  newPage(doc, flow);
};

const ensureSpace = (doc: PdfDoc, flow: Flow, needed: number) => {
  if (flow.y + needed > BOTTOM) {
    nextColumn(doc, flow);
  }
};

const writeHeader = (doc: PdfDoc) => {
  doc.font("Helvetica-Bold").fontSize(42).fillColor(COLORS.ink).text(PROFILE.name, PAGE.margin, 31, {
    width: BODY_WIDTH,
    lineGap: -8,
  });

  const titleY = 77;
  const locationY = 90;
  const linksY = 104;
  let cursorX = PAGE.margin;

  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor(COLORS.muted)
    .text(PROFILE.title, cursorX, titleY)
    .text(PROFILE.location, cursorX, locationY);

  const links = [
    [`GitHub (${PROFILE.handle})`, "https://github.com/0xpolarzero"],
    [`Twitter (${PROFILE.handle})`, "https://x.com/0xpolarzero"],
    [PROFILE.email, `mailto:${PROFILE.email}`],
  ] as const;

  links.forEach(([label, url], index) => {
    if (index > 0) {
      doc.font("Helvetica").fontSize(8.5).fillColor(COLORS.quiet).text("/", cursorX, linksY);
      cursorX += doc.widthOfString("/") + 8;
    }

    doc
      .font("Helvetica-Bold")
      .fontSize(8.5)
      .fillColor(COLORS.link)
      .text(label, cursorX, linksY, {
        link: url,
        underline: true,
      });
    cursorX += doc.widthOfString(label) + 8;
  });

  doc
    .moveTo(PAGE.margin, 119)
    .lineTo(PAGE.width - PAGE.margin, 119)
    .lineWidth(0.8)
    .strokeColor(COLORS.line)
    .stroke();
};

const writeIntro = (doc: PdfDoc) => {
  doc.y = 134;
  PROFILE.summary.forEach((paragraph) => {
    doc.font("Helvetica").fontSize(8.3).fillColor(COLORS.ink).text(paragraph, PAGE.margin, doc.y, {
      width: BODY_WIDTH,
      lineGap: 1.7,
      align: "justify",
    });
    doc.moveDown(0.32);
  });

  return doc.y + 8;
};

const sectionHeight = () => 24;

const writeSection = (doc: PdfDoc, flow: Flow, title: string) => {
  ensureSpace(doc, flow, sectionHeight());

  const x = columnX(flow.column);
  doc
    .font("Helvetica-Bold")
    .fontSize(8.2)
    .fillColor(COLORS.accent)
    .text(title.toUpperCase(), x, flow.y, {
      characterSpacing: 0.7,
      width: COLUMN_WIDTH,
    });
  doc
    .moveTo(x, doc.y + 4)
    .lineTo(x + COLUMN_WIDTH, doc.y + 4)
    .lineWidth(0.55)
    .strokeColor(COLORS.line)
    .stroke();

  flow.y = doc.y + 10;
};

const writeSectionAt = (doc: PdfDoc, title: string, x: number, y: number, width: number) => {
  doc
    .font("Helvetica-Bold")
    .fontSize(8.2)
    .fillColor(COLORS.accent)
    .text(title.toUpperCase(), x, y, {
      characterSpacing: 0.7,
      width,
    });
  doc
    .moveTo(x, doc.y + 4)
    .lineTo(x + width, doc.y + 4)
    .lineWidth(0.55)
    .strokeColor(COLORS.line)
    .stroke();

  return doc.y + 10;
};

const textHeight = (doc: PdfDoc, text: string, width: number, fontSize: number, lineGap = 0) => {
  doc.font("Helvetica").fontSize(fontSize);
  return doc.heightOfString(text, { width, lineGap });
};

const entryHeight = (doc: PdfDoc, item: PdfEntry) => {
  const dateWidth = 56;
  const bodyWidth = COLUMN_WIDTH - dateWidth - 9;
  const captionHeight = textHeight(doc, item.caption, bodyWidth, 7.25, 0.8);
  const bulletHeight = item.bullets.reduce(
    (total, bullet) => total + 4 + textHeight(doc, bullet, bodyWidth - 8, 7.1, 0.8),
    0,
  );
  const linksHeight = Object.keys(item.links ?? {}).length > 0 ? 10 : 0;

  return Math.max(30, 10 + captionHeight + bulletHeight + linksHeight);
};

const entryBoxHeight = (
  doc: PdfDoc,
  item: PdfEntry,
  width: number,
  options: { dense?: boolean } = {},
) => {
  const dense = options.dense ?? false;
  const dateWidth = dense ? 50 : 56;
  const bodyWidth = width - dateWidth - 9;
  const captionSize = dense ? 6.8 : 7.25;
  const bulletSize = dense ? 6.45 : 7.1;
  const lineGap = dense ? 0.35 : 0.8;
  const captionHeight = textHeight(doc, item.caption, bodyWidth, captionSize, lineGap);
  const bulletHeight = item.bullets.reduce(
    (total, bullet) => total + 3 + textHeight(doc, bullet, bodyWidth - 8, bulletSize, lineGap),
    0,
  );
  const linksHeight = Object.keys(item.links ?? {}).length > 0 ? 9 : 0;

  return Math.max(dense ? 24 : 30, 10 + captionHeight + bulletHeight + linksHeight);
};

const writeLinks = (doc: PdfDoc, links: PdfEntry["links"], x: number, y: number) => {
  Object.entries(links ?? {})
    .filter(([, url]) => url.length > 0)
    .slice(0, 5)
    .forEach(([label, url], index) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(6.3)
        .fillColor(COLORS.link)
        .text(label, x + index * 34, y, {
          link: url,
          underline: true,
        });
    });
};

const writeBulletText = (
  doc: PdfDoc,
  text: string,
  descriptionLinks: PdfEntry["descriptionLinks"],
  x: number,
  y: number,
  width: number,
  fontSize: number,
  lineGap: number,
) => {
  const match = text.match(/^([^:]{2,64}:)\s+(.*)$/);

  if (!match) {
    doc.font("Helvetica").fontSize(fontSize).fillColor(COLORS.ink).text(text, x, y, {
      width,
      lineGap,
    });
    return;
  }

  const [, label, rest] = match;
  const link = descriptionLinks?.[label.slice(0, -1)];
  const labelText = `${label} `;
  const labelWidth = doc.font("Helvetica-Bold").fontSize(fontSize).widthOfString(labelText);
  const underlineWidth = doc.widthOfString(label);

  doc
    .font("Helvetica-Bold")
    .fontSize(fontSize)
    .fillColor(link ? COLORS.link : COLORS.ink)
    .text(labelText, x, y, {
      continued: true,
      lineGap,
      width,
    });

  if (link) {
    doc
      .save()
      .moveTo(x, y + fontSize)
      .lineTo(x + underlineWidth, y + fontSize)
      .lineWidth(0.35)
      .strokeColor(COLORS.link)
      .stroke()
      .restore()
      .link(x, y, labelWidth, fontSize + 2, link);
  }

  doc
    .font("Helvetica")
    .fillColor(COLORS.ink)
    .text(rest, {
      width,
      lineGap,
    });
};

const writeEntry = (doc: PdfDoc, flow: Flow, item: PdfEntry) => {
  ensureSpace(doc, flow, Math.min(entryHeight(doc, item), BOTTOM - TOP));

  const x = columnX(flow.column);
  const dateWidth = 56;
  const bodyX = x + dateWidth + 9;
  const bodyWidth = COLUMN_WIDTH - dateWidth - 9;
  const startY = flow.y;

  doc
    .font("Helvetica-Bold")
    .fontSize(6.2)
    .fillColor(COLORS.quiet)
    .text(item.date, x, startY + 2, { width: dateWidth });

  doc.font("Helvetica-Bold").fontSize(8.4).fillColor(COLORS.ink).text(item.title, bodyX, startY, {
    width: bodyWidth,
    lineGap: 0.2,
  });

  doc.font("Helvetica").fontSize(7.25).fillColor(COLORS.muted).text(item.caption, bodyX, doc.y + 1, {
    width: bodyWidth,
    lineGap: 0.8,
    align: "justify",
  });

  item.bullets.forEach((bullet) => {
    if (doc.y + textHeight(doc, bullet, bodyWidth - 8, 7.1, 0.8) + 6 > BOTTOM) {
      flow.y = doc.y + 5;
      nextColumn(doc, flow);
      doc.y = flow.y;
    }

    doc.moveDown(0.1);
    doc.circle(bodyX + 1.8, doc.y + 3.4, 1).fillColor(COLORS.accent).fill();
    writeBulletText(doc, bullet, item.descriptionLinks, bodyX + 8, doc.y, bodyWidth - 8, 7.1, 0.8);
  });

  if (Object.keys(item.links ?? {}).length > 0) {
    writeLinks(doc, item.links, bodyX, doc.y + 2);
    doc.y += 8;
  }

  flow.y = Math.max(doc.y + 8, startY + 30);
};

const writeEntryBox = (
  doc: PdfDoc,
  item: PdfEntry,
  x: number,
  y: number,
  width: number,
  options: { dense?: boolean } = {},
) => {
  const dense = options.dense ?? false;
  const dateWidth = dense ? 50 : 56;
  const bodyX = x + dateWidth + 9;
  const bodyWidth = width - dateWidth - 9;
  const titleSize = dense ? 8 : 8.4;
  const captionSize = dense ? 6.8 : 7.25;
  const bulletSize = dense ? 6.45 : 7.1;
  const lineGap = dense ? 0.35 : 0.8;

  doc
    .font("Helvetica-Bold")
    .fontSize(6.2)
    .fillColor(COLORS.quiet)
    .text(item.date, x, y + 2, { width: dateWidth });

  doc.font("Helvetica-Bold").fontSize(titleSize).fillColor(COLORS.ink).text(item.title, bodyX, y, {
    width: bodyWidth,
    lineGap: 0.2,
  });

  doc.font("Helvetica").fontSize(captionSize).fillColor(COLORS.muted).text(item.caption, bodyX, doc.y + 1, {
    width: bodyWidth,
    lineGap,
    align: "justify",
  });

  item.bullets.forEach((bullet) => {
    doc.moveDown(0.08);
    doc.circle(bodyX + 1.8, doc.y + 3.2, 0.9).fillColor(COLORS.accent).fill();
    writeBulletText(doc, bullet, item.descriptionLinks, bodyX + 8, doc.y, bodyWidth - 8, bulletSize, lineGap);
  });

  if (Object.keys(item.links ?? {}).length > 0) {
    writeLinks(doc, item.links, bodyX, doc.y + 2);
    doc.y += 7;
  }

  return Math.max(doc.y + 6, y + entryBoxHeight(doc, item, width, { dense }));
};

const writeCategory = (doc: PdfDoc, flow: Flow, category: TimelineCategory) => {
  writeSection(doc, flow, CATEGORY_LABELS[category]);
  entriesFor(category).forEach((item) => writeEntry(doc, flow, item));
  flow.y += 4;
};

const writePageOne = (doc: PdfDoc) => {
  writeBackground(doc);
  writeHeader(doc);
  const top = writeIntro(doc);
  const leftX = PAGE.margin;
  const rightX = PAGE.margin + COLUMN_WIDTH + COLUMN_GAP;
  const work = entriesFor("work");
  const research = entriesFor("research");

  let y = writeSectionAt(doc, "work", PAGE.margin, top, BODY_WIDTH);

  const firstRowY = y;
  const svvyEnd = writeEntryBox(doc, work[0], leftX, firstRowY, COLUMN_WIDTH);
  const primodiumEnd = writeEntryBox(doc, work[2], rightX, firstRowY, COLUMN_WIDTH);

  const leftColumnEnd = writeEntryBox(doc, work[1], leftX, svvyEnd + 8, COLUMN_WIDTH);
  const rightColumnEnd = writeEntryBox(doc, work[3], rightX, primodiumEnd + 8, COLUMN_WIDTH);

  y = writeSectionAt(doc, "research", PAGE.margin, Math.max(leftColumnEnd, rightColumnEnd) + 2, BODY_WIDTH);
  writeEntryBox(doc, research[0], leftX, y, COLUMN_WIDTH, { dense: true });
  writeEntryBox(doc, research[1], rightX, y, COLUMN_WIDTH, { dense: true });
};

const writePageTwo = (doc: PdfDoc) => {
  writeBackground(doc);

  const left: Flow = { column: 0, y: TOP };
  writeCategory(doc, left, "experiments");
  left.y += 2;
  writeCategory(doc, left, "writing");

  writeCategory(doc, { column: 1, y: TOP }, "education");
};

const drawFooter = (doc: PdfDoc, pageNumber: number, totalPages: number) => {
  const footerText = "Read a cleaner web version at ";
  const footerY = BOTTOM - 2;
  const footerSize = 6.8;
  const linkLabel = "polarzero.xyz";
  const linkX = PAGE.margin + doc.font("Helvetica").fontSize(footerSize).widthOfString(footerText);
  const linkWidth = doc.font("Helvetica-Bold").fontSize(footerSize).widthOfString(linkLabel);

  doc
    .font("Helvetica")
    .fontSize(footerSize)
    .fillColor(COLORS.quiet)
    .text(footerText, PAGE.margin, footerY, { width: BODY_WIDTH / 2 })
    .font("Helvetica-Bold")
    .fillColor(COLORS.link)
    .text(linkLabel, linkX, footerY);

  doc
    .save()
    .moveTo(linkX, footerY + footerSize)
    .lineTo(linkX + linkWidth, footerY + footerSize)
    .lineWidth(0.35)
    .strokeColor(COLORS.link)
    .stroke()
    .restore()
    .link(linkX, footerY, linkWidth, footerSize + 2, "https://polarzero.xyz");

  doc
    .font("Helvetica")
    .fillColor(COLORS.quiet)
    .text(`${pageNumber} / ${totalPages}`, PAGE.margin, footerY, {
      align: "right",
      width: BODY_WIDTH,
    });
};

export async function generateProfilePdf() {
  const doc = new PDFDocument({
    size: PAGE.size,
    margin: PAGE.margin,
    bufferPages: true,
    info: {
      Title: "polarzero",
      Author: PROFILE.name,
      Subject: PROFILE.title,
    },
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  writePageOne(doc);
  doc.addPage();
  writePageTwo(doc);

  const pageRange = doc.bufferedPageRange();
  for (let pageIndex = pageRange.start; pageIndex < pageRange.start + pageRange.count; pageIndex += 1) {
    doc.switchToPage(pageIndex);
    drawFooter(doc, pageIndex + 1, pageRange.count);
  }

  doc.end();

  return new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
