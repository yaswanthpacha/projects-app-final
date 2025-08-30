"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";

type Field = { key: string; label: string; type?: "text" | "boolean" };

const FIELDS: Field[] = [
  { key: "customer_name", label: "Customer Name" },
  { key: "partner_company_name", label: "Partner Company Name" },
  { key: "by_industry", label: "Industry" },
  { key: "by_product", label: "Product" },
  { key: "by_competitor", label: "Competitor" },
  { key: "submitter_name", label: "Submitter Name" },
  { key: "submitter_email", label: "Submitter Email" },
  // ... rest of your fields
];

export default function NewProjectClient() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const params = useSearchParams();

  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");
    })();
  }, [supabase, router]);

  const [fromProspect, setFromProspect] = useState<string | null>(null);

  useEffect(() => {
    const param = params.get("fromProspect");
    if (param) setFromProspect(param);
  }, [params]);

  useEffect(() => {
    if (!fromProspect) return;
    (async () => {
      const { data, error } = await supabase
        .from("prospects")
        .select("*")
        .eq("id", Number(fromProspect))
        .single();
      if (!error && data) {
        setForm(prev => ({
          ...prev,
          customer_name: data.prospect ?? "",
          by_industry: data.industry ?? "",
          submitter_name: data.zenardy_sc ?? "",
          partner_company_name: data.ns_sales_rep ?? "",
        }));
      }
    })();
  }, [fromProspect, supabase]);

  const handleChange = (key: string, value: any) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("projects").insert([form]);
    setSaving(false);
    if (error) setError(error.message);
    else router.push("/projects");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Add Project</h2>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map(f => (
          <label key={f.key} className="flex flex-col gap-1">
            <span className="text-sm font-medium">{f.label}</span>
            {f.type === "boolean" ? (
              <select
                className="border rounded-xl px-3 py-2"
                value={form[f.key] ?? ""}
                onChange={e =>
                  handleChange(
                    f.key,
                    e.target.value === "" ? null : e.target.value === "true"
                  )
                }
              >
                <option value="">—</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            ) : (
              <input
                className="border rounded-xl px-3 py-2"
                value={form[f.key] ?? ""}
                onChange={e => handleChange(f.key, e.target.value)}
                placeholder={f.label}
              />
            )}
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
