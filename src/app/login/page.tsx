"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLoginWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      console.error("Login error:", error);
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen w-full flex-col items-center justify-center p-6">
      <h1 className="mb-6 text-center text-3xl font-semibold">
        Login to Summarium
      </h1>
      <Button
        onClick={handleLoginWithGoogle}
        disabled={loading}
        variant={"default"}
      >
        {loading ? "Logging in..." : "Login with Google"}
      </Button>
    </div>
  );
}
