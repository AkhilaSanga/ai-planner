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

      if (!response.ok) throw new Error(`Export failed: ${response.statusText}`);
      const blob = await response.blob();
      if (blob.size === 0) throw new Error("Empty file received");

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

      if (!response.ok) throw new Error(`Export failed: ${response.statusText}`);
      const htmlBlob = await response.blob();
      if (htmlBlob.size === 0) throw new Error("Empty HTML received");

      const reader = new FileReader();
      reader.onload = (e) => {
        const htmlContent = e.target?.result as string;
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);

        const doc = iframe.contentDocument;
        if (doc) {
          doc.open();
          doc.write(htmlContent);
          doc.close();

          setTimeout(() => {
            iframe.contentWindow?.print();
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
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={handleExportDocx}
        disabled={isExporting}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 text-base"
      >
        {isExporting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Exporting...
          </>
        ) : (
          "📄 Export DOCX"
        )}
      </button>
      <button
        onClick={handleExportPdf}
        disabled={isExporting}
        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 text-base"
      >
        {isExporting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Exporting...
          </>
        ) : (
          "📕 Export PDF"
        )}
      </button>
    </div>
  );
}
