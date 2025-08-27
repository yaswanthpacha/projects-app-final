"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function EditProject({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    // Fetch project data by ID
    const fetchProject = async () => {
      const res = await fetch(`/api/projects/${params.id}`);
      const data = await res.json();
      setFormData(data);
    };
    fetchProject();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/projects/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    router.push("/projects");
  };

  // ✅ All 40 project fields
  const fields = [
    "Customer Name",
    "Partner Company Name",
    "Industry",
    "Product",
    "Competitor",
    "Submitter Name",
    "Submitter Email",
    "NSCorp Customer ID",
    "Implementation Record Number",
    "Customer Website",
    "Customer Annual Revenue",
    "Is Customer Live",
    "Project Completed Last 18 Months",
    "Is Customer Referencable",
    "Is Company Public",
    "PE/VC Backed",
    "PE/VC Firm",
    "Association Member",
    "Association Name",
    "Has M&A",
    "Founded Year",
    "Main Business Lines",
    "Headquarters",
    "Employee Count",
    "Key Decision Maker",
    "Decision Maker Title",
    "Sales Stage",
    "Deal Size",
    "Use Case",
    "Region",
    "Country",
    "Implementation Partner",
    "Project Manager",
    "Go-Live Date",
    "Current Status",
    "Challenges",
    "Opportunities",
    "Value Proposition",
    "Budget",
    "Funding Source",
    "Notes", // ✅ textarea
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Edit Project #{params.id}</h2>
        <Button variant="outline" onClick={() => router.push("/projects")}>
          ← Back
        </Button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {fields.map((field) => {
          const name = field.toLowerCase().replace(/\s+/g, "_");
          const isTextarea = ["notes", "challenges", "opportunities", "value_proposition", "use_case"].includes(
            name
          );

          return (
            <div
              key={field}
              className={isTextarea ? "flex flex-col col-span-2" : "flex flex-col"}
            >
              <label className="text-sm font-semibold mb-1">{field}</label>
              {isTextarea ? (
                <Textarea
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  placeholder={field}
                  className="bg-white text-black placeholder-gray-500"
                />
              ) : (
                <Input
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  placeholder={field}
                  className="bg-white text-black placeholder-gray-500"
                />
              )}
            </div>
          );
        })}

        {/* Save Button */}
        <div className="col-span-2 flex justify-end">
          <Button type="submit" className="px-6 py-2">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
