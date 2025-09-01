"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getProspectsByType, getConversionRate, getOnTimeProjects } from "@/lib/supabaseQueries";

interface KPIsChartProps {
  type: "prospectsByType" | "conversionRate" | "onTimeProjects";
}

export default function KPIsChart({ type }: KPIsChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      let result: any[] = [];

      if (type === "prospectsByType") {
        result = await getProspectsByType();
      } else if (type === "conversionRate") {
        result = await getConversionRate();
      } else if (type === "onTimeProjects") {
        result = await getOnTimeProjects();
      }

      setData(result || []);
      setLoading(false);
    }

    fetchData();
  }, [type]);

  return (
    <div className="bg-zinc-900 rounded-2xl shadow-md p-4 border border-zinc-800">
      {/* Dynamic chart titles */}
      <h2 className="text-lg font-semibold mb-3">
        {type === "prospectsByType" && "Prospects Overview"}
        {type === "conversionRate" && "Conversion Rate"}
        {type === "onTimeProjects" && "On-Time Projects"}
      </h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-400">No data available</p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
