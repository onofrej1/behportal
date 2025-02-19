"use client";

import { ControllerRenderProps } from "react-hook-form";
//import MDEditor from "@uiw/react-md-editor";
//import Editor from "../rich-text/editor";
import { MinimalTiptapEditor } from "../minimal-tiptap";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";

interface RichEditorProps {
  label?: string;
  className?: string;
  field: ControllerRenderProps;
}

export default function RichEditor({ label, field }: RichEditorProps) {
  // <Editor content={value} onChange={onChange} />

  const Element = (
    <MinimalTiptapEditor
      value={field.value}
      onChange={field.onChange}
      className="w-full"
      editorContentClassName="p-5"
      output="html"
      placeholder="Enter your description..."
      autofocus={true}
      editable={true}
      editorClassName="focus:outline-none"
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
