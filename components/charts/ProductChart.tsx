"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const data = [
  { name: "Product A", value: 5 },
  { name: "Product B", value: 3 },
  { name: "Product C", value: 1 },
];

export default function ProductChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
