import { OptionType } from "@/components/fancy-switch/types";
import { FormRender } from "@/components/form/form";
import { RepeaterRenderFunc } from "@/components/form/repeater";
import { Rules } from "@/validation";
import { JSX } from "react";
import { Option } from "@/components/multiple-selector";
import { CountryCode } from "libphonenumber-js";

interface BaseFormType {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  onChange?: any;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface MultiSelectOption {
  label: string;
  value: string;
  icon?: any;
}

export interface TableData {
  [key: string]: any;
}

interface TableHeader {
  name: string;
  header: string;
  enableSort?: boolean;
  enableHide?: boolean;
  render?: (data: TableData) => JSX.Element;
}

export interface InputType extends BaseFormType {
  type:
    | "text"
    | "textarea"
    | "number"
    | "email"
    | "color"
    | "hidden"
    | "password";
  color?: string;
  min?: number;
  max?: number;
}

export interface RichtextType extends BaseFormType {
  type: "richtext";
}

export interface CountrySelectType extends BaseFormType {
  type: "country-select";  
}

export interface TextAreaType extends BaseFormType {
  type: "textarea";
  rows?: number;
}

export interface SelectType extends BaseFormType {
  type: "select";
  options?: SelectOption[] | MultiSelectOption[];
}

export interface ForeignKeyType extends BaseFormType {
  type: "foreignKey";
  resource: PrismaModel;
  relation: string;
  renderLabel: (data: Record<string, any>) => string | JSX.Element;
  options?: SelectOption[] | MultiSelectOption[];
}

export interface MultiSelectType extends BaseFormType {
  type: "m2m-notused";
  options?: SelectOption[] | MultiSelectOption[];
  resource: PrismaModel;
  renderLabel: (data: Record<string, any>) => string | JSX.Element;
}

export interface MultipleSelectorType extends BaseFormType {
  type: "manyToMany";
  options?: Option[];
  resource: PrismaModel;
  renderLabel: (data: Record<string, any>) => string | JSX.Element;
}

export interface DatePickerType extends BaseFormType {
  type: "date-picker";
}

export interface CheckboxType extends BaseFormType {
  type: "checkbox";
}

export interface SwitchType extends BaseFormType {
  type: "switch";
}

export interface FancySwitchType extends BaseFormType {
  type: "fancy-switch";
  options: OptionType[];
}

export interface PhoneInputType extends BaseFormType {
  type: "phone-input";
  defaultCountry?: CountryCode;
}

export interface DateTimePickerType extends BaseFormType {
  type: "datetime-picker";
}

export interface UploadType extends BaseFormType {
  type: "upload";
  allowedTypes?: string[];
  maxSize?: number;
  uploadText?: string;
  onFileSelect?: (data: { file: File; thumbNail?: string }) => void;
}

/*export interface MediaUploadType extends BaseFormType {
  type: "media-upload";
  allowedTypes?: string[];
  maxSize?: number;
  maxFiles?: number;
  uploadText?: string;
  onFileSelect?: (data: { file: File; thumbNail?: string }) => void;
}*/

export interface RepeaterType extends BaseFormType {
  type: "repeater";
  fields: FormField[];
  render?: RepeaterRenderFunc;
}

type FormField =
  | InputType
  | TextAreaType
  | SelectType
  | SelectFilterType
  | ForeignKeyType
  | CheckboxType
  | DatePickerType
  | MultiSelectType
  | RichtextType
  | UploadType
  | RepeaterType
  | PhoneInputType
  | DateTimePickerType
  | SwitchType
  | FancySwitchType
  | MultipleSelectorType
  | CountrySelectType;

interface TextFilterType extends BaseFormType {
  type: "text";
}

interface NumberFilterType extends BaseFormType {
  type: "number";
}

interface DateFilterType extends BaseFormType {
  type: "date";
}

interface BooleanFilterType extends BaseFormType {
  type: "boolean";
}

export interface SelectFilterType extends BaseFormType {
  type: "select";
  fields: string[];
  search: string;
  resource: string;
  renderOption?: any;
  options?: { label: string; value: string }[];
}

export interface MultiSelectFilterType extends BaseFormType {
  type: "multi-select";
  fields: string[];
  search: string;
  resource: string;
  renderOption?: any;
  options?: { label: string; value: string }[];
}

export type FilterField =
  | BooleanFilterType
  | SelectFilterType
  | MultiSelectFilterType
  | DateFilterType
  | TextFilterType
  | NumberFilterType;

type Resource = {
  group?: string;
  name: string;
  name_plural: string;
  model: PrismaModel;
  resource: string;
  relations?: string[];
  rules: Rules;
  menuIcon: string;
  form: FormField[];
  renderForm?: FormRender;
  list: TableHeader[];
  filter: FilterField[];
  canAddItem?: boolean;
  canEditItem?: boolean;
};

type PrismaModel = any; // TODO

export type { Resource, FormField };
