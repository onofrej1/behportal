"use client";
import { baseUrl } from "@/constants";
import {
  ForeignKeyType,
  FormField,
  MultiSelectType,
} from "@/resources/resources.types";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

type RelationFormType = ForeignKeyType | MultiSelectType;

const getOptions = async (resource: string, fields: string[]) => {
  const select = `select=${fields.join(",")}`;
  const url = `${baseUrl}/api/resources/${resource}/options?${select}`;
  const response = await axios.get(url);

  return response.data;
};

const getLabel = (field: RelationFormType, row: Record<string, any>) => {
  const titleField = field.fields.find((f) => f !== "id");
  return field.renderLabel ? field.renderLabel(row) : row[titleField!];
};

export function useFormFields(form: FormField[], hasId: boolean) {
  const idField: FormField = { name: "id", type: "hidden" };
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    async function getFields() {
      const relations = form.filter((f) => ["fk", "m2m"].includes(f.type!));
      for (const field of relations as RelationFormType[]) {
        const options = await queryClient.fetchQuery({
          queryKey: [field.resource],
          queryFn: () => getOptions(field.resource, field.fields),
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
