"use client";

import {
  DataTableFilterField,
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

interface TableProps {
  resource: string;
  data: TableData[];
  pageCount: number;
}

export function Table(props: TableProps) {
  const queryClient = useQueryClient();
  const { data, pageCount } = props;
  const params = useParams();
  const { name: resource } = params;
  const [filterFields, setFilterFields] = React.useState<DataTableFilterField<TableData>[]>([]);

  //const advancedFilterFields = getAdvancedFilters(resource);
  /*const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<TableData> | null>(null);*/

  const columns = React.useMemo(() => getColumns({ resource: resource as string }), [resource]);
  const enableAdvancedTable = false; // featureFlags.includes("advancedTable");

  React.useEffect(() => {
    async function fetchFilters() {
      const filters = await getFilters(resource as string, queryClient);
      setFilterFields(filters);
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

  return (
    <>
      <DataTable table={table}>
        {enableAdvancedTable ? (
          <DataTableAdvancedToolbar
            table={table}
            filterFields={/*advancedFilterFields*/[]}
            shallow={false}
          >
            {/*<TasksTableToolbarActions table={table} />*/}
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar table={table} filterFields={filterFields}>
            {/*<TasksTableToolbarActions table={table} /> */}
          </DataTableToolbar>
        )}
      </DataTable>
    </>
  );
}
