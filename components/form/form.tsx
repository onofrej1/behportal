"use client";
import {
  FormState,
  useForm,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSX, useEffect } from "react";
import {
  PhoneInputType,
  FormField as FormField_,
  MultipleSelectorType,
  RepeaterType,
  SelectType,
  TextAreaType,
} from "@/types/resources";
import { Rules } from "@/validation";
import FormInput from "@/components/form/input";
import FormSelect from "@/components/form/select";
import FormCheckbox from "@/components/form/checkbox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Textarea from "./textarea";
import RichEditor from "./richeditor";
import FileUploader from "./file-uploader";
import RepeaterInput from "./repeater";
import { urlToFile } from "@/lib/utils";
import { Form, FormField } from "@/components/ui/form";
import PhoneInput from "@/components/form/phone-input";
import { DateTimePicker } from "./datetime-picker";
import Switch from "./switch";
import FancySwitch from "./fancy-switch";
import { MultipleSelector } from "./multiple-selector";
import { z } from "zod";
import CountrySelect from "./country-select";

export interface DefaultFormData {
  [key: string]: any;
}

export type actionResult = {
  redirect?: string;
  message?: string;
  error?: { path: string; message: string };
};

export type FormRenderProps = {
  fields: Record<string, JSX.Element>;
  formState: FormState<DefaultFormData>;
  getValues: UseFormGetValues<DefaultFormData>;
  setValue: UseFormSetValue<DefaultFormData>;
  trigger: UseFormTrigger<DefaultFormData>;
};

export type FormRender = (props: FormRenderProps) => JSX.Element;

interface FormProps {
  fields: FormField_[];
  validation?: Rules;
  data?: DefaultFormData;
  action?: (...args: any[]) => any;
  buttons?: ((props: Partial<FormState<DefaultFormData>>) => JSX.Element)[];
  render?: FormRender;
  children?: FormRender;
}

