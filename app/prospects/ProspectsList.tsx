"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Prospect = { [key: string]: any };

export default function ProspectsList() {
  const supabase = createClientComponentClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login";
    })();
  }, []);

  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchProspects() {
    setLoading(true);
    const { data, error } = await supabase
      .from("prospects")
      .select("*")
      .order("id", { ascending: false });

    if (error) setError(error.message);
    setProspects(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchProspects();
  }, []);

  async function handleConvert(prospect: Prospect) {
    // Step 1: update prospect status
    const { error: updateErr } = await supabase
      .from("prospects")
      .update({ status: "converted" })
      .eq("id", prospect.id);

    if (updateErr) {
      alert("Error converting prospect: " + updateErr.message);
      return;
    }

    // Step 2: create related project entry
    const { error: projErr } = await supabase.from("projects").insert({
      prospect_id: prospect.id,
      project_name: prospect.prospect,
      ns_sales_rep: prospect.ns_sales_rep,
      zenardy_sc: prospect.zenardy_sc,
      industry: prospect.industry,
    });

    if (projErr) {
      alert("Error creating project: " + projErr.message);
      return;
    }

    alert(`Prospect ${prospect.prospect} converted to project successfully!`);
    fetchProspects(); // refresh list
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Prospects</h1>
        <Link
          href="/prospects/new"
          className="px-3 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700"
        >
          + New Prospect
        </Link>
      </div>

      <Card className="dark:bg-gray-900">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {prospects.length > 0 &&
                    Object.keys(prospects[0]).map((k) => (
                      <TableHead key={k}>
                        {k.replaceAll("_", " ").replace(/\b\w/g, (s) => s.toUpperCase())}
                      </TableHead>
                    ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell
                      colSpan={(prospects[0] ? Object.keys(prospects[0]).length : 0) + 1}
                      className="text-center py-6"
                    >
                      Loading…
                    </TableCell>
                  </TableRow>
                )}
                {!loading && prospects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={1} className="text-center py-6">
                      No data
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  prospects.map((p) => (
                    <TableRow key={p.id}>
                      {Object.keys(p).map((k) => (
                        <TableCell key={k}>{String(p[k] ?? "-")}</TableCell>
                      ))}
                      <TableCell className="flex gap-2">
                        <Link
                          href={`/prospects/${p.id}/edit`}
                          className="px-3 py-2 rounded-xl text-sm bg-yellow-500 text-white"
                        >
                          ✏️ Edit
                        </Link>
                        {p.status !== "converted" ? (
                          <Button
                            size="sm"
                            className="bg-green-600 text-white"
                            onClick={() => handleConvert(p)}
                          >
                            Convert
                          </Button>
                        ) : (
                          <span className="text-green-600 font-medium">Converted</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
