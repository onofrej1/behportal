"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { renderError } from "./utils";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@hookform/error-message";
import { ControllerRenderProps } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";

interface DatePickerProps {
  label?: string;
  className?: string;
  field: ControllerRenderProps;
}

export function DatePicker(props: DatePickerProps) {
  const { label, field, className } = props;

  const Element = (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal w-full",
            !field.value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon />
          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          //initialFocus
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>{Element}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
