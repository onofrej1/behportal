"use server";
import { sendTextEmail } from "@/lib/email";

export async function contactEmail(
  name: string,
  message: string
) {
  await sendTextEmail(process.env.CONTACT_EMAIL!, name, message);
}
