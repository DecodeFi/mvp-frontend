import { useState } from "react";
import TurndownService from "turndown";

import { Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text?: string;
  html?: string;
  htmlRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}

export function CopyButton({
  text,
  html,
  htmlRef,
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      if (!text && !html && !htmlRef?.current) {
        console.error("No text to copy");
        return;
      }

      const htmlContent = html || htmlRef?.current?.innerHTML || "";
      let textContent = text ?? "";

      await navigator.clipboard.writeText(textContent);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <Button
      variant="outline"
      style={{
        backgroundColor: "white",
        width: "20px",
        display: "flex",
        justifyContent: "center",
      }}
      className={className}
      onClick={copyToClipboard}
    >
      {copied ? <Check /> : <Copy className=" h-4 w-4" />}
    </Button>
  );
}
