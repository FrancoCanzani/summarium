"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`, // Important: Full URL
        },
      });

      if (error) {
        console.error("Google sign-in error:", error);
        alert(error.message);
      }
      // No need to redirect manually; Supabase handles it.
    } catch (error) {
      console.error("Unexpected error during Google sign-in:", error);
      alert("Unexpected error during Google sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSignIn} disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in with Google"}
      </button>
    </div>
  );
}
