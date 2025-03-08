"use client";
import { getSession } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useSession() {
  const { data: session, isFetching } = useQuery({
    queryKey: ["getSession"],
    queryFn: getSession,
  });
  return {
    isFetching,
    user: {
      ...session?.user,
      role: session?.role,
    },
  };
}