export default function Form_({
  fields,
  validation,
  data,
  action,
  buttons,
  render,
  children,
}: FormProps) {
  const { replace } = useRouter();

  const defaultData = data;

  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver((validation as any) || z.any()),
    defaultValues: defaultData,
  });

  useEffect(() => {
    if (data) {
      const m2mFields = fields.filter((f) => f.type === "manyToMany");
      for (const field of m2mFields) {
        const selectValue = data[field.name as keyof typeof data].map(
          (value: { id: string }) => {
            const option = field.options?.find((o) => o.value === value.id);
            return { label: option?.label, value: value.id };
          }
        );
        data![field.name] = selectValue;
      }
      form.reset(data);
    }
  }, [data]);

  useEffect(() => {
    async function setUploads(uploadFields: FormField_[]) {
      for (const field of uploadFields) {
        const value = data![field.name];
        const uploadPath = process.env.NEXT_PUBLIC_UPLOAD_DIR;
        if (value) {
          const file = await urlToFile(
            uploadPath + "/" + value,
            value,
            "image/png"
          );
          const v = { file, previousFile: file, isDirty: false };
          form.setValue(field.name, v);
        }
      }
    }
    const uploadFields = fields.filter((f) => f.type === "upload");
    if (data && uploadFields) {
      setUploads(uploadFields);
    }
  }, [fields]);

  const { isValid, errors, isLoading } = form.formState;

  if (errors && Object.keys(errors).length > 0) {
    console.log("errors", errors);
  }

  const submitForm = async (data: unknown) => {
    if (!action) return;

    try {
      const response: actionResult = await action(data);
      if (!response) {
        return;
      }
      if (response.message) {
        toast(response.message);
      }
      if (response.error) {
        form.setError(response.error.path, {
          message: response.error.message,
        });
      }
      if (response.redirect) {
        replace(response.redirect);
        return;
      }
    } catch (e) {
      console.log(e);
      return "An error occured";
    }
  };

  const renderField = (formField: FormField_) => {
    const type = formField.type;
    const label = formField.label;
    const className = formField.className;

    return (
      <>
        {["text", "number", "email", "hidden"].includes(type) && (
          <FormField
            control={form.control}
            name={formField.name}
            render={({ field }) => (
              <FormInput
                field={field}
                label={label}
                className={className}
                type={type}
              />
            )}
          />
        )}

        {type === "textarea" && (
          <FormField
            control={form.control}
            name={formField.name}
            render={({ field }) => (
              <Textarea
                field={field}
                label={label}
                className={className}
                rows={(formField as TextAreaType).rows}
              />
            )}
          />
        )}

        {type === "checkbox" && (
          <>
            <FormField
              control={form.control}
              name={formField.name}
              render={({ field }) => (
                <FormCheckbox
                  field={field}
                  label={label}
                  className={className}
                />
              )}
            />
          </>
        )}

        {type === "switch" && (
          <>
            <FormField
              control={form.control}
              name={formField.name}
              render={({ field }) => (
                <Switch field={field} label={label} className={className} />
              )}
            />
          </>
        )}

        {type === "fancy-switch" && (
          <>
            <FormField
              control={form.control}
              name={formField.name}
              render={({ field }) => (
                <FancySwitch
                  field={field}
                  label={label}
                  options={formField.options}
                  className={className}
                />
              )}
            />
          </>
        )}

        {type === "date-picker" && (
          <>
            <FormField
              control={form.control}
              name={formField.name}
              render={({ field }) => (
                <>
                  <DateTimePicker
                    granularity="day"
                    label={label}
                    field={field}
                    className={className}
                  />
                  {/*<DatePicker label={label} field={field} className={className} />*/}
                </>
              )}
            />
          </>
        )}

        {type === "country-select" && (
          <>
            <FormField
              control={form.control}
              name={formField.name}
              render={({ field }) => (
                <>
                  <CountrySelect
                    label={label}
                    field={field}
                    className={className}
                  />
                </>
              )}
            />
          </>
        )}

        {["select", "foreignKey"].includes(type) && (
          <FormField
            control={form.control}
            name={formField.name}
            render={({ field }) => (
              <FormSelect
                label={label}
                field={field}
                className={className}
                options={(formField as SelectType).options!}
              />
            )}
          />
        )}

        {["manyToMany"].includes(type) && (
          <FormField
            control={form.control}
            name={formField.name}
            render={({ field }) => {
              return (
                <>
                  <MultipleSelector
                    field={field}
                    label={label}
                    className={className}
                    options={(formField as MultipleSelectorType).options!}
                  />
                </>
              );
            }}
          />
        )}

        {["richtext"].includes(type) && (
          <FormField
            control={form.control}
            name={formField.name}
            render={({ field }) => <RichEditor field={field} label={label} />}
          />
        )}

        {["upload"].includes(type) && (
          <FormField
            control={form.control}
            name={formField.name}
            render={({ field }) => (
              <FileUploader
                field={field}
                allowedTypes={["image/png", "image/jpeg", "video/mp4"]}
              />
            )}
          />
        )}

        {type === "phone-input" && (
          <FormField
            control={form.control}
            name={formField.name}
            render={({ field }) => (
              <PhoneInput
                label={label}
                field={field}
                className={className}
                defaultCountry={(formField as PhoneInputType).defaultCountry}
              />
            )}
          />
        )}

        {type === "datetime-picker" && (
          <FormField
            control={form.control}
            name={formField.name}
            render={({ field }) => (
              <DateTimePicker
                granularity="second"
                label={label}
                field={field}
                className={className}
              />
            )}
          />
        )}

        {["repeater"].includes(type) && (
          <FormField
            control={form.control}
            name={formField.name}
            render={({ field }) => (
              <RepeaterInput
                control={form.control}
                field={field}
                label={label}
                unregister={form.unregister}
                fields={(formField as RepeaterType).fields}
                render={(formField as RepeaterType).render}
                renderField={renderField}
              />
            )}
          />
        )}
      </>
    );
  };

  const fieldsToRender = fields.reduce((acc, field) => {
    acc[field.name] = renderField(field);
    return acc;
  }, {} as Record<string, JSX.Element>);

  if (children) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)}>
          {children({
            fields: fieldsToRender,
            ...form,
          })}
        </form>
      </Form>
    );
  }

  if (render) {
    const Content = render({
      fields: fieldsToRender,
      ...form,
    });
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)}>{Content}</form>
      </Form>
    );
  }

  const fieldNames = fields.map((f) => f.name);
  const commonErrorMessages = Object.keys(errors).filter(
    (e) => !fieldNames.includes(e)
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)}>
        {fields.map((field) => (
          <div className="mb-3" key={field.name}>
            {renderField(field)}
          </div>
        ))}

        {commonErrorMessages.map((e) => (
          <div className="my-4" key={e}>
            {errors[e]?.message?.toString()}
          </div>
        ))}

        {buttons?.length ? (
          <div className="flex space-x-2">
            {buttons.map((Button, index) => (
              <Button key={index} isValid={isValid} isLoading={isLoading} />
            ))}
          </div>
        ) : (
          <Button type="submit" className="mt-3">
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
}
