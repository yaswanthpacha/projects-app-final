"use client";

import { useEffect, useMemo, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";

type RecordType = { [key: string]: any };

const projectCols = ["id","customer_name","partner_company_name","by_industry","by_product","by_competitor"];
const prospectCols = ["id","prospect","ns_sales_rep","zenardy_sc","industry","ns_solution_proposed","zenardy_cost","close_date","stage","next_steps","status"];

function exportCSV(rows: RecordType[], filename = "filtered.csv", cols: string[]) {
  if (!rows.length) return;
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  const wbout = XLSX.write(workbook, { bookType: "csv", type: "array" });
  const blob = new Blob([wbout], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function exportPDF(rows: RecordType[], filename = "filtered.pdf", cols: string[]) {
  if (!rows.length) return;
  const doc = new jsPDF();
  const body = rows.map(r => cols.map(c => String(r[c] ?? "")));
  (doc as any).autoTable({ head: [cols], body, styles: { fontSize: 8 } });
  doc.save(filename);
}

export default function SearchTogglePage() {
  const supabase = createClientComponentClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login";
    })();
  }, []);

  const [activeTab, setActiveTab] = useState<"projects" | "prospects">("projects");
  const [projects, setProjects] = useState<RecordType[]>([]);
  const [prospects, setProspects] = useState<RecordType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (activeTab === "projects") {
        const { data, error } = await supabase.from("projects").select("*").order("id", { ascending: false });
        if (error) setError(error.message);
        setProjects(data || []);
      } else {
        const { data, error } = await supabase.from("prospects").select("*").order("id", { ascending: false });
        if (error) setError(error.message);
        setProspects(data || []);
      }
      setLoading(false);
    })();
  }, [activeTab]);

  const data = activeTab === "projects" ? projects : prospects;
  const keyCols = activeTab === "projects" ? projectCols : prospectCols;

  const searchableKeys = useMemo(() => {
    const sample = data[0] || {};
    return Object.keys(sample).filter(k => typeof sample[k] !== "boolean");
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return data.filter(p =>
      searchableKeys.some(k => {
        const v = p[k];
        if (v === null || v === undefined) return false;
        if (typeof v === "boolean") return false;
        return String(v).toLowerCase().includes(q);
      })
    );
  }, [data, query, searchableKeys]);

  const selected = useMemo(() => data.find(p => p.id === openId) || null, [data, openId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Search {activeTab === "projects" ? "Projects" : "Prospects"}</h1>
        <div className="flex gap-2">
          <Button variant={activeTab === "projects" ? "default" : "outline"} onClick={() => { setActiveTab("projects"); setQuery(""); setInput(""); }}>Projects</Button>
          <Button variant={activeTab === "prospects" ? "default" : "outline"} onClick={() => { setActiveTab("prospects"); setQuery(""); setInput(""); }}>Prospects</Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Search ${activeTab}...`} className="w-96" />
        <Button onClick={() => setQuery(input)}>Search</Button>
        <Button variant="secondary" onClick={() => { setInput(""); setQuery(""); }}>Reset</Button>
        <Button onClick={() => exportCSV(filtered, `${activeTab}_filtered.csv`, keyCols)}>Export CSV</Button>
        <Button variant="destructive" onClick={() => exportPDF(filtered, `${activeTab}_filtered.pdf`, keyCols)}>Export PDF</Button>
      </div>

      <Card className="dark:bg-gray-900">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {keyCols.map(k => <TableHead key={k}>{k.replaceAll("_", " ").replace(/\b\w/g, s => s.toUpperCase())}</TableHead>)}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!query && <TableRow><TableCell colSpan={keyCols.length + 1} className="text-center py-6">Enter a term and press Search</TableCell></TableRow>}
                {query && filtered.length === 0 && <TableRow><TableCell colSpan={keyCols.length + 1} className="text-center py-6">No results</TableCell></TableRow>}
                {filtered.map(p => (
                  <TableRow key={p.id}>
                    {keyCols.map(k => <TableCell key={k}>{String(p[k] ?? "-")}</TableCell>)}
                    <TableCell className="flex gap-2">
                      <Link
                        href={activeTab === "projects" ? `/projects/${p.id}/edit` : `/prospects/${p.id}/edit`}
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-sm bg-yellow-500 text-white hover:bg-yellow-600"
                      >
                        ✏️ Edit
                      </Link>
                      <Link
                        href={activeTab === "projects" ? `/projects/${p.id}` : `/prospects/${p.id}` }
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-sm bg-gray-800 text-white hover:bg-gray-900"
                      >
                        Open
                      </Link>
                      {activeTab === "prospects" && (
                        <Link
                          href={`/projects/new?prospectId=${p.id}`} // Pass prefill param
                          className="flex items-center gap-1 px-2 py-1 rounded-md text-sm bg-green-600 text-white hover:bg-green-700"
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

      {/* Scrollable Detail Dialog */}
      <Dialog open={openId !== null} onOpenChange={(o) => { if (!o) setOpenId(null); }}>
        <DialogContent className="flex flex-col max-h-[80vh] w-full sm:w-[600px]">
          <DialogHeader>
            <div className="font-semibold">{activeTab === "projects" ? `Project #${selected?.id}` : `Prospect #${selected?.id}`} — {selected?.customer_name || selected?.prospect || "Untitled"}</div>
            <button onClick={() => setOpenId(null)} className="px-2 py-1">✖</button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-2 text-sm p-2">
            {selected && keyCols.map((key) => (
              <div key={key} className="grid grid-cols-3 gap-3 py-1 border-b">
                <div className="font-medium col-span-1 break-words">{key.replaceAll("_", " ").replace(/\b\w/g, s => s.toUpperCase())}</div>
                <div className="col-span-2 break-words">{String(selected[key] ?? "")}</div>
              </div>
            ))}
          </div>

          <DialogFooter className="flex gap-2">
            {selected && <Link href={activeTab === "projects" ? `/projects/${selected.id}` : `/prospects/${selected.id}`} className="px-3 py-2 rounded-xl text-sm bg-gray-900 text-white">Open Full Page</Link>}
            <Button variant="secondary" onClick={() => setOpenId(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
