import { z } from "zod";

export const RegisterUser = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().email(),
  password: z.string().min(1),
});

export const LoginUser = z.object({
  email: z.string().email(),
  password: z.string().min(2),
});

export const CreateCategory = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(1),
});

export const CreateTag = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(1),
});

export const CreatePost = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(1),
  status: z.string().min(1),
  content: z.string().min(1),
  authorId: z.string().min(1),
  categories: z
    .array(z.object({ value: z.number(), label: z.string() }))
    .transform((arr) => {
      return arr.map((v) => v.value);
    })
    .optional()
    .default([]),
  tags: z
    .array(z.object({ value: z.number(), label: z.string() }))
    .transform((arr) => {
      return arr.map((v) => v.value);
    })
    .optional()
    .default([]),
  cover: z.string().optional().nullable(),
});

export const CreateEvent = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(1),
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

export const CreateRun = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(1),
  distance: z.coerce.number(),
  price: z.coerce.number(),
  elevation: z.coerce.number(),
  eventId: z.coerce.number(),
  runCategories: z
    .array(z.object({ value: z.number(), label: z.string() }))
    .transform((arr) => {
      return arr.map((v) => v.value);
    })
    .optional()
    .default([]),
});

export const CreateRegistration = z.object({
  id: z.number().optional(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  dateOfBirth: z.coerce.date(),
  gender: z.enum(["MALE", "FEMALE"]),
  email: z.string().email(),

  runId: z.coerce.number(),
  nation: z.string().or(z.record(z.string(), z.any())),
  city: z.string().trim().min(1),
  club: z.string().trim().min(1),
  phone: z.string().trim().min(1),
});

export const CreateRunResult = z.array(
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

export const CreateRunCategory = z.object({
  id: z.number().optional(),
  category: z.string().trim().min(1),
  title: z.string().trim().min(1),
});

export const CreateVenue = z.object({
  id: z.number().optional(),
  location: z.string().trim().min(1),
});

export const CreateEventType = z.object({
  id: z.number().optional(),
  type: z.string().trim().min(1),
});

export const CreateOrganizer = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(1),
});

export const ContactForm = z.object({
  name: z.string().trim().min(1),
  email: z.string().email(),
  message: z.string().trim().min(1),
  myfiles: z.array(z.any()),
});

export const ResetPasswordRequest = z.object({
  email: z.string().email(),
});

export const ResetPassword = z.object({
  password: z.string().email(),
});

export const ChangePassword = z.object({
  password: z.string().min(1),
  confirmPassword: z.string().min(1),
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
