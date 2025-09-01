"use client";

import { useEffect, useState } from "react";
import {
  getProspectsByType,
  getConversionRate,
  getOnTimeProjects,
  getProspectsTrend,
} from "@/lib/supabaseQueries";
import KPIsChart from "@/components/charts/KPIsChart";

export default function DashboardPage() {
  const [prospectsByType, setProspectsByType] = useState<Record<string, number>>({});
  const [conversionRate, setConversionRate] = useState(0);
  const [onTimePct, setOnTimePct] = useState(0);
  const [trendData, setTrendData] = useState<{ month: string; prospects: number }[]>([]);

  // 🔹 Filters
  const [industry, setIndustry] = useState<string | null>(null);
  const [salesRep, setSalesRep] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const filterOptions = { industry, salesRep, startDate, endDate };

      const prospects = await getProspectsByType(filterOptions);
      const grouped = prospects.reduce((acc: Record<string, number>, p: any) => {
        acc[p.prospect_type] = (acc[p.prospect_type] || 0) + 1;
        return acc;
      }, {});
      setProspectsByType(grouped);

      setConversionRate(await getConversionRate(filterOptions));
      setOnTimePct(await getOnTimeProjects(filterOptions));
      setTrendData(await getProspectsTrend(filterOptions));
    }
    fetchData();
  }, [industry, salesRep, startDate, endDate]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Dashboard</h1>

      {/* 🔹 Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-2xl shadow">
        <select
          className="p-2 border rounded"
          value={industry ?? ""}
          onChange={(e) => setIndustry(e.target.value || null)}
        >
          <option value="">All Industries</option>
          <option value="Tech">Tech</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
        </select>

        <select
          className="p-2 border rounded"
          value={salesRep ?? ""}
          onChange={(e) => setSalesRep(e.target.value || null)}
        >
          <option value="">All Sales Reps</option>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
          <option value="Charlie">Charlie</option>
        </select>

        <input
          type="date"
          className="p-2 border rounded"
          value={startDate ?? ""}
          onChange={(e) => setStartDate(e.target.value || null)}
        />
        <input
          type="date"
          className="p-2 border rounded"
          value={endDate ?? ""}
          onChange={(e) => setEndDate(e.target.value || null)}
        />

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => {
            setIndustry(null);
            setSalesRep(null);
            setStartDate(null);
            setEndDate(null);
          }}
        >
          Reset
        </button>
      </div>

      {/* KPI Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Prospects by Type</h2>
          {Object.entries(prospectsByType).map(([type, count]) => (
            <p key={type}>
              {type}: <span className="font-bold">{count}</span>
            </p>
          ))}
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Conversion Rate</h2>
          <p className="text-3xl font-bold">{conversionRate}%</p>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <h2 className="text-lg font-semibold">On-Time Projects</h2>
          <p className="text-3xl font-bold">{onTimePct}%</p>
        </div>
      </div>

      {/* KPI Charts */}
      <KPIsChart
        prospectsByType={prospectsByType}
        conversionRate={conversionRate}
        onTimeProjects={onTimePct}
        trendData={trendData}
      />
    </div>
  );
}
