"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function IndustryChart() {
  const [data, setData] = useState<{ name: string; count: number }[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: projects } = await supabase.from("projects").select("by_industry");
      const counts: Record<string, number> = {};
      projects?.forEach((p) => {
        if (p.by_industry) {
          counts[p.by_industry] = (counts[p.by_industry] || 0) + 1;
        }
      });
      setData(Object.entries(counts).map(([name, count]) => ({ name, count })));
    };
    fetchData();
  }, [supabase]);

  return (
    <div className="h-72">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
