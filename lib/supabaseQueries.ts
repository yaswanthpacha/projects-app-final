import { supabase } from "./supabaseClient";

type Filters = {
  industry?: string | null;
  salesRep?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

function applyFilters(query: any, filters: Filters) {
  if (filters.industry) query = query.eq("industry", filters.industry);
  if (filters.salesRep) query = query.eq("sales_rep", filters.salesRep);
  if (filters.startDate) query = query.gte("created_at", filters.startDate);
  if (filters.endDate) query = query.lte("created_at", filters.endDate);
  return query;
}

export async function getProspectsByType(filters: Filters = {}) {
  let query = supabase.from("prospects").select("id, prospect_type, industry, sales_rep, created_at");
  query = applyFilters(query, filters);
  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export async function getConversionRate(filters: Filters = {}) {
  let query = supabase.from("prospects").select("status, industry, sales_rep, created_at");
  query = applyFilters(query, filters);
  const { data, error } = await query;
  if (error || !data) return 0;

  const converted = data.filter((p) => p.status === "customer").length;
  return data.length ? Math.round((converted / data.length) * 100) : 0;
}

export async function getOnTimeProjects(filters: Filters = {}) {
  let query = supabase.from("projects").select("delivered_on_time, industry, sales_rep, created_at");
  query = applyFilters(query, filters);
  const { data, error } = await query;
  if (error || !data) return 0;

  const onTime = data.filter((p) => p.delivered_on_time === true).length;
  return data.length ? Math.round((onTime / data.length) * 100) : 0;
}

export async function getProspectsTrend(filters: Filters = {}) {
  let query = supabase.from("prospects").select("id, created_at, industry, sales_rep");
  query = applyFilters(query, filters);
  const { data, error } = await query;
  if (error || !data) return [];

  const grouped: Record<string, number> = {};
  data.forEach((p) => {
    const month = new Date(p.created_at).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    grouped[month] = (grouped[month] || 0) + 1;
  });

  return Object.entries(grouped).map(([month, prospects]) => ({
    month,
    prospects,
  }));
}
