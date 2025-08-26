"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      // 1️⃣ Get user session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUser(session.user);

      // 2️⃣ Fetch projects from Supabase
      const { data, error } = await supabase.from("projects").select("*");

      if (error) {
        console.error("Error fetching projects:", error.message);
      } else {
        setProjects(data || []);
      }

      setLoading(false);
    };

    getData();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Welcome, {user?.email}
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Here are your projects from Supabase:
        </p>

        {projects.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No projects found.
          </p>
        ) : (
          <ul className="space-y-3">
            {projects.map((project) => (
              <li
                key={project.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {project.customer_name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Industry: {project.by_industry || "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Product: {project.by_product || "N/A"}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Competitor: {project.by_competitor || "N/A"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
