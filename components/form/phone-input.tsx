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
import { CountryCode } from "libphonenumber-js";

interface PhoneInputProps {
  placeholder?: string;
  label?: string;
  className?: string;
  defaultCountry?: CountryCode;
  field: ControllerRenderProps;
}

export default function PhoneInput(props: PhoneInputProps) {
  const { placeholder, defaultCountry, label, field, className } = props;
  const { error } = useFormField();

  const Element = (
    <PhoneInput_
      {...field}
      defaultCountry={defaultCountry}
      placeholder={placeholder}
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
