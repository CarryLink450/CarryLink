import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "docs", "CarryLink-End-User-Manual.md");
const outputPath = path.join(root, "docs", "CarryLink-End-User-Manual.pdf");

const markdown = fs.readFileSync(sourcePath, "utf8");
const lines = markdown.replace(/\r\n/g, "\n").split("\n");

const pageWidth = 612;
const pageHeight = 792;
const margin = 54;
const contentWidth = pageWidth - margin * 2;
const bottom = 54;

function escapePdfText(value) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function textWidth(value, fontSize) {
  return value.length * fontSize * 0.48;
}

function wrapText(value, fontSize) {
  const words = value.split(/\s+/).filter(Boolean);
  const wrapped = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (textWidth(next, fontSize) <= contentWidth) {
      current = next;
    } else {
      if (current) wrapped.push(current);
      current = word;
    }
  }

  if (current) wrapped.push(current);
  return wrapped.length ? wrapped : [""];
}

const pages = [];
let currentPage = [];
let y = pageHeight - margin;

function newPage() {
  if (currentPage.length) pages.push(currentPage);
  currentPage = [];
  y = pageHeight - margin;
}

function ensureSpace(height) {
  if (y - height < bottom) newPage();
}

function addText(value, options = {}) {
  const fontSize = options.fontSize ?? 10;
  const lineHeight = options.lineHeight ?? fontSize * 1.45;
  const gapBefore = options.gapBefore ?? 0;
  const gapAfter = options.gapAfter ?? 0;
  const font = options.font ?? "F1";
  const indent = options.indent ?? 0;

  if (!value.trim()) {
    y -= lineHeight * 0.55;
    return;
  }

  const wrapped = wrapText(value, fontSize);
  ensureSpace(gapBefore + wrapped.length * lineHeight + gapAfter);
  y -= gapBefore;

  for (const line of wrapped) {
    currentPage.push({ text: line, x: margin + indent, y, fontSize, font });
    y -= lineHeight;
  }

  y -= gapAfter;
}

for (const rawLine of lines) {
  const line = rawLine.trim();

  if (line.startsWith("# ")) {
    addText(line.slice(2), { fontSize: 24, lineHeight: 32, font: "F2", gapAfter: 12 });
  } else if (line.startsWith("## ")) {
    addText(line.slice(3), { fontSize: 16, lineHeight: 23, font: "F2", gapBefore: 10, gapAfter: 4 });
  } else if (line.startsWith("### ")) {
    addText(line.slice(4), { fontSize: 12, lineHeight: 18, font: "F2", gapBefore: 6, gapAfter: 2 });
  } else if (line.startsWith("- ")) {
    addText(`- ${line.slice(2)}`, { fontSize: 10, lineHeight: 15, indent: 12 });
  } else if (/^\d+\.\s/.test(line)) {
    addText(line, { fontSize: 10, lineHeight: 15, indent: 12 });
  } else {
    addText(line, { fontSize: 10, lineHeight: 15 });
  }
}

newPage();

const objects = [];

function addObject(value) {
  objects.push(value);
  return objects.length;
}

const fontRegular = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
const fontBold = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
const pageObjectIds = [];

for (const page of pages) {
  const content = page
    .map((item) => `BT /${item.font} ${item.fontSize} Tf ${item.x.toFixed(2)} ${item.y.toFixed(2)} Td (${escapePdfText(item.text)}) Tj ET`)
    .join("\n");
  const contentId = addObject(`<< /Length ${Buffer.byteLength(content, "utf8")} >>\nstream\n${content}\nendstream`);
  const pageId = addObject("");
  pageObjectIds.push({ pageId, contentId });
}

const pagesId = objects.length + 1;
const catalogId = objects.length + 2;

for (const { pageId, contentId } of pageObjectIds) {
  objects[pageId - 1] = `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> /Contents ${contentId} 0 R >>`;
}

addObject(`<< /Type /Pages /Kids [${pageObjectIds.map((item) => `${item.pageId} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>`);
addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

let pdf = "%PDF-1.4\n";
const offsets = [0];

objects.forEach((object, index) => {
  offsets.push(Buffer.byteLength(pdf, "utf8"));
  pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
});

const xrefOffset = Buffer.byteLength(pdf, "utf8");
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += "0000000000 65535 f \n";
for (let index = 1; index < offsets.length; index += 1) {
  pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

fs.writeFileSync(outputPath, pdf);
console.log(outputPath);
