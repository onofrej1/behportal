"use client";
import { Table } from "@/components/resources/table/table";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import ResourceForm from "@/components/resources/form";
import { getResourceData } from "@/api";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { FeatureFlagsProvider } from "./_components/feature-flags-provider";
import { useResource } from "@/state";

export default function Resource() {
  const searchParams = useSearchParams();
  const [openAddItem, setOpenAddItem] = useState(false);
  const { resource } = useResource();

  const {
    page,
    pageCount,
    sortBy = "id",
    sortDir = "asc",
  } = Object.fromEntries(searchParams.entries());
  const where: Record<string, string> = {};

  resource?.filter.forEach((field) => {
    const value = searchParams.get(field.name);
    if (value) {
      if (field.type === "text") {
        where[field.name] = `contains__${value}`;
      } else if (field.type === "multi-select") {
        where[field.search!] = `in__${value}`;
      }
    }
  });

  const skip = (Number(page) || 1) - 1;
  const take = Number(pageCount) || 10;
  const filters = searchParams.get("filters");

  const args: any = {
    where,
    filters,
    skip: skip * take,
    take: take,
    sortBy,
    sortDir,
    include: resource.relations || [],
  };

  const { isLoading, data } = useQuery({
    queryKey: [
      "getResourceData",
      args.skip,
      args.take,
      args.sortBy,
      args.sortDir,
      args.where,
      args.filters,
    ],
    queryFn: () =>
      getResourceData({ resource: resource?.resource, data: args }),
  });

  const createResource = async () => {
    setOpenAddItem(true);
  };

  return (
    <div className="w-full">
      <div className="flex flex-row justify-end">
        <form action={createResource}>
          <Button variant="outline" type="submit">
            <Plus className="h-5 w-5" /> Add item
          </Button>
        </form>
      </div>
      <div>
        {isLoading ? (
          <DataTableSkeleton
            columnCount={6}
            searchableColumnCount={1}
            filterableColumnCount={2}
            cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
            shrinkZero
          />
        ) : (
          <FeatureFlagsProvider>
            <Table
              data={data.data}
              pageCount={data.numPages}
            />
          </FeatureFlagsProvider>
        )}

        <ResourceForm
          open={openAddItem}
          onOpenChange={() => setOpenAddItem(false)}
        />
      </div>
    </div>
  );
}
