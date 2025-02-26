"use client";
import { ForeignKeyType, FormField, MultiSelectType } from "@/resources/resources.types";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

type RelationFormType = ForeignKeyType | MultiSelectType;

const getOptions = async (resource: string) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/resources/${resource}/options`;
  const response = await axios.get(url);

  return response.data;  
};

const getLabel = (field: RelationFormType, value: Record<string, any>) => {
  return field.renderLabel ? field.renderLabel(value) : value[field.textField!];
};

export function useFormFields(form: FormField[], hasId: boolean) {
  const idField: FormField = { name: 'id', type: 'hidden'};
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    async function getFields() {
      for (const field of form.filter((f) => ["fk", "m2m"].includes(f.type!)) as RelationFormType[]) {
        const options = await queryClient.fetchQuery({
          queryKey: [field.resource],
          queryFn: () => getOptions(field.resource),
        });

        field.options = options.map((value: any) => ({
          value: value.id,
          label: getLabel(field, value),
        }));
      }
      setFormFields(hasId ? [idField, ...form] : form);
    }
    getFields();
  }, []);

  return formFields;
}
