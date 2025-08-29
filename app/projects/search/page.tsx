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

const projectCols = ["id","customer_name","partner_company_name","by_industry","by_product","by_competitor"];
const prospectCols = ["id","prospect","ns_sales_rep","industry","stage","status"];

export default function SearchCombined() {
  const supabase = createClientComponentClient();

  // Auth check
  useEffect(()=>{
    (async()=>{
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login";
    })();
  },[]);

  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(false);
  const [openProjectId, setOpenProjectId] = useState<number|null>(null);

  // Debounced search
  useEffect(()=>{
    const handler = setTimeout(() => { loadSearch(); }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  async function loadSearch() {
    setLoading(true);
    const terms = search.split(",").map(t=>t.trim()).filter(Boolean);

    // Projects query
    let pq = supabase.from("projects").select("*").order("id",{ascending:false});
    if (terms.length) {
      pq = pq.or(
        terms.map(t => `customer_name.ilike.%${t}%,partner_company_name.ilike.%${t}%,by_industry.ilike.%${t}%,by_product.ilike.%${t}%`).join(",")
      );
    }
    const { data: p1 } = await pq;

    // Prospects query
    let rq = supabase.from("prospects").select("*").order("id",{ascending:false});
    if (terms.length) {
      rq = rq.or(
        terms.map(t => `prospect.ilike.%${t}%,ns_sales_rep.ilike.%${t}%,industry.ilike.%${t}%,stage.ilike.%${t}%`).join(",")
      );
    }
    const { data: p2 } = await rq;

    setProjects(p1 || []);
    setProspects(p2 || []);
    setLoading(false);
  }

  function exportCSV(rows: any[], cols: string[], filename = "data.csv") {
    if (!rows.length) return;
    const worksheet = XLSX.utils.json_to_sheet(rows.map(r=> {
      const obj: any = {};
      cols.forEach(c=>obj[c]=r[c]??"");
      return obj;
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const wbout = XLSX.write(workbook,{bookType:"csv",type:"array"});
    const blob = new Blob([wbout],{type:"text/csv;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download=filename; a.click();
    URL.revokeObjectURL(url);
  }

  function exportPDF(rows: any[], cols: string[], filename = "data.pdf") {
    if (!rows.length) return;
    const doc = new jsPDF();
    const body = rows.map(r => cols.map(c=>String(r[c]??"")));
    (doc as any).autoTable({head:[cols],body,styles:{fontSize:8}});
    doc.save(filename);
  }

  const selectedProject = useMemo(()=>projects.find(p=>p.id===openProjectId)||null,[projects,openProjectId]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Search Projects & Prospects</h1>

      <div className="flex items-center gap-2">
        <Input
          value={search}
          onChange={e=>setSearch(e.target.value)}
          placeholder="Type keywords, comma separated"
          className="w-96"
        />
        <Button onClick={loadSearch}>Search</Button>
        <Button variant="secondary" onClick={()=>{setSearch(""); setProjects([]); setProspects([]);}}>Reset</Button>
        <Button onClick={()=>exportCSV(projects,projectCols,"projects.csv")}>Export Projects CSV</Button>
        <Button onClick={()=>exportCSV(prospects,prospectCols,"prospects.csv")}>Export Prospects CSV</Button>
        <Button variant="destructive" onClick={()=>exportPDF(projects,projectCols,"projects.pdf")}>Export Projects PDF</Button>
        <Button variant="destructive" onClick={()=>exportPDF(prospects,prospectCols,"prospects.pdf")}>Export Prospects PDF</Button>
      </div>

      {/* Projects Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {projectCols.map(c=><TableHead key={c}>{c.replaceAll("_"," ").replace(/\b\w/g,s=>s.toUpperCase())}</TableHead>)}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && <TableRow><TableCell colSpan={projectCols.length+1} className="text-center py-6">Searching…</TableCell></TableRow>}
                {!loading && projects.length===0 && <TableRow><TableCell colSpan={projectCols.length+1} className="text-center py-6">No projects</TableCell></TableRow>}
                {projects.map(p=>(
                  <TableRow key={p.id} className="border-t">
                    {projectCols.map(c=><TableCell key={c}>{String(p[c]??"-")}</TableCell>)}
                    <TableCell className="flex gap-2">
                      <Button size="sm" onClick={()=>setOpenProjectId(p.id)}>🔍 Quick View</Button>
                      <Link href={`/projects/${p.id}/edit`} className="px-2 py-1 rounded-md text-sm bg-yellow-500 text-white">✏️ Edit</Link>
                      <Link href={`/projects/${p.id}`} className="px-2 py-1 rounded-md text-sm bg-gray-800 text-white">Open</Link>
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
                  {prospectCols.map(c=><TableHead key={c}>{c.replaceAll("_"," ").replace(/\b\w/g,s=>s.toUpperCase())}</TableHead>)}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && <TableRow><TableCell colSpan={prospectCols.length+1} className="text-center py-6">Searching…</TableCell></TableRow>}
                {!loading && prospects.length===0 && <TableRow><TableCell colSpan={prospectCols.length+1} className="text-center py-6">No prospects</TableCell></TableRow>}
                {prospects.map(p=>(
                  <TableRow key={p.id} className="border-t">
                    {prospectCols.map(c=><TableCell key={c}>{String(p[c]??"-")}</TableCell>)}
                    <TableCell>
                      <Link href={`/projects/new?fromProspect=${p.id}`} className="text-green-700">Convert</Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick View Dialog for Projects */}
      <Dialog open={openProjectId!==null} onOpenChange={o=>{if(!o)setOpenProjectId(null);}}>
        <DialogContent className="flex flex-col max-h-[80vh] w-full sm:w-[600px]">
          <DialogHeader>
            <div className="font-semibold">Project #{selectedProject?.id} — {selectedProject?.customer_name || "Untitled"}</div>
            <button onClick={()=>setOpenProjectId(null)} className="px-2 py-1">✖</button>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-2 text-sm p-2">
            {selectedProject && Object.keys(selectedProject).sort().map(k=>(
              <div key={k} className="grid grid-cols-3 gap-3 py-1 border-b">
                <div className="font-medium col-span-1 break-words">{k}</div>
                <div className="col-span-2 break-words">{String(selectedProject[k]??"")}</div>
              </div>
            ))}
          </div>
          <DialogFooter className="flex gap-2">
            {selectedProject && <Link href={`/projects/${selectedProject.id}`} className="px-3 py-2 rounded-xl text-sm bg-gray-900 text-white">Open Full Page</Link>}
            <Button variant="secondary" onClick={()=>setOpenProjectId(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
