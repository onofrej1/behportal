import { request } from "@/api/request";

export interface DeleteRowsProps {
  resource?: string;
  rows: number[];
}

export const deleteResources = (props: DeleteRowsProps) =>
  request({
    url: `/resources/${props.resource}/delete`,
    method: "POST",
    data: props.rows,
  });
