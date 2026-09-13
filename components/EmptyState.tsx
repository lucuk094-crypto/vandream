import type { ReactNode } from "react";
import { IconSparkle } from "./Icons";

interface EmptyStateProps {
  title: string;
  hint?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

/**
 * Gentle empty state — glass panel, serif title.
 */
export function EmptyState({ title, hint, icon, action }: EmptyStateProps) {
  return (
    <div className="glass animate-fade flex flex-col items-center px-6 py-14 text-center shadow-soft">
      <span
        aria-hidden="true"
        className="grid h-14 w-14 place-items-center rounded-2xl border border-gold/30 bg-gold/10 text-gold-2 shadow-gold"
      >
        {icon ?? <IconSparkle size={24} />}
      </span>
      <h3 className="mt-5 font-display text-xl text-ivory sm:text-2xl">
        {title}
      </h3>
      {hint && <p className="mt-2 max-w-sm text-sm leading-relaxed text-mist">{hint}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
