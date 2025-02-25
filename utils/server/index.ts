import { FormField } from "@/resources/resources.types";

const sizeOf = require("image-size");

export function getImageOrientation(imagePath: string) {
  const dir = process.cwd() + "/public";
  try {
    const dimensions = sizeOf(dir + imagePath);
    const { width, height } = dimensions;
    if (width > height) {
      return "HORIZONTAL";
    } else if (height > width) {
      return "VERTICAL";
    } else {
      return "SQUARE";
    }
  } catch (err) {
    console.error("Error reading image dimensions:", err);
    return "SQUARE";
  }
}

export function slugify(title: string) {
  return title
    .trim()
    .replace(/ +/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

export function getWhere(where: any) {
  return Object.keys(where).reduce((acc, k) => {
    const value = where[k];
    if (value !== "") {
      const [op, val] = value.split(",");
      acc[k] = { [op]: val };
    }
    return acc;
  }, {} as Record<string, unknown>);
}

export function getInclude(includeModels: string) {
  if (!includeModels) {
    return {};
  }
  return includeModels.split(',').reduce((acc, model) => {
    acc[model] = true;
    return acc;
  }, {} as Record<string, true>);
}

export function setRelations(data: Record<string, any>, fields: FormField[], isUpdate: boolean = false) {
  for (const field of fields) {
    if (field.type === "fk") {
      if (data[field.name]) {
        data[field.relation!] = { connect: { id: data[field.name] } };
      } else {
        data[field.relation!] = { disconnect: true };
      }
      delete data[field.name!];
    }
    
    if (field.type === "m2m") {
      const values = data[field.name]
        .filter(Boolean)
        .map((value: number) => ({ id: value }));
      if (values && values.length > 0) {
        data[field.name] = { connect: values };
      } else {
        isUpdate ? data[field.name] = { set: [] } : delete data[field.name];
      }
    }
  }
}
