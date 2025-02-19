"use server";

import { prisma } from "@/db/prisma";
import { Event, Venue } from "@prisma/client";
import { getSession } from "./auth";
import { Model, Action } from "@/types";

export async function getEvents() {
  return prisma.event.findMany();
}

export async function getOrganizers() {
  return prisma.organizer.findMany();
}

export async function getVenues() {
  return prisma.venue.findMany({ orderBy: { id: 'desc' }});
}

export async function createVenue(data: Venue) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const venue = await prisma.venue.create({
    data,
  });
  
  return venue;
}

export async function getEvent(id: number) {
  return prisma.event.findFirstOrThrow({
    where: {
      id,
    },
  });
}

export async function createEvent(data: Event) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  data.createdById = session.userId;
  const event = await prisma.event.create({
    data,
  });
  await prisma.activityFeed.create({
    data: {
      actorId: session.userId,
      objectType: Model.event,
      objectId: event.id,
      verb: Action.created,
      time: new Date(),
    }
  });
  return event;
}

export async function updateEvent(data: Event) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const event = await prisma.event.update({
    where: {
      id: data.id,
    },
    data,
  });

  await prisma.activityFeed.create({
    data: {
      actorId: session.userId,
      objectType: Model.event,
      objectId: event.id,
      verb: Action.updated,
      time: new Date(),
    }
  });
  return event;
}
