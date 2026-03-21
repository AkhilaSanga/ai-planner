import { NextResponse } from "next/server";

type Report = {
  problemBreakdown: string;
  stakeholders: string;
  solution: string;
  actionPlan: string;
};

function generateHTML(
  report: Report,
  problemStatement: string,
  timestamp: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background: #ffffff;
          padding: 40px;
        }

        h1 {
          font-size: 36px;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
          padding: 40px;
          text-align: center;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .subtitle {
          text-align: center;
          font-size: 18px;
          color: #666;
          margin-bottom: 40px;
          font-style: italic;
        }

        .timestamp {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-bottom: 60px;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }

        h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1e40af;
          margin: 40px 0 20px 0;
          padding-bottom: 10px;
          border-bottom: 2px solid #1e40af;
          page-break-before: always;
          page-break-after: avoid;
        }

        .section {
          margin-bottom: 30px;
        }

        .section p {
          margin-bottom: 12px;
          line-height: 1.8;
          color: #374151;
        }

        .bullet-item {
          display: flex;
          gap: 12px;
          margin-bottom: 10px;
          align-items: flex-start;
          color: #374151;
        }

        .bullet-item::before {
          content: "•";
          color: #1e40af;
          font-weight: bold;
          flex-shrink: 0;
          font-size: 16px;
          line-height: 1.6;
        }

        .number-item {
          display: flex;
          gap: 12px;
          margin-bottom: 10px;
          align-items: flex-start;
          color: #374151;
        }

        .number-item::before {
          content: counter(item);
          counter-increment: item;
          color: #1e40af;
          font-weight: bold;
          flex-shrink: 0;
          min-width: 24px;
        }

        .heading-item {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin-top: 20px;
          margin-bottom: 10px;
        }

        .footer {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
          page-break-before: avoid;
        }

        @media print {
          body {
            padding: 0;
          }
          h2 {
            page-break-before: always;
            page-break-after: avoid;
          }
        }
      </style>
    </head>
    <body>
      <h1>Strategic Planning Report</h1>
      <div class="subtitle">${problemStatement}</div>
      <div class="timestamp">Generated: ${new Date(timestamp).toLocaleDateString()}</div>

      <h2>📋 Problem Breakdown</h2>
      <div class="section">
        ${report.problemBreakdown
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => {
            const escaped = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            if (escaped.trim().startsWith("•") || escaped.trim().startsWith("-")) {
              return `<div class="bullet-item">${escaped.replace(/^[•-]\s*/, "")}</div>`;
            }
            if (/^\d+\.\s/.test(escaped.trim())) {
              return `<div class="number-item">${escaped.replace(/^\d+\.\s*/, "")}</div>`;
            }
            if (escaped.trim().endsWith(":")) {
              return `<div class="heading-item">${escaped}</div>`;
            }
            return `<p>${escaped}</p>`;
          })
          .join("")}
      </div>

      <h2>👥 Key Stakeholders</h2>
      <div class="section">
        ${report.stakeholders
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => {
            const escaped = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            if (escaped.trim().startsWith("•") || escaped.trim().startsWith("-")) {
              return `<div class="bullet-item">${escaped.replace(/^[•-]\s*/, "")}</div>`;
            }
            if (/^\d+\.\s/.test(escaped.trim())) {
              return `<div class="number-item">${escaped.replace(/^\d+\.\s*/, "")}</div>`;
            }
            if (escaped.trim().endsWith(":")) {
              return `<div class="heading-item">${escaped}</div>`;
            }
            return `<p>${escaped}</p>`;
          })
          .join("")}
      </div>

      <h2>💡 Solution Approach</h2>
      <div class="section">
        ${report.solution
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => {
            const escaped = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            if (escaped.trim().startsWith("•") || escaped.trim().startsWith("-")) {
              return `<div class="bullet-item">${escaped.replace(/^[•-]\s*/, "")}</div>`;
            }
            if (/^\d+\.\s/.test(escaped.trim())) {
              return `<div class="number-item">${escaped.replace(/^\d+\.\s*/, "")}</div>`;
            }
            if (escaped.trim().endsWith(":")) {
              return `<div class="heading-item">${escaped}</div>`;
            }
            return `<p>${escaped}</p>`;
          })
          .join("")}
      </div>

      <h2>🎯 Action Plan</h2>
      <div class="section">
        ${report.actionPlan
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => {
            const escaped = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            if (escaped.trim().startsWith("•") || escaped.trim().startsWith("-")) {
              return `<div class="bullet-item">${escaped.replace(/^[•-]\s*/, "")}</div>`;
            }
            if (/^\d+\.\s/.test(escaped.trim())) {
              return `<div class="number-item">${escaped.replace(/^\d+\.\s*/, "")}</div>`;
            }
            if (escaped.trim().endsWith(":")) {
              return `<div class="heading-item">${escaped}</div>`;
            }
            return `<p>${escaped}</p>`;
          })
          .join("")}
      </div>

      <div class="footer">
        <p>Generated by AI Planning Agent • Strategic planning made simple</p>
      </div>
    </body>
    </html>
  `;
}

export async function POST(req: Request) {
  try {
    const { reportData } = await req.json();
    const { report, problemStatement, timestamp } = reportData;

    const htmlContent = generateHTML(report, problemStatement, timestamp);

    // For server-side PDF generation, we'll use html2pdf or similar
    // Install with: npm install html2pdf.js
    // Or use Vercel's built-in PDF rendering

    // Simple approach: return HTML for client-side conversion
    // In production, use puppeteer or similar for server-side rendering

    const pdf = Buffer.from(htmlContent);

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="strategic-report-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      { error: "Export failed" },
      { status: 500 }
    );
  }
}
