"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [supabase, router]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
        {/* Zenardy Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="Zenardy Logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Welcome to Zenardy
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Sign in to continue
        </p>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google logo"
            className="h-5 w-5"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
