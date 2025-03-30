"use client";

import { useState, useTransition } from "react";
import { login, signup } from "@/lib/supabase/actions";
import { AuthSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

type AuthResponse = {
  error: string | null;
};

type AuthAction = "login" | "signup";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<AuthAction | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuthAction = async (
    action: (formData: FormData) => Promise<AuthResponse | undefined>,
    actionType: AuthAction,
  ) => {
    const validationResult = AuthSchema.safeParse({ email, password });
    if (!validationResult.success) {
      const errors = validationResult.error.errors
        .map((e) => e.message)
        .join(" ");
      toast.error(errors);
      return;
    }

    const formData = new FormData();
    formData.append("email", validationResult.data.email);
    formData.append("password", validationResult.data.password);

    setPendingAction(actionType);
    startTransition(async () => {
      try {
        const result = await action(formData);
        if (result?.error) {
          toast.error(result.error);
        }
      } finally {
        setPendingAction(null);
      }
    });
  };

  const isLoginPending = isPending && pendingAction === "login";
  const isSignupPending = isPending && pendingAction === "signup";

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-sm rounded-sm">
        <CardHeader className="text-center">
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            Log in or create an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            onClick={() => handleAuthAction(login, "login")}
            className="w-full"
            disabled={isPending}
          >
            {isLoginPending ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoginPending ? "Logging in..." : "Log In"}
          </Button>
          <Button
            onClick={() => handleAuthAction(signup, "signup")}
            variant="outline"
            className="w-full"
            disabled={isPending}
          >
            {isSignupPending ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isSignupPending ? "Signing up..." : "Sign Up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
