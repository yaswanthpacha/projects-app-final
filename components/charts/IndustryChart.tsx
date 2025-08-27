"use client";

import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

const data = [
  { name: "Industry A", value: 4 },
  { name: "Industry B", value: 3 },
  { name: "Industry C", value: 2 },
];

const COLORS = ["#4F46E5", "#10B981", "#F59E0B"];

export default function IndustryChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
