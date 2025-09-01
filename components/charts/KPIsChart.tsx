"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getKPIsChartData } from "@/utils/supabaseQueries";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#a855f7"];

export default function KPIsChart({ type }: { type: string }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getKPIsChartData(type).then(setData);
  }, [type]);

  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-sm">No data available</p>;
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            outerRadius={90}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#111",
              border: "1px solid #333",
              color: "#fff",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
