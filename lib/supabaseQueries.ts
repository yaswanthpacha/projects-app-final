import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export async function getKPIs() {
  // Fetch raw data
  const { data, error } = await supabase.from("projects").select("*");
  if (error) {
    console.error(error);
    return null;
  }

  // Total prospects by type
  const totalProspects = data.length;

  // Conversion Rate: prospects → customers
  const converted = data.filter((d) => d.is_customer).length;
  const conversionRate = totalProspects
    ? Math.round((converted / totalProspects) * 100)
    : 0;

  // Projects delivered on time
  const delivered = data.filter((d) => d.is_delivered).length;
  const onTime = data.filter((d) => d.is_delivered && d.on_time).length;
  const onTimeRate = delivered
    ? Math.round((onTime / delivered) * 100)
    : 0;

  return { totalProspects, conversionRate, onTimeRate };
}

export async function getKPIsChartData(type: string) {
  const { data, error } = await supabase.from("projects").select("*");
  if (error || !data) {
    console.error(error);
    return [];
  }

  switch (type) {
    case "prospectsByType":
      const counts: Record<string, number> = {};
      data.forEach((d) => {
        const key = d.type || "Unknown";
        counts[key] = (counts[key] || 0) + 1;
      });
      return Object.entries(counts).map(([label, value]) => ({
        label,
        value,
      }));

    case "conversionRate":
      const total = data.length;
      const converted = data.filter((d) => d.is_customer).length;
      return [
        { label: "Converted", value: converted },
        { label: "Not Converted", value: total - converted },
      ];

    case "onTimeProjects":
      const delivered = data.filter((d) => d.is_delivered).length;
      const onTime = data.filter((d) => d.is_delivered && d.on_time).length;
      return [
        { label: "On Time", value: onTime },
        { label: "Delayed", value: delivered - onTime },
      ];

    default:
      return [];
  }
}
