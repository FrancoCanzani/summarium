import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { redirect } from "next/navigation";
import { journalDateSchema, uuidV4Schema } from "./schemas";
import {
  isServer,
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";
import { ParamValue } from "next/dist/server/request/params";

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

export function validateUUID(id: string | ParamValue) {
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

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        shouldRedactErrors: () => {
          // We should not catch Next.js server errors
          // as that's how Next.js detects dynamic pages
          // so we cannot redact them.
          // Next.js also automatically redacts errors for us
          // with better digests.
          return false;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  const containerHeight = container.offsetHeight;
  const itemHeight = item ? item.offsetHeight : 0;

  const top = item.offsetTop;
  const bottom = top + itemHeight;

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5;
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
  }
};
