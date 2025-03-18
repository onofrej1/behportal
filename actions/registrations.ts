"use server";

import { prisma } from "@/db/prisma";
import { Registration } from "@prisma/client";
import { getSession } from "./auth";

export async function getRegistrations() {
  return prisma.registration.findMany({
    include: {
      run: true,
    },
  });
}

export async function getRegistrationByRunId(runId: number) {
  return prisma.registration.findFirst({
    where: {
      id: runId,
    },
  });
}

export async function getRegistrationsByRunId(runId: number) {
  const run = await prisma.run.findFirst({
    where: {
      id: runId,
    },
    select: {
      id: true,
      title: true,
      event: {
        select: {
          startDate: true,
          endDate: true,
        },
      },
    },
  });

  const registrations = await prisma.registration.findMany({
    select: {
      id: true,
      city: true,
      club: true,
      firstName: true,
      lastName: true,
      gender: true,
      email: true,
      nation: true,
      phone: true,
      paid: true,
      presented: true,
      tshirtSize: true,
      runId: true,
    },
    where: {
      runId,
    },
  });
  return { run, registrations };
}

export async function updateRegistration(data: Partial<Registration>) {
  const session = await getSession();
  if (!session) {
    //throw new Error("Unauthorized");
  }
  await prisma.registration.update({
    where: {
      id: data.id,
    },
    data,
  });
}

export async function createRegistration(data: Registration) {
  const session = await getSession();
  if (!session) {
    //throw new Error("Unauthorized");
  }
  await prisma.registration.create({
    data: {
      city: data.city,
      club: data.club,
      dateOfBirth: data.dateOfBirth,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      nation: data.nation,
      runId: data.runId,
      paid: data.paid,
      presented: data.presented
    },
  });
  return ({ status: 'success' });
}
