import { SkeletonGrid } from "./Skeleton";

/** Shown on the server / while the client bundle loads. */
export function FavoritesFallback() {
  return (
    <div className="container-vd pt-8 sm:pt-10" aria-busy="true">
      <header className="mb-8">
        <p className="eyebrow">Koleksimu</p>
        <div className="skeleton skeleton-shimmer mt-3 h-10 w-52 rounded" />
        <div className="skeleton skeleton-shimmer mt-3 h-4 w-72 max-w-full rounded" />
      </header>
      <SkeletonGrid count={6} />
    </div>
  );
}
