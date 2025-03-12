import { Resource } from "@/types/resources";
import { CreateVenue } from "@/validation";

const venue: Resource = {
  name: "Venue",
  name_plural: "Venues",
  model: "venue",
  resource: "venues",
  filter: [],
  menuIcon: "",
  group: "Events",
  rules: CreateVenue,
  form: [{ name: "location", type: "text", label: "Location" }],
  list: [{ name: "location", header: "Location" }],
};
export { venue };
