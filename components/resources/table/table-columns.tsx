"use client";

import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { resources } from "@/resources";
import { TableData } from "@/types/resources";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { DataTableRowAction } from "@/types/data-table";
import { QueryClient } from "@tanstack/react-query";

interface GetColumnsProps {
  resource: string;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<TableData> | null>
  >;
  queryClient: QueryClient;
}

export function getColumns({
  resource: resourceName,
  setRowAction,
  queryClient,
}: GetColumnsProps): ColumnDef<TableData>[] {
  const resource = resources.find((r) => r.resource === resourceName);
  if (!resource) {
    throw new Error("Resource not found");
  }

  const selectRowColumn: ColumnDef<TableData> = {
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

  const actionColumn: ColumnDef<TableData> = {
    id: "actions",
    cell: function Cell({ row }) {
      const customActions = resource.list.find(
        (field) => field.name === "actions"
      );

      const EditMenuItem = (
        <DropdownMenuItem
          onSelect={() => setRowAction({ row, type: "update" })}
        >
          Edit
        </DropdownMenuItem>
      );

      const DeleteMenuItem = (
        <DropdownMenuItem
          onSelect={() => setRowAction({ row, type: "delete" })}
        >
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      );

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
            {resource.canEditItem === null || resource.canEditItem !== false && EditMenuItem}
            {customActions?.render!({ row: row.original, queryClient })}

            {resource.canRemoveItem === null || resource.canRemoveItem !== false && (
              <>
                <DropdownMenuSeparator />
                {DeleteMenuItem}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 40,
  };

  const columns = resource.list
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

  return [selectRowColumn, ...columns, actionColumn];
}
