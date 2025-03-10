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
import { FeatureFlagsProvider } from "./_components/feature-flags-provider";
import { useResource } from "@/state";

export default function Resource() {
  const searchParams = useSearchParams();
  const [openAddItem, setOpenAddItem] = useState(false);
  const {
    resource: { resource, relations, filter },
  } = useResource();
  if (!resource) {
    return;
  }

  const { page, pageCount, sort = '', filters } = Object.fromEntries(
    searchParams.entries()
  );

  const baseFilters: any[] = [];
  filter.forEach((field) => {
    const value = searchParams.get(field.name);
    if (value) {
      baseFilters.push({
        id: field.name,
        value,
        type: field.type,
        search: field.type === 'multi-select' ? field.search : field.name,
        operator: 'eq'
      });
    }
  });

  const skip = (Number(page) || 1) - 1;
  const take = Number(pageCount) || 10;

  const query = {
    filters: JSON.stringify(baseFilters),
    skip: skip * take,
    take: take,
    sort,
    include: relations || [],
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
          <FeatureFlagsProvider>
            <Table dataPromise={promise} />
          </FeatureFlagsProvider>
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
