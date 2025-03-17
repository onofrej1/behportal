import { Resource } from "@/types/resources";
import { CreateVenue } from "@/validation";

const venue: Resource = {
  name: "Venue",
  name_plural: "Venues",
  model: "venue",
  resource: "venues",
  menuIcon: "",
  rules: CreateVenue,
  form: [{ name: "location", type: "text", label: "Location" }],
  list: [{ name: "id", header: "Id" }, { name: "location", header: "Location" }],
  filter: [{ name: "location", type: "text", label: "Location" }],
};
export { venue };
