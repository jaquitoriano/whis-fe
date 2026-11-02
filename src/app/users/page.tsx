"use client";

import { AppShell } from "@/components/AppShell";
import { ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function UsersPage() {
  const [message, setMessage] = useState("");

  async function check(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams({ resource_id: String(form.get("resource_id")), action: String(form.get("action")) });
    const result = await apiRequest<Record<string, unknown>>(`permissions/check?${params}`);
    setMessage(result.error ?? JSON.stringify(result.data, null, 2));
  }

  async function grant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await apiRequest<Record<string, unknown>>("permissions/grant", {
      method: "POST",
      body: JSON.stringify({ subject_id: form.get("subject_id"), resource_id: form.get("resource_id"), relation: form.get("relation") }),
    });
    setMessage(result.error ?? JSON.stringify(result.data, null, 2));
  }

  return <AppShell title="Users" section="Users"><div className="page-heading"><div><h1>User access</h1><p>Check and grant API-backed relationships.</p></div></div><section className="dashboard-grid"><form className="panel" onSubmit={check}><div className="panel-header"><h2>Check permission</h2><ShieldCheck size={14} /></div><div style={{ padding: 16, display: "grid", gap: 12 }}><label className="auth-field">Resource ID<input name="resource_id" required /></label><label className="auth-field">Action<input name="action" required placeholder="read" /></label><button className="primary-button">Check access</button></div></form><form className="panel" onSubmit={grant}><div className="panel-header"><h2>Grant role</h2></div><div style={{ padding: 16, display: "grid", gap: 12 }}><label className="auth-field">Subject UUID<input name="subject_id" required /></label><label className="auth-field">Resource ID<input name="resource_id" required /></label><label className="auth-field">Relation<input name="relation" required placeholder="admin" /></label><button className="primary-button">Grant relation</button></div></form></section>{message && <pre style={{ marginTop: 12, border: "1px solid var(--line)", borderRadius: 8, background: "white", padding: 16, overflow: "auto" }}>{message}</pre>}</AppShell>;
}
