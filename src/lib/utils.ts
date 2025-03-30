import { clsx, type ClassValue } from "clsx";
import { notFound } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function htmlToTextDOMParser(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html"); // 'text/html' is critical
  return doc.body.textContent || ""; //  Return empty string if body is null
}

export const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      const error = new Error("An error occurred while fetching the data.");
      throw error;
    }
    return res.json();
  });

export const uuidV4Schema = z.string().uuid("Invalid UUID format");

export function validateUUID(id: string) {
  const result = uuidV4Schema.safeParse(id);
  if (!result.success) {
    notFound();
  }
  return result.data;
}
