import { TableData } from "@/resources/resources.types";
import { Resource } from "@/resources/resources.types";

const post: Resource = {
  name: "Post",
  name_plural: "Posts",
  model: "post",
  resource: "posts",
  rules: "CreateOrEditPost",
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
      renderOption: (row: any) => `${row.lastName} ${row.firstName}`,
    },
  ],
  form: [
    { name: "title", type: "text", label: "Title" },
    { name: "content", type: "richtext", label: "Content" },
    { name: "status", type: "text", label: "Status" },
    {
      name: "cover",
      type: "upload",
      label: "Cover" /*, uploadPath: 'posts'*/,
    },
    {
      name: "authorId",
      type: "fk",
      relation: "author",
      label: "Author",
      resource: "users",
      fields: ["id", "firstName", "lastName"],
      renderLabel: (row: any) => `${row.lastName} ${row.firstName}`,
    },
    {
      name: "categories",
      type: "m2m",
      label: "Categories",
      resource: "categories",
      fields: ["id", "title"],
    },
    {
      name: "tags",
      type: "m2m",
      label: "Tags",
      resource: "tags",
      fields: ["id", "title"],
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
    /*{ 
      name: 'content', 
      header: 'Content', 
    },*/
  ],
};
export { post };
