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
type Prospect = { [key: string]: any };

export default function SearchCombined() {
  const supabase = createClientComponentClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login";
    })();
  }, []);

  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [openProjectId, setOpenProjectId] = useState<number | null>(null);

  async function loadSearch() {
    setLoading(true);
    setSearched(true);

    const terms = search.split(/\s+/).map(t => t.trim()).filter(Boolean);
    if (!terms.length) {
      setProjects([]);
      setProspects([]);
      setLoading(false);
      return;
    }

    // --- Projects ---
    let { data: projectSample } = await supabase.from("projects").select("*").limit(1);
    const projectAllCols = projectSample?.[0] ? Object.keys(projectSample[0]) : [];

    let pq = supabase.from("projects").select("*").order("id", { ascending: false });
    const projectFilters = terms
      .map(t => projectAllCols.map(c => `${c}.ilike.%${t}%`).join(","))
      .join(",");
    pq = projectFilters ? pq.or(projectFilters) : pq;
    const { data: p1 } = await pq;

    // --- Prospects ---
    let { data: prospectSample } = await supabase.from("prospects").select("*").limit(1);
    const prospectAllCols = prospectSample?.[0] ? Object.keys(prospectSample[0]) : [];

    let rq = supabase.from("prospects").select("*").order("id", { ascending: false });
    const prospectFilters = terms
      .map(t => prospectAllCols.map(c => `${c}.ilike.%${t}%`).join(","))
      .join(",");
    rq = prospectFilters ? rq.or(prospectFilters) : rq;
    const { data: p2 } = await rq;

    setProjects(p1 || []);
    setProspects(p2 || []);
    setLoading(false);
  }

  function exportCSV(rows: any[], filename = "data.csv") {
    if (!rows.length) return;
    const cols = Object.keys(rows[0]);
    const worksheet = XLSX.utils.json_to_sheet(rows.map(r => {
      const obj: any = {};
      cols.forEach(c => obj[c] = r[c] ?? "");
      return obj;
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const wbout = XLSX.write(workbook, { bookType: "csv", type: "array" });
    const blob = new Blob([wbout], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  function exportPDF(rows: any[], filename = "data.pdf") {
    if (!rows.length) return;
    const cols = Object.keys(rows[0]);
    const doc = new jsPDF();
    const body = rows.map(r => cols.map(c => String(r[c] ?? "")));
    (doc as any).autoTable({ head: [cols], body, styles: { fontSize: 8 } });
    doc.save(filename);
  }

  const selectedProject = useMemo(() => projects.find(p => p.id === openProjectId) || null, [projects, openProjectId]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Search Projects & Prospects</h1>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Type keywords separated by space"
          className="w-96"
        />
        <Button onClick={loadSearch} className="bg-blue-600 hover:bg-blue-700 text-white">Search</Button>
        <Button variant="outline" onClick={() => { setSearch(""); setProjects([]); setProspects([]); setSearched(false); }}>Reset</Button>
        <Button onClick={() => exportCSV(projects, "projects.csv")} className="bg-green-600 hover:bg-green-700 text-white">Export Projects CSV</Button>
        <Button onClick={() => exportCSV(prospects, "prospects.csv")} className="bg-green-600 hover:bg-green-700 text-white">Export Prospects CSV</Button>
        <Button onClick={() => exportPDF(projects, "projects.pdf")} className="bg-red-600 hover:bg-red-700 text-white">Export Projects PDF</Button>
        <Button onClick={() => exportPDF(prospects, "prospects.pdf")} className="bg-red-600 hover:bg-red-700 text-white">Export Prospects PDF</Button>
      </div>

      {/* Projects Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {projects[0] ? Object.keys(projects[0]).map(c => <TableHead key={c}>{c.replaceAll("_", " ").replace(/\b\w/g, s => s.toUpperCase())}</TableHead>) : <TableHead>Columns</TableHead>}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!searched && <TableRow><TableCell colSpan={projects[0] ? Object.keys(projects[0]).length + 1 : 1} className="text-center py-6">Enter a term and click Search</TableCell></TableRow>}
                {searched && loading && <TableRow><TableCell colSpan={projects[0] ? Object.keys(projects[0]).length + 1 : 1} className="text-center py-6">Searching…</TableCell></TableRow>}
                {searched && !loading && projects.length === 0 && <TableRow><TableCell colSpan={projects[0] ? Object.keys(projects[0]).length + 1 : 1} className="text-center py-6">No projects found</TableCell></TableRow>}
                {projects.map(p => (
                  <TableRow key={p.id} className="border-t">
                    {Object.keys(p).map(c => <TableCell key={c}>{String(p[c] ?? "-")}</TableCell>)}
                    <TableCell className="flex gap-2">
                      <Button size="sm" className="bg-gray-700 hover:bg-gray-800 text-white" onClick={() => setOpenProjectId(p.id)}>Quick View</Button>
                      <Link href={`/projects/${p.id}/edit`} className="px-3 py-1 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white text-sm">Edit</Link>
                      <Link href={`/projects/${p.id}`} className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm">Open</Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Prospects Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {prospects[0] ? Object.keys(prospects[0]).map(c => <TableHead key={c}>{c.replaceAll("_", " ").replace(/\b\w/g, s => s.toUpperCase())}</TableHead>) : <TableHead>Columns</TableHead>}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!searched && <TableRow><TableCell colSpan={prospects[0] ? Object.keys(prospects[0]).length + 1 : 1} className="text-center py-6">Enter a term and click Search</TableCell></TableRow>}
                {searched && loading && <TableRow><TableCell colSpan={prospects[0] ? Object.keys(prospects[0]).length + 1 : 1} className="text-center py-6">Searching…</TableCell></TableRow>}
                {searched && !loading && prospects.length === 0 && <TableRow><TableCell colSpan={prospects[0] ? Object.keys(prospects[0]).length + 1 : 1} className="text-center py-6">No prospects found</TableCell></TableRow>}
                {prospects.map(p => (
                  <TableRow key={p.id} className="border-t">
                    {Object.keys(p).map(c => <TableCell key={c}>{String(p[c] ?? "-")}</TableCell>)}
                    <TableCell className="flex gap-2">
                      <Link href={`/projects/new?fromProspect=${p.id}`} className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm">Convert</Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick View Dialog */}
      <Dialog open={openProjectId !== null} onOpenChange={o => { if (!o) setOpenProjectId(null); }}>
        <DialogContent className="flex flex-col max-h-[80vh] w-full sm:w-[600px]">
          <DialogHeader className="flex justify-between items-center">
            <div className="font-semibold">Project #{selectedProject?.id} — {selectedProject?.customer_name || "Untitled"}</div>
            <button onClick={() => setOpenProjectId(null)} className="text-gray-500 hover:text-gray-700">✖</button>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-2 text-sm p-2">
            {selectedProject && Object.keys(selectedProject).sort().map(k => (
              <div key={k} className="grid grid-cols-3 gap-3 py-1 border-b">
                <div className="font-medium col-span-1 break-words">{k}</div>
                <div className="col-span-2 break-words">{String(selectedProject[k] ?? "")}</div>
              </div>
            ))}
          </div>
          <DialogFooter className="flex gap-2">
            {selectedProject && <Link href={`/projects/${selectedProject.id}`} className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">Open Full Page</Link>}
            <Button variant="outline" onClick={() => setOpenProjectId(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
