import { prisma } from "@/db/prisma";
import { faker } from "@faker-js/faker";
import {
  Post,
  Event,
  Run,
  RunCategory,
  Comment,
  User,
  EventSchedule,
  //Attendee,
  Registration,
  RunResult,
  Tag,
  Category,
  Organizer,
  Venue,
  EventType,
  Like,
  MediaCategory,
  MediaType,
  Gallery,
} from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { slugify } from "@/lib/utils";

function random(list: any[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export async function GET(request: Request) {
  const count = Array.from({ length: 5 });
  const categories: Partial<Category>[] = [];
  const tags: Partial<Tag>[] = [];
  const organizers: Partial<Organizer>[] = [];
  const venues: Partial<Venue>[] = [];
  const mediaCategories: Partial<MediaCategory>[] = [];
  const mediaTypes: Partial<MediaType>[] = [];

  const hashedPassword = await bcrypt.hash(
    process.env.TEST_USER_PASSWORD!,
    Number(process.env.BCRYPT_SALT!)
  );

  await prisma.user.create({
    data: {
      email: process.env.EMAIL_USER!,
      firstName: "John",
      lastName: "Doe",
      emailVerified: false,
      role: "USER",
      status: "ACTIVE",
      password: hashedPassword,
      lastLogin: new Date(),
    },
  });

  mediaTypes.push(
    {
      name: "image",
      slug: "image",
    },
    {
      name: "video",
      slug: "video",
    }
  );

  for (const i of Array.from({ length: 100 })) {
    let title = faker.lorem.word();
    categories.push({
      title,
      description: faker.lorem.sentence(),
      slug: slugify(title),
    });

    mediaCategories.push({
      name: faker.lorem.word(),
      details: faker.lorem.sentence(),
    });

    title = faker.lorem.word();
    tags.push({
      title,
      description: faker.lorem.sentence(),
      slug: slugify(title),
    });

    organizers.push({
      name: faker.lorem.word(),
    });

    venues.push({
      location: faker.lorem.word(),
    });
  }

  await prisma.category.createMany({ data: categories as Category[] });
  await prisma.tag.createMany({ data: tags as Tag[] });
  await prisma.organizer.createMany({ data: organizers as Organizer[] });
  await prisma.venue.createMany({ data: venues as Venue[] });
  await prisma.mediaCategory.createMany({
    data: mediaCategories as MediaCategory[],
  });
  await prisma.mediaType.createMany({ data: mediaTypes as MediaType[] });

  const users: Partial<User>[] = [];

  const posts: Partial<Post>[] = [];
  const comments: Partial<Comment>[] = [];
  const likes: Partial<Like>[] = [];

  const events: Partial<Event>[] = [];
  const eventTypes: Partial<EventType>[] = [];
  const eventSchedules: Partial<EventSchedule>[] = [];
  //const attendees: Partial<Attendee>[] = [];
  const galleries: Partial<Gallery>[] = [];

  const runs: Partial<Run>[] = [];
  const registrations: Partial<Registration>[] = [];
  const runResults: Partial<RunResult>[] = [];

  for (const [index] of count.entries()) {
    const i = index + 1;
    users.push({
      email: `user${i}@example.com`, //faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      emailVerified: false,
      role: "USER",
      status: "ACTIVE",
      password: hashedPassword,
      lastLogin: new Date(),
    });
  }

  await prisma.user.createMany({ data: users as User[] });
  const ids = await prisma.user.findMany({ select: { id: true } });
  const userIds = ids.map((i) => i.id);

  eventTypes.push(
    {
      type: "Race",
    },
    {
      type: "Running kemp",
    }
  );

  for (const [index] of count.entries()) {
    const i = index + 1;

    posts.push({
      title: faker.lorem.word(),
      summary: faker.lorem.paragraph(),
      content: faker.lorem.paragraphs({ min: 3, max: 5 }),
      slug: faker.lorem.slug(),
      authorId: random(userIds),
      status: random(["DRAFT", "PUBLISHED"]),
      metaTitle: faker.lorem.word(),
    });

    comments.push({
      comment: faker.lorem.paragraphs({ min: 3, max: 5 }),
      userId: random(userIds),
      postId: i,
      status: "APPROVED",
    });

    likes.push({
      userId: random(userIds),
      postId: i,
    });

    const startDate = new Date();
    const endDate = startDate;

    events.push({
      name: faker.lorem.words({ min: 2, max: 3 }),
      description: faker.lorem.sentences(),
      color: faker.internet.color(),
      location: faker.location.street() + " " + faker.location.city(),
      maxAttendees: faker.number.int({ min: 1, max: 9 }),
      contact: faker.person.fullName(),
      createdById: random(userIds),
      startDate,
      endDate,
      organizerId: i % 2 === 0 ? i : null,
      venueId: i % 2 === 0 ? i : null,
      status: "Created",
      eventTypeId: random([1, 2]),
    });

    const startTime = new Date(startDate);
    startTime.setHours(5);
    const endTime = new Date(startTime);
    endTime.setHours(7);

    eventSchedules.push({
      activity: faker.lorem.words({ min: 2, max: 3 }),
      location: faker.location.streetAddress() + " " + faker.location.city(),
      startTime,
      endTime,
      eventId: i,
    });

    /*attendees.push({
      status: random(["PENDING", "YES", "MAYBE", "NO", "ATTENDED"]),
      eventId: random([1, 2, 3]),
      userId: random(userIds),
    });*/

    runs.push({
      title: faker.lorem.words({ min: 2, max: 3 }),
      distance: random([5000, 10000, 21097, 15000]),
      elevation: faker.number.int({ min: 10, max: 600 }),
      fee: random([10, 15, 20, 25]),
      surface: random(["road", "grass"]),
      eventId: i,
    });

    galleries.push({
      name: faker.lorem.word(),
      userId: userIds[0],
      description: faker.lorem.sentence(),
      eventId: i,
    });
  }

  const clubs = [
    "BK Furca Kosice",
    "BKO Vysna Mysla",
    "Obal servis Kosice",
    "US Steel Kosice",
    "Presov running team",
  ];

  const rank: Record<number, number> = {};
  for (let i = 0; i < 150; i++) {
    const runId = random([1, 2, 3]);
    if (!rank[runId]) rank[runId] = 0;

    registrations.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      gender: random(["MALE", "FEMALE"]),
      dateOfBirth: faker.date.past(),
      city: faker.location.city(),
      nation: faker.location.state(),
      category: random(["A", "B", "C", "D", "E", "F"]),
      club: random(clubs),
      paid: false,
      presented: false,
      runId,
      phone: faker.phone.number(),
    });

    runResults.push({
      name: faker.person.fullName(),
      category: random(["A", "B", "C", "D", "E", "F"]),
      club: random(clubs),
      bib: faker.number.int({ min: 50, max: 250 }).toString(),
      gender: random(["MALE", "FEMALE"]),
      rank: ++rank[runId],
      runId,
      yearOfBirth: random([1980, 1984, 1965, 1998, 2002]),
      time: 1200 + i * 5,
    });
  }

  const runCategories: Partial<RunCategory>[] = [
    {
      category: "A",
      title: "Muzi do 39 rokov",
    },
    {
      category: "B",
      title: "Muzi do 49 rokov",
    },
    {
      category: "C",
      title: "Muzi do 59 rokov",
    },
    {
      category: "D",
      title: "Muzi nad 60 rokov",
    },
    {
      category: "F",
      title: "Zeny do 39 rokov",
    },
    {
      category: "G",
      title: "Zeny nad 39 rokov",
    },
  ];

  await prisma.post.createMany({ data: posts as Post[] });

  await prisma.comment.createMany({
    data: comments as Comment[],
  });
  await prisma.like.createMany({ data: likes as Like[] });
  
  await prisma.eventType.createMany({ data: eventTypes as EventType[] });
  await prisma.event.createMany({ data: events as Event[] });
  await prisma.eventSchedule.createMany({
    data: eventSchedules as EventSchedule[],
  });
  /*await prisma.attendee.createMany({
    data: attendees as Attendee[],
  });*/
  await prisma.run.createMany({ data: runs as Run[] });
  await prisma.runCategory.createMany({
    data: runCategories as RunCategory[],
  });
  await prisma.gallery.createMany({
    data: galleries as Gallery[],
  });

  await prisma.registration.createMany({
    data: registrations as Registration[],
  });
  await prisma.runResult.createMany({
    data: runResults as RunResult[],
  });

  return NextResponse.json({ result: "done" });
}
