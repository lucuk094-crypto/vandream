import { NextRequest, NextResponse } from "next/server";
import { toApiError } from "@/lib/api-helpers";
import { getAllDrama } from "@/lib/nunomix/queries";
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
    const result = await getAllDrama(page);
    return NextResponse.json(result);
  } catch (err) {
    return toApiError(err);
  }
}
