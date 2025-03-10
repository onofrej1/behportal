"use client";
import { getOptions } from "@/api";
import { baseUrl } from "@/constants";
import {
  ForeignKeyType,
  FormField,
  MultipleSelectorType,
} from "@/types/resources";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type RelationFormType = ForeignKeyType | MultipleSelectorType;

export function useFormFields(form: FormField[], hasId: boolean) {
  const [fields, setFields] = useState<FormField[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    async function getFields() {
      const relations = form.filter((f) =>
        ["foreignKey", "manyToMany"].includes(f.type!)
      );
      for (const field of relations as RelationFormType[]) {
        const options = await queryClient.fetchQuery({
          queryKey: [field.resource],
          queryFn: () => getOptions(field.resource),
        });

        field.options = options.map((value: any) => ({
          value: value.id,
          label: field.renderLabel(value),
        }));
      }
      const idField: FormField = { name: "id", type: "hidden" };

      setFields(hasId ? [idField, ...form] : form);
    }
    getFields();
  }, []);

  return { fields };
}
