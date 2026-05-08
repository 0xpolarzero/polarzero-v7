import PDFDocument from "pdfkit";

import { PROFILE } from "@/data/profile";
import { TIMELINE, type TimelineCategory, type TimelineItem } from "@/data/timeline";

const PAGE = {
  size: "A4" as const,
  margin: 42,
  width: 595.28,
  height: 841.89,
};

const COLORS = {
  ink: "#17191f",
  muted: "#666a73",
  line: "#b9b1a4",
  accent: "#f97316",
  link: "#1f4da8",
  wash: "#f8f2e8",
};

const CATEGORY_LABELS: Record<TimelineCategory, string> = {
  work: "Work",
  experiments: "Experiments",
  research: "Research",
  writing: "Writing",
  education: "Education",
};

const CATEGORY_ORDER: TimelineCategory[] = [
  "work",
  "experiments",
  "research",
  "writing",
  "education",
];

type PdfDoc = InstanceType<typeof PDFDocument>;

const contentWidth = PAGE.width - PAGE.margin * 2;

const range = (item: TimelineItem) => {
  if (!item.to || item.to === item.from) return item.from;
  return `${item.from} - ${item.to}`;
};

const collectTimelineItems = () => {
  return TIMELINE.flatMap((group) => group.items.map((item) => ({ ...item, year: group.year })));
};

const categoryItems = (category: TimelineCategory) => {
  return collectTimelineItems().filter((item) => item.category === category);
};

const writeRule = (doc: PdfDoc, y = doc.y) => {
  doc
    .save()
    .moveTo(PAGE.margin, y)
    .lineTo(PAGE.width - PAGE.margin, y)
    .lineWidth(0.8)
    .strokeColor(COLORS.line)
    .stroke()
    .restore();
};

const ensureSpace = (doc: PdfDoc, needed: number) => {
  if (doc.y + needed > PAGE.height - PAGE.margin - 26) {
    doc.addPage();
  }
};

const drawHeader = (doc: PdfDoc) => {
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(COLORS.accent)
    .text(PROFILE.handle, PAGE.margin, 28, { continued: true })
    .fillColor(COLORS.muted)
    .font("Helvetica")
    .text(`  ${PROFILE.email}`);

  writeRule(doc, 48);
  doc.y = PAGE.margin + 20;
};

const drawFooter = (doc: PdfDoc, pageNumber: number, totalPages: number) => {
  const y = PAGE.height - 30;
  writeRule(doc, y - 10);
  doc
    .font("Helvetica")
    .fontSize(7.5)
    .fillColor(COLORS.muted)
    .text("polarzero.xyz", PAGE.margin, y, { width: contentWidth / 2 })
    .text(`${pageNumber} / ${totalPages}`, PAGE.margin, y, {
      align: "right",
      width: contentWidth,
    });
};

const writeSectionHeading = (doc: PdfDoc, label: string) => {
  ensureSpace(doc, 58);
  doc.moveDown(0.5);
  writeRule(doc);
  doc.moveDown(0.65);
  doc.font("Helvetica-Bold").fontSize(16).fillColor(COLORS.ink).text(label);
  doc.moveDown(0.45);
};

const writeLinkedDescription = (
  doc: PdfDoc,
  text: string,
  links: TimelineItem["descriptionLinks"] | undefined,
  x: number,
  y: number,
  options: PDFKit.Mixins.TextOptions,
) => {
  const linkedLabel = Object.keys(links ?? {}).find(
    (label) => text.startsWith(`${label}:`) || text === label,
  );

  if (!linkedLabel || !links?.[linkedLabel]) {
    doc.fillColor(COLORS.ink).text(text, x, y, options);
    return;
  }

  const rest = text.slice(linkedLabel.length);
  doc
    .fillColor(COLORS.link)
    .text(linkedLabel, x, y, {
      ...options,
      continued: true,
      link: links[linkedLabel],
      underline: true,
    })
    .fillColor(COLORS.ink)
    .text(rest);
};

