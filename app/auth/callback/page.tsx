"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.replace("/dashboard");
      else router.replace("/login");
    };
    run();
  }, [router, supabase]);

  return <p className="text-center mt-10">Signing you in…</p>;
}
