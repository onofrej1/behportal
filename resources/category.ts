import { Resource } from "@/types/resources";
import { CreateCategory } from "@/validation";

const category: Resource = {
  name: "Category",
  name_plural: "Categories",
  model: "category",
  resource: "categories",
  menuIcon: "",
  rules: CreateCategory,
  form: [{ name: "title", type: "text", label: "Title" }],
  list: [
    { name: "id", header: "Id" },
    { name: "title", header: "Title" },
  ],
  filter: [{ name: "title", type: "text", label: "Title" }],
};
export { category };
