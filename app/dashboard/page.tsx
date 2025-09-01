"use client";

import { motion } from "framer-motion";
import KPIsChart from "@/components/charts/KPIsChart";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <motion.h1
        className="text-3xl font-bold flex items-center mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        📊 Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Prospects Chart */}
        <motion.div
          className="bg-zinc-900 rounded-2xl shadow-md p-4 border border-zinc-800"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold mb-3">Prospects Overview</h2>
          <KPIsChart type="prospectsByType" />
        </motion.div>

        {/* Conversion Chart */}
        <motion.div
          className="bg-zinc-900 rounded-2xl shadow-md p-4 border border-zinc-800"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold mb-3">Conversion Rate</h2>
          <KPIsChart type="conversionRate" />
        </motion.div>

        {/* On-Time Delivery Chart */}
        <motion.div
          className="bg-zinc-900 rounded-2xl shadow-md p-4 border border-zinc-800"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-lg font-semibold mb-3">On-Time Projects</h2>
          <KPIsChart type="onTimeProjects" />
        </motion.div>
      </div>
    </div>
  );
}
