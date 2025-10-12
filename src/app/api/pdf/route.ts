import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  PDFFont,
  PDFPage,
  Color,
  degrees,
} from "pdf-lib";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Ingen mötes-ID angiven" }, { status: 400 });
  }

  try {
    const meeting = await prisma.meeting.findUnique({ where: { id } });
    if (!meeting) {
      return NextResponse.json({ error: "Möte ej hittat" }, { status: 404 });
    }

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { height, width } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const titleColor = rgb(0.1, 0.2, 0.6);
    const textColor = rgb(0, 0, 0);
    const lineColor = rgb(0.85, 0.85, 0.85);

    let y = height - 70;
    const marginX = 60;
    let pageCount = 1;

    // --- Watermark ---
    const drawWatermark = (p: PDFPage) => {
      p.drawText("Moteva Confidential", {
        x: width / 4,
        y: height / 2,
        size: 40,
        font: fontBold,
        color: rgb(0.9, 0.9, 0.9),
        opacity: 0.2,
        rotate: degrees(45),
      });
    };

    // --- Draw header ---
    const drawHeader = () => {
      page.drawText("Moteva", { x: marginX, y, size: 18, font: fontBold, color: titleColor });
      y -= 30;
      drawLine(page, marginX, width, y, lineColor);
      y -= 30;
    };

    // --- Helper: auto new page ---
    const ensureSpace = (needed = 60) => {
      if (y < needed) {
        page = addNewPage(pdfDoc, width, height, marginX, fontBold, titleColor, ++pageCount);
        drawWatermark(page);
        y = height - 100;
      }
    };

    // --- Helper: write paragraph with line breaks ---
    const writeParagraph = (text: string, size = 12, gap = 16) => {
      const paragraphs = text.split(/\n+/).filter((p) => p.trim() !== "");
      for (const para of paragraphs) {
        const lines = wrapText(para, 90);
        for (const line of lines) {
          ensureSpace(80);
          page.drawText(line, { x: marginX, y, size, font, color: textColor });
          y -= gap;
        }
        y -= 10; // extra gap between paragraphs
      }
    };

    // --- Helper: add section ---
    const addSection = (title: string, content?: string | null) => {
      if (!content) return;
      ensureSpace(120);
      page.drawText(title, { x: marginX, y, size: 14, font: fontBold, color: titleColor });
      y -= 20;
      writeParagraph(content);
      drawLine(page, marginX, width, y, lineColor);
      y -= 20;
    };

    // --- Start writing ---
    drawHeader();
    addSection(`Protokoll för ${meeting.title ?? "möte"}`, "");
    const meetingDate = meeting.date
      ? new Date(meeting.date).toLocaleDateString("sv-SE")
      : "Ej angivet";
    page.drawText(`Datum: ${meetingDate}`, { x: marginX, y, size: 12, font, color: textColor });
    y -= 30;

    addSection("Dagordning", meeting.agenda);
    addSection("Anteckningar", meeting.notes);
    addSection("Protokoll", meeting.protocol);

    // --- Footer ---
    const createdDate = new Date(meeting.createdAt).toLocaleString("sv-SE");
    drawFooter(page, pageCount, createdDate, font, width, marginX);
    drawWatermark(page);

    const pdfBytes = await pdfDoc.save();
    const body = Buffer.from(pdfBytes);
    const filename = encodeURIComponent(`${meeting.title ?? "meeting"}.pdf`);

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Fel vid PDF-export:", err);
    return NextResponse.json({ error: "Fel vid PDF-generering" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

/* ---------- Helpers ---------- */

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + word).length > maxChars) {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line += word + " ";
    }
  }
  if (line.trim().length > 0) lines.push(line.trim());
  return lines;
}

function drawLine(page: PDFPage, marginX: number, width: number, y: number, color: Color) {
  page.drawLine({
    start: { x: marginX, y },
    end: { x: width - marginX, y },
    thickness: 0.5,
    color,
  });
}

function addNewPage(
  pdfDoc: PDFDocument,
  width: number,
  height: number,
  marginX: number,
  fontBold: PDFFont,
  titleColor: Color,
  pageNum: number
): PDFPage {
  const newPage = pdfDoc.addPage();
  newPage.drawText("Moteva", { x: marginX, y: height - 60, size: 14, font: fontBold, color: titleColor });
  newPage.drawLine({
    start: { x: marginX, y: height - 70 },
    end: { x: width - marginX, y: height - 70 },
    thickness: 0.5,
    color: titleColor,
  });
  drawFooter(newPage, pageNum, "", fontBold, width, marginX);
  return newPage;
}

function drawFooter(
  page: PDFPage,
  pageNum: number,
  createdDate: string,
  font: PDFFont,
  width: number,
  marginX: number
) {
  if (createdDate) {
    page.drawText(`Skapad: ${createdDate}`, {
      x: marginX,
      y: 40,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
  }
  page.drawText(`Sida ${pageNum}`, {
    x: width - marginX - 50,
    y: 40,
    size: 10,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });
}
