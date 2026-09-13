import type { SVGProps } from "react";

/**
 * Hand-rolled icon set — chunky 2.5px strokes, square caps,
 * to match the Neo-Brutalism language. All icons are decorative
 * by default (aria-hidden); give accessible name on the control itself.
 */

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function resolveSize(size?: number): number {
  return size ?? 24;
}

export function IconHome({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3 11 12 3l9 8" />
      <path d="M5 10v10h5v-6h4v6h5V10" />
    </svg>
  );
}

export function IconSearch({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </svg>
  );
}

export function IconFilm({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="4" width="18" height="16" />
      <path d="M3 9h18M3 15h18M9 4v16M15 4v16" />
    </svg>
  );
}

export function IconHeart({
  size,
  filled = false,
  ...props
}: IconProps & { filled?: boolean }) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 20.5 4.8 13a4.6 4.6 0 0 1 0-6.6 4.7 4.7 0 0 1 6.6 0l.6.7.6-.7a4.7 4.7 0 0 1 6.6 0 4.6 4.6 0 0 1 0 6.6L12 20.5Z" />
    </svg>
  );
}

export function IconPlay({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M7 4.5v15l13-7.5-13-7.5Z" />
    </svg>
  );
}

export function IconPause({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="5.5" y="4" width="4.5" height="16" />
      <rect x="14" y="4" width="4.5" height="16" />
    </svg>
  );
}

export function IconChevronLeft({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="m14.5 5-7 7 7 7" />
    </svg>
  );
}

export function IconChevronDown({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="m5 9.5 7 7 7-7" />
    </svg>
  );
}

export function IconChevronRight({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="m9.5 5 7 7-7 7" />
    </svg>
  );
}

export function IconVolume({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" stroke="none" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 6a9 9 0 0 1 0 12" />
    </svg>
  );
}

export function IconVolumeMute({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" stroke="none" />
      <path d="m16 9 6 6M22 9l-6 6" />
    </svg>
  );
}

export function IconMaximize({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
    </svg>
  );
}

export function IconMinimize({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5" />
    </svg>
  );
}

export function IconRefresh({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M20 11a8 8 0 0 0-14.9-3M4 13a8 8 0 0 0 14.9 3" />
      <path d="M20 4v5h-5M4 20v-5h5" />
    </svg>
  );
}

export function IconX({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  );
}

export function IconSparkle({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2c.6 4.8 2.4 7.4 3.6 8.4C16.8 11.4 19 12 22 12c-3 0-5.2.6-6.4 1.6C14.4 14.6 12.6 17.2 12 22c-.6-4.8-2.4-7.4-3.6-8.4C7.2 12.6 5 12 2 12c3 0 5.2-.6 6.4-1.6C9.6 9.4 11.4 6.8 12 2Z" />
    </svg>
  );
}

export function IconClock({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function IconStar({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2l-6.1 3.4 1.4-6.8L2.2 9.1l6.9-.8L12 2Z" />
    </svg>
  );
}

export function IconArrowRight({ size, ...props }: IconProps) {
  return (
    <svg width={resolveSize(size)} height={resolveSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}
