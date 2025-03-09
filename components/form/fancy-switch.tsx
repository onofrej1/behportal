"use client";

//import { FancySwitch as FancySwitch_ } from "@/components/fancy-switch";
import { ControllerRenderProps } from "react-hook-form";
import { FormControl, FormLabel, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";
import { OptionType } from "../fancy-switch/types";
import { FancySwitch as FancySwitch_ } from "@omit/react-fancy-switch";

interface SwitchProps {
  label?: string;
  className?: string;
  options: OptionType[];
  field: ControllerRenderProps;
}

export default function FancySwitch(props: SwitchProps) {
  const { label, className, options, field } = props;

  const Element = (
    <FancySwitch_
      {...field}
      options={options}
      className="flex rounded-full bg-muted p-2"
      //highlighterClassName="bg-primary rounded-full"
      //radioClassName="relative mx-2 flex h-9 cursor-pointer items-center justify-center rounded-full px-3.5 text-sm font-medium transition-colors focus:outline-none data-[checked]:text-primary-foreground"
      //highlighterIncludeMargin={true}
      //highlighterStyle={{ backgroundColor: "blue", borderRadius: "8px" }}
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
