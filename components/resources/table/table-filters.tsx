"use client";

import { resources } from "@/resources";
import { TableData } from "@/components/table/table";
import {
  DataTableAdvancedFilterField,
  DataTableFilterField,
} from "@/types/data-table";
import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import { SelectFilterType } from "@/resources/resources.types";
import { baseUrl } from "@/constants";

const getOptions = async (resource: string, fields: string[]) => {
  const select = `select=${fields.join(",")}`;
  const url = `${baseUrl}/api/resources/${resource}/options?${select}`;
  const response = await axios.get(url);

  return response.data;
};

const getOption = (field: SelectFilterType, row: Record<string, any>) => {
  const titleField = field.fields.find((f) => f !== "id");
  return field.renderOption ? field.renderOption(row) : row[titleField!];
};

export async function getFilters(
  resourceName: string,
  queryClient: QueryClient
): Promise<DataTableFilterField<TableData>[]> {
  const resource = resources.find((r) => r.resource === resourceName);
  if (!resource) {
    throw new Error("Resource not found");
  }

  const filterFields: DataTableFilterField<TableData>[] = [];
  for (const filter of resource.filter) {
    const filterField: DataTableFilterField<TableData> = {
      id: filter.name,
      label: filter.label || filter.name,
      placeholder: `${filter.name}...`,
    };
    if (filter.type === "select-filter") {
      const optionsData = await queryClient.fetchQuery({
        queryKey: ["getOptions", filter.resource],
        queryFn: () => getOptions(filter.resource!, filter.fields!),
      });

      const options = optionsData.map((o: any) => ({
        label: getOption(filter!, o),
        value: o.id,
      }));
      filterField.options = options;
    }
    filterFields.push(filterField);
  }
  return filterFields;
}

export function getAdvancedFilters(
  resourceName: string
): DataTableAdvancedFilterField<TableData>[] {
  const resource = resources.find((r) => r.resource === resourceName);
  if (!resource) {
    throw new Error("Resource not found");
  }
  return [];
}
