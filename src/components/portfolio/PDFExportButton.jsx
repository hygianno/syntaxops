"use client";

import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import Button from "@/components/ui/Button";
import ProjectReportDoc from "@/components/pdf/ProjectReportDoc";

export default function PDFExportButton({ submission, credentialId }) {
  const [isCompiling, setIsCompiling] = useState(false);

  const handleDownload = async () => {
    setIsCompiling(true);
    try {
      const doc = <ProjectReportDoc submission={submission} />;
      const asPdf = pdf();
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();

      // Trigger client-side vector download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `SyntaxOps_PoW_${credentialId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF client compilation error:", err);
      alert("PDF compilation failed: " + err.message);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <Button
      variant="primary"
      size="md"
      isLoading={isCompiling}
      onClick={handleDownload}
      className="shadow-sm"
    >
      <Download className="w-4 h-4 mr-2" />
      <span>{isCompiling ? "Compiling Vector PDF..." : "Download Verified Dossier"}</span>
    </Button>
  );
}
