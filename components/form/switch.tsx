"use client";

import { Switch as Switch_ } from "@/components/ui/switch";
import { ControllerRenderProps } from "react-hook-form";
import { FormControl, FormLabel, FormMessage } from "../ui/form";

interface SwitchProps {
  label?: string;
  className?: string;
  field: ControllerRenderProps;
}

export default function Switch({ label, className, field }: SwitchProps) {
  const Element = (
    <Switch_
      checked={field.value}
      onCheckedChange={field.onChange}
      className={className}
      {...field}
    />
  );

  if (!label) {
    return Element;
  }

  return (
    <div className="flex items-center space-x-2">
      <FormControl>{Element}</FormControl>
      <FormLabel>{label}</FormLabel>
      <FormMessage />
    </div>
  );
}
