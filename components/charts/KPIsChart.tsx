"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

type KPIsChartProps = {
  prospectsByType: Record<string, number>;
  conversionRate: number;
  onTimeProjects: number;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9932CC", "#FF69B4"];

export default function KPIsChart({ prospectsByType, conversionRate, onTimeProjects }: KPIsChartProps) {
  const prospectsData = Object.entries(prospectsByType).map(([name, value]) => ({
    name,
    value,
  }));

  const conversionData = [
    { name: "Converted", value: conversionRate },
    { name: "Not Converted", value: 100 - conversionRate },
  ];

  const onTimeData = [
    { name: "On Time", value: onTimeProjects },
    { name: "Delayed", value: 100 - onTimeProjects },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Prospects by Type */}
      <div className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={prospectsData} dataKey="value" nameKey="name" outerRadius={80} label>
              {prospectsData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion % */}
      <div className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={conversionData} dataKey="value" nameKey="name" outerRadius={80} label>
              {conversionData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* On-time Projects % */}
      <div className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={onTimeData} dataKey="value" nameKey="name" outerRadius={80} label>
              {onTimeData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
