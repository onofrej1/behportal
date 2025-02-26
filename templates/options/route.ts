import { prisma } from "@/db/prisma";
import { arrayToObj } from "@/utils/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const { select } = Object.fromEntries(
    searchParams.entries()
  );

  const data = await prisma.[MODEL].findMany({
    select: arrayToObj(select),
  });

  return NextResponse.json(data);
}