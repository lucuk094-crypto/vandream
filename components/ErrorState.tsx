import type { ReactNode } from "react";
import { IconRefresh, IconX } from "./Icons";

interface ErrorStateProps {
  title?: string;
  hint?: string;
  onRetry?: () => void;
  /** Prebuilt action node (e.g. a router.refresh button). */
  action?: ReactNode;
  compact?: boolean;
}

/**
 * Friendly error panel — raw API details never reach the UI.
 */
export function ErrorState({
  title = "Terjadi kesalahan",
  hint,
  onRetry,
  action,
  compact = false,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`glass animate-fade flex flex-col items-center px-6 text-center shadow-soft ${
        compact ? "py-8" : "py-14"
      }`}
    >
      <span
        aria-hidden="true"
        className="grid h-12 w-12 place-items-center rounded-2xl border border-rose/40 bg-rose/10 text-rose"
      >
        <IconX size={22} />
      </span>
      <h3 className={`mt-4 font-display text-ivory ${compact ? "text-lg" : "text-xl sm:text-2xl"}`}>
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-mist">
        {hint ??
          "Kami tidak dapat memuat data ini saat ini. Periksa koneksi internet Anda, lalu coba lagi."}
      </p>
      <div className="mt-6 flex items-center gap-3">
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn-gold px-6 py-2.5">
            <IconRefresh size={15} />
            Coba Lagi
          </button>
        )}
        {action}
      </div>
    </div>
  );
}
