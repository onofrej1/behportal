import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();

  await prisma.[MODEL].deleteMany({
    where: {
      id: {
        in: data,
      },
    },
  });

  return NextResponse.json({ status: "success" });
}
