"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-background text-foreground flex min-h-screen w-full flex-col items-center justify-center space-y-8 p-4">
      <div className="items-center text-center">
        <h2 className="text-2xl font-semibold">Oops! Something Went Wrong</h2>
        <p className="mt-2 text-balance">
          An unexpected error occurred. We&apos;ve logged the issue and our team
          will look into it.
        </p>
      </div>
      <div className="text-center">
        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="border-destructive/30 bg-destructive/5 mt-4 space-y-2 rounded-sm border border-dashed p-3 text-left text-xs">
            <p className="text-destructive font-medium">
              Development Error Details:
            </p>
            <pre className="text-muted-foreground whitespace-pre-wrap">
              <code>
                {error.message}
                {error.digest && `\n\nDigest: ${error.digest}`}
              </code>
            </pre>
          </div>
        )}
      </div>
      <footer className="flex flex-col gap-3 pt-6 sm:flex-row sm:justify-center">
        <Button onClick={() => reset()} className="w-full sm:w-auto">
          Try Again
        </Button>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/">Go Home</Link>
        </Button>
      </footer>
    </div>
  );
}
