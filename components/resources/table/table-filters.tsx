"use client";

import { resources } from "@/resources";
import { TableData } from "@/components/table/table";
import {
  DataTableAdvancedFilterField,
  DataTableFilterField,
} from "@/types/data-table";
import { QueryClient } from "@tanstack/react-query";
import {
  MultiSelectFilterType,
  SelectFilterType,
} from "@/resources/resources.types";
import { getOptions } from "@/api";
import { useResource } from "@/state";

const getOption = (
  field: SelectFilterType | MultiSelectFilterType,
  row: Record<string, any>
) => {
  const titleField = field.fields.find((f) => f !== "id");
  return field.renderOption ? field.renderOption(row) : row[titleField!];
};

export async function getFilters(
  queryClient: QueryClient
): Promise<DataTableFilterField<TableData>[]> {
  const { resource } = useResource.getState();

  const filterFields: DataTableFilterField<TableData>[] = [];
  for (const filter of resource.filter) {
    const filterField: DataTableFilterField<TableData> = {
      id: filter.name,
      label: filter.label || filter.name,
      placeholder: `${filter.name}...`,
    };
    if (filter.type === "multi-select") {
      const optionsData = await queryClient.fetchQuery({
        queryKey: ["getOptions", filter.resource],
        queryFn: () =>
          getOptions({ resource: filter.resource!, fields: filter.fields! }),
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

export async function getAdvancedFilters(
  queryClient: QueryClient
): Promise<DataTableAdvancedFilterField<TableData>[]> {
  const { resource } = useResource.getState();

  const filterFields: DataTableAdvancedFilterField<TableData>[] = [];
  for (const filter of resource.filter) {
    const filterField: DataTableAdvancedFilterField<TableData> = {
      type: filter.type,
      id: filter.name,
      label: filter.label || filter.name,
      placeholder: `${filter.name}...`,
    };
    if (filter.type === "multi-select" || filter.type === "select") {
      const optionsData = await queryClient.fetchQuery({
        queryKey: ["getOptions", filter.resource],
        queryFn: () =>
          getOptions({ resource: filter.resource!, fields: filter.fields! }),
      });

      const options = optionsData.map((o: any) => ({
        label: getOption(filter!, o),
        value: o.id.toString(),
      }));
      filterField.search = filter.search;
      filterField.options = options;
    }
    filterFields.push(filterField);
  }
  return filterFields;
}
