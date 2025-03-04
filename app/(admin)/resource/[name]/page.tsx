"use client";
import { Table } from "@/components/resources/table/table";
import { resources } from "@/resources";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import ResourceForm from "@/components/resources/form";
import { getResourceData } from "@/api";

export default function Resource() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [openAddItem, setOpenAddItem] = useState(false);

  const { name: resourceName } = params;
  const {
    page,
    pageCount,
    sortBy = "id",
    sortDir = "asc",
  } = Object.fromEntries(searchParams.entries());
  const where: Record<string, string> = {};

  const resource = resources.find((r) => r.resource === resourceName);  

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

  if (!resource) {
    throw new Error(`Resource ${resourceName} not found !`);
  }

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

  const { data: resourceData = { data: [], numPages: 0 } } =
    useQuery({
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

  const { data, numPages } = resourceData;

  const createResource = async () => {
    setOpenAddItem(true);
  };

  return (
    <div className="w-full">
      <div className="flex flex-row items-end justify-between">
        <form action={createResource}>
          <Button variant="outline" type="submit">
            <Plus className="h-5 w-5" /> Add item
          </Button>
        </form>
      </div>
      <div>
        {/*<React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={6}
            searchableColumnCount={1}
            filterableColumnCount={2}
            cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
            shrinkZero
          />
        }
      >*/}
        <Table resource={resource.resource} data={data} pageCount={numPages} />
        {/*</React.Suspense>*/}

        <ResourceForm
          resource={resourceName as string}
          open={openAddItem}
          onOpenChange={() => setOpenAddItem(false)}
        />
      </div>
    </div>
  );
}
