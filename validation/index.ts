import { z } from "zod";

const many2many = z
  .array(z.object({ value: z.number(), label: z.string() }))
  .transform((arr) => {
    return arr.map((v) => v.value);
  })
  .optional()
  .default([]);

const richText = z
  .object({ type: z.string(), content: z.array(z.any()) })
  .transform((obj) => {
    return JSON.stringify(obj);
  });

const stringValue = z.string().trim().min(1);
const numberValue = z.coerce.number();
const dateValue = z.coerce.date();

export const RegisterUser = z.object({
  firstName: stringValue,
  lastName: stringValue,
  email: z.string().email(),
  password: stringValue,
});

export const LoginUser = z.object({
  email: z.string().email(),
  password: z.string().min(2),
});

export const CreateCategory = z.object({
  id: z.number().optional(),
  title: stringValue,
});

export const CreateTag = z.object({
  id: z.number().optional(),
  title: stringValue,
});

export const CreatePost = z.object({
  id: z.number().optional(),
  title: stringValue,
  status: stringValue,
  content: richText,
  authorId: stringValue,
  categories: many2many,
  tags: many2many,
  cover: z.record(z.string(), z.any()).optional(), //z.string().optional().nullable(),
});

export const CreateEvent = z.object({
  id: z.number().optional(),
  name: stringValue,
  description: stringValue,
  status: stringValue,
  color: stringValue,
  location: z.string().optional(),
  venueId: z.coerce.number().nullable(),
  info: richText,
  eventTypeId: numberValue,
  organizerId: z.coerce.number().nullable(),
  maxAttendees: z.coerce.number().nullable(),
  startDate: dateValue,
  endDate: dateValue,
  resultsLink: z.string().nullable(),
  registrationLink: z.string().nullable(),
  galleriesLink: z.string().nullable(),
  eventUrl: z.string().nullable(),
});

export const CreateRun = z.object({
  id: z.number().optional(),
  title: stringValue,
  distance: numberValue,
  price: numberValue,
  elevation: numberValue,
  eventId: numberValue,
  runCategories: many2many,
});

export const CreateRegistration = z.object({
  id: z.number().optional(),
  firstName: stringValue,
  lastName: stringValue,
  dateOfBirth: dateValue,
  gender: z.enum(["MALE", "FEMALE"]),
  email: z.string().email(),

  runId: numberValue,
  nation: z.string().or(z.record(z.string(), z.any())),
  city: stringValue,
  club: stringValue,
  phone: stringValue,
});

export const CreateRunResult = z.array(
  z.object({
    id: z.number().optional(),
    name: stringValue,
    club: stringValue,
    category: stringValue,
    bib: stringValue,
    rank: numberValue,
    time: numberValue,
    gender: z.enum(["MALE", "FEMALE"]),
    yearOfBirth: numberValue,
    runId: numberValue,
  })
);

export const CreateRunCategory = z.object({
  id: z.number().optional(),
  category: stringValue,
  title: stringValue,
});

export const CreateVenue = z.object({
  id: z.number().optional(),
  location: stringValue,
});

export const CreateEventType = z.object({
  id: z.number().optional(),
  type: stringValue,
});

export const CreateOrganizer = z.object({
  id: z.number().optional(),
  name: stringValue,
});

export const ContactForm = z.object({
  name: stringValue,
  email: z.string().email(),
  message: stringValue,
  //myfiles: z.array(z.any()),
});

export const ResetPasswordRequest = z.object({
  email: z.string().email(),
});

export const ResetPassword = z.object({
  password: z.string().email(),
});

export const ChangePassword = z.object({
  password: stringValue,
  confirmPassword: stringValue,
});

export type Rules =
  | typeof RegisterUser
  | typeof LoginUser
  | typeof ChangePassword
  | typeof CreatePost
  | typeof CreateCategory
  | typeof CreateEvent
  | typeof CreateTag
  | typeof CreateRun
  | typeof CreateRunCategory
  | typeof CreateVenue
  | typeof CreateOrganizer
  | typeof CreateRegistration
  | typeof CreateRunResult
  | typeof ResetPasswordRequest
  | typeof ContactForm
  | typeof ResetPassword
  | typeof CreateEventType;

export type RegisterUserType = z.infer<typeof RegisterUser>;
export type LoginUserType = z.infer<typeof LoginUser>;
export type ChangePasswordType = z.infer<typeof ChangePassword>;
export type CreatePostType = z.infer<typeof CreatePost>;
export type CreateCategoryType = z.infer<typeof CreateCategory>;
export type CreateEventType = z.infer<typeof CreateEvent>;
export type CreateTagType = z.infer<typeof CreateTag>;
export type CreateRunType = z.infer<typeof CreateRun>;
export type CreateRunCategoryType = z.infer<typeof CreateRunCategory>;
export type CreateVenueType = z.infer<typeof CreateVenue>;
export type CreateOrganizerType = z.infer<typeof CreateOrganizer>;
export type CreateRegistrationType = z.infer<typeof CreateRegistration>;
export type CreateRunResultType = z.infer<typeof CreateRunResult>;
export type ResetPasswordRequestType = z.infer<typeof ResetPasswordRequest>;
export type ContactFormType = z.infer<typeof ContactForm>;
export type ResetPasswordType = z.infer<typeof ResetPassword>;
export type CreateEventTypeType = z.infer<typeof CreateEventType>;
