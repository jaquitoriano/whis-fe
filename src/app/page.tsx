"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, Boxes, CreditCard, Gauge, Settings, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { apiRequest } from "@/lib/api";

export default function Home() {
  const [health, setHealth] = useState<Record<string, unknown> | null>(null);
  const [usage, setUsage] = useState<Record<string, unknown> | null>(null);
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [pathCount, setPathCount] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void apiRequest<Record<string, unknown>>("health").then((result) => {
      if (result.error) setError(result.error);
      else setHealth(result.data);
    });
    void apiRequest<Record<string, unknown>>("meter/usage?metric_name=api.requests").then((result) => {
      if (result.error) setError(result.error);
      else setUsage(result.data);
    });
    void apiRequest<Record<string, unknown>>("config?scope=system&key=workspace.name").then((result) => {
      if (!result.error) setConfig(result.data);
    });
    void fetch("/openapi.json").then(async (response) => {
      if (!response.ok) return;
      const contract = await response.json() as { paths?: Record<string, unknown> };
      setPathCount(Object.keys(contract.paths ?? {}).length);
    });
  }, []);

  return (
    <AppShell title="Overview" section="Overview">
      <div className="page-heading">
        <div><h1>System overview</h1><p>Live status from the User Management API.</p></div>
      </div>
      {error && <p className="auth-error">{error}</p>}
      <section className="metrics">
        <div className="metric">
          <div className="metric-top"><span>API health</span><Activity size={14} /></div>
          <div className="metric-value">{health ? String(health.status ?? "available") : "..."}</div>
          <div className="metric-note">/api/health</div>
        </div>
        <div className="metric">
          <div className="metric-top"><span>Usage source</span><Gauge size={14} /></div>
          <div className="metric-value">{usage ? "Live" : "..."}</div>
          <div className="metric-note">api.requests</div>
        </div>
        <div className="metric">
          <div className="metric-top"><span>Configuration</span><Settings size={14} /></div>
          <div className="metric-value">{config ? "Live" : "..."}</div>
          <div className="metric-note">workspace.name</div>
        </div>
        <div className="metric">
          <div className="metric-top"><span>API contract</span><Boxes size={14} /></div>
          <div className="metric-value">{pathCount ?? "..."}</div>
          <a className="metric-note" href="/openapi.json" target="_blank" rel="noreferrer">Open OpenAPI JSON</a>
        </div>
      </section>
      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header"><h2>API modules</h2></div>
          <div className="jobs">
            <Link className="job" href="/users"><ShieldCheck size={14} /><div><div className="job-name">Users and access</div><div className="job-time">Permission check and role grant</div></div></Link>
            <Link className="job" href="/settings"><Settings size={14} /><div><div className="job-name">Configuration</div><div className="job-time">Read and publish values</div></div></Link>
            <Link className="job" href="/billing"><CreditCard size={14} /><div><div className="job-name">Billing and usage</div><div className="job-time">Usage and reservations</div></div></Link>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header"><h2>Live usage</h2><Link className="panel-action" href="/billing">Details</Link></div>
          <pre style={{ margin: 0, padding: 16, overflow: "auto" }}>{usage ? JSON.stringify(usage, null, 2) : "Loading..."}</pre>
        </div>
      </section>
    </AppShell>
  );
}
