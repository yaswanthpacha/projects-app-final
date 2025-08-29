"use client";

import { useEffect, useMemo, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";

type Prospect = { [key: string]: any };

// Choose the important columns to show in the table
const keyCols = [
  "id",
  "prospect",
  "ns_sales_rep",
  "zenardy_sc",
  "industry",
  "stage",
  "status"
];

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
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("prospects")
        .select("*")
        .order("id", { ascending: false });

      if (error) setError(error.message);
      setProspects(data || []);
      setLoading(false);
    })();
  }, []);

  const selected = useMemo(
    () => prospects.find((p) => p.id === openId) || null,
    [prospects, openId]
  );

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
                  {keyCols.map((k) => (
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
                    <TableCell colSpan={keyCols.length + 1} className="text-center py-6">
                      Loading…
                    </TableCell>
                  </TableRow>
                )}
                {!loading && prospects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={keyCols.length + 1} className="text-center py-6">
                      No data
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  prospects.map((p) => (
                    <TableRow key={p.id}>
                      {keyCols.map((k) => (
                        <TableCell key={k}>{String(p[k] ?? "-")}</TableCell>
                      ))}
                      <TableCell className="flex gap-2">
                        <Button variant="ghost" onClick={() => setOpenId(p.id)} title="Quick view">
                          🔍
                        </Button>
                        <Link
                          href={`/prospects/${p.id}/edit`}
                          className="px-3 py-2 rounded-xl text-sm bg-yellow-500 text-white"
                        >
                          ✏️ Edit
                        </Link>
                        <Link
                          href={`/prospects/${p.id}`}
                          className="px-3 py-2 rounded-xl text-sm bg-gray-900 text-white"
                        >
                          Open
                        </Link>
                        {p.status !== "converted" && (
                          <Link
                            href={`/prospects/${p.id}/convert`}
                            className="px-3 py-2 rounded-xl text-sm bg-green-600 text-white"
                          >
                            Convert
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openId !== null} onOpenChange={(o) => { if (!o) setOpenId(null); }}>
        <DialogHeader>
          <div className="font-semibold">
            Prospect #{selected?.id} — {selected?.prospect || "Untitled"}
          </div>
          <button onClick={() => setOpenId(null)} className="px-2 py-1">✖</button>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-2 text-sm">
            {selected &&
              Object.keys(selected).sort().map((key) => (
                <div key={key} className="grid grid-cols-3 gap-3 py-1 border-b">
                  <div className="font-medium col-span-1 break-words">{key}</div>
                  <div className="col-span-2 break-words">{String(selected[key] ?? "")}</div>
                </div>
              ))}
          </div>
        </DialogContent>
        <DialogFooter>
          {selected && (
            <Link
              href={`/prospects/${selected.id}`}
              className="px-3 py-2 rounded-xl text-sm bg-gray-900 text-white"
            >
              Open Full Page
            </Link>
          )}
          <Button variant="secondary" onClick={() => setOpenId(null)}>Close</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
