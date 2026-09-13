import { NextRequest, NextResponse } from "next/server";
import { toApiError } from "@/lib/api-helpers";
import { getEpisodes } from "@/lib/nunomix/queries";
import { parseVodId } from "@/lib/validate";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ vodId: string }> },
) {
  try {
    const { vodId: rawVodId } = await params;
    const vodId = parseVodId(rawVodId);
    if (!vodId) {
      return NextResponse.json({ error: "Invalid drama id." }, { status: 400 });
    }
    const episodes = await getEpisodes(vodId);
    return NextResponse.json({ vodId, episodes });
  } catch (err) {
    return toApiError(err);
  }
}
