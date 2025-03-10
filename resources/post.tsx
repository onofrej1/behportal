import { TableData } from "@/types/resources";
import { Resource } from "@/types/resources";
import { User } from "@prisma/client";

const post: Resource = {
  name: "Post",
  name_plural: "Posts",
  model: "post",
  resource: "posts",
  rules: "CreatePost",
  group: "Blog",
  menuIcon: "",
  relations: ["author", "categories", "tags"],
  filter: [
    //{ name: "title", type: "text", label: "Title" },
    { name: "enableComments", type: "boolean", label: "enable comments" },
    {
      type: "multi-select",
      name: "categories",
      label: "Category",
      resource: "categories",
      fields: ["id", "title"],
      search: "categories_",
    },
    {
      name: "authorId",
      resource: "users",
      search: "author",
      type: "multi-select",
      fields: ["id", "firstName", "lastName"],
      label: "Author",
      renderOption: (row: User) => `${row.lastName} ${row.firstName}`,
    },
  ],
  form: [
    { name: "title", type: "text", label: "Title" },
    { name: "content", type: "richtext", label: "Content" },
    { name: "status", type: "text", label: "Status" },
    {
      name: "cover",
      type: "upload",
      label: "Cover" /*, path: 'posts'*/,
    },
    {
      name: "authorId",
      type: "foreignKey",
      relation: "author",
      label: "Author",
      resource: "users",
      renderLabel: (row) => `${row.lastName} ${row.firstName}`,
    },
    {
      name: "categories",
      type: "manyToMany",
      label: "Categories",
      resource: "categories",
      renderLabel: (row) => row.title,
    },
    {
      name: "tags",
      type: "manyToMany",
      label: "Tags",
      resource: "tags",
      renderLabel: (row) => row.title,
    },
  ],
  list: [
    { name: "id", header: "Id" },
    { name: "title", header: "Title" },
    { name: "cover", header: "Cover" },
    { name: "enableComments", header: "Enable comments" },
    { name: "status", header: "Status" },
    {
      name: "authorId",
      header: "Author",
      render: (row: TableData) => (
        <span>
          {row.author.lastName} {row.author.firstName}
        </span>
      ),
    },
    {
      name: "categories",
      header: "Categories",
      render: (row: TableData) => (
        <span>{row.categories?.map((c: any) => c.id).join(",")}</span>
      ),
    },
  ],
};
export { post };
