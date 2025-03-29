"use client";
import React, { useEffect } from "react";
import Form from "@/components/form/form";
import { useRelationFields } from "@/hooks/resources/use-relation-fields";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createResource, getResource, updateResource } from "@/api";
import { ResourceContext, useContext } from "@/app/resource-context";
import { useSubmitForm } from "@/hooks/resources/use-submit-form";

interface ResourceFormDialogProps {
  id?: string;
  open: boolean;
  onOpenChange?(open: boolean): void;
}

export default function ResourceFormDialog(props: ResourceFormDialogProps) {
  const { id, open, onOpenChange } = props;
  
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

  const { fields, data: formData } = useRelationFields(form, data);
  const { submitForm, status } = useSubmitForm(resource, fields, data?.id ? updateResource : createResource);

  useEffect(() => {
    if (status === 'success') {
      onOpenChange?.(false);
    }
  }, [status])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-y-scroll h-[calc(100vh-30px)] my-auto min-w-fitXXX min-w-[700px]">
        <DialogHeader>
          <DialogTitle>{id ? "Update" : "Add new"} item</DialogTitle>
        </DialogHeader>
        <Form
          fields={fields}
          validation={rules}
          data={formData}
          render={renderForm}
          action={submitForm}
        />
      </DialogContent>
    </Dialog>
  );
}
