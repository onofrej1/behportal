"use server";

import { prisma } from "@/db/prisma";
import { CreateRunResult } from "@/validation";
import { RunResult } from "@prisma/client";
import { getSession } from "./auth";

export async function getResults() {
  return prisma.runResult.findMany({
    include: {
      run: true,
      /*_count: {
        select: {
            registrations: true,
            runResults: true,
        }
      }*/
    },
  });
}

export async function getResultsByRunId(runId: number) {
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

  const results = await prisma.runResult.findMany({
    select: {
      id: true,
      bib: true,
      category: true,
      club: true,
      name: true,
      gender: true,
      rank: true,
      yearOfBirth: true,
      time: true,      
    },
    where: {
      runId,
    },    
  });
  return { run, results };
}

export async function createResults(data: RunResult[]) {
  const validateResult = CreateRunResult.parse(data);

  const runResults = prisma.runResult.createMany({
    data: validateResult,
  });

  return runResults;
}

export async function updateRunResult(data: Partial<RunResult>) {
  const session = await getSession();
  if (!session) {
    //throw new Error("Unauthorized");
  }
  await prisma.runResult.update({
    where: {
      id: data.id,
    },
    data,
  });
}
