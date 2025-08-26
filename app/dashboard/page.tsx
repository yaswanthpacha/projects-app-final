"use client";

import { useEffect, useMemo, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart as RBarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import Link from "next/link";

type Project = Record<string, any>;

export default function Dashboard() {
  const supabase = createClientComponentClient();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  // check authentication
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login";
    })();
  }, [supabase]);

  // detect dark mode
  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // fetch projects
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from("projects").select("*").order("id", { ascending: false });
      if (error) setError(error.message);
      setProjects(data || []);
      setLoading(false);
    })();
  }, [supabase]);

  const total = projects.length;
  const uniqueCount = (key: string) => new Set(projects.map(p => p[key]).filter(Boolean)).size;

  const tally = (field: string) => {
    const map = new Map<string, number>();
    for (const p of projects) {
      const key = (p[field] || "Unknown") as string;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  };

  const byIndustry = useMemo(() => tally("by_industry"), [projects]);
  const byProduct = useMemo(() => tally("by_product"), [projects]);
  const byCompetitor = useMemo(() => tally("by_competitor"), [projects]);

  const colorsLight = ["#2563eb","#16a34a","#dc2626","#7c3aed","#ea580c","#059669","#f59e0b","#0ea5e9"];
  const colorsDark  = ["#93c5fd","#86efac","#fca5a5","#c4b5fd","#fdba74","#6ee7b7","#fde68a","#67e8f9"];
  const palette = isDark ? colorsDark : colorsLight;

  const renderBarChart = (data: { name: string; value: number }[], offset = 0) => (
    <ResponsiveContainer width="100%" height="100%">
      <RBarChart data={data}>
        <XAxis dataKey="name" hide />
        <YAxis allowDecimals={false} stroke={isDark ? "#94a3b8" : "#475569"} />
        <Tooltip />
        {data.map((_, i) => (
          <Bar key={i} dataKey="value" fill={palette[(i + offset) % palette.length]} />
        ))}
      </RBarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <Link
          href="/projects/search"
          className="px-3 py-2 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-700"
        >
          Search Projects
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="dark:bg-gray-900">
          <CardHeader><CardTitle>Total Projects</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{loading ? "…" : total}</CardContent>
        </Card>

        <Card className="dark:bg-gray-900">
          <CardHeader><CardTitle>Unique Industries</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{loading ? "…" : uniqueCount("by_industry")}</CardContent>
        </Card>

        <Card className="dark:bg-gray-900">
          <CardHeader><CardTitle>Unique Partners</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{loading ? "…" : uniqueCount("partner_company_name")}</CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="dark:bg-gray-900">
          <CardHeader><CardTitle>By Industry</CardTitle></CardHeader>
          <CardContent className="h-72">{loading ? "Loading…" : renderBarChart(byIndustry)}</CardContent>
        </Card>

        <Card className="dark:bg-gray-900">
          <CardHeader><CardTitle>By Product</CardTitle></CardHeader>
          <CardContent className="h-72">{loading ? "Loading…" : renderBarChart(byProduct, 2)}</CardContent>
        </Card>

        <Card className="dark:bg-gray-900">
          <CardHeader><CardTitle>By Competitor</CardTitle></CardHeader>
          <CardContent className="h-72">{loading ? "Loading…" : renderBarChart(byCompetitor, 4)}</CardContent>
        </Card>
      </div>

      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
}
