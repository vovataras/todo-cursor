"use client";

import { useState } from "react";
import { supabase } from "~/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setSuccess(
        "Please check your email for the confirmation link to complete your registration!",
      );
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-yellow-100 p-8">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-center text-4xl font-bold">✨ Sign Up ✨</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border-2 border-red-500 bg-red-100 p-4 text-red-500">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border-2 border-green-500 bg-green-100 p-4 text-green-700">
              {success}
            </div>
          )}

          <div>
            <label className="mb-2 block font-bold" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border-2 border-black bg-white p-4 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none focus:translate-x-[3px] focus:translate-y-[3px] focus:shadow-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-bold" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border-2 border-black bg-white p-4 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none focus:translate-x-[3px] focus:translate-y-[3px] focus:shadow-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg border-2 border-black bg-green-500 px-8 py-4 font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-50"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-center">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-bold text-green-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
