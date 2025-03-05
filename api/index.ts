import { request } from "@/api/request";

type DeleteResourceProps = {
  resource: string;
  id: number;
};

export const deleteResource = (props: DeleteResourceProps) =>
  request({
    url: `/resources/${props.resource}/${props.id}`,
    method: "DELETE",
  });

type DeleteResourcesProps = {
  resource?: string;
  rows: number[];
};

export const deleteResources = (props: DeleteResourcesProps) =>
  request({
    url: `/resources/${props.resource}/delete`,
    method: "POST",
    data: props.rows,
  });

type SaveResourceProps = {
  resource: string;
  data: any;
};

export const createResource = (props: SaveResourceProps) => {
  const { resource, data } = props;

  return request({
    url: `/resources/${resource}`,
    method: "POST",
    data,
  });
};

export const updateResource = (props: SaveResourceProps) => {
  const {
    resource,
    data: { id, ...saveData },
  } = props;

  return request({
    url: `/resources/${resource}/${id}`,
    method: "PATCH",
    data: saveData,
  });
};

type GetResourceProps = {
  resource: string;
  id?: string;
  include?: string[];
};

export const getResource = (props: GetResourceProps) => {
  const { id, resource, include = [] } = props;
  const query = include.length > 0 ? `?include=${include.join(",")}` : "";

  return request({
    url: `/resources/${resource}/${id}${query}`,
    method: "GET",
  });
};

export const getSession = () =>
  request({
    url: `/session`,
    method: "GET",
  });

type GetResourceDataProps = {
  resource?: string;
  data: any;
};

export const getResourceData = (props: GetResourceDataProps) => {
  const { resource, data } = props;
  const { where, filters, ...rest } = data;

  const whereQuery = new URLSearchParams(rest);
  const query = filters
    ? `filters=${filters}`
    : new URLSearchParams(whereQuery);

  return request({
    url: `/resources/${resource}?${query}`,
    method: "GET",
    data,
  });
};

type GetOptionsProps = {
  resource: string;
  fields: string[];
};

export const getOptions = (props: GetOptionsProps) => {
  const query = `?select=${props.fields.join(",")}`;

  return request({
    url: `/resources/${props.resource}/options${query}`,
    method: "GET",
  });
};
