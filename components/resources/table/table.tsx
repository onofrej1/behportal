"use client";

import {
  DataTableAdvancedFilterField,
  DataTableFilterField,
  DataTableRowAction,
} from "@/types/data-table";
import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { getColumns } from "./table-columns";
import { TableData } from "@/components/table/table";
import { getAdvancedFilters, getFilters } from "./table-filters";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { TableFloatingBar } from "./table-floating-bar";
import { TableToolbarActions } from "./table-toolbar-actions";
import ResourceForm from "../form";
import { useFeatureFlags } from "@/app/(admin)/resource/[name]/_components/feature-flags-provider";

interface TableProps {
  resource: string;
  data: TableData[];
  pageCount: number;
}

export function Table(props: TableProps) {
  const { featureFlags } = useFeatureFlags();
  const queryClient = useQueryClient();
  const { data, pageCount } = props;
  const params = useParams();
  const { name: resource } = params;
  const [filterFields, setFilterFields] = React.useState<
    DataTableFilterField<TableData>[]
  >([]);
  const [advancedFilterFields, setAdvancedFilterFields] = React.useState<
    DataTableAdvancedFilterField<TableData>[]
  >([]);

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<TableData> | null>(null);

  const columns = React.useMemo(
    () => getColumns({ resource: resource as string, setRowAction }),
    [resource]
  );
  const enableAdvancedTable = featureFlags.includes("advancedTable");

  React.useEffect(() => {
    async function fetchFilters() {
      if (enableAdvancedTable) {
        const filters = await getAdvancedFilters(
          resource as string,
          queryClient
        );
        setAdvancedFilterFields(filters);
      } else {
        const filters = await getFilters(resource as string, queryClient);
        setFilterFields(filters);
      }
    }
    if (filterFields.length === 0) {
      fetchFilters();
    }
  }, [resource]);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter: enableAdvancedTable,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id.toString(),
    shallow: false,
    clearOnDefault: true,
  });

  const enableFloatingBar = featureFlags.includes("floatingBar");

  return (
    <div className="mt-2">
      <DataTable
        table={table}
        floatingBar={
          enableFloatingBar ? (
            <TableFloatingBar table={table} resource={resource as string} />
          ) : null
        }
      >
        {enableAdvancedTable ? (
          <DataTableAdvancedToolbar
            table={table}
            filterFields={advancedFilterFields}
            shallow={false}
          >
            <TableToolbarActions table={table} resource={resource as string} />
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar table={table} filterFields={filterFields}>
            <TableToolbarActions table={table} resource={resource as string} />
          </DataTableToolbar>
        )}
      </DataTable>

      <ResourceForm
        resource={resource as string}
        open={rowAction?.type === "update"}
        onOpenChange={() => setRowAction(null)}
        id={rowAction?.row.original.id}
      />
    </div>
  );
}
