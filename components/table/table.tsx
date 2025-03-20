"use client";

import {
  DataTableAdvancedFilterField,
  DataTableFilterField,
} from "@/types/data-table";
import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { getColumns } from "@/components/table/table-columns";
import { getAdvancedFilters, getFilters } from "./table-filters";
import { useQueryClient } from "@tanstack/react-query";
import { FilterField, TableData, TableHeader } from "@/types/resources";

interface TableProps {
  dataPromise: Promise<{ data: any; numPages: number }>;
  advancedFilter: boolean;
  columns: TableHeader[];
  filters: FilterField[];
}

export function Table(props: TableProps) {
  const queryClient = useQueryClient();
  const { advancedFilter, columns, filters } = props;

  const { data, numPages: pageCount } = React.use(props.dataPromise);

  const [filterFields, setFilterFields] = React.useState<
    DataTableFilterField<TableData>[]
  >([]);
  const [advancedFilterFields, setAdvancedFilterFields] = React.useState<
    DataTableAdvancedFilterField<TableData>[]
  >([]);

  const tableColumns = React.useMemo(
    () => getColumns({ columns, queryClient }),
    []
  );

  React.useEffect(() => {
    async function setupFilters() {
      if (advancedFilter) {
        const advancedFilters = await getAdvancedFilters(queryClient, filters);
        setAdvancedFilterFields(advancedFilters);
      } else {
        const baseFilters = await getFilters(queryClient, filters);
        setFilterFields(baseFilters);
      }
    }
    setupFilters();
  }, []);

  const { table } = useDataTable({
    data,
    columns: tableColumns,
    pageCount,
    filterFields,
    enableAdvancedFilter: false,
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
      <DataTable table={table}>
        {advancedFilter ? (
          <DataTableAdvancedToolbar
            table={table}
            filterFields={advancedFilterFields}
            shallow={false}
          ></DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar
            table={table}
            filterFields={filterFields}
          ></DataTableToolbar>
        )}
      </DataTable>
    </div>
  );
}
