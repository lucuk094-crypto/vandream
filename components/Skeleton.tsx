/**
 * Dark shimmer skeletons (premium, low-noise).
 */

export function SkeletonCardCell() {
  return (
    <div className="animate-fade" aria-hidden="true">
      <div className="skeleton skeleton-shimmer aspect-[2/3] w-full rounded-xl" />
      <div className="skeleton skeleton-shimmer mt-3 h-3.5 w-4/5 rounded" />
      <div className="skeleton skeleton-shimmer mt-2 h-3 w-3/5 rounded" />
    </div>
  );
}

export function SkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
      role="status"
      aria-label="Memuat"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCardCell key={i} />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div
      className="relative flex min-h-[76dvh] items-end overflow-hidden"
      aria-hidden="true"
    >
      <div className="skeleton skeleton-shimmer absolute inset-0 rounded-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
      <div className="container-vd relative z-10 py-16">
        <div className="flex items-center gap-2">
          <div className="skeleton skeleton-shimmer h-6 w-32 rounded-full" />
          <div className="skeleton skeleton-shimmer h-6 w-20 rounded-full" />
        </div>
        <div className="skeleton skeleton-shimmer mt-5 h-8 w-56 rounded" />
        <div className="skeleton skeleton-shimmer mt-4 h-14 w-full max-w-xl rounded" />
        <div className="skeleton skeleton-shimmer mt-2 h-14 w-3/4 max-w-lg rounded" />
        <div className="mt-7 flex gap-3">
          <div className="skeleton skeleton-shimmer h-12 w-48 rounded-full" />
          <div className="skeleton skeleton-shimmer h-12 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonEpisodes() {
  return (
    <div
      className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8"
      aria-hidden="true"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="skeleton skeleton-shimmer aspect-square rounded-xl" />
      ))}
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="container-vd pt-6 sm:pt-8" aria-hidden="true">
      <div className="skeleton skeleton-shimmer h-7 w-28 rounded-full" />
      <div className="mt-6 grid gap-8 md:grid-cols-[280px_1fr]">
        <div className="skeleton skeleton-shimmer mx-auto aspect-[2/3] w-full max-w-[280px] rounded-2xl md:mx-0" />
        <div>
          <div className="flex gap-2">
            <div className="skeleton skeleton-shimmer h-6 w-20 rounded-full" />
            <div className="skeleton skeleton-shimmer h-6 w-16 rounded-full" />
            <div className="skeleton skeleton-shimmer h-6 w-16 rounded-full" />
          </div>
          <div className="skeleton skeleton-shimmer mt-4 h-12 w-4/5 rounded" />
          <div className="skeleton skeleton-shimmer mt-6 h-4 w-full rounded" />
          <div className="skeleton skeleton-shimmer mt-2 h-4 w-11/12 rounded" />
          <div className="skeleton skeleton-shimmer mt-2 h-4 w-2/3 rounded" />
          <div className="mt-8 flex gap-3">
            <div className="skeleton skeleton-shimmer h-12 w-44 rounded-full" />
            <div className="skeleton skeleton-shimmer h-12 w-36 rounded-full" />
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div className="skeleton skeleton-shimmer h-8 w-40 rounded" />
        <div className="mt-5">
          <SkeletonEpisodes />
        </div>
      </div>
    </div>
  );
}
