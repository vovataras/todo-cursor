"use client";

import { useState, useRef } from "react";
import { supabase } from "~/lib/supabase";
import { AuthForm, type AuthFormHandle } from "~/components/auth-form";

export default function SignUp() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<AuthFormHandle>(null);

  const handleSubmit = async (email: string, password: string) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      formRef.current?.clearInputs();
      setSuccess(
        "Please check your email for the confirmation link to complete your registration!",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      ref={formRef}
      mode="sign-up"
      onSubmit={handleSubmit}
      error={error}
      success={success}
      isLoading={isLoading}
    />
  );
}
