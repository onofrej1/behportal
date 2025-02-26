"use client";

import { resources } from "@/resources";
import { TableData } from "@/components/table/table";
import {
  DataTableAdvancedFilterField,
  DataTableFilterField,
} from "@/types/data-table";
import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

const getOptions = async (resource: string) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/resources/${resource}/options`;
  const response = await axios.get(url);

  return response.data;  
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
        queryKey: ["getOptions", filter.name],
        queryFn: () => getOptions(filter.name),
      });

      const options = optionsData.map((o: any) => ({ label: o[filter.textField!], value: o.id }));
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
