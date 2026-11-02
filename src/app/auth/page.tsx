"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { LogOut, KeyRound } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function AuthPage() {
  const [message, setMessage] = useState("");

  async function logout() {
    const result = await apiRequest<Record<string, unknown>>("auth/logout", { method: "POST" });
    setMessage(result.error ?? JSON.stringify(result.data, null, 2));
  }

  return <AppShell title="Authentication" section="Authentication"><div className="page-heading"><div><h1>Authentication</h1><p>Manage API-backed sessions, MFA, and password recovery.</p></div></div><section className="dashboard-grid"><div className="panel"><div className="panel-header"><h2>Session</h2><LogOut size={14} /></div><div style={{ padding: 16, display: "grid", gap: 12 }}><p style={{ fontSize: 12 }}>Sign out the current API session.</p><button className="primary-button" onClick={logout}>Log out</button></div></div><div className="panel"><div className="panel-header"><h2>Security actions</h2><KeyRound size={14} /></div><div style={{ padding: 16, display: "grid", gap: 10 }}><Link className="primary-button" href="/auth/mfa">Verify MFA</Link><Link className="primary-button" href="/auth/reset">Reset password</Link></div></div></section>{message && <pre style={{ marginTop: 12, border: "1px solid var(--line)", borderRadius: 8, background: "white", padding: 16 }}>{message}</pre>}</AppShell>;
}
