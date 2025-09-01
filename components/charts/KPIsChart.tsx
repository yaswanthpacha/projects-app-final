"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getKPIsChartData } from "@/lib/supabaseQueries";

interface KPIsChartProps {
  type: "prospectsByType" | "conversionRate" | "onTimeProjects";
}

export default function KPIsChart({ type }: KPIsChartProps) {
  const [chartData, setChartData] = useState<{ label: string; value: number }[]>(
    []
  );

  useEffect(() => {
    async function fetchData() {
      const data = await getKPIsChartData(type);
      setChartData(data);
    }
    fetchData();
  }, [type]);

  return (
    <div className="w-full h-64 bg-gray-900 rounded-2xl p-4 shadow-md">
      <h2 className="text-lg font-semibold text-white mb-3">
        {type === "prospectsByType"
          ? "Prospects by Type"
          : type === "conversionRate"
          ? "Conversion Rate"
          : "On-Time Projects"}
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="label" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip
            contentStyle={{ backgroundColor: "#222", border: "none" }}
            itemStyle={{ color: "#fff" }}
          />
          <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
