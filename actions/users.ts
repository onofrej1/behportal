"use server";

import { prisma } from "@/db/prisma";
import { getSession } from "./auth";

export async function getUsers() {
  return prisma.user.findMany();
}

export async function getUser() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const userId = session.userId;
  const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });

  return user;
}
