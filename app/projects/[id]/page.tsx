"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProjectDetail(){
  const supabase = createClientComponentClient();
  useEffect(()=>{
    (async()=>{
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login";
    })();
  },[]);

  const params = useParams();
  const id = Number(params.id);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
      if (error) setError(error.message);
      setData(data);
      setLoading(false);
    })();
  },[id]);

  if (loading) return <div>Loading…</div>;
  if (!data) return <div>No project found.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Project #{data.id} — {data.customer_name || "Untitled"}</h2>
        <div className="flex gap-2">
          <Link href={`/projects/${data.id}/edit`} className="px-3 py-2 rounded-xl text-sm bg-yellow-500 text-white">✏️ Edit</Link>
          <Link href="/projects" className="px-3 py-2 rounded-xl text-sm bg-gray-200">Back</Link>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {Object.keys(data).sort().map((k)=> (
              <div key={k} className="border rounded-xl p-3">
                <div className="text-xs text-gray-500">{k}</div>
                <div className="font-medium break-words">{String(data[k] ?? "")}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}