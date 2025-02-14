import {
  type FormEvent,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Link from "next/link";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
  onSubmit: (email: string, password: string) => Promise<void>;
  error: string | null;
  success?: string | null;
  isLoading: boolean;
}

export interface AuthFormHandle {
  clearInputs: () => void;
}

export const AuthForm = forwardRef<AuthFormHandle, AuthFormProps>(
  function AuthForm({ mode, onSubmit, error, success, isLoading }, ref) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useImperativeHandle(ref, () => ({
      clearInputs: () => {
        setEmail("");
        setPassword("");
      },
    }));

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      await onSubmit(email, password);
    };

    const title = mode === "sign-in" ? "Sign In" : "Sign Up";
    const buttonText = isLoading
      ? mode === "sign-in"
        ? "Signing in..."
        : "Signing up..."
      : title;
    const altLink =
      mode === "sign-in" ? (
        <p className="text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-bold text-green-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      ) : (
        <p className="text-center">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-bold text-green-600 hover:underline"
          >
            Sign In
          </Link>
        </p>
      );

    return (
      <main className="min-h-screen bg-yellow-100 p-8">
        <div className="mx-auto max-w-md">
          <h1 className="mb-8 text-center text-4xl font-bold">✨ {title} ✨</h1>

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
              {buttonText}
            </button>

            {altLink}
          </form>
        </div>
      </main>
    );
  },
);
