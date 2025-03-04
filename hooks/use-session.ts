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
      user: session?.user,
      userId: session?.userId,
      role: session?.role,
    },
  };
}
