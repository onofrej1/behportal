"use client";

import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { resources } from "@/resources";
import { TableData } from "@/components/table/table";
import { Checkbox } from "@/components/ui/checkbox";

interface GetColumnsProps {
  resource: string;
}

export function getColumns({
  resource: resourceName,
}: GetColumnsProps): ColumnDef<TableData>[] {
  const resource = resources.find((r) => r.resource === resourceName);
  if (!resource) {
    throw new Error("Resource not found");
  }

  const checkboxCol: ColumnDef<TableData> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const cols = resource.list.map((field) => {
    const column = {
      accessorKey: field.name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={field.header} />
      ),
      enableSorting: field.enableSort === undefined ? true : field.enableSort,
      enableHiding: field.enableHide === undefined ? true : field.enableHide,
    } as ColumnDef<TableData>;
    if (field.render) {
      column.cell = ({ row }) => {        
        return field.render!(row.original);
      };
    }
    return column;
  });
  return [checkboxCol, ...cols];
}
