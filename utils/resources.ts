import { FormField, TableData } from "@/types/resources";
import { Filter } from "@/types/data-table";

export function getOrderBy(input: string) {
  if (!input) {
    return [{ id: "asc" }];
  }

  const sort: { id: string; desc: boolean }[] = JSON.parse(input);
  return sort.map((value) => ({ [value.id]: value.desc ? "desc" : "asc" }));
}

export function getWhereQuery(input: string) {
  if (!input) {
    return {};
  }
  const filters: Filter<TableData>[] = JSON.parse(input);
  const where: Record<string, any> = {};

  filters.forEach((filter) => {
    let value = filter.value;
    const operator = filter.operator;

    if (["text"].includes(filter.type)) {
      if (["isEmpty", "isNotEmpty"].includes(operator)) {
        where[filter.id] = operator === "isEmpty" ? "" : { not: "" };
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
        if (value === null || value === undefined || value === "") return;
        const op: any = {
          eq: "equals",
          ne: "not",
          lt: "lt",
          lte: "lte",
          gt: "gt",
          gte: "gte",
        };
        where[filter.id] = {
          [op[filter.operator]]: new Date(value as string).toISOString(),
        };
      }
    }

    if (["number"].includes(filter.type)) {
      if (["isEmpty", "isNotEmpty"].includes(operator)) {
        where[filter.id] = operator === "isEmpty" ? "" : { not: "" };
      } else {
        if (value === null || value === undefined || value === "") return;
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
      where[filter.id] = {
        [op[filter.operator]]: value === "false" ? false : !!value,
      };
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
        value = Array.isArray(value)
          ? value.filter(Boolean).map((v: any) => parseFloat(v) || v)
          : value
          ? [parseFloat(value) || value]
          : [];
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
        value = Array.isArray(value)
          ? value.filter(Boolean).map((v: any) => parseFloat(v) || v)
          : value
          ? [parseFloat(value) || value]
          : [];
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
  return where;
}

export function getRelations(query?: string | string[]) {
  if (!query) {
    return {};
  }
  if (typeof query === "string") {
    return reduceQuery(query.split(","));
  }
  return reduceQuery(query);
}

export function reduceQuery(query: string[]) {
  return query.reduce((result, model) => {
    result[model] = true;
    return result;
  }, {} as Record<string, boolean>);
}

function getConnectValues(
  oldValues: { id: string }[] = [],
  newValues: { id: string }[]
) {
  if (newValues.length === 0) {
    return { set: [] };
  }

  const oldIds = new Set(oldValues.map((item) => item.id));
  const newIds = new Set(newValues.map((item) => item.id));

  const connect = Array.from(newIds)
    .filter((id) => !oldIds.has(id))
    .map((id) => ({ id }));

  const disconnect = Array.from(oldIds)
    .filter((id) => !newIds.has(id))
    .map((id) => ({ id }));

  if (oldValues.length === 0) {
    return {
      connect,
    };
  }

  return {
    connect,
    disconnect,
  };
}

export function setRelations(
  data: Record<string, any>,
  fields: FormField[],
  entity?: Record<string, any>
) {
  for (const field of fields) {
    if (field.type === "foreignKey") {
      if (data[field.name]) {
        data[field.relation!] = { connect: { id: data[field.name] } };
      } else {
        data[field.relation!] = { disconnect: true };
      }
      delete data[field.name!];
    }

    if (field.type === "manyToMany") {
      const values = data[field.name]
        .filter(Boolean)
        .map((value: number) => ({ id: value }));

      if (values && values.length > 0) {
        data[field.name] = getConnectValues(entity?.[field.name], values);
      } else {
        entity?.id ? (data[field.name] = { set: [] }) : delete data[field.name];
      }
    }
  }
}
