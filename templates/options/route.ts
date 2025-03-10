import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.[MODEL].findMany();

  return NextResponse.json(data);
}