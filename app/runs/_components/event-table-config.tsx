import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { FilterField, TableHeader } from "@/types/resources";

export const tableColumns: TableHeader[] = [
  { name: "name", header: "Name" },
  { name: "location", header: "Location" },
  {
    name: "startDate",
    header: "Start date",
    render: ({ row }) => <span>{formatDate(row.startDate)}</span>,
  },
  {
    name: "endDate",
    header: "End date",
    render: ({ row }) => <span>{formatDate(row.endDate)}</span>,
  },
  {
    name: "propozicie",
    header: "",
    enableSort: false,
    enableHide: false,
    render: ({ row }) => (
      <div className="flex gap-2 justify-end">
        <Button onClick={() => {}} variant="outline">Propozície</Button>
      </div>
    ),
  },
];

export const tableFilters: FilterField[] = [
  { name: "name", type: "text", label: "Title" },
  { name: "location", type: "text", label: "Location" },
  { name: "startDate", type: "date", label: "Start date" },
  { name: "endDate", type: "date", label: "Start date" },
];
