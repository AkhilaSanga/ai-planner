"use client";

import { useState } from "react";

type Report = {
  problemBreakdown: string;
  stakeholders: string;
  solution: string;
  actionPlan: string;
};

type Props = {
  report: Report;
  problemStatement: string;
  reportRef: React.RefObject<HTMLDivElement>;
};

export default function ReportExport({ report, problemStatement, reportRef }: Props) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportDocx = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/export/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report,
          problemStatement,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("Empty file received");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `strategic-report-${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert("✅ DOCX exported successfully!");
    } catch (error) {
      console.error("DOCX Export error:", error);
      alert(`❌ Failed to export DOCX: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportData: {
            report,
            problemStatement,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const htmlBlob = await response.blob();

      if (htmlBlob.size === 0) {
        throw new Error("Empty HTML received");
      }

      // Convert HTML to PDF using browser's print to PDF
      const reader = new FileReader();
      reader.onload = (e) => {
        const htmlContent = e.target?.result as string;

        // Create an iframe to print
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);

        const doc = iframe.contentDocument;
        if (doc) {
          doc.open();
          doc.write(htmlContent);
          doc.close();

          // Wait a moment for content to load, then print
          setTimeout(() => {
            iframe.contentWindow?.print();

            // Clean up after a delay
            setTimeout(() => {
              document.body.removeChild(iframe);
              setIsExporting(false);
            }, 1000);
          }, 500);
        }
      };

      reader.readAsText(htmlBlob);

      alert("✅ PDF print dialog opened! Select 'Save as PDF' to download.");
    } catch (error) {
      console.error("PDF Export error:", error);
      alert(`❌ Failed to export PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportDocx}
        disabled={isExporting}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
      >
        {isExporting ? "Exporting..." : "📄 Export DOCX"}
      </button>
      <button
        onClick={handleExportPdf}
        disabled={isExporting}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
      >
        {isExporting ? "Exporting..." : "📕 Export PDF"}
      </button>
    </div>
  );
}
