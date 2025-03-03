import { DeleteRowsProps } from "@/api";
import {
  useMutation as useBaseMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

export const useMutation = <T>(
  fn: any, // UseMutationOptions['mutationFn'], //(...args: any) => void, 
  success?: (data: unknown) => void, // UseMutationOptions['onSuccess'],
  error?: UseMutationOptions["onError"],
  invalidateKey?: string[],
  options?: UseMutationOptions
) => {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: fn, // async (...args: any[]) => fn?.(...args),
    onSuccess: (data) => {
      invalidateKey &&
        invalidateKey.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      success && success(data);
    },
    onError: error,
    retry: 1,
    ...options,
  });
};
