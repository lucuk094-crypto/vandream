import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EpisodeList } from "@/components/EpisodeList";
import { ErrorState } from "@/components/ErrorState";
import { ExpandableText } from "@/components/ExpandableText";
import { FavoriteButton } from "@/components/FavoriteButton";
import { IconChevronLeft, IconPlay, IconStar } from "@/components/Icons";
import { PosterImage } from "@/components/PosterImage";
import { RetryButton } from "@/components/RetryButton";
import { SectionHeader } from "@/components/SectionHeader";
import { getDramaDetail, getEpisodes } from "@/lib/nunomix/queries";
import { parseVodId } from "@/lib/validate";

export async function generateMetadata({
  params,
}: PageProps<"/drama/[vod_id]">): Promise<Metadata> {
  const { vod_id } = await params;
  if (!parseVodId(vod_id)) return { title: "Drama" };
  try {
    const d = await getDramaDetail(vod_id);
    return {
      title: d.title,
      description: d.description
        ? d.description.slice(0, 160)
        : `Tonton ${d.title} di Van Dream.`,
      openGraph: {
        title: d.title,
        description: d.description?.slice(0, 160),
        images: d.poster ? [{ url: d.poster, width: 600, height: 900 }] : undefined,
      },
    };
  } catch {
    return { title: "Drama" };
  }
}

export default async function DramaDetailPage({
  params,
}: PageProps<"/drama/[vod_id]">) {
  const { vod_id } = await params;
  const vodId = parseVodId(vod_id);
  if (!vodId) notFound();

  const [detailSettled, episodesSettled] = await Promise.allSettled([
    getDramaDetail(vodId),
    getEpisodes(vodId),
  ]);

  if (detailSettled.status === "rejected") {
    console.error("[vandream:page] detail failed for", vodId, detailSettled.reason);
    return (
      <div className="container-vd pt-10">
        <ErrorState
          hint="Drama ini belum bisa dimuat dari layanan kami."
          action={<RetryButton />}
        />
      </div>
    );
  }

  const drama = detailSettled.value;
  // Fallback: detail payload embeds the episode list (vod_collection).
  const episodes =
    episodesSettled.status === "fulfilled"
      ? episodesSettled.value
      : drama.embeddedEpisodes;

  const meta = [drama.type, drama.year].filter(Boolean).join(" · ");
  const firstEp = episodes.length > 0 ? episodes[0].number : 1;

  const chips: { label: string; gold?: boolean }[] = [];
  if (drama.type) chips.push({ label: drama.type });
  if (drama.year) chips.push({ label: drama.year });
  if (drama.totalEpisodes)
    chips.push({ label: `${drama.totalEpisodes} Episode`, gold: true });
  if (drama.remarks) chips.push({ label: drama.remarks });

  return (
    <div className="container-vd pt-6 sm:pt-8">
      <Link
        href="/drama"
        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.04] px-4 py-2 text-xs font-bold tracking-widest text-mist uppercase transition-colors hover:border-gold/40 hover:text-gold-2"
      >
        <IconChevronLeft size={13} />
        Semua Drama
      </Link>

      <div className="mt-7 grid gap-8 md:grid-cols-[280px_1fr] md:gap-10">
        {/* Poster */}
        <div className="mx-auto w-full max-w-[280px] md:mx-0">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-3xl bg-gold/10 blur-2xl"
            />
            <div className="poster-frame relative shadow-lift">
              <PosterImage
                src={drama.poster}
                alt={`Poster — ${drama.title}`}
                seed={drama.vodId}
                priority
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent"
              />
              {drama.score && (
                <span className="chip chip-gold absolute right-2.5 bottom-2.5">
                  <IconStar size={11} />
                  {drama.score}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {drama.isNew && (
              <span className="chip chip-gold">
                <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-2" />
                Baru
              </span>
            )}
            {chips.map((c) => (
              <span key={c.label} className={`chip ${c.gold ? "chip-gold" : "text-mist"}`}>
                {c.label}
              </span>
            ))}
          </div>

          <h1 className="mt-4 font-display text-3xl leading-tight tracking-tight text-ivory sm:text-4xl lg:text-[2.75rem]">
            {drama.title}
          </h1>

          {drama.genres.length > 0 && (
            <p className="mt-2.5 text-sm font-medium text-gold-2/90">
              {drama.genres.join(" · ")}
            </p>
          )}

          {drama.description ? (
            <ExpandableText text={drama.description} className="mt-5" />
          ) : (
            <p className="mt-5 text-sm font-medium text-faint">
              Belum ada sinopsis untuk drama ini.
            </p>
          )}

          {(drama.cast.length > 0 || drama.director.length > 0) && (
            <dl className="mt-6 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
              {drama.cast.length > 0 && (
                <div>
                  <dt className="text-[11px] font-bold tracking-[0.2em] text-faint uppercase">
                    Pemeran
                  </dt>
                  <dd className="mt-1.5 leading-relaxed text-mist">
                    {drama.cast.join(", ")}
                  </dd>
                </div>
              )}
              {drama.director.length > 0 && (
                <div>
                  <dt className="text-[11px] font-bold tracking-[0.2em] text-faint uppercase">
                    Sutradara
                  </dt>
                  <dd className="mt-1.5 leading-relaxed text-mist">
                    {drama.director.join(", ")}
                  </dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`/watch/${drama.vodId}/${firstEp}`}
              className="btn-gold px-8 py-3.5 text-[15px]"
            >
              <IconPlay size={16} />
              Tonton EP {String(firstEp).padStart(2, "0")}
            </Link>
            <FavoriteButton
              vodId={drama.vodId}
              title={drama.title}
              poster={drama.poster}
              meta={meta || null}
              size="lg"
            />
          </div>
        </div>
      </div>

      <section className="mt-12 sm:mt-14">
        <SectionHeader
          eyebrow={episodes.length > 0 ? `${episodes.length} episode` : undefined}
          title="Episode"
        />
        {episodesSettled.status === "fulfilled" ? (
          <EpisodeList vodId={vodId} episodes={episodes} />
        ) : (
          <ErrorState
            compact
            title="Daftar episode tidak tersedia"
            action={<RetryButton />}
          />
        )}
      </section>
    </div>
  );
}
