import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");

  const tools = await prisma.marketingTool.findMany({
    where: category ? { category } : undefined,
    orderBy:
      sort === "score"
        ? { usageScore: "desc" }
        : sort === "date"
          ? { dateAdded: "desc" }
          : { usageScore: "desc" },
  });

  return NextResponse.json(tools);
}
