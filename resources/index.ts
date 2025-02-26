import { Resource } from "@/resources/resources.types";
import { post } from "@/resources/post";
import { category } from "@/resources/category";
import { event } from "@/resources/event";
import { tag } from "@/resources/tag";
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
];

export { resources };
