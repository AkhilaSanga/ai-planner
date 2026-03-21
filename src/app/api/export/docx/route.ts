import { Document, Packer, Paragraph, BorderStyle, AlignmentType, TextRun, HeadingLevel } from "docx";

type Report = {
  problemBreakdown: string;
  stakeholders: string;
  solution: string;
  actionPlan: string;
};

function formatText(content: string): Paragraph[] {
  const lines = content.split("\n").filter((line) => line.trim());
  const paragraphs: Paragraph[] = [];

  for (const line of lines) {
    // Bullet points
    if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
      paragraphs.push(
        new Paragraph({
          text: line.replace(/^[•-]\s*/, ""),
          bullet: {
            level: 0,
          },
          spacing: { line: 240, after: 100 },
        })
      );
    }
    // Numbered steps
    else if (/^\d+\.\s/.test(line.trim())) {
      const match = line.match(/^(\d+)\.\s(.+)$/);
      if (match) {
        paragraphs.push(
          new Paragraph({
            text: match[2],
            numPr: {
              ilvl: 0,
              numId: 1,
            },
            spacing: { line: 240, after: 100 },
          })
        );
      }
    }
    // Headings (lines ending with :)
    else if (line.trim().endsWith(":") && line.trim().length > 2) {
      paragraphs.push(
        new Paragraph({
          text: line.replace(/:$/, ""),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
          bold: true,
        })
      );
    }
    // Regular paragraphs
    else if (line.trim()) {
      paragraphs.push(
        new Paragraph({
          text: line,
          spacing: { line: 240, after: 150 },
        })
      );
    }
  }

  return paragraphs;
}

export async function POST(req: Request) {
  try {
    const { report, problemStatement, timestamp } = await req.json();

    const sections = [
      // Title Page
      new Paragraph({
        text: "Strategic Planning Report",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 600, after: 300 },
        bold: true,
      }),
      new Paragraph({
        text: problemStatement,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        italic: true,
      }),
      new Paragraph({
        text: `Generated: ${new Date(timestamp).toLocaleDateString()}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 },
        color: "666666",
      }),

      // Table of Contents
      new Paragraph({
        text: "Table of Contents",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        text: "1. Problem Breakdown",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "2. Key Stakeholders",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "3. Solution Approach",
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: "4. Action Plan",
        spacing: { after: 400 },
      }),

      // Page break
      new Paragraph({
        text: "",
        pageBreakBefore: true,
      }),

      // Problem Breakdown Section
      new Paragraph({
        text: "Problem Breakdown",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
        border: {
          bottom: {
            color: "1E40AF",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
      }),
      ...formatText(report.problemBreakdown),

      // Page break
      new Paragraph({
        text: "",
        pageBreakBefore: true,
      }),

      // Stakeholders Section
      new Paragraph({
        text: "Key Stakeholders",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
        border: {
          bottom: {
            color: "1E40AF",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
      }),
      ...formatText(report.stakeholders),

      // Page break
      new Paragraph({
        text: "",
        pageBreakBefore: true,
      }),

      // Solution Section
      new Paragraph({
        text: "Solution Approach",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
        border: {
          bottom: {
            color: "1E40AF",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
      }),
      ...formatText(report.solution),

      // Page break
      new Paragraph({
        text: "",
        pageBreakBefore: true,
      }),

      // Action Plan Section
      new Paragraph({
        text: "Action Plan",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
        border: {
          bottom: {
            color: "1E40AF",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
      }),
      ...formatText(report.actionPlan),

      // Footer
      new Paragraph({
        text: "",
        spacing: { before: 800 },
      }),
      new Paragraph({
        text: "Generated by AI Planning Agent",
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        color: "666666",
      }),
      new Paragraph({
        text: "Strategic planning made simple",
        alignment: AlignmentType.CENTER,
        color: "999999",
      }),
    ];

    const doc = new Document({
      sections: [
        {
          children: sections,
          properties: {
            page: {
              margins: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="strategic-report-${Date.now()}.docx"`,
      },
    });
  } catch (error) {
    console.error("DOCX export error:", error);
    return new Response(JSON.stringify({ error: "Export failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
