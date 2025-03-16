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
import { getAdvancedFilters, getFilters } from "./table-filters";
import { useQueryClient } from "@tanstack/react-query";
import { TableFloatingBar } from "./table-floating-bar";
import { TableToolbarActions } from "./table-toolbar-actions";
import ResourceFormDialog from "../form-dialog";
import { TableData } from "@/types/resources";
import { ResourceContext, useContext } from "@/app/resource-context";

interface TableProps {
  dataPromise: Promise<{ data: any; numPages: number }>;
}

export function Table(props: TableProps) {
  const {
    resource: { resource, filter, advancedFilter, floatingBar },
  } = useContext(ResourceContext);

  const queryClient = useQueryClient();

  const { data, numPages: pageCount } = React.use(props.dataPromise);

  const [filterFields, setFilterFields] = React.useState<
    DataTableFilterField<TableData>[]
  >([]);
  const [advancedFilterFields, setAdvancedFilterFields] = React.useState<
    DataTableAdvancedFilterField<TableData>[]
  >([]);

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<TableData> | null>(null);

  const columns = React.useMemo(
    () => getColumns({ resource, setRowAction, queryClient }),
    [resource]
  );

  React.useEffect(() => {
    async function setupFilters() {
      if (advancedFilter) {
        const filters = await getAdvancedFilters(queryClient, filter);
        setAdvancedFilterFields(filters);
      } else {
        const filters = await getFilters(queryClient, filter);
        setFilterFields(filters);
      }
    }
    setupFilters();
  }, [resource]);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter: advancedFilter,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id.toString(),
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <div className="mt-2">
      <DataTable
        table={table}
        floatingBar={floatingBar ? <TableFloatingBar table={table} /> : null}
      >
        {advancedFilter ? (
          <DataTableAdvancedToolbar
            table={table}
            filterFields={advancedFilterFields}
            shallow={false}
          >
            <TableToolbarActions table={table} />
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar table={table} filterFields={filterFields}>
            <TableToolbarActions table={table} />
          </DataTableToolbar>
        )}
      </DataTable>

      <ResourceFormDialog
        key="updateResource"
        open={rowAction?.type === "update"}
        onOpenChange={() => setRowAction(null)}
        id={rowAction?.row.original.id}
      />
    </div>
  );
}
