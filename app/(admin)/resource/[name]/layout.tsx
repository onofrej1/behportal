"use client";

import { ResourceProvider } from "@/app/resource-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ResourceProvider>{children}</ResourceProvider>;
}
