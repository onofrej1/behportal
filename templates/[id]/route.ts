import { prisma } from "@/db/prisma";
import { resources } from "@/resources";
import { arrayToObj, setRelations } from "@/utils/server";
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
    include: arrayToObj(include),
  });

  return NextResponse.json({ status: "success", data });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const data = await req.json();

  const resource = resources.find((r) => r.model === "[MODEL]");

  setRelations(data, resource!.form, true);
  
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
