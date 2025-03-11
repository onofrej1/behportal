"use client";

import { FilterField, TableData } from "@/types/resources";
import {
  DataTableAdvancedFilterField,
  DataTableFilterField,
} from "@/types/data-table";
import { QueryClient } from "@tanstack/react-query";
import { getOptions } from "@/api";

export async function getFilters(
  queryClient: QueryClient,
  filters: FilterField[]
): Promise<DataTableFilterField<TableData>[]> {
  const filterFields: DataTableFilterField<TableData>[] = [];
  for (const filter of filters) {
    const filterField: DataTableFilterField<TableData> = {
      id: filter.name,
      label: filter.label || filter.name,
      placeholder: `${filter.name}...`,
    };
    if (filter.type === "multi-select") {
      const optionsData = await queryClient.fetchQuery({
        queryKey: ["getOptions", filter.resource],
        queryFn: () => getOptions(filter.resource!),
      });
      const options = optionsData.map((o: any) => ({
        label: filter.renderOption(o),
        value: o.id,
      }));
      filterField.options = options;
    }
    filterFields.push(filterField);
  }
  return filterFields;
}

export async function getAdvancedFilters(
  queryClient: QueryClient,
  filters: FilterField[]
): Promise<DataTableAdvancedFilterField<TableData>[]> {
  const filterFields: DataTableAdvancedFilterField<TableData>[] = [];
  for (const filter of filters) {
    const filterField: DataTableAdvancedFilterField<TableData> = {
      type: filter.type,
      id: filter.name,
      label: filter.label || filter.name,
      placeholder: `${filter.name}...`,
    };
    if (filter.type === "multi-select" || filter.type === "select") {
      const optionsData = await queryClient.fetchQuery({
        queryKey: ["getOptions", filter.resource],
        queryFn: () => getOptions(filter.resource!),
      });

      const options = optionsData.map((o: any) => ({
        label: filter.renderOption(o),
        value: o.id.toString(),
      }));
      filterField.search = filter.search;
      filterField.options = options;
    }
    filterFields.push(filterField);
  }
  return filterFields;
}
