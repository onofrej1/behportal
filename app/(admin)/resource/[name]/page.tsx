"use client";
import Table from "@/components/resources/table";
import { resources } from "@/resources";
import { useParams, useSearchParams } from "next/navigation";
import TableFilter from "@/components/table/table-filter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TablePagination from "@/components/table/table-pagination";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

interface SaveResourceArgs {
  resource?: string;
  data: any;
}

const getResource = async (args: SaveResourceArgs) => {
  const { resource, data } = args;
  const { where, ...rest } = data;
  const query = new URLSearchParams(rest);
  const whereQuery = new URLSearchParams(where);
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/resources/${resource}?${query}&${whereQuery}`;

  const response = await axios.get<any[]>(url, data);
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

  resource?.filter.forEach((f) => {
    const value = searchParams.get(f.name);
    if (value) {
      where[f.name] = `contains,${value}`;
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

  const { data = [], isFetching } = useQuery({
    queryKey: [
      "getResources",
      args.skip,
      args.take,
      args.sortBy,
      args.sortDir,
      args.where,
    ],
    queryFn: () => getResource({ resource: resource?.resource, data: args }),
  });

  const createResource = async () => {
    router.push(`${resourcePath}/add`);
  };

  const totalRows = 100;

  return (
    <div className="w-full">
      <div className="flex flex-row items-end justify-between">
        <TableFilter />
        <form action={createResource}>
          <Button variant="outline" type="submit">
            <Plus className="h-5 w-5" /> Add item
          </Button>
        </form>
      </div>
      <div>
        <Table resource={resource.resource} data={data} totalRows={totalRows} />
        <TablePagination totalRows={totalRows} />
      </div>
    </div>
  );
}
