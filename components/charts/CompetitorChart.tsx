"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

const data = [
  { name: "Competitor A", value: 2 },
  { name: "Competitor B", value: 4 },
  { name: "Competitor C", value: 3 },
];

export default function CompetitorChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
