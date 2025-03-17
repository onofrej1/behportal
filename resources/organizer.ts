import { Resource } from "@/types/resources";
import { CreateOrganizer } from "@/validation";

const organizer: Resource = {
  name: "Organizer",
  name_plural: "Organizers",
  model: "organizer",
  resource: "organizers",
  menuIcon: "",
  rules: CreateOrganizer,
  form: [{ name: "name", type: "text", label: "Name" }],
  list: [
    { name: "id", header: "Id" },
    { name: "name", header: "Name" },
  ],
  filter: [{ name: "name", type: "text", label: "Name" }],
};
export { organizer };
