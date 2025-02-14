"use client";

import { useState } from "react";
import { supabase } from "~/lib/supabase";
import { useRouter } from "next/navigation";
import { AuthForm } from "~/components/auth-form";

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      mode="sign-in"
      onSubmit={handleSubmit}
      error={error}
      isLoading={isLoading}
    />
  );
}
