"use client";
import React from "react";
import Form from "@/components/form/form";
import { useFormFields } from "@/hooks/useFormFields";
import { deleteFile, uploadFiles } from "@/actions/files";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createResource, getResource, updateResource } from "@/api";
import { useResource } from "@/state";

interface ResourceFormDialogProps {
  id?: string;
  open: boolean;
  onOpenChange?(open: boolean): void;
}

export default function ResourceFormDialog(props: ResourceFormDialogProps) {
  const { id, open, onOpenChange } = props;
  const queryClient = useQueryClient();

  const {
    resource: { resource, relations, form, rules, renderForm },
  } = useResource();

  const { isFetching, data } = useQuery({
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
        queryKey: ['getResourceData', resource]
      })
    },
  });

  const fields = useFormFields(form, !!id);

  const submit = async (data: Record<string, any>) => {
    const uploadData = new FormData();
    for (const field of fields.filter((f) => f.type === "fileUpload")) {
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

    if (!uploadData.entries().next().done) {
      await uploadFiles(uploadData);
    }
    mutate({ resource, data });
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
            validation={rules}
            data={data}
            render={renderForm}
            action={submit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
