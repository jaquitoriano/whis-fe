"use client";

import { Pause, RotateCcw } from "lucide-react";
import { FormEvent, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { apiRequest } from "@/lib/api";

export default function QueuePage() {
  const [status, setStatus] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState("");
  const [jobId, setJobId] = useState("");

  async function load(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const id = jobId.trim();
    if (!id) {
      setMessage("Enter a job ID to load status.");
      return;
    }
    const result = await apiRequest<Record<string, unknown>>(`jobs/status?job_id=${encodeURIComponent(id)}`);
    if (result.error) setMessage(result.error);
    else {
      setMessage("");
      setStatus(result.data);
    }
  }

  async function enqueue() {
    const result = await apiRequest<Record<string, unknown>>("jobs", {
      method: "POST",
      body: JSON.stringify({ job_type: "usage.report", payload: {}, max_attempts: 3 }),
    });
    if (result.error) {
      setMessage(result.error);
      return;
    }
    const data = result.data ?? {};
    const id = String(data.job_id ?? data.id ?? "");
    if (id) setJobId(id);
    setMessage(id ? `Job enqueued: ${id}` : "Job enqueued.");
    if (id) await loadStatus(id);
  }

  async function loadStatus(id: string) {
    const result = await apiRequest<Record<string, unknown>>(`jobs/status?job_id=${encodeURIComponent(id)}`);
    if (result.error) setMessage(result.error);
    else setStatus(result.data);
  }

  return (
    <AppShell title="Queue monitor" section="Queue monitor">
      <div className="page-heading">
        <div><h1>Queue monitor</h1><p>Live background job operations from the queue API.</p></div>
        <button className="primary-button" onClick={enqueue}><Pause size={15} />Enqueue report</button>
      </div>
      {message && <p className="auth-error">{message}</p>}
      <section className="panel">
        <div className="panel-header">
          <h2>Job status</h2>
          <button className="panel-action" onClick={() => void load()}><RotateCcw size={12} /> Refresh</button>
        </div>
        <form onSubmit={load} style={{ padding: 16, display: "flex", gap: 8 }}>
          <input value={jobId} onChange={(event) => setJobId(event.target.value)} aria-label="Job ID" placeholder="Job ID" required style={{ flex: 1 }} />
          <button className="primary-button" type="submit">Load status</button>
        </form>
        <pre style={{ margin: 0, padding: 16, overflow: "auto" }}>{status ? JSON.stringify(status, null, 2) : "No job status loaded."}</pre>
      </section>
    </AppShell>
  );
}
