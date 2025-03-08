"use client";

import * as React from "react";
import { ControllerRenderProps } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { DateTimePicker as DateTimePicker_ } from "../datetime-picker";

interface DateTimePickerProps {
  label?: string;
  className?: string;
  field: ControllerRenderProps;
}

export function DateTimePicker(props: DateTimePickerProps) {
  const { label, field, className } = props;

  const Element = (
    <DateTimePicker_
      value={field.value}
      onChange={field.onChange}
      className={className}
    />
  );

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>{Element}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
