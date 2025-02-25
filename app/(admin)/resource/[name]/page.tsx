"use client";
import { Table } from "@/components/resources/table/table";
import { resources } from "@/resources";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

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
  const { where, ...rest } = data;
  const query = new URLSearchParams(rest);
  const whereQuery = new URLSearchParams(where);
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/resources/${resource}?${query}&${whereQuery}`;

  const response = await axios.get(url, data);
  return response.data;
};

export default function Resource() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { name: resourceName } = params;
  const page = searchParams.get("page");
  const pageCount = searchParams.get("pageCount");
  const sortBy = searchParams.get("sortBy") || "id";
  const sortDir = searchParams.get("sortDir") || "asc";
  const where: any = {};

  const resource = resources.find((r) => r.resource === resourceName);

  resource?.filter.forEach((field) => {
    const value = searchParams.get(field.name);
    if (value) {
      if (field.type === "text") {
        where[field.name] = `contains__${value}`;
      } else if (field.type === "select-filter") {
        where[field.search!] = `in__${value}`;
      }
    }
  });

  const resourcePath = `/resource/${resourceName}`;
  if (!resource) {
    throw new Error(`Resource ${resourceName} not found !`);
  }

  const skip = (Number(page) || 1) - 1;
  const take = Number(pageCount) || 10;

  const args: any = {
    where,
    skip: skip * take,
    take: take,
    sortBy,
    sortDir,
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
      ],
      queryFn: () => getData({ resource: resource?.resource, data: args }),
    });

  const { data, numPages } = resourceData;

  const createResource = async () => {
    router.push(`${resourcePath}/add`);
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
      </div>
    </div>
  );
}
