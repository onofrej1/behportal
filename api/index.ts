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
    data: { id, ...data },
  } = props;

  return request({
    url: `/resources/${resource}/${id}`,
    method: "PATCH",
    data,
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
  const { filters, take, skip, sort, joinOperator, include } = data;

  const params = {
    take,
    skip,
    sort,
    include,
    joinOperator
  };
  const searchParams = new URLSearchParams(params);

  const filtersQuery = filters ? `&filters=${filters}` : "";

  return request({
    url: `/resources/${resource}?${searchParams.toString()}${filtersQuery}`,
    method: "GET",
    data,
  });
};

export const getOptions = (resource: string) =>
  request({
    url: `/resources/${resource}/options`,
    method: "GET",
  });

export type MutationFunction = typeof updateResource | typeof createResource;

