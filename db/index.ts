/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaModel } from "@/resources/resources.types";
import { prisma } from "@/db/prisma";

export async function prismaQuery(
  resource: PrismaModel,
  operation: any,
  args: any
) {
  if (args) {
    //@ts-ignore
    return (prisma[resource][operation] as any)(args);
  }
  //@ts-ignore
  return (prisma[resource][operation] as any)();
}
