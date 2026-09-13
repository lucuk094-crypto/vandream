import { NextRequest, NextResponse } from "next/server";
import { toApiError } from "@/lib/api-helpers";
import { getStream } from "@/lib/nunomix/queries";
import { parseEpisode, parseVodId } from "@/lib/validate";

export async function GET(req: NextRequest) {
  try {
    const rawVodId = req.nextUrl.searchParams.get("vod_id");
    const rawEpisode = req.nextUrl.searchParams.get("episode");

    const vodId = parseVodId(rawVodId);
    if (!vodId) {
      return NextResponse.json({ error: "Invalid drama id." }, { status: 400 });
    }
    const episode = parseEpisode(rawEpisode);
    if (episode === null) {
      return NextResponse.json(
        { error: "Invalid episode number." },
        { status: 400 },
      );
    }

    const stream = await getStream(vodId, episode);
    // Short cache: stream URLs may be temporary.
    return NextResponse.json({ stream });
  } catch (err) {
    return toApiError(err);
  }
}
