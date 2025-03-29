"use client";

import Link from "next/link";
import { useAuth } from "@/lib/context/auth-context";

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="bg-background text-foreground flex h-full min-h-screen w-full flex-col items-center justify-evenly p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Welcome to Summarium</h1>
        <p className="mt-2 text-lg">
          Your personal assistant for note-taking and productivity.
        </p>
      </header>

      <main className="flex items-center justify-center space-x-4">
        <Link
          href="/login"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm px-4 py-2 text-sm font-medium transition"
        >
          Get Started
        </Link>
        {!loading && user && (
          <Link
            href="/notes"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm px-4 py-2 text-sm font-medium transition"
          >
            Go to app
          </Link>
        )}
      </main>

      <footer className="mt-8 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Summarium. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
