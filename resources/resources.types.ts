import { FormRender } from "@/components/form/form";
import { RepeaterRenderFunc } from "@/components/form/repeater";
import { TableHeader } from "@/components/table/table";
import { FormSchema } from "@/validation";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface MultiSelectOption {
  label: string;
  value: string;
  icon?: any;
}

interface BaseFormType {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  onChange?: any;
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

export interface TextAreaType extends BaseFormType {
  type: "textarea";
  rows?: number;
}

export interface SelectType extends BaseFormType {
  type: "select";
  options?: SelectOption[] | MultiSelectOption[];
}

export interface SelectFilterType extends BaseFormType {
  type: "select-filter";
  textField?: string;
  search?: string;
  options?: { label: string; value: string }[];
}

export interface ForeignKeyType extends BaseFormType {
  type: "fk";
  resource: PrismaModel;
  relation: string;
  textField?: string;
  renderLabel?: any;
  options?: SelectOption[] | MultiSelectOption[];
}

export interface MultiSelectType extends BaseFormType {
  type: "m2m";
  options?: SelectOption[] | MultiSelectOption[];
  resource: PrismaModel;
  renderLabel?: any;
  textField: string;
}

export interface DatePickerType extends BaseFormType {
  type: "datepicker";
}

export interface CheckboxType extends BaseFormType {
  type: "checkbox";
}

export interface FileUploadType extends BaseFormType {
  type: "fileUpload";
  allowedTypes?: string[];
  maxSize?: number;
  uploadText?: string;
  onFileSelect?: (data: { file: File; thumbNail?: string }) => void;
}

export interface MediaUploaderType extends BaseFormType {
  type: "mediaUploader";
  allowedTypes?: string[];
  maxSize?: number;
  maxFiles?: number;
  uploadText?: string;
  onFileSelect?: (data: { file: File; thumbNail?: string }) => void;
}

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
  | FileUploadType
  | MediaUploaderType
  | RepeaterType;

type Resource = {
  group?: string;
  name: string;
  name_plural: string;
  model: PrismaModel;
  resource: string;
  relations?: string[];
  rules: FormSchema;
  menuIcon: string;
  form: FormField[];
  renderForm?: FormRender;
  list: TableHeader[];
  filter: FormField[];
  canAddItem?: boolean;
  canEditItem?: boolean;
};

type PrismaModel =
  | "user"
  | "post"
  | "category"
  | "task"
  | "event"
  | "attendee"
  | "eventSchedule"
  | "tag"
  | "run"
  | "runCategory"
  | "venue"
  | "organizer"
  | "activity"
  | "runResult"
  | "registration"
  | "project";

export type { Resource, FormField, PrismaModel };
