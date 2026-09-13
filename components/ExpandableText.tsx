"use client";

import { useState } from "react";

interface ExpandableTextProps {
  text: string;
  className?: string;
}

/**
 * Line-clamped description with a quiet "Lebihnya / Kurangi" toggle.
 */
export function ExpandableText({ text, className = "" }: ExpandableTextProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <p
        className={`text-sm leading-relaxed text-mist sm:text-[15px] ${
          open ? "" : "line-clamp-4"
        }`}
      >
        {text}
      </p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-2 inline-flex items-center gap-1 text-xs font-bold tracking-widest text-gold uppercase transition-colors hover:text-gold-2"
      >
        {open ? "Tutup" : "Lebihnya"}
      </button>
    </div>
  );
}
