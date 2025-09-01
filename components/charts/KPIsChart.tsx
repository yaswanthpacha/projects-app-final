"use client";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type KPIsChartProps = {
  prospectsByType: Record<string, number>;
  conversionRate: number;
  onTimeProjects: number;
  trendData: { month: string; prospects: number }[];
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9932CC", "#FF69B4"];

export default function KPIsChart({
  prospectsByType,
  conversionRate,
  onTimeProjects,
  trendData,
}: KPIsChartProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Prospects by Type */}
      <div className="h-72 bg-white rounded-2xl shadow p-2">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={prospectsData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {prospectsData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Rate */}
      <div className="h-72 bg-white rounded-2xl shadow p-2">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={conversionData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {conversionData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* On-time Projects */}
      <div className="h-72 bg-white rounded-2xl shadow p-2">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={onTimeData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {onTimeData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Over Time */}
      <div className="h-72 bg-white rounded-2xl shadow p-2">
        <ResponsiveContainer>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="prospects" stroke="#0088FE" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
