"use client";

import { AppShell } from "@/components/AppShell";
import { UsersRound } from "lucide-react";

export default function GroupsPage() {
  return (
    <AppShell title="Groups" section="Groups">
      <div className="page-heading">
        <div><h1>User groups</h1><p>Manage group membership and inherited permissions.</p></div>
      </div>
      <section className="panel">
        <div className="panel-header"><h2>API availability</h2><UsersRound size={14} /></div>
        <div style={{ padding: 16 }}>
          <p>The deployed OpenAPI contract does not currently publish group CRUD or membership endpoints.</p>
          <p>Group management will use tenant-scoped <code>/api/groups/*</code> endpoints when those routes are added.</p>
        </div>
      </section>
    </AppShell>
  );
}
