import { useState } from "react";

export function useClipboard(delay: number = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), delay);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return { isCopied, copy };
}
