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

export function getWhereFilters(filters: any[]) {
  const where: Record<string, any> = {};
  filters.forEach((filter) => {
    console.log(filter);
    let value = filter.value;
    const operator = filter.operator;    

    if (["text"].includes(filter.type)) {
      if (["isEmpty", "isNotEmpty"].includes(operator)) {
        where[filter.id] = operator === "isEmpty" ? "" : { "not": "" };
      } else {
        const op: any = {
          eq: "equals",
          ne: "not",
          iLike: "contains",
        };
        where[filter.id] = { [op[filter.operator]]: value };
      }
    }

    if (["date"].includes(filter.type)) {
      if (["isEmpty", "isNotEmpty"].includes(operator)) {
        where[filter.id] = operator === "isEmpty" ? null : { not: null };
      } else {
        if (value === null || value === undefined || value === '') return;
        const op: any = {
          eq: "equals",
          ne: "not",
          lt: "lt",
          lte: "lte",
          gt: "gt",
          gte: "gte",
        };
        where[filter.id] = { [op[filter.operator]]: new Date(value).toISOString() };
      }
    }

    if (["number"].includes(filter.type)) {
      if (["isEmpty", "isNotEmpty"].includes(operator)) {
        where[filter.id] = operator === "isEmpty" ? "" : { not: "" };
      } else {
        if (value === null || value === undefined || value === '') return;
        const op: any = {
          eq: "equals",
          ne: "not",
          lt: "lt",
          lte: "lte",
          gt: "gt",
          gte: "gte",
        };
        where[filter.id] = { [op[filter.operator]]: Number(value) };
      }
    }

    if (["boolean"].includes(filter.type)) {
      const op: any = {
        eq: "equals",
        ne: "not",
      };
      where[filter.id] = { [op[filter.operator]]: value === 'false' ? false : !!value };
    }

    if (filter.type === "multi-select") {
      const [key, op] = filter.search.split("_");
      const isManyRelation = op !== undefined;

      if (["isEmpty", "isNotEmpty"].includes(operator)) {
        if (isManyRelation) {
          where[key] = {
            [filter.operator === "isEmpty" ? "none" : "some"]: {},
          };
        } else {
          where[key] = {
            [filter.operator === "isEmpty" ? "isNot" : "is"]: {},
          };
        }
      }

      if (["eq", "ne"].includes(operator)) {
        value = value.filter(Boolean).map((v: any) => parseFloat(v) || v);
        if (!value.length) return;

        if (isManyRelation) {
          where[key] = {
            [filter.operator === "eq" ? "some" : "none"]: {
              id: {
                ["in"]: value,
              },
            },
          };
        } else {
          where[key] = {
            id: {
              [filter.operator === "eq" ? "in" : "notIn"]: value,
            },
          };
        }
      }
    }

    if (filter.type === "select") {
      const [key, op] = filter.search.split("_");
      const isManyRelation = op !== undefined;

      if (["isEmpty", "isNotEmpty"].includes(operator)) {
        if (isManyRelation) {
          where[key] = {
            [filter.operator === "isEmpty" ? "none" : "some"]: {},
          };
        } else {
          where[key] = {
            [filter.operator === "isEmpty" ? "isNot" : "is"]: {},
          };
        }
      }

      if (["eq", "ne"].includes(operator)) {
        value = Array.isArray(value) ? value.filter(Boolean).map((v: any) => parseFloat(v) || v) : value ? [parseFloat(value) || value] : [];
        if (!value.length) return;

        if (isManyRelation) {
          where[key] = {
            [filter.operator === "eq" ? "some" : "none"]: {
              id: {
                ["in"]: value,
              },
            },
          };
        } else {
          where[key] = {
            id: {
              [filter.operator === "eq" ? "in" : "notIn"]: value,
            },
          };
        }
      }
    }
  });
  console.log(where);
  return where;
}

export function getWhere(where: any) {
  return Object.keys(where).reduce((acc, key) => {
    let value = where[key];
    if (value === null || value === undefined || value === "") {
      return acc;
    }

    if (value.includes("__")) {
      let [operator, val] = value.split("__");
      if (operator === "in") {
        val = val.split(",").map((v: any) => parseFloat(v) || v);
      }
      value = { [operator]: val };
    }

    if (key.includes("_")) {
      const arr = key.split("_");
      const field = arr.shift();
      const query = arr.reverse().reduce((res, key) => ({ [key]: res }), value);
      acc[field!] = query;
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, unknown>);
}

export function arrayToObj(arr: string) {
  if (!arr) {
    return {};
  }
  return arr.split(",").reduce((acc, model) => {
    acc[model] = true;
    return acc;
  }, {} as Record<string, true>);
}

export function setRelations(
  data: Record<string, any>,
  fields: FormField[],
  isUpdate: boolean = false
) {
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
        isUpdate ? (data[field.name] = { set: [] }) : delete data[field.name];
      }
    }
  }
}
