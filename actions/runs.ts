"use server";

import { prisma } from "@/db/prisma";
import { Registration, Run } from "@prisma/client";

export async function getRuns() {
  return prisma.run.findMany({
    include: {
      event: true,
      _count: {
        select: {
            registrations: true,
            runResults: true,
        }
      }
    },    
  });
}

export async function getRunById(id: number) {
  return prisma.run.findFirstOrThrow({
    where: {
      id,
    },
  });
}

export async function createRegistration(data: Registration) {
  const registration = prisma.registration.create({
    data,
  });
  return registration;
}

export async function createRun(data: Run) {    
  const run = await prisma.run.create({
    data,
  });
  return run;
}

export async function updateRun(data: Run) {  
  const run = await prisma.run.update({
    where: {
      id: data.id,
    },
    data,
  });
  return run;
}
