"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function HomePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) router.push("/projects");
      else router.push("/login");
    };

    checkAuth();
  }, [supabase, router]);

  return <p className="text-center mt-20">Redirecting...</p>;
}
