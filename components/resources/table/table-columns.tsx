"use client";

import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { resources } from "@/resources";
import { TableData } from "@/components/table/table";

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

  return resource.list.map((field) => {
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
}
