"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";

const FIELDS = [
  { key: "prospect", label: "Prospect" },
  { key: "ns_sales_rep", label: "NS Sales Rep" },
  { key: "zenardy_sc", label: "Zenardy SC" },
  { key: "industry", label: "Industry" },
  { key: "ns_solution_proposed", label: "NS Solution Proposed" },
  { key: "zenardy_cost", label: "Zenardy Cost" },
  { key: "close_date", label: "Close Date", type: "date" },
  { key: "stage", label: "Stage" },
  { key: "next_steps", label: "Next Steps" },
  { key: "status", label: "Status" },
];

export default function EditProspect() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const [form, setForm] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("prospects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) setError(error.message);
      setForm(data || {});
      setLoading(false);
    })();
  }, [supabase, id]);

  const handleChange = (key: string, value: any) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("prospects").update(form).eq("id", id);
    setSaving(false);
    if (error) setError(error.message);
    else router.push("/prospects");
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Edit Prospect #{id}</h2>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map(f => (
          <label key={f.key} className="flex flex-col gap-1">
            <span className="text-sm font-medium">{f.label}</span>
            <input
              className="border rounded-xl px-3 py-2"
              value={form[f.key] ?? ""}
              onChange={e => handleChange(f.key, e.target.value)}
              placeholder={f.label}
              type={f.type === "date" ? "date" : "text"}
            />
          </label>
        ))}
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={() => router.back()}>
          Back
        </Button>
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}