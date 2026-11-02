"use client";

import { AppShell } from "@/components/AppShell";
import { Save } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function SettingsPage() {
  const [key, setKey] = useState("workspace.name");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    void apiRequest<Record<string, unknown>>(`config?scope=system&key=${encodeURIComponent(key)}`).then((result) => {
      if (result.data) setValue(typeof result.data.value === "string" ? result.data.value : JSON.stringify(result.data.value ?? ""));
    });
  }, [key]);

  async function publish(event: FormEvent) {
    event.preventDefault();
    const result = await apiRequest("config", { method: "PUT", body: JSON.stringify({ scope: "system", key, value }) });
    setMessage(result.error ?? "Configuration published.");
  }

  return <AppShell title="Configuration" section="Configuration"><div className="page-heading"><div><h1>Workspace configuration</h1><p>Versioned system settings and feature controls.</p></div></div><form onSubmit={publish}><section className="panel"><div className="panel-header"><h2>Configuration value</h2><span className="status active">Live API</span></div><div style={{ padding: 16, display: "grid", gap: 14 }}><label style={{ display: "grid", gap: 7, fontSize: 11, fontWeight: 800 }}>Key<input value={key} onChange={(event) => setKey(event.target.value)} /></label><label style={{ display: "grid", gap: 7, fontSize: 11, fontWeight: 800 }}>Value<textarea value={value} onChange={(event) => setValue(event.target.value)} rows={4} /></label>{message && <p>{message}</p>}<button className="primary-button" type="submit"><Save size={15} />Publish changes</button></div></section></form></AppShell>;
}
