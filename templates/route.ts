import { prisma } from "@/db/prisma";
import { resources } from "@/resources";
import { getRelations, getWhereQuery, getOrderBy, setRelations } from "@/utils/resources";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const { take, skip, sort, include, filters } = Object.fromEntries(
    searchParams.entries()
  );  

  const orderBy = getOrderBy(sort);
  const where = getWhereQuery(filters);

  const data = await prisma.[MODEL].findMany({
    take: Number(take),
    skip: Number(skip),
    orderBy,
    where,
    include: getRelations(include),
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
