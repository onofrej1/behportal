"use client";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";
import { cn } from "@/lib/utils";
import { PhoneInput as PhoneInput_ } from "@/components/phone-input";

interface PhoneInputProps {
  placeholder?: string;
  label?: string;
  className?: string;
  field: ControllerRenderProps;
}

export default function PhoneInput(props: PhoneInputProps) {
  const { placeholder, label, field, className } = props;
  const { error } = useFormField();

  const Element = (
    <PhoneInput_
      {...field}
      placeholder={placeholder}
      className={cn(error && "text-destructive", className)}
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
