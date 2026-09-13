import { NextRequest, NextResponse } from "next/server";
import { toApiError } from "@/lib/api-helpers";
import { searchDrama } from "@/lib/nunomix/queries";
import { parseKeyword, parsePage } from "@/lib/validate";

export async function GET(req: NextRequest) {
  try {
    const keyword = parseKeyword(
      req.nextUrl.searchParams.get("q") ?? req.nextUrl.searchParams.get("keyword"),
    );
    if (keyword === null) {
      return NextResponse.json(
        { error: "Provide a search keyword (q)." },
        { status: 400 },
      );
    }
    const page = parsePage(req.nextUrl.searchParams.get("page"));
    if (page === null) {
      return NextResponse.json(
        { error: "Invalid page parameter." },
        { status: 400 },
      );
    }
    const result = await searchDrama(keyword, page);
    return NextResponse.json(result);
  } catch (err) {
    return toApiError(err);
  }
}
