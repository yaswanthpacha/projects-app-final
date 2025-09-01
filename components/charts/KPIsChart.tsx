"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";
import { getKPIsChartData } from "@/lib/supabaseQueries";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]; // blue, green, yellow, red

interface ChartData {
  label: string;
  value: number;
}

export default function KPIsChart({ type }: { type: string }) {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const result = await getKPIsChartData(type);
      setData(result);
    }
    fetchData();
  }, [type]);

  return (
    <motion.div
      className="flex flex-col justify-center items-center p-4 bg-neutral-900 rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-white text-lg font-semibold mb-4 capitalize">
        {type.replace(/([A-Z])/g, " $1")}
      </h2>
      {data.length > 0 ? (
        <PieChart width={300} height={280}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
            animationBegin={200}
            animationDuration={1200}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <p className="text-gray-400 text-sm">No data available</p>
      )}
    </motion.div>
  );
}
