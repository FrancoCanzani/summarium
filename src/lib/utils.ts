import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { redirect } from "next/navigation";
import { journalDateSchema, uuidV4Schema } from "./schemas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function htmlToTextDOMParser(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
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

export function validateUUID(id: string) {
  const result = uuidV4Schema.safeParse(id);

  return result;
}

export function validateDateParam(
  dateParam: string | undefined | null,
  redirectPath: string = "/journal",
) {
  if (!dateParam) {
    const today = new Date().toISOString().split("T")[0];
    handleRedirect(`${redirectPath}?date=${today}`);
  }

  const parseResult = journalDateSchema.safeParse(dateParam);

  if (!parseResult.success) {
    const today = new Date().toISOString().split("T")[0];
    handleRedirect(`${redirectPath}?date=${today}`);
  }

  return dateParam;
}

function handleRedirect(url: string) {
  if (typeof window === "undefined") {
    redirect(url);
  } else {
    window.location.href = url;
  }
}

export const getJournalDate = (dateParam?: string) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date parameter");
  }

  const urlDate = date.toISOString().split("T")[0];

  const displayDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    urlParam: urlDate,
    display: displayDate,
    timestamp: date.getTime(),
  };
};
