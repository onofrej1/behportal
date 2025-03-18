"use client";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import {
  ControllerRenderProps,  
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { CountryDropdown } from "../country-dropdown";

interface CountrySelectProps {
  placeholder?: string;
  label?: string;
  className?: string;
  field: ControllerRenderProps;
}

export default function CountrySelect(props: CountrySelectProps) {
  const { placeholder, label, field, className } = props;
  const { error } = useFormField();

  const Element = (
    <CountryDropdown
      {...field}
      placeholder={placeholder}
      onChange={(value) => field.onChange(value.alpha3)}
      defaultValue={field.value}
      className={cn(error && "text-destructive border-destructive", className)}
    />
  );

  if (!label) {
    return Element;
  }

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>{Element}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
