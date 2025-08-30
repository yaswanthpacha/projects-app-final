"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Prospect = {
  id: number;
  prospect: string;
  ns_sales_rep: string | null;
  zenardy_sc: string | null;
  industry: string | null;
  ns_solution_proposed: string | null;
  zenardy_cost: number | null;
  close_date: string | null;
  stage: string | null;
  next_steps: string | null;
  status: string | null;
  project_id: number | null;
  prospect_type: string | null; // new field
  created_at?: string | null;
  updated_at?: string | null;
};

const keyCols: (keyof Prospect)[] = [
  "id",
  "prospect",
  "ns_sales_rep",
  "zenardy_sc",
  "industry",
  "ns_solution_proposed",
  "zenardy_cost",
  "close_date",
  "stage",
  "next_steps",
  "status",
  "prospect_type", // added column
];

export default function ProspectsList() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) router.push("/login");
    })();
  }, [supabase, router]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("prospects")
        .select("*")
        .order("id", { ascending: false });

      if (error) setError(error.message);
      setProspects((data || []) as Prospect[]);
      setLoading(false);
    })();
  }, [supabase]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Prospects</h1>
        <div className="flex gap-2">
          <Link
            href="/projects/search"
            className="px-3 py-2 rounded-xl text-sm bg-gray-900 text-white"
          >
            Search
          </Link>
          <Link
            href="/prospects/new"
            className="px-3 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700"
          >
            + New Prospect
          </Link>
        </div>
      </div>

      <div className="border rounded-xl overflow-x-auto max-h-[70vh]">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-800 text-white sticky top-0 z-10">
            <tr>
              {keyCols.map((k) => (
                <th
                  key={String(k)}
                  className="text-left px-3 py-2 capitalize"
                >
                  {String(k).replaceAll("_", " ")}
                </th>
              ))}
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  className="text-center py-6"
                  colSpan={keyCols.length + 1}
                >
                  Loading…
                </td>
              </tr>
            )}
            {!loading && prospects.length === 0 && (
              <tr>
                <td
                  className="text-center py-6"
                  colSpan={keyCols.length + 1}
                >
                  No data
                </td>
              </tr>
            )}
            {!loading &&
              prospects.map((p) => (
                <tr key={p.id} className="border-t">
                  {keyCols.map((k) => (
                    <td key={String(k)} className="px-3 py-2">
                      {p[k] === null || p[k] === undefined || p[k] === ""
                        ? "—"
                        : String(p[k])}
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <Link
                        href={`/prospects/${p.id}/edit`}
                        className="px-3 py-2 rounded-xl text-sm bg-yellow-500 text-white"
                      >
                        ✏️ Edit
                      </Link>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          if (p.status !== "converted") {
                            window.location.href = `/projects/new?fromProspect=${p.id}`;
                          }
                        }}
                        disabled={p.status === "converted"}
                      >
                        {p.status === "converted" ? "Converted" : "Convert"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
