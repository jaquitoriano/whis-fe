"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { apiRequest } from "@/lib/api";
import { getAuthSession, setAuthSession } from "@/lib/session";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const session = getAuthSession();
    if (!session) return;
    setEmail(session.email);
    setDisplayName(session.displayName || session.email.split("@")[0]);
    void apiRequest<Record<string, unknown>>("config?scope=user&key=profile.display_name").then((result) => {
      if (!result.data) return;
      const value = result.data.value;
      if (typeof value === "string") {
        setDisplayName(value);
        setAuthSession({ ...session, displayName: value });
      }
    });
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const result = await apiRequest("config", {
      method: "PUT",
      body: JSON.stringify({ scope: "user", key: "profile.display_name", value: displayName }),
    });
    if (result.error) {
      setMessage(result.error);
      return;
    }
    const session = getAuthSession();
    if (session) setAuthSession({ ...session, displayName });
    window.dispatchEvent(new Event("whis-session-updated"));
    setMessage("Profile updated.");
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const result = await apiRequest("auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
    if (result.error) setMessage(result.error);
    else {
      setPassword("");
      setToken("");
      setMessage("Password updated.");
    }
  }

  return (
    <AppShell title="Profile" section="Profile">
      <div className="page-heading">
        <div><h1>User dashboard</h1><p>Manage your profile and account security.</p></div>
      </div>
      {message && <p className="auth-error">{message}</p>}
      <section className="dashboard-grid">
        <form className="panel" onSubmit={saveProfile}>
          <div className="panel-header"><h2>Profile</h2></div>
          <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <label className="auth-field">Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} required /></label>
            <label className="auth-field">Email<input value={email} readOnly /></label>
            <button className="primary-button" type="submit">Save profile</button>
          </div>
        </form>
        <form className="panel" onSubmit={updatePassword}>
          <div className="panel-header"><h2>Update password</h2></div>
          <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <label className="auth-field">Reset token<input value={token} onChange={(event) => setToken(event.target.value)} required /></label>
            <label className="auth-field">New password<input type="password" minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
            <button className="primary-button" type="submit">Update password</button>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
