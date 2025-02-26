"use client";
import React from "react";
import Form from "@/components/form/form";
import { resources } from "@/resources";
import { useFormFields } from "@/hooks/useFormFields";
import { deleteFile, uploadFiles } from "@/actions/files";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { baseUrl } from "@/constants";

interface ResourceFormProps {
  resource: string;
}

interface SaveResourceArgs {
  method: "post" | "patch";
  resource: string;
  data: any;
}

const saveResource = async (args: SaveResourceArgs) => {
  const { method, resource, data } = args;
  let url = `${baseUrl}/api/resources/${resource}`;
  if (method === 'patch') {
    url += `/${data.id}`;
    delete data.id;
  }
  return await axios[method](url, data);
};

const fetchResource = async (args: { resource: string, id: string, include?: string[] }) => {
  const { resource, id, include = [] } = args;
  if (!id) return {};

  const includeQuery = include.length > 0 ? `include=${include.join(',')}` : '';
  const url = `${baseUrl}/api/resources/${resource}/${id}?${includeQuery}`;
  const response = await axios.get(url);
  return response.data.data;
};

export default function ResourceForm(props: ResourceFormProps) {
  const { id } = useParams();
  const { resource: resourceName } = props;
  const router = useRouter();
  const resource = resources.find((r) => r.resource === resourceName);
  if (!resource) {
    return;
  }

  const { data } = useQuery({
    queryKey: ["fetchResource", resource.resource],
    queryFn: () => fetchResource({ resource: resource.resource, id: id as string, include: resource.relations }),
  });

  const { isPending, mutate } = useMutation({
    mutationFn: saveResource,
    onSuccess: (data) => {
      if (data.status === 200) {
        return router.push("/resource/" + resource?.resource);
      }
    },
  });

  if (!resource) {
    throw new Error("Resource not found");
  }

  const fields = useFormFields(resource.form, !!id);

  if (id && !data) {
    return;
  }

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
          //await deleteFile(previousFile.name);
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
    if (data?.id) {
      return mutate({ method: "patch", resource: resource.resource, data });
    } else {
      return mutate({ method: "post", resource: resource.resource, data });
    }
  };

  return (
    <div className="mx-auto">
      <Form
        fields={fields}
        validation={resource.rules}
        data={data}
        render={resource.renderForm}
        action={submit}
      />
    </div>
  );
}
