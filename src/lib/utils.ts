import { QueryClient } from "@tanstack/react-query";
import { clsx, type ClassValue } from "clsx";
import { cache } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getQueryClient = cache(() => new QueryClient());

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
