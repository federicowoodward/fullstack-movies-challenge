"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { loginSchema, type LoginFormValues } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPageClient() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") ?? "/";

  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema as any),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.status === 204) {
        toast({ title: "Logged in", variant: "success" });
        router.push(redirectTo as any);
        router.refresh();
        return;
      }

      const payload = await response.json().catch(() => ({ message: "Login failed" }));
      const message = payload?.message ?? "Invalid credentials";
      setError("username", { type: "manual", message });
      toast({ title: "Login failed", description: message, variant: "error" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to login";
      toast({ title: "Login failed", description: message, variant: "error" });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
        <p className="mt-2 text-sm text-slate-500">Use your API credentials to access the dashboard.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="username">
              Username
            </label>
            <Input id="username" autoComplete="username" placeholder="admin" {...register("username")} />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <Input id="password" type="password" autoComplete="current-password" placeholder="������" {...register("password")} />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" loading={submitting}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}

