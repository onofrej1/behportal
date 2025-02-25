import { Resource } from "@/resources//resources.types";
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

//const include: Record<string, Record<string, boolean>> = {};
const include: Record<string, string[]> = {};

for (const r of resources) {
  for (const field of r.form) {
    if (field.type === "m2m") {
      if (!include[r.model]) include[r.model] = [];
      include[r.model].push(field.name);
      //if (!include[r.model]) include[r.model] = {};
      //include[r.model][field.name] = true;
    }
    /*if (field.type === 'fileUpload') {
      if (!files[r.model]) files[r.model] = [];
      files[r.model].push(field.name);
    }*/
  }
}

const models = resources.map((r) => ({
  model: r.model,
  resource: r.resource,
  relations: include[r.model] || [],
  //files: files[r.model] || [],
}));

export { resources, models };
