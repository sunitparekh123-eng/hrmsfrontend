"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, KeyRound, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import apiClient from "@/lib/api-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ResetPasswordResponse {
  message: string;
}

// ---------------------------------------------------------------------------
// Inner component (uses useSearchParams)
// ---------------------------------------------------------------------------

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawToken = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // If no token in URL, show invalid state immediately
  if (!rawToken) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Invalid Link</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            This password reset link is missing a token. Please request a new reset link.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/login">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post<{ success: boolean; data: ResetPasswordResponse }>(
        "/auth/reset-password",
        { token: rawToken, new_password: newPassword }
      );
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        const message =
          axiosErr.response?.data?.message ||
          "Failed to reset password. The link may be expired or already used.";
        setError(message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Password Reset!</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Your password has been reset successfully. You can now sign in with your new password.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild className="gap-2">
            <Link href="/login">
              <ArrowLeft className="h-4 w-4" />
              Go to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <KeyRound className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="newPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              New Password
            </label>
            <Input
              id="newPassword"
              type="password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting…
              </>
            ) : (
              <>
                <KeyRound className="mr-2 h-4 w-4" />
                Reset Password
              </>
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page wrapper with Suspense boundary for useSearchParams
// ---------------------------------------------------------------------------

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <Card className="shadow-lg">
              <CardContent className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
