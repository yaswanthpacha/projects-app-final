"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";

// All 40 project fields
const PROJECT_FIELDS = [
  "by_industry",
  "by_product",
  "by_competitor",
  "partner_company_name",
  "submitter_name",
  "submitter_email",
  "nscorp_customer_id",
  "customer_name",
  "implementation_record_number",
  "customer_website",
  "customer_annual_revenue",
  "is_customer_live",
  "project_completed_last_18_months",
  "is_customer_referencable",
  "is_company_public",
  "is_pe_vc_backed",
  "pe_vc_firm",
  "is_association_member",
  "association_name",
  "has_mna",
  "founded_year",
  "main_business_lines",
  "top_challenges",
  "previous_technology",
  "other_technology",
  "competitors_in_deal",
  "other_competitors",
  "why_chose_netsuite",
  "netsuite_modules",
  "suiteapps_used",
  "additional_apps",
  "leveraging_ai",
  "ai_usage",
  "partner_customizations",
  "customization_benefits",
  "implementation_summary",
  "go_live_duration",
  "implementation_benefits",
  "whats_next",
  "customer_quote",
];

// Mapping of fields in prospects → projects
const FIELD_MAP: Record<string, string> = {
  prospect: "customer_name",
  ns_sales_rep: "submitter_name",
  zenardy_sc: "partner_company_name",
  industry: "by_industry",
  ns_solution_proposed: "netsuite_modules",
  zenardy_cost: "additional_apps",
  close_date: "go_live_duration",
  stage: "project_completed_last_18_months",
  next_steps: "implementation_summary",
  status: "status",
  prospect_type: "by_product",
};

export default function ConvertProspect() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const params = useParams();
  const prospectId = Number(params.prospectId);

  const [form, setForm] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Prefill project form from prospect
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("prospects")
        .select("*")
        .eq("id", prospectId)
        .single();

      if (data) {
        const prefill: Record<string, any> = {};
        PROJECT_FIELDS.forEach(field => {
          // Prefill only if mapped from prospect
          const prospectField = Object.keys(FIELD_MAP).find(
            key => FIELD_MAP[key] === field
          );
          if (prospectField && data[prospectField] !== undefined) {
            prefill[field] = data[prospectField];
          } else {
            prefill[field] = ""; // leave empty for manual input
          }
        });
        setForm(prefill);
      }
      setLoading(false);
    })();
  }, [prospectId]);

  const handleChange = (key: string, value: any) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);

    // Insert into projects table
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .insert([form])
      .select()
      .single();

    if (projectError) {
      setSaving(false);
      alert(projectError.message);
      return;
    }

    // Update prospect: mark as converted and set project_id
    await supabase
      .from("prospects")
      .update({ status: "converted", project_id: projectData.id })
      .eq("id", prospectId);

    setSaving(false);
    router.push("/prospects"); // redirect to prospects list
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-semibold">
        Convert Prospect #{prospectId} to Project
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROJECT_FIELDS.map(f => (
          <label key={f} className="flex flex-col gap-1">
            <span className="text-sm font-medium">{f}</span>
            <input
              className="border rounded-xl px-3 py-2 text-gray-900 bg-white placeholder-gray-400"
              value={form[f] ?? ""}
              onChange={e => handleChange(f, e.target.value)}
              placeholder={f}
              type="text"
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

