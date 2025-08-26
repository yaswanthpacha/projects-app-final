"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ✅ force Node.js runtime (needed for Supabase on Vercel)
export const runtime = "nodejs";

type Project = {
  id: number;
  customer_name: string | null;
  partner_company_name: string | null;
  by_industry: string | null;
  by_product: string | null;
  by_competitor: string | null;
};

export default function ProjectsPage() {
  const supabase = createClientComponentClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) {
        console.error("Error fetching projects:", error.message);
      } else {
        setProjects(data as Project[]);
      }
    };

    fetchProjects();
  }, [supabase]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Dialog
            key={project.id}
            open={openId === project.id}
            onOpenChange={(o: boolean) => {
              if (!o) setOpenId(null); // ✅ fixed TypeScript error
            }}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => setOpenId(project.id)}
                className="w-full justify-start"
                variant="secondary"
              >
                {project.customer_name || "Unnamed Project"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {project.customer_name || "Unnamed Project"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Partner Company:</strong>{" "}
                  {project.partner_company_name || "N/A"}
                </p>
                <p>
                  <strong>Industry:</strong>{" "}
                  {project.by_industry || "N/A"}
                </p>
                <p>
                  <strong>Product:</strong>{" "}
                  {project.by_product || "N/A"}
                </p>
                <p>
                  <strong>Competitor:</strong>{" "}
                  {project.by_competitor || "N/A"}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
