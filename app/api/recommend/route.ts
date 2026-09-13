import { NextRequest, NextResponse } from "next/server";
import { toApiError } from "@/lib/api-helpers";
import { getRecommended } from "@/lib/nunomix/queries";
import { parsePage } from "@/lib/validate";

export async function GET(req: NextRequest) {
  try {
    const page = parsePage(req.nextUrl.searchParams.get("page"));
    if (page === null) {
      return NextResponse.json(
        { error: "Invalid page parameter." },
        { status: 400 },
      );
    }
    const result = await getRecommended(page);
    return NextResponse.json(result);
  } catch (err) {
    return toApiError(err);
  }
}
