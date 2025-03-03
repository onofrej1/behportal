import {
  useQuery as useBaseQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

export const useQuery = (
  key: UseQueryOptions["queryKey"],
  fn: UseQueryOptions["queryFn"],
  options: Omit<UseQueryOptions, "queryKey">
) =>
  useBaseQuery({
    queryKey: key,
    queryFn: fn,
    ...options,
  });
