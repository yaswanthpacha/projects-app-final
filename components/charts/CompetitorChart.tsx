"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function CompetitorChart() {
  const [data, setData] = useState<{ name: string; count: number }[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: projects } = await supabase.from("projects").select("by_competitor");
      const counts: Record<string, number> = {};
      projects?.forEach((p) => {
        if (p.by_competitor) {
          counts[p.by_competitor] = (counts[p.by_competitor] || 0) + 1;
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
          <Bar dataKey="count" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
