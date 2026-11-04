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
        className="text-[13px] gap-1.5"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-[var(--success)]" />
            <span>Link Copied</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>Copy Dossier Link</span>
          </>
        )}
      </Button>

      <Button
        variant="secondary"
        size="sm"
        onClick={handleLinkedInShare}
        className="text-[13px] gap-1.5 text-blue-500 hover:text-blue-600"
      >
        <span>Share to LinkedIn</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-60" />
      </Button>

      <Button
        variant="secondary"
        size="sm"
        onClick={handleTwitterShare}
        className="text-[13px] gap-1.5 text-[var(--text-primary)]"
      >
        <span>Post to X</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-60" />
      </Button>
    </div>
  );
}
