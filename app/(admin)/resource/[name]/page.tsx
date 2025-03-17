"use client";
import { Table } from "@/components/resources/table/table";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import ResourceForm from "@/components/resources/form-dialog";
import { getResourceData } from "@/api";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { ResourceContext, useContext } from "@/app/resource-context";

export default function Resource() {
  const searchParams = useSearchParams();
  const [openAddItem, setOpenAddItem] = useState(false);

  const {
    resource: { filter, relations, resource, advancedFilter },
  } = useContext(ResourceContext);

  const {
    page,
    perPage,
    sort = "",
    joinOperator = 'AND',
    filters,
  } = Object.fromEntries(searchParams.entries());

  const baseFilters: any[] = [];
  if (!advancedFilter) {
    filter.forEach((field) => {
      const value = searchParams.get(field.name);
      const isMultiSelect = field.type === "multi-select";
      if (value) {
        baseFilters.push({
          id: field.name,
          type: field.type,
          operator: isMultiSelect ? "eq" : "iLike",
          value: isMultiSelect ? value.split(',') : value,          
          search: isMultiSelect ? field.search : field.name,          
        });
      }
    });
  }

  const skip = (Number(page) || 1) - 1;
  const take = Number(perPage) || 10;

  const query = {
    take: take,
    skip: skip * take,    
    filters: advancedFilter ? filters : JSON.stringify(baseFilters),
    joinOperator,
    include: relations || [],
    sort,
  };

  const { promise } = useQuery({
    experimental_prefetchInRender: true,
    queryKey: [
      "getResourceData",
      resource,
      query.skip,
      query.take,
      query.sort,
      query.filters,
      query.joinOperator
    ],
    queryFn: () => getResourceData({ resource, data: query }),
  });

  return (
    <div className="w-full">
      <div className="flex flex-row justify-end">
        <form action={() => setOpenAddItem(true)}>
          <Button variant="outline" type="submit">
            <Plus className="h-5 w-5" /> Add item
          </Button>
        </form>
      </div>
      <div>
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={6}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
              shrinkZero
            />
          }
        >
          <Table dataPromise={promise} />
        </React.Suspense>

        <ResourceForm
          key="addResource"
          open={openAddItem}
          onOpenChange={() => setOpenAddItem(false)}
        />
      </div>
    </div>
  );
}