const writeTimelineItem = (doc: PdfDoc, item: TimelineItem) => {
  const estimatedHeight =
    56 +
    item.caption.length / 2.7 +
    item.description.reduce((height, text) => height + 12 + text.length / 4.7, 0);

  ensureSpace(doc, Math.min(estimatedHeight, 230));

  const startY = doc.y;
  const dateWidth = 88;
  const bodyX = PAGE.margin + dateWidth + 18;
  const bodyWidth = contentWidth - dateWidth - 18;

  doc
    .font("Helvetica-Bold")
    .fontSize(8.5)
    .fillColor(COLORS.accent)
    .text(range(item), PAGE.margin, startY + 3, { width: dateWidth });

  doc
    .font("Helvetica-Bold")
    .fontSize(11.5)
    .fillColor(COLORS.ink)
    .text(item.title, bodyX, startY, { width: bodyWidth });

  doc
    .font("Helvetica")
    .fontSize(8.8)
    .fillColor(COLORS.muted)
    .text(item.caption, bodyX, doc.y + 2, { width: bodyWidth });

  doc.moveDown(0.35);

  item.description.forEach((text) => {
    const bulletY = doc.y + 4;
    doc
      .circle(bodyX + 2, bulletY, 1.5)
      .fillColor(COLORS.accent)
      .fill();
    doc.font("Helvetica").fontSize(8.8);
    writeLinkedDescription(doc, text, item.descriptionLinks, bodyX + 14, doc.y, {
      width: bodyWidth - 14,
      indent: 0,
      lineGap: 1.3,
    });
    doc.moveDown(0.18);
  });

  const linkedItems = Object.entries(item.links ?? {});
  if (linkedItems.length > 0) {
    doc.moveDown(0.08);
    linkedItems.forEach(([label, url], index) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(COLORS.link)
        .text(label, bodyX + index * 58, doc.y, {
          continued: index < linkedItems.length - 1,
          link: url,
          underline: true,
        });
      if (index < linkedItems.length - 1) {
        doc.fillColor(COLORS.muted).font("Helvetica").text("  ");
      }
    });
  }

  doc.y = Math.max(doc.y + 14, startY + 42);
};

const writeIntro = (doc: PdfDoc) => {
  doc.font("Helvetica-Bold").fontSize(44).fillColor(COLORS.ink).text(PROFILE.name, { lineGap: -6 });

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(COLORS.muted)
    .text(`${PROFILE.title} / ${PROFILE.location}`, { characterSpacing: 0.2 });

  doc.moveDown(1.2);

  PROFILE.summary.forEach((paragraph) => {
    doc.font("Helvetica").fontSize(9.4).fillColor(COLORS.ink).text(paragraph, {
      width: contentWidth,
      lineGap: 2.2,
    });
    doc.moveDown(0.65);
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
  doc.on("pageAdded", () => {
    doc.rect(0, 0, PAGE.width, PAGE.height).fill(COLORS.wash);
    drawHeader(doc);
  });

  doc.rect(0, 0, PAGE.width, PAGE.height).fill(COLORS.wash);
  doc.fillColor(COLORS.ink);
  drawHeader(doc);
  writeIntro(doc);

  CATEGORY_ORDER.forEach((category) => {
    const items = categoryItems(category);
    if (items.length === 0) return;

    writeSectionHeading(doc, CATEGORY_LABELS[category]);
    items.forEach((item) => writeTimelineItem(doc, item));
  });

  const rangeInfo = doc.bufferedPageRange();
  for (
    let pageIndex = rangeInfo.start;
    pageIndex < rangeInfo.start + rangeInfo.count;
    pageIndex += 1
  ) {
    doc.switchToPage(pageIndex);
    drawFooter(doc, pageIndex + 1, rangeInfo.count);
  }

  doc.end();

  return new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
