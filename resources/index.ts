import { Resource } from "@/types/resources";
import { post } from "@/resources/post";
import { category } from "@/resources/category";
import { tag } from "@/resources/tag";
import { event } from "@/resources/event";
import { eventType } from "@/resources/eventType";
import { run } from "@/resources/run";
import { runCategory } from "@/resources/runCategory";
import { venue } from "@/resources/venue";
import { organizer } from "@/resources/organizer";

const resources: Resource[] = [
  post,
  category,
  event,
  tag,
  run,
  runCategory,
  venue,
  organizer,
  eventType
];

export { resources };
