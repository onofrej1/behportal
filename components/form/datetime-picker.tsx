"use client";

import * as React from "react";
import { ControllerRenderProps } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import {
  DateTimePicker as DateTimePicker_,
} from "../datetime-picker";

type Granularity = "day" | "hour" | "minute" | "second";

interface DateTimeProps {
  label?: string;
  className?: string;
  field: ControllerRenderProps;
  granularity: Granularity;
}

export function DateTimePicker(props: DateTimeProps) {
  const { label, field, className, granularity = "second" } = props;
  const value = field.value;

  React.useEffect(() => {
    if (value && typeof value === "string") {
      field.onChange(new Date(value));
    }
  }, [value]);

  const Element = (
    <DateTimePicker_
      granularity={granularity}
      value={new Date(value)}
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
