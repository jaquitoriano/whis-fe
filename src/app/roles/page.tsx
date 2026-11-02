"use client";

import { FormEvent, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ShieldCheck } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function RolesPage() {
  const [message, setMessage] = useState("");

  async function checkPermission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams({
      resource_id: String(form.get("resource_id")),
      action: String(form.get("action")),
    });
    const result = await apiRequest<Record<string, unknown>>(`permissions/check?${params}`);
    setMessage(result.error ?? JSON.stringify(result.data, null, 2));
  }

  async function grantRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await apiRequest<Record<string, unknown>>("permissions/grant", {
      method: "POST",
      body: JSON.stringify({
        subject_id: form.get("subject_id"),
        resource_id: form.get("resource_id"),
        relation: form.get("relation"),
      }),
    });
    setMessage(result.error ?? JSON.stringify(result.data, null, 2));
  }

  return (
    <AppShell title="Roles" section="Roles">
      <div className="page-heading">
        <div><h1>Permission roles</h1><p>Check permissions and manage published role relationships.</p></div>
      </div>
      <section className="dashboard-grid">
        <form className="panel" onSubmit={checkPermission}>
          <div className="panel-header"><h2>Check permission</h2><ShieldCheck size={14} /></div>
          <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <label className="auth-field">Resource ID<input name="resource_id" required /></label>
            <label className="auth-field">Action<input name="action" required placeholder="users.manage" /></label>
            <button className="primary-button">Check access</button>
          </div>
        </form>
        <form className="panel" onSubmit={grantRole}>
          <div className="panel-header"><h2>Grant role relationship</h2></div>
          <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <label className="auth-field">Subject UUID<input name="subject_id" required /></label>
            <label className="auth-field">Resource ID<input name="resource_id" required /></label>
            <label className="auth-field">Relation<input name="relation" required placeholder="admin" /></label>
            <button className="primary-button">Grant relationship</button>
          </div>
        </form>
      </section>
      {message && <pre style={{ marginTop: 12, border: "1px solid var(--line)", borderRadius: 8, background: "white", padding: 16 }}>{message}</pre>}
    </AppShell>
  );
}
