import { NextResponse } from "next/server";

type Report = {
  problemBreakdown: string;
  stakeholders: string;
  solution: string;
  actionPlan: string;
};

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateHTMLForPDF(
  report: Report,
  problemStatement: string,
  timestamp: string
): string {
  return `<!DOCTYPE html>
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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: #ffffff;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }

    .title-page {
      text-align: center;
      padding: 100px 40px;
      background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
      color: white;
      margin-bottom: 60px;
      page-break-after: always;
    }

    .title-page h1 {
      font-size: 42px;
      margin-bottom: 30px;
      font-weight: 700;
    }

    .title-page .problem {
      font-size: 18px;
      margin-bottom: 40px;
      opacity: 0.95;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .title-page .timestamp {
      font-size: 12px;
      opacity: 0.8;
    }

    .toc {
      page-break-after: always;
      margin-bottom: 40px;
    }

    .toc h2 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #1e40af;
    }

    .toc ul {
      list-style: none;
    }

    .toc li {
      margin-bottom: 10px;
      padding-left: 20px;
      font-size: 14px;
    }

    h2 {
      font-size: 28px;
      font-weight: 700;
      color: #1e40af;
      margin: 60px 0 30px 0;
      padding-bottom: 10px;
      border-bottom: 2px solid #1e40af;
      page-break-after: avoid;
    }

    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }

    .section p {
      margin-bottom: 15px;
      line-height: 1.8;
      font-size: 14px;
    }

    .bullet-item {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
      align-items: flex-start;
      font-size: 14px;
    }

    .bullet-item::before {
      content: "•";
      color: #1e40af;
      font-weight: bold;
      flex-shrink: 0;
      font-size: 16px;
      line-height: 1.4;
    }

    .number-item {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
      align-items: flex-start;
      font-size: 14px;
      counter-increment: item;
    }

    .number-item::before {
      content: counter(item) ".";
      color: #1e40af;
      font-weight: bold;
      flex-shrink: 0;
      min-width: 24px;
    }

    .heading-item {
      font-size: 15px;
      font-weight: 600;
      color: #111827;
      margin-top: 20px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }

    .footer {
      margin-top: 80px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
      page-break-before: avoid;
    }

    @page {
      size: A4;
      margin: 0.5in;
    }

    @media print {
      body {
        background: white;
      }
      .section {
        page-break-inside: avoid;
      }
      h2 {
        page-break-after: avoid;
        page-break-before: always;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Title Page -->
    <div class="title-page">
      <h1>Strategic Planning Report</h1>
      <div class="problem">${escapeHtml(problemStatement)}</div>
      <div class="timestamp">Generated: ${new Date(timestamp).toLocaleDateString()}</div>
    </div>

    <!-- Table of Contents -->
    <div class="toc">
      <h2>Table of Contents</h2>
      <ul>
        <li>1. Problem Breakdown</li>
        <li>2. Key Stakeholders</li>
        <li>3. Solution Approach</li>
        <li>4. Action Plan</li>
      </ul>
    </div>

    <!-- Problem Breakdown -->
    <h2>Problem Breakdown</h2>
    <div class="section">
      ${report.problemBreakdown
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const escaped = escapeHtml(line);
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

    <!-- Stakeholders -->
    <h2>Key Stakeholders</h2>
    <div class="section">
      ${report.stakeholders
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const escaped = escapeHtml(line);
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

    <!-- Solution Approach -->
    <h2>Solution Approach</h2>
    <div class="section">
      ${report.solution
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const escaped = escapeHtml(line);
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

    <!-- Action Plan -->
    <h2>Action Plan</h2>
    <div class="section">
      ${report.actionPlan
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const escaped = escapeHtml(line);
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

    <!-- Footer -->
    <div class="footer">
      <p>Generated by AI Planning Agent • Strategic planning made simple</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const { reportData } = await req.json();
    const { report, problemStatement, timestamp } = reportData;

    const htmlContent = generateHTMLForPDF(report, problemStatement, timestamp);

    // Return HTML for client-side PDF conversion with html2pdf.js
    // The client will use html2pdf library to convert this to PDF
    return NextResponse.json({
      html: htmlContent,
      success: true,
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      { error: "Export failed", success: false },
      { status: 500 }
    );
  }
}
