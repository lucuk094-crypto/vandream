import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReelsPlayer } from "@/components/ReelsPlayer";
import {
  getDramaDetail,
  getEpisodes,
  getStream,
} from "@/lib/nunomix/queries";
import { parseEpisode, parseVodId } from "@/lib/validate";

export async function generateMetadata({
  params,
}: PageProps<"/watch/[vod_id]/[episode]">): Promise<Metadata> {
  const { vod_id, episode } = await params;
  const ep = parseEpisode(episode);
  const vodId = parseVodId(vod_id);
  if (!vodId || ep === null) return { title: "Tonton" };
  try {
    const d = await getDramaDetail(vodId);
    const title = `${d.title} — EP ${ep} (Reels)`;
    return {
      title,
      description: `Tonton ${d.title} episode ${ep} dalam mode reels di Van Dream.`,
      openGraph: {
        title,
        images: d.poster ? [{ url: d.poster, width: 600, height: 900 }] : undefined,
      },
    };
  } catch {
    return { title: `Tonton EP ${ep}` };
  }
}

/**
 * REELS WATCH — chrome-free, TikTok/Melolo/ReelShort style.
 * One episode per screen; swipe up for the next.
 */
export default async function WatchPage({
  params,
}: PageProps<"/watch/[vod_id]/[episode]">) {
  const { vod_id, episode } = await params;
  const vodId = parseVodId(vod_id);
  const ep = parseEpisode(episode);
  if (!vodId || ep === null) notFound();

  const [detailSettled, episodesSettled, streamSettled] =
    await Promise.allSettled([
      getDramaDetail(vodId),
      getEpisodes(vodId),
      getStream(vodId, ep),
    ]);

  if (streamSettled.status === "rejected") {
    console.error(
      "[vandream:page] initial stream failed",
      vodId,
      "ep",
      ep,
      streamSettled.reason,
    );
  }

  const drama = detailSettled.status === "fulfilled" ? detailSettled.value : null;
  // Fallback: the detail payload embeds the episode list (vod_collection).
  const episodes =
    episodesSettled.status === "fulfilled"
      ? episodesSettled.value
      : drama?.embeddedEpisodes ?? [];
  const initialStream =
    streamSettled.status === "fulfilled" ? streamSettled.value : null;

  return (
    <ReelsPlayer
      drama={drama}
      episodes={episodes}
      initialEpisode={ep}
      initialStream={initialStream}
    />
  );
}
