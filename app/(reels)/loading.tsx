export default function ReelsLoading() {
  return (
    <div
      className="grid min-h-dvh place-items-center bg-black"
      role="status"
      aria-label="Memuat pemutar"
    >
      <div className="flex flex-col items-center gap-4">
        <span className="h-12 w-12 animate-spin rounded-full border-[3px] border-gold/25 border-t-gold-2" />
        <span className="text-[11px] font-bold tracking-[0.3em] text-mist uppercase">
          Memuat experience reels
        </span>
      </div>
    </div>
  );
}
