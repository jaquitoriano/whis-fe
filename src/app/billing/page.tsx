"use client";

import { Download, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { apiRequest } from "@/lib/api";

export default function BillingPage() {
  const [usage, setUsage] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void apiRequest<Record<string, unknown>>("meter/usage?metric_name=api.requests").then((result) => {
      if (result.error) setError(result.error);
      else setUsage(result.data);
    });
  }, []);

  async function reserve() {
    const result = await apiRequest("meter/reserve", {
      method: "POST",
      body: JSON.stringify({ metric_name: "api.requests", quantity: 1000 }),
    });
    setError(result.error ?? "Reservation created.");
  }

  function exportUsage() {
    const blob = new Blob([JSON.stringify(usage, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "whis-metering-usage.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return <AppShell title="Billing & usage" section="Billing & usage"><div className="page-heading"><div><h1>Billing & usage</h1><p>Live credits and reservations from the usage API.</p></div><button className="primary-button" onClick={reserve}><Plus size={15} />Reserve 1k credits</button></div>{error && <p>{error}</p>}<section className="panel"><div className="panel-header"><h2>Metering usage</h2><button className="panel-action" onClick={exportUsage} disabled={!usage} style={{ display: "flex", alignItems: "center", gap: 5 }}><Download size={12} />Export JSON</button></div><pre style={{ margin: 0, padding: 16, overflow: "auto" }}>{usage ? JSON.stringify(usage, null, 2) : "Loading usage..."}</pre></section></AppShell>;
}
