import { Resource } from "@/types/resources";
import { CreateOrganizer } from "@/validation";

const organizer: Resource = {
  name: "Organizer",
  name_plural: "Organizers",
  model: "organizer",
  resource: "organizers",
  filter: [],
  menuIcon: "",
  rules: CreateOrganizer,
  form: [{ name: "name", type: "text", label: "Name" }],
  list: [{ name: "name", header: "Name" }],
};
export { organizer };
