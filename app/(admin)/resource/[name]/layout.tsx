"use client";

import { ResourceProvider } from "@/app/resource-context";
//import { FeatureFlagsProvider } from "./_components/feature-flags-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ResourceProvider>
      {children}
    </ResourceProvider>
  );
}
