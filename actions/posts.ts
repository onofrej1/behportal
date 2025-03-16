"use server";

import { prisma } from "@/db/prisma";
import { PostStatus } from "@prisma/client";

export async function toggleEnableComments(
  id: number,
  enableComments: boolean
) {
  return prisma.post.update({
    where: {
      id,
    },
    data: {
      enableComments,
    },
  });
}

export async function updateStatus(
  id: number,
  status: PostStatus
) {
  return prisma.post.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
}
