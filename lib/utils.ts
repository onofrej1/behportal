import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

type ErrorWithMessage = {
  message: string;
};

export function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    // this is important
    video.autoplay = true;
    video.muted = true;
    video.src = URL.createObjectURL(file);

    video.onloadeddata = () => {
      let ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      video.pause();
      return resolve(canvas.toDataURL("image/png"));
    };
  });
}

export function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
  return str;
}

export async function urlToFile(
  url: string,
  filename: string,
  mimeType: "image/png"
) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return new File([buffer], filename, { type: mimeType });
}

export function formatDate(date: string | Date, dateFormat?: string) {
  if (dateFormat) {
    return format(date instanceof Date ? date : new Date(date), dateFormat);
  }
  if (date instanceof Date) {
    return date.toLocaleDateString();
  }
  return new Date(date).toLocaleDateString();
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

export const capitalize = (s: string) =>
  s && String(s[0]).toUpperCase() + String(s).slice(1);

export const parseCsv = (content: string, requiredHeaders: string[]) => {
  const lines = content.split("\n").filter(Boolean);
  const csvArray = [];

  const header = lines.shift();
  const headers = header?.split(",");

  const hasAllHeaders = requiredHeaders.every((header) =>
    headers?.includes(header)
  );
  if (!headers || !hasAllHeaders) {
    throw new Error("Missing headers");
  }

  for (const line of lines) {
    const splitLine = line.split(",");
    const record: Record<string, any> = {};
    headers.forEach((key, index) => {
      record[key] = splitLine[index].trim();
    });
    csvArray.push(record);
  }
  return csvArray;
};

export const hmsToSeconds = (hms: string) => {
  const a = hms.split(":");
  const seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];

  return seconds;
};

