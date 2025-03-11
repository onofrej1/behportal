import { Resource } from "@/types/resources";
import { create } from "zustand";

interface ResourceProps {
  resource: Resource;
  setResource: (resource: Resource) => void;
}

/*export const useResource = create<ResourceProps>((set) => ({
  resource: {} as Resource,
  setResource: (resource: Resource) => set({ resource }),
}));*/
