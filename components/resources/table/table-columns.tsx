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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { DataTableRowAction } from "@/types/data-table";
import { toast } from "sonner";

interface GetColumnsProps {
  resource: string;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<TableData> | null>
  >;
}

export function getColumns({
  resource: resourceName,
  setRowAction,
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

  const actionCol: ColumnDef<TableData> = {
    id: "actions",
    cell: function Cell({ row }) {
      const [isUpdatePending, startUpdateTransition] = React.useTransition();

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
            <DropdownMenuItem
              onSelect={() => setRowAction({ row, type: "update" })}
            >
              Edit
            </DropdownMenuItem>
            {/*<DropdownMenuSub>
              <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={row.original.label}
                  onValueChange={(value) => {
                    startUpdateTransition(() => {
                      toast.promise(
                        updateTask({
                          id: row.original.id,
                          label: value as Task["label"],
                        }),
                        {
                          loading: "Updating...",
                          success: "Label updated",
                          error: (err) => getErrorMessage(err),
                        },
                      );
                    });
                  }}
                >
                  <DropdownMenuRadioItem
                    key={"test"}
                    value={"test"}
                    className="capitalize"
                    disabled={isUpdatePending}
                  >
                    {"test"}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>*/}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setRowAction({ row, type: "delete" })}
            >
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 40,
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
  return [checkboxCol, ...cols, actionCol];
}
