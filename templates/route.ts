import { prisma } from "@/db/prisma";
import { resources } from "@/resources";
import { getWhere, setRelations } from "@/utils/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const { take, skip, sortBy, sortDir, ...where } = Object.fromEntries(
    searchParams.entries()
  );

  const data = await prisma.[MODEL].findMany({
    take: Number(take),
    skip: Number(skip),
    orderBy: [{ [sortBy]: sortDir }],
    where: getWhere(where)
  });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const data = await req.json();

  const resource = resources.find((r) => r.model === "[MODEL]");
  setRelations(data, resource!.form);

  await prisma.[MODEL].create({ data });

  return NextResponse.json({ status: "success" });
}
