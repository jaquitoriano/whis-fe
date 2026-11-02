"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, Settings, ShieldCheck, UserPlus, UsersRound } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { apiRequest } from "@/lib/api";

export default function Home() {
  const [health, setHealth] = useState<Record<string, unknown> | null>(null);
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void apiRequest<Record<string, unknown>>("health").then((result) => {
      if (result.error) setError(result.error);
      else setHealth(result.data);
    });
    void apiRequest<Record<string, unknown>>("config?scope=system&key=workspace.name").then((result) => {
      if (!result.error) setConfig(result.data);
    });
  }, []);

  return (
    <AppShell title="Overview" section="Overview">
      <div className="page-heading">
        <div><h1>User management overview</h1><p>Live identity and authorization operations.</p></div>
      </div>
      {error && <p className="auth-error">{error}</p>}
      <section className="metrics">
        <div className="metric">
          <div className="metric-top"><span>API health</span><Activity size={14} /></div>
          <div className="metric-value">{health ? String(health.status ?? "available") : "..."}</div>
          <div className="metric-note">/api/health</div>
        </div>
        <div className="metric">
          <div className="metric-top"><span>Configuration</span><Settings size={14} /></div>
          <div className="metric-value">{config ? "Live" : "..."}</div>
          <div className="metric-note">workspace.name</div>
        </div>
        <div className="metric">
          <div className="metric-top"><span>Users</span><UsersRound size={14} /></div>
          <div className="metric-value">Access</div>
          <div className="metric-note">Permission management</div>
        </div>
        <div className="metric">
          <div className="metric-top"><span>Authorization</span><ShieldCheck size={14} /></div>
          <div className="metric-value">Roles</div>
          <div className="metric-note">Group inheritance</div>
        </div>
      </section>
      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header"><h2>User administration</h2></div>
          <div className="jobs">
            <Link className="job" href="/users"><ShieldCheck size={14} /><div><div className="job-name">Users and access</div><div className="job-time">Permission check and role grant</div></div></Link>
            <Link className="job" href="/groups"><UsersRound size={14} /><div><div className="job-name">User groups</div><div className="job-time">Membership and group administration</div></div></Link>
            <Link className="job" href="/roles"><UserPlus size={14} /><div><div className="job-name">Permission roles</div><div className="job-time">Role and relation management</div></div></Link>
            <Link className="job" href="/settings"><Settings size={14} /><div><div className="job-name">Configuration</div><div className="job-time">Tenant and system settings</div></div></Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
