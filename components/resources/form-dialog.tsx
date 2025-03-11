"use client";
import React from "react";
import Form from "@/components/form/form";
import { useFormFields } from "@/hooks/use-fields";
import { deleteFile, uploadFiles } from "@/actions/files";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createResource, getResource, updateResource } from "@/api";
import { ResourceContext, useContext } from "@/app/resource-context";

interface ResourceFormDialogProps {
  id?: string;
  open: boolean;
  onOpenChange?(open: boolean): void;
}

export default function ResourceFormDialog(props: ResourceFormDialogProps) {
  const { id, open, onOpenChange } = props;
  const queryClient = useQueryClient();
  
  const { resource: { form, relations, resource, rules, renderForm } } = useContext(ResourceContext);

  const { data } = useQuery({
    queryKey: ["getResource", resource, id],
    queryFn: () =>
      getResource({
        id,
        resource,
        include: relations,
      }),
    enabled: !!id,
  });

  const { mutate } = useMutation({
    mutationFn: data?.id ? updateResource : createResource,
    onSuccess: () => {
      onOpenChange?.(false);
      queryClient.invalidateQueries({
        queryKey: ["getResourceData", resource],
      });
    },
  });

  const { fields } = useFormFields(form, !!id);

  const submit = async (data: Record<string, any>) => {
    const uploadData = new FormData();
    for (const field of fields.filter((f) => f.type === "upload")) {
      const { file, previousFile, isDirty } = data[field.name];
      console.log('is dirty', isDirty);
      if (!isDirty) {
        delete data[field.name];
        continue;
      }
      if (previousFile) {
        await deleteFile(previousFile.name);
      }
      if (file) {
        uploadData.append(field.name, file, file.name);
        data[field.name] = file.name;
      } else if (data[field.name]) {
        data[field.name] = null;
      }
    }

    if (!uploadData.entries().next().done) {
      await uploadFiles(uploadData);
    }
    mutate({ resource, data });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-fit overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>{id ? "Add new" : "Update"} item</DialogTitle>
        </DialogHeader>
        <Form
          fields={fields}
          validation={rules}
          data={data}
          render={renderForm}
          action={submit}
        />
      </DialogContent>
    </Dialog>
  );
}
