"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import IndustryChart from "@/components/charts/IndustryChart";
import ProductChart from "@/components/charts/ProductChart";
import CompetitorChart from "@/components/charts/CompetitorChart";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* ✅ Updated link to new-project page */}
        <Link href="/new-project">
          <Button className="rounded-2xl">➕ New Project</Button>
        </Link>
        <Link href="/projects/search">
  <Button className="rounded-2xl">🔍 Search Projects</Button>
</Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">Total Projects</h2>
            <p className="text-3xl font-bold">9</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">Unique Industries</h2>
            <p className="text-3xl font-bold">9</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">Unique Partners</h2>
            <p className="text-3xl font-bold">2</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <h2 className="text-md font-semibold mb-2">By Industry</h2>
            <IndustryChart />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-md font-semibold mb-2">By Product</h2>
            <ProductChart />
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardContent>
            <h2 className="text-md font-semibold mb-2">By Competitor</h2>
            <CompetitorChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
