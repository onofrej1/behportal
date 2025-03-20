"use client";

import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { TableData, TableHeader } from "@/types/resources";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { DataTableRowAction } from "@/types/data-table";
import { QueryClient } from "@tanstack/react-query";

interface GetColumnsProps {
  columns: TableHeader[];
  queryClient: QueryClient;
}

export function getColumns({
  columns,
  queryClient,
}: GetColumnsProps): ColumnDef<TableData>[] {
  const customActions = columns.find((field) => field.name === "actions");

  const actionColumn: ColumnDef<TableData> = {
    id: "actions",
    cell: function Cell({ row }) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Open menu"
              variant="ghost"
              className="flex size-8 p-0 data-[state=open]:bg-muted"
            >
              <Ellipsis className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {customActions?.render!({ row: row.original, queryClient })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 40,
  };

  const tableColumns = columns
    .filter((field) => field.name !== "actions")
    .map((field) => {
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
          return field.render!({ row: row.original, queryClient });
        };
      }
      return column;
    });

  if (customActions) {
    tableColumns.push(customActions);
  }

  return tableColumns;
}
