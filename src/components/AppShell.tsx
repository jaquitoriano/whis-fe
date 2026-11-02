"use client";

import Link from "next/link";
import { Boxes, Braces, CreditCard, LayoutDashboard, Menu, Settings, ShieldCheck, UserRound, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAuthSession, getAuthSession } from "@/lib/session";
import { apiRequest } from "@/lib/api";

export function AppShell({ title, section, children }: { title: string; section: string; children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState(getAuthSession());
  const links = [
    ["Overview", "/", LayoutDashboard],
    ["Users", "/users", Users],
    ["Configuration", "/settings", Settings],
    ["Billing & usage", "/billing", CreditCard],
    ["Authentication", "/auth", ShieldCheck],
    ["Queue monitor", "/admin/queues", Boxes],
    ["Profile", "/profile", UserRound],
  ] as const;

  useEffect(() => {
    setSession(getAuthSession());
    const refreshSession = () => setSession(getAuthSession());
    window.addEventListener("whis-session-updated", refreshSession);
    window.addEventListener("storage", refreshSession);
    return () => {
      window.removeEventListener("whis-session-updated", refreshSession);
      window.removeEventListener("storage", refreshSession);
    };
  }, []);

  async function logout() {
    await apiRequest("auth/logout", { method: "POST" });
    clearAuthSession();
    router.replace("/auth/login");
    router.refresh();
  }

  const displayName = session?.displayName || session?.email?.split("@")[0] || "User";
  const initials = displayName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">W</span><span>Whis</span></div>
      <nav>
        <div className="nav-label">Workspace</div>
        {links.slice(0, 4).map(([label, href, Icon]) => <Link key={href} className={`nav-link ${section === label ? "active" : ""}`} href={href}><Icon />{label}</Link>)}
        <div className="nav-label">System</div>
        {links.slice(4).map(([label, href, Icon]) => <Link key={href} className={`nav-link ${section === label ? "active" : ""}`} href={href}><Icon />{label}</Link>)}
      </nav>
      <div className="sidebar-footer">
        <Link className="profile" href="/profile">
          <div className="avatar">{initials}</div>
          <div><strong>{displayName}</strong><span>{session?.email || "API session"}</span></div>
        </Link>
        {session && <button className="panel-action" onClick={logout} style={{ width: "100%", padding: 8 }}>Log out</button>}
      </div>
    </aside>
    <main className="main">
      <header className="topbar"><div style={{ display: "flex", alignItems: "center", gap: 10 }}><button className="icon-button mobile-menu" aria-label="Open menu"><Menu size={17} /></button><div className="topbar-path">Whis&nbsp; / &nbsp;<strong>{title}</strong></div></div><div style={{ display: "flex", gap: 8 }}><a className="icon-button" href="/openapi.json" target="_blank" rel="noreferrer" aria-label="Open API contract"><Braces size={16} /></a></div></header>
      <div className="content">{children}</div>
    </main>
  </div>;
}
