"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";

export default function AuthCallbackPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // 👇 Exchange the OAuth code in the URL for a Supabase session
      const { data, error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (error) {
        console.error("OAuth error:", error.message);
        router.push("/login");
        return;
      }

      if (data?.session) {
        // Success: user is logged in
        router.push("/dashboard");
      } else {
        // Fallback: go to login if session not created
        router.push("/login");
      }
    };

    handleAuth();
  }, [supabase, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600 dark:text-gray-300">
        Finishing login, please wait...
      </p>
    </div>
  );
}
