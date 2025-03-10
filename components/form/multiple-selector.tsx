"use client";

import * as React from "react";
import { ControllerRenderProps } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import MultipleSelector_, { Option } from "../multiple-selector";

interface MultipleSelectorProps {
  label?: string;
  options: Option[];
  className?: string;
  field: ControllerRenderProps;
}

export function MultipleSelector(props: MultipleSelectorProps) {
  const { label, options, field, className } = props;
  
  const Element = (
    <MultipleSelector_
      value={field.value}
      onChange={field.onChange}
      className={className}
      defaultOptions={options}
      placeholder="Select frameworks you like..."
      emptyIndicator={
        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
          no results found.
        </p>
      }
    />
  );

  if (!label) {
    return Element;
  }

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div>{Element}</div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
