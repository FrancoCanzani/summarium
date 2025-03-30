"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-background text-foreground flex min-h-screen w-full items-center justify-center p-4">
      <Card className="border-destructive/50 shadow-destructive/10 w-full max-w-md rounded-sm shadow-lg">
        <CardHeader className="items-center text-center">
          <AlertTriangle className="text-destructive mb-4 h-12 w-12" />
          <CardTitle className="text-2xl font-semibold">
            Oops! Something Went Wrong
          </CardTitle>
          <CardDescription className="mt-2">
            An unexpected error occurred. We&apos;ve logged the issue and our
            team will look into it.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
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
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-6 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()} className="w-full sm:w-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="mr-2 size-4"
            >
              <path
                fillRule="evenodd"
                d="M15.312 11.424a5.5 5.5 0 0 1-9.201-4.42 5.5 5.5 0 0 1 10.163 3.23 5.5 5.5 0 0 1-1.002 2.048l3.533 3.533a1 1 0 0 1-1.414 1.414l-3.533-3.533ZM13.5 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
            Try Again
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="mr-2 size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 10.707V16.5a1.5 1.5 0 0 1-1.5 1.5h-2.5a.5.5 0 0 1-.5-.5V14.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-.5.5H5A1.5 1.5 0 0 1 3.5 16.5V10.707a1 1 0 0 1 .293-.707l7-7Z"
                  clipRule="evenodd"
                />
              </svg>
              Go Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
