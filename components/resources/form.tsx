"use client";
import React from "react";
import Form from "@/components/form/form";
import { resources } from "@/resources";
import { useFormFields } from "@/hooks/useFormFields";
import { deleteFile, uploadFiles } from "@/actions/files";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createResource, getResource, updateResource } from "@/api";

interface ResourceFormProps {
  resource: string;
  id?: string;
  open: boolean;
  onOpenChange?(open: boolean): void;
}

export default function ResourceForm(props: ResourceFormProps) {
  const { resource: resourceName, id, open, onOpenChange } = props;
  const resource = resources.find((r) => r.resource === resourceName);
  if (!resource) {
    return;
  }

  const { isFetching, data = {} } = useQuery({
    queryKey: ["getResource", resource.resource, id],
    queryFn: () =>
      getResource({
        id,
        resource: resource.resource,
        include: resource.relations,
      }),
    enabled: !!id,
  });

  const { mutate } = useMutation({
    mutationFn: data.id ? updateResource : createResource,
    onSuccess: () => onOpenChange?.(false),
  });

  if (!resource) {
    throw new Error("Resource not found");
  }

  const fields = useFormFields(resource.form, !!id);

  const submit = async (data: Record<string, any>) => {
    const uploadData = new FormData();
    for (const field of fields) {
      if (field.type === "fileUpload") {
        const { file, previousFile, isDirty } = data[field.name];
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
        } else {
          data[field.name] = null;
        }
      }
    }

    if (!uploadData.entries().next().done) {
      await uploadFiles(uploadData);
    }

    return mutate({ resource: resource.resource, data });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? "Add new" : "Update"} item</DialogTitle>
        </DialogHeader>
        {isFetching ? (
          "Loading..."
        ) : (
          <Form
            fields={fields}
            validation={resource.rules}
            data={data}
            render={resource.renderForm}
            action={submit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
