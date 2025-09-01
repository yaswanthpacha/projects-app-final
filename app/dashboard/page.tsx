"use client";

import { useEffect, useState } from "react";
import { getKPIs } from "@/utils/supabaseQueries";
import KPIsChart from "@/components/charts/KPIsChart";

export default function DashboardPage() {
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    getKPIs().then(setKpis);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Dashboard</h1>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <p className="text-gray-500">Prospects</p>
          <p className="text-3xl font-bold">{kpis?.totalProspects ?? 0}</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <p className="text-gray-500">Conversion Rate</p>
          <p className="text-3xl font-bold">
            {kpis?.conversionRate ?? 0}%
          </p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <p className="text-gray-500">Projects On Time</p>
          <p className="text-3xl font-bold">
            {kpis?.onTimeRate ?? 0}%
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Prospects by Type</h2>
          <KPIsChart type="prospectsByType" />
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Prospect Conversion</h2>
          <KPIsChart type="conversionRate" />
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Projects On Time</h2>
          <KPIsChart type="onTimeProjects" />
        </div>
      </div>
    </div>
  );
}
