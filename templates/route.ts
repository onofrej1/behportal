import { prisma } from "@/db/prisma";
import { resources } from "@/resources";
import { arrayToObj, getWhere, getOrderBy, setRelations } from "@/utils/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const { take, skip, sort, include, filters } = Object.fromEntries(
    searchParams.entries()
  );  

  const orderBy = getOrderBy(sort);
  const where = getWhere(filters);

  const data = await prisma.[MODEL].findMany({
    take: Number(take),
    skip: Number(skip),
    orderBy,
    where,
    include: arrayToObj(include),
  });

  const count = await prisma.[MODEL].count({
    where,
  });
  const numPages = Math.ceil(count / Number(take));

  return NextResponse.json({ data, count, numPages });
}

export async function POST(req: Request) {
  const data = await req.json();

  const resource = resources.find((r) => r.model === "[MODEL]");
  setRelations(data, resource!.form);

  await prisma.[MODEL].create({ data });

  return NextResponse.json({ status: "success" });
}
