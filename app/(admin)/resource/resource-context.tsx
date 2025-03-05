'use client'
import { Resource } from "@/resources/resources.types";
import React, {
  Context,
  createContext,
  useContext as useReactContext,
  useState,
} from "react";

const ResourceContext = createContext<
  | {
      resource: Resource | undefined;
      setResource: React.Dispatch<React.SetStateAction<Resource | undefined>>;
    }
  | undefined
>(undefined);

const ResourceProvider = ({ children }: React.PropsWithChildren) => {
  const [resource, setResource] = useState<Resource | undefined>();

  return (
    <ResourceContext value={{ resource, setResource }}>
      {children}
    </ResourceContext>
  );
};

const useContext = <T extends Record<string, unknown>>(
  context: Context<T | undefined>
): T => {
  const value = useReactContext(context);

  if (value == null) {
    throw new Error(
      'The "useContext" hook must be used within the corresponding context "Provider"'
    );
  }

  return value;
};

export { ResourceContext, ResourceProvider, useContext };
