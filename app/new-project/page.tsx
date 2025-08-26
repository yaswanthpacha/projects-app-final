"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  { key: "nscorp_customer_id", label: "NSCorp Customer ID" },
  { key: "implementation_record_number", label: "Implementation Record Number" },
  { key: "customer_website", label: "Customer Website" },
  { key: "customer_annual_revenue", label: "Customer Annual Revenue" },
  { key: "is_customer_live", label: "Is Customer Live", type: "boolean" },
  { key: "project_completed_last_18_months", label: "Project Completed Last 18 Months", type: "boolean" },
  { key: "is_customer_referencable", label: "Is Customer Referencable", type: "boolean" },
  { key: "is_company_public", label: "Is Company Public", type: "boolean" },
  { key: "is_pe_vc_backed", label: "PE/VC Backed", type: "boolean" },
  { key: "pe_vc_firm", label: "PE/VC Firm" },
  { key: "is_association_member", label: "Association Member", type: "boolean" },
  { key: "association_name", label: "Association Name" },
  { key: "has_mna", label: "Has M&A", type: "boolean" },
  { key: "founded_year", label: "Founded Year" },
  { key: "main_business_lines", label: "Main Business Lines" },
  { key: "top_challenges", label: "Top Challenges" },
  { key: "previous_technology", label: "Previous Technology" },
  { key: "other_technology", label: "Other Technology" },
  { key: "competitors_in_deal", label: "Competitors in Deal" },
  { key: "other_competitors", label: "Other Competitors" },
  { key: "why_chose_netsuite", label: "Why Chose NetSuite" },
  { key: "netsuite_modules", label: "NetSuite Modules" },
  { key: "suiteapps_used", label: "SuiteApps Used" },
  { key: "additional_apps", label: "Additional Apps" },
  { key: "leveraging_ai", label: "Leveraging AI", type: "boolean" },
  { key: "ai_usage", label: "AI Usage" },
  { key: "partner_customizations", label: "Partner Customizations" },
  { key: "customization_benefits", label: "Customization Benefits" },
  { key: "implementation_summary", label: "Implementation Summary" },
  { key: "go_live_duration", label: "Go Live Duration" },
  { key: "implementation_benefits", label: "Implementation Benefits" },
  { key: "whats_next", label: "What's Next" },
  { key: "customer_quote", label: "Customer Quote" }
];

export default function NewProject() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if no user
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login";
    })();
  }, [supabase]);

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
                    e.target.value === ""
                      ? null
                      : e.target.value === "true"
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
