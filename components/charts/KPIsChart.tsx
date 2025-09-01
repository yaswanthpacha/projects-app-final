"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";
import { getKPIData } from "@/lib/supabaseQueries";

const COLORS = ["#3b82f6", "#10b981"]; // blue, green

export default function KPIsChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    async function fetchData() {
      const projects = await getKPIData();

      // Example calculation (adjust based on your DB fields)
      const converted = projects.filter((p: any) => p.status === "converted").length;
      const notConverted = projects.length - converted;

      setData([
        { name: "Converted", value: converted },
        { name: "Not Converted", value: notConverted },
      ]);
    }

    fetchData();
  }, []);

  return (
    <motion.div
      className="flex justify-center items-center p-4 bg-neutral-900 rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <PieChart width={300} height={300}>
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
    </motion.div>
  );
}
