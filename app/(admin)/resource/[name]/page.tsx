"use client";
import { Table } from "@/components/resources/table/table";
import { resources } from "@/resources";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { baseUrl } from "@/constants";
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs/server";
import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import { TableData } from "@/components/table/table";
import ResourceForm from "@/components/resources/form";

interface SaveResourceArgs {
  resource?: string;
  data: any;
}

interface ResourceResponse {
  numPages: number;
  data: any[];
}

const getData = async (args: SaveResourceArgs) => {
  const { resource, data } = args;
  const { where, filters, ...rest } = data;
  const query = new URLSearchParams(rest);
  const whereQuery = new URLSearchParams(where);
  const url = `${baseUrl}/api/resources/${resource}?${query}&${whereQuery}&filters=${filters}`;

  const response = await axios.get(url, data);
  return response.data;
};

export const searchParamsCachex = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<TableData>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

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
    const value = searchParams.get("filters");
    if (value) {
      /*if (field.type === "text") {
        where[field.name] = `contains__${value}`;
      } else if (field.type === "select-filter") {
        where[field.search!] = `in__${value}`;
      }*/
    }
  });

  /*resource?.filter.forEach((field) => {
    const value = searchParams.get(field.name);
    if (value) {
      if (field.type === "text") {
        where[field.name] = `contains__${value}`;
      } else if (field.type === "select-filter") {
        where[field.search!] = `in__${value}`;
      }
    }
  });*/

  if (!resource) {
    throw new Error(`Resource ${resourceName} not found !`);
  }

  const skip = (Number(page) || 1) - 1;
  const take = Number(pageCount) || 10;

  const args: any = {
    where,
    filters: searchParams.get("filters"),
    skip: skip * take,
    take: take,
    sortBy,
    sortDir,
    include: resource.relations || [],
  };

  const { data: resourceData = { data: [], numPages: 0 }, isFetching } =
    useQuery<ResourceResponse>({
      queryKey: [
        "getResourceData",
        args.skip,
        args.take,
        args.sortBy,
        args.sortDir,
        args.where,
        args.filters,
      ],
      queryFn: () => getData({ resource: resource?.resource, data: args }),
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
