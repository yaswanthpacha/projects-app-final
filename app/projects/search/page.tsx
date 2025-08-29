"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

type Project = { [key: string]: any };
type Prospect = { [key: string]: any };

export default function CombinedSearch() {
  const supabase = createClientComponentClient();
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => { load(); }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  async function load() {
    setLoading(true);
    const terms = search.split(",").map(t => t.trim()).filter(Boolean);

    // Projects query
    let pq = supabase.from("projects").select("*").order("id", { ascending: false });
    if (terms.length) {
      pq = pq.or(
        terms.map(t => `customer_name.ilike.%${t}%,partner_company_name.ilike.%${t}%,by_industry.ilike.%${t}%,by_product.ilike.%${t}%`).join(",")
      );
    }
    const { data: p1 } = await pq;

    // Prospects query
    let rq = supabase.from("prospects").select("*").order("id", { ascending: false });
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

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Search Projects & Prospects</h1>
      <input
        className="border rounded-xl px-3 py-2 w-full"
        placeholder="Type keywords (comma separated)"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading && <div>Searching…</div>}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Projects</h2>
        <div className="border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-3 py-2">Customer</th>
                <th className="text-left px-3 py-2">Partner</th>
                <th className="text-left px-3 py-2">Industry</th>
                <th className="text-left px-3 py-2">Product</th>
                <th className="text-left px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 && !loading && (
                <tr><td colSpan={5} className="text-center py-4">No projects</td></tr>
              )}
              {projects.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-2">{p.customer_name ?? "—"}</td>
                  <td className="px-3 py-2">{p.partner_company_name ?? "—"}</td>
                  <td className="px-3 py-2">{p.by_industry ?? "—"}</td>
                  <td className="px-3 py-2">{p.by_product ?? "—"}</td>
                  <td className="px-3 py-2">
                    <Link href={`/projects/${p.id}`} className="text-blue-600 hover:underline">Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Prospects</h2>
        <div className="border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-3 py-2">Prospect</th>
                <th className="text-left px-3 py-2">Sales Rep</th>
                <th className="text-left px-3 py-2">Industry</th>
                <th className="text-left px-3 py-2">Stage</th>
                <th className="text-left px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prospects.length === 0 && !loading && (
                <tr><td colSpan={5} className="text-center py-4">No prospects</td></tr>
              )}
              {prospects.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-2">{p.prospect ?? "—"}</td>
                  <td className="px-3 py-2">{p.ns_sales_rep ?? "—"}</td>
                  <td className="px-3 py-2">{p.industry ?? "—"}</td>
                  <td className="px-3 py-2">{p.stage ?? "—"}</td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/projects/new?fromProspect=${p.id}`}
                      className="text-green-700 hover:underline"
                    >
                      Convert
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
