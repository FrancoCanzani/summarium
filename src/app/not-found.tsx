import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-background text-foreground flex min-h-screen w-full flex-col items-center justify-center space-y-8 p-4">
      <div className="items-center text-center">
        <div className="text-2xl font-semibold lg:text-3xl">
          404 - Page Not Found
        </div>
        <div className="mt-2 max-w-3xl text-balance">
          Sorry, we couldn&apos;t find the page you were looking for. It might
          have been moved or deleted.
        </div>
      </div>
      <p className="text-muted-foreground text-sm">
        Let&apos;s get you back on track.
      </p>
      <footer className="flex flex-col gap-3 pt-6 sm:flex-row sm:justify-center">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/notes">Go to Notes</Link>
        </Button>
      </footer>
    </div>
  );
}
