import Link from "next/link";
import type { ReactNode } from "react";
import { IconChevronRight } from "./Icons";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  action?: { href: string; label: string };
  children?: ReactNode;
}

/**
 * Refined section header: gold eyebrow + serif title + optional link.
 */
export function SectionHeader({
  eyebrow,
  title,
  action,
  children,
}: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-1 font-display text-2xl tracking-tight text-ivory sm:text-3xl">
          {title}
          {children && (
            <span className="ml-2 align-middle text-sm font-sans font-medium text-faint">
              {children}
            </span>
          )}
        </h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="group hidden shrink-0 items-center gap-1 text-sm font-semibold text-mist transition-colors hover:text-gold-2 sm:inline-flex"
        >
          {action.label}
          <IconChevronRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
