"use client";

import React, { useState } from "react";
import { Share2, Check, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ShareButtons({ courseTitle, credentialId, shareUrl }) {
  const [copied, setCopied] = useState(false);

  const shareText = `I just deployed and verified my hands-on Proof of Work (PoW) cloud project on Syntax_Ops: "${courseTitle}". Check out my auditable execution dossier:`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy link:", e);
    }
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl || window.location.href
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl || window.location.href)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleCopyLink}
        className="text-xs"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
            <span>Link Copied</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5 mr-1.5" />
            <span>Copy Dossier Link</span>
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleLinkedInShare}
        className="text-xs text-blue-400 border-blue-500/40 hover:border-blue-400"
      >
        <span>Share to LinkedIn</span>
        <ExternalLink className="w-3 h-3 ml-1" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleTwitterShare}
        className="text-xs text-cyan-400 border-cyan-500/40 hover:border-cyan-400"
      >
        <span>Post to X</span>
        <ExternalLink className="w-3 h-3 ml-1" />
      </Button>
    </div>
  );
}
