import { z } from "zod";

/*const UpdateUserProfile = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(4),
  email: z.string().min(1)
});*/

const RegisterUser = z.object({
  firstName: z.string().trim().min(4),
  lastName: z.string().trim().min(4),
  email: z.string().email(),
  password: z.string().min(1),
});

const LoginUser = z.object({
  email: z.string().email(),
  password: z.string().min(2),
});

const CreateOrEditCategory = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(1),
});

const CreateOrEditTag = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(4),
});

const CreateOrEditPost = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(4),
  status: z.string().min(1),
  content: z.string().min(1),
  authorId: z.string().min(1, "Author field is required"),
  categories: z.array(z.coerce.number()).optional().default([]),
  tags: z.array(z.coerce.number()).optional().default([]),
  cover: z.any().optional().nullable(),
  //.transform((val) => val ? val : []),
});

const CreateEvent = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(4),
  description: z.string().min(1),
  status: z.string().min(1),
  color: z.string().min(1).optional(),
  location: z.string().optional(),
  venueId: z.coerce.number().nullable().optional(),
  organizerId: z.coerce.number().nullable().optional(),
  maxAttendees: z.coerce.number().optional(),
  startDate: z.date(),
  endDate: z.date(),
});

const CreateOrEditEvent = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(4),
  description: z.string().min(1),
  status: z.string().min(1),
  color: z.string().min(1),
  location: z.string().optional(),
  venueId: z.coerce.number().nullable(),
  organizerId: z.coerce.number().nullable(),
  maxAttendees: z.coerce.number().nullable(),
  startDate: z.date(),
  endDate: z.date(),
});

const CreateOrEditRun = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(4),
  distance: z.coerce.number(),
  price: z.coerce.number(),
  elevation: z.coerce.number(),
  eventId: z.coerce.number(),
  runCategories: z.array(z.coerce.number()).optional().default([]),
});

const CreateRegistration = z.object({
  id: z.number().optional(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  dateOfBirth: z.coerce.date(),
  gender: z.enum(["MAN", "WOMAN"]),
  email: z.string().email(),

  runId: z.coerce.number(),
  nation: z.string().trim().min(1),
  city: z.string().trim().min(1),
  club: z.string().trim().min(1),
  phone: z.string().trim().min(1),
});

const CreateRunResult = z.array(
  z.object({
    id: z.number().optional(),
    name: z.string().trim().min(1),
    club: z.string().trim().min(1),
    category: z.string().trim().min(1),
    bib: z.coerce.number(),
    rank: z.coerce.number(),
    time: z.coerce.number(),
    gender: z.enum(["MALE", "FEMALE"]),
    yearOfBirth: z.coerce.number(),
    runId: z.coerce.number(),
  })
);

const CreateOrEditRunCategory = z.object({
  id: z.number().optional(),
  category: z.string().trim().min(1),
  title: z.string().trim().min(4),
});

const CreateOrEditVenue = z.object({
  id: z.number().optional(),
  location: z.string().trim().min(1),
});

const CreateOrEditOrganizer = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(4),
});

const ContactForm = z.object({
  name: z.string().trim().min(1),
  email: z.string().email(),
  message: z.string().trim().min(4),
  myfiles: z.array(z.any()),
});

const ResetPasswordRequest = z.object({
  email: z.string().email(),
});

const ChangePassword = z.object({
  password: z.string().min(3),
  confirmPassword: z.string().min(3),
});

const CreatePost = z.object({
  content: z.string().min(3),
});

export type FormSchema =
  | "LoginUser"
  | "RegisterUser"
  | "CreateOrEditPost"
  | "CreateOrEditCategory"
  | "CreateOrEditTag"
  | "CreateOrEditEvent"
  | "CreateOrEditRun"
  | "CreateOrEditRunCategory"
  | "CreateOrEditVenue"
  | "CreateOrEditOrganizer"
  | "FilterResource"
  | "CreateRegistration"
  | "CreateRunResult"
  | "ContactForm"
  | "ResetPasswordRequest"
  | "ChangePassword"
  | "ResetPassword"
  | "CreateEvent"
  | "CreatePost";

const rules = {
  RegisterUser,
  LoginUser,
  ChangePassword,
  CreateOrEditPost,
  CreateOrEditCategory,
  CreateOrEditEvent,
  CreateOrEditTag,
  CreateEvent,
  CreateOrEditRun,
  CreateOrEditRunCategory,
  CreateOrEditVenue,
  CreateOrEditOrganizer,
  CreateRegistration,
  CreateRunResult,
  ResetPasswordRequest,
  ContactForm,
  //UpdateUserProfile,
  FilterResource: z.any(),
  CreatePost,
};

export default rules;

export type RegisterUserType = z.infer<typeof RegisterUser>;
export type LoginUserType = z.infer<typeof LoginUser>;
export type ContactForm = z.infer<typeof ContactForm>;