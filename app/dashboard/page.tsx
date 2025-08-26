"use client";

import { useEffect, useMemo, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart as RBarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import Link from "next/link";

type Project = { [key: string]: any };

export default function Dashboard() {
  const supabase = createClientComponentClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login";
    })();
  }, []);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from("projects").select("*").order("id", { ascending: false });
      if (error) setError(error.message);
      setProjects(data || []);
      setLoading(false);
    })();
  }, []);

  const total = projects.length;
  const unique = (key: string) => new Set(projects.map(p => p[key]).filter(Boolean)).size;
  const uniqueIndustries = unique("by_industry");
  const uniquePartners = unique("partner_company_name");

  const tally = (field: string) => {
    const m = new Map<string, number>();
    for (const p of projects) {
      const key = (p[field] || "Unknown") as string;
      m.set(key, (m.get(key) || 0) + 1);
    }
    return Array.from(m.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  };

  const byIndustry = useMemo(() => tally("by_industry"), [projects]);
  const byProduct = useMemo(() => tally("by_product"), [projects]);
  const byCompetitor = useMemo(() => tally("by_competitor"), [projects]);

  const colors = ["#2563eb","#16a34a","#dc2626","#7c3aed","#ea580c","#059669","#f59e0b","#0ea5e9"];

  return (
    <div className="space-y-6 min-h-screen p-4 overflow-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <Link href="/projects/search" className="px-3 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700">
          Search Projects
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle>Total Projects</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{loading ? "…" : total}</CardContent></Card>
        <Card><CardHeader><CardTitle>Unique Industries</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{loading ? "…" : uniqueIndustries}</CardContent></Card>
        <Card><CardHeader><CardTitle>Unique Partners</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{loading ? "…" : uniquePartners}</CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>By Industry</CardTitle></CardHeader>
          <CardContent className="h-72">
            {loading ? "Loading…" : (
              <ResponsiveContainer width="100%" height="100%">
                <RBarChart data={byIndustry}>
                  <XAxis dataKey="name" hide />
                  <YAxis allowDecimals={false} stroke="#475569" />
                  <Tooltip />
                  {byIndustry.map((_, i) => <Bar key={i} dataKey="value" fill={colors[i % colors.length]} />)}
                </RBarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>By Product</CardTitle></CardHeader>
          <CardContent className="h-72">
            {loading ? "Loading…" : (
              <ResponsiveContainer width="100%" height="100%">
                <RBarChart data={byProduct}>
                  <XAxis dataKey="name" hide />
                  <YAxis allowDecimals={false} stroke="#475569" />
                  <Tooltip />
                  {byProduct.map((_, i) => <Bar key={i} dataKey="value" fill={colors[(i+2) % colors.length]} />)}
                </RBarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>By Competitor</CardTitle></CardHeader>
          <CardContent className="h-72">
            {loading ? "Loading…" : (
              <ResponsiveContainer width="100%" height="100%">
                <RBarChart data={byCompetitor}>
                  <XAxis dataKey="name" hide />
                  <YAxis allowDecimals={false} stroke="#475569" />
                  <Tooltip />
                  {byCompetitor.map((_, i) => <Bar key={i} dataKey="value" fill={colors[(i+4) % colors.length]} />)}
                </RBarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
