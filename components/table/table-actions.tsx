"use client";
import React from "react";
import { TableAction, TableData } from "./table";
import { useParams, useRouter } from "next/navigation";
import { useAlert } from "@/state";
import { Button } from "../ui/button";
import { LucideIcon, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { resources } from "@/resources";
import { useMutation } from "@tanstack/react-query";
import { revalidatePath } from "next/cache";
import { deleteResource } from "@/api";

type IconNames = "edit" | "delete";

export const Icons: Record<IconNames, LucideIcon> = {
  edit: Pencil,
  delete: Trash2,
};

export default function TableActions({ row }: { row?: any }) {
  const { open: openDialog, setTitle, setAction } = useAlert();
  const { push } = useRouter();
  const { mutate } = useMutation({
    mutationFn: deleteResource,
    onSuccess: (data) => {
      if (data.status === 200) {
        console.log("revalidate");
        const resourcePath = `/resource/${resource?.resource}`;
        revalidatePath(resourcePath);
      }
    },
  });
  const params = useParams();
  const resource = resources.find((r) => r.resource === params.name);
  if (!resource) {
    throw new Error("Resource not found");
  }
  const deleteRow = () => {
    mutate({ resource: resource.resource, id: row.id });
  };

  const resourcePath = `/resource/${resource.resource}`;

  const actions: TableAction[] = [
    {
      label: "Edit",
      icon: "edit",
      action: (data: TableData) => {
        return { redirect: `${resourcePath}/${data.id}/edit` };
      },
    },
    {
      label: "Delete",
      icon: "delete",
      variant: "outline",
      action: (data: TableData) => {
        setAction(deleteRow);
        setTitle("Really delete row with id: " + data.id);
        openDialog();
      },
    },
  ];

  return (
    <>
      {actions?.map((action) => {
        const Icon = action.icon ? Icons[action.icon] : null;
        return (
          <Button
            size={"sm"}
            variant={action.variant || "default"}
            onClick={async () => {
              const response = await action.action(row);
              if (response && response.message) {
                toast(response.message);
              }
              if (response && response.redirect) {
                push(response.redirect);
              }
            }}
            key={action.label}
            className="flex flex-row gap-2"
          >
            {Icon && <Icon size={14} />}
            {action.label}
          </Button>
        );
      })}
    </>
  );
}
