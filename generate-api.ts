import { models } from "./resources";
import { replaceInFileSync } from "replace-in-file";
const fs = require("fs-extra");
const path = require("path");

const generateApi = (resource: string, model: string) => {
  const templatePath = path.join(__dirname, "templates");
  const destinationPath = path.join(
    process.cwd(),
    "app",
    "api",
    "resources",
    resource
  );

  console.log(`Generating api for "${model}" model:`);
  fs.copySync(templatePath, destinationPath);

  replaceInFileSync({
    files: path.join(destinationPath, "**", "*"),
    from: /\[MODEL\]/g,
    to: model,
  });

  console.log("Done.");
};

for (const model of models) {
  generateApi(model.resource, model.model);
}
