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

type Project = { [key: string]: any };
const keyCols = ["id","customer_name","partner_company_name","by_industry","by_product","by_competitor"];

function exportCSV(rows: any[], filename = "projects_filtered.csv") {
  if (!rows.length) return;
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");
  const wbout = XLSX.write(workbook, { bookType: "csv", type: "array" });
  const blob = new Blob([wbout], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function exportPDF(rows: any[], filename = "projects_filtered.pdf") {
  if (!rows.length) return;
  const doc = new jsPDF();
  const headers = keyCols;
  const body = rows.map(r => headers.map(h => String(r[h] ?? "")));
  (doc as any).autoTable({ head: [headers], body, styles: { fontSize: 8 } });
  doc.save(filename);
}

export default function SearchProjects(){
  const supabase = createClientComponentClient();
  useEffect(()=>{
    (async()=>{
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login";
    })();
  },[]);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<number|null>(null);

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      const { data, error } = await supabase.from("projects").select("*").order("id",{ascending:false});
      if (error) setError(error.message);
      setProjects(data || []);
      setLoading(false);
    })();
  },[]);

  const searchableKeys = useMemo(()=>{
    const sample = projects[0] || {};
    return Object.keys(sample).filter(k => typeof sample[k] !== "boolean");
  },[projects]);

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return projects.filter(p =>
      searchableKeys.some(k => {
        const v = p[k];
        if (v === null || v === undefined) return false;
        if (typeof v === "boolean") return false;
        return String(v).toLowerCase().includes(q);
      })
    );
  },[projects, query, searchableKeys]);

  const selected = useMemo(() => projects.find(p => p.id === openId) || null, [projects, openId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Search Projects</h1>
      </div>

      <div className="flex items-center gap-2">
        <Input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Search projects..." className="w-96" />
        <Button onClick={()=>setQuery(input)}>Search</Button>
        <Button variant="secondary" onClick={()=>{ setInput(""); setQuery(""); }}>Reset</Button>
        <Button onClick={()=>exportCSV(filtered)}>Export CSV</Button>
        <Button variant="destructive" onClick={()=>exportPDF(filtered)}>Export PDF</Button>
      </div>

      <Card className="dark:bg-gray-900">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {keyCols.map(k => <TableHead key={k}>{k === "partner_company_name" ? "Partner" : k.replaceAll("_"," ").replace(/\b\w/g, s=>s.toUpperCase())}</TableHead>)}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!query && <TableRow><TableCell colSpan={keyCols.length+1} className="text-center py-6">Enter a term and press Search</TableCell></TableRow>}
                {query && filtered.length === 0 && <TableRow><TableCell colSpan={keyCols.length+1} className="text-center py-6">No results</TableCell></TableRow>}
                {filtered.map(p => (
                  <TableRow key={p.id}>
                    {keyCols.map(k => <TableCell key={k}>{String(p[k] ?? "-")}</TableCell>)}
                    <TableCell className="flex gap-2">
                      <Button variant="ghost" onClick={()=>setOpenId(p.id)} title="Quick view">🔍</Button>
                      <Link href={`/projects/${p.id}/edit`} className="px-3 py-2 rounded-xl text-sm bg-yellow-500 text-white">✏️ Edit</Link>
                      <Link href={`/projects/${p.id}`} className="px-3 py-2 rounded-xl text-sm bg-gray-900 text-white">Open</Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Scrollable Quick View Dialog */}
      <Dialog open={openId !== null} onOpenChange={(o)=>{ if(!o) setOpenId(null); }}>
        <DialogContent className="flex flex-col max-h-[80vh] w-full sm:w-[600px]">
          <DialogHeader>
            <div className="font-semibold">Project #{selected?.id} — {selected?.customer_name || "Untitled"}</div>
            <button onClick={()=>setOpenId(null)} className="px-2 py-1">✖</button>
          </DialogHeader>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto space-y-2 text-sm p-2">
            {selected && Object.keys(selected).sort().map((key) => (
              <div key={key} className="grid grid-cols-3 gap-3 py-1 border-b">
                <div className="font-medium col-span-1 break-words">{key}</div>
                <div className="col-span-2 break-words">{String(selected[key] ?? "")}</div>
              </div>
            ))}
          </div>

          <DialogFooter className="flex gap-2">
            {selected && <Link href={`/projects/${selected.id}`} className="px-3 py-2 rounded-xl text-sm bg-gray-900 text-white">Open Full Page</Link>}
            <Button variant="secondary" onClick={()=>setOpenId(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
