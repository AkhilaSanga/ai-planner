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
  const [exportType, setExportType] = useState<"docx" | "pdf" | null>(null);

  const handleExportDocx = async () => {
    setIsExporting(true);
    setExportType("docx");
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
      setExportType(null);
    }
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    setExportType("pdf");
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
              setExportType(null);
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
      setExportType(null);
    }
  };

  return (
    <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
      <button
        onClick={handleExportDocx}
        disabled={isExporting}
        className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 text-sm sm:text-base whitespace-nowrap shadow-md hover:shadow-lg transform hover:scale-105 active:scale-100 disabled:hover:scale-100"
      >
        {isExporting && exportType === "docx" ? (
          <>
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="hidden sm:inline">Exporting...</span>
          </>
        ) : (
          "📄 DOCX"
        )}
      </button>
      <button
        onClick={handleExportPdf}
        disabled={isExporting}
        className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 text-sm sm:text-base whitespace-nowrap shadow-md hover:shadow-lg transform hover:scale-105 active:scale-100 disabled:hover:scale-100"
      >
        {isExporting && exportType === "pdf" ? (
          <>
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="hidden sm:inline">Exporting...</span>
          </>
        ) : (
          "📕 PDF"
        )}
      </button>
    </div>
  );
}
