"use client";

import KPIsChart from "@/components/charts/KPIsChart";
import { useEffect, useState } from "react";
import { getKPIs } from "@/lib/supabaseQueries";

export default function DashboardPage() {
  const [kpis, setKpis] = useState<{
    totalProspects: number;
    conversionRate: number;
    onTimeRate: number;
  } | null>(null);

  useEffect(() => {
    async function fetchKPIs() {
      const data = await getKPIs();
      setKpis(data);
    }
    fetchKPIs();
  }, []);

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-900 rounded-2xl p-4 shadow-md">
          <p className="text-gray-400">Total Prospects</p>
          <p className="text-3xl font-bold">{kpis?.totalProspects ?? "-"}</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 shadow-md">
          <p className="text-gray-400">Conversion Rate</p>
          <p className="text-3xl font-bold">{kpis?.conversionRate ?? "-"}%</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 shadow-md">
          <p className="text-gray-400">On-Time Delivery</p>
          <p className="text-3xl font-bold">{kpis?.onTimeRate ?? "-"}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPIsChart type="prospectsByType" />
        <KPIsChart type="conversionRate" />
        <KPIsChart type="onTimeProjects" />
      </div>
    </div>
  );
}
