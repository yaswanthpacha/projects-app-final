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
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error during callback:", error.message);
        router.push("/login");
        return;
      }

      if (data.session) {
        router.push("/dashboard");
      } else {
        // if session not yet set, try refreshing
        await supabase.auth.refreshSession();
        router.push("/dashboard");
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
