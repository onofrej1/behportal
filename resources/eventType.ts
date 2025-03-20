import { Resource } from "@/types/resources";
import { CreateEventType } from "@/validation";

const eventType: Resource = {
  name: "Event type",
  name_plural: "Event types",
  model: "eventType",
  resource: "eventTypes",
  menuIcon: "",
  rules: CreateEventType,
  form: [{ name: "type", type: "text", label: "Event type" }],
  list: [{ name: "id", header: "Id" }, { name: "type", header: "Event type" }],
  filter: [{ name: "type", type: "text", label: "Event type" }],
};
export { eventType };
