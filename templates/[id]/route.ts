import { prisma } from "@/db/prisma";
import { resources } from "@/resources";
import { getRelations, setRelations } from "@/utils/resources";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  const { searchParams } = req.nextUrl;
  const { include } = Object.fromEntries(searchParams.entries());

  const data = await prisma.[MODEL].findFirst({
    where: { id: Number(id) },
    include: getRelations(include),
  });

  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const data = await req.json();

  const resource = resources.find((r) => r.model === "[MODEL]");

  const model = await prisma.[MODEL].findFirst({
    where: { id: Number(id) },
    include: getRelations(resource!.relations),
  });

  setRelations(data, resource!.form, model as Record<string, any>);
  
  await prisma.[MODEL].update({ data, where: { id: Number(id) } });

  return NextResponse.json({ status: "success" });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  await prisma.[MODEL].delete({ where: { id: Number(id) } });

  return NextResponse.json({ status: "success" });
}
