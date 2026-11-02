"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function ResetPasswordPage() {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const result = await apiRequest<Record<string, unknown>>("auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token: form.get("token"), password: form.get("password") }),
    });
    setSubmitting(false);
    setMessage(result.error ?? JSON.stringify(result.data, null, 2));
  }

  return <main className="auth-page"><section className="auth-brand-panel"><div className="brand"><span className="brand-mark">W</span><span>Whis</span></div><div className="auth-copy"><h1>Recover<br />access.</h1><p>Set a new password with a reset token issued by the API.</p></div></section><section className="auth-form-panel"><form className="auth-form" onSubmit={submit}><h2>Reset password</h2>{message && <div className="auth-error">{message}</div>}<label className="auth-field">Reset token<input name="token" required /></label><label className="auth-field">New password<input name="password" type="password" minLength={12} required /></label><button className="auth-submit" type="submit" disabled={submitting}>{submitting ? "Resetting..." : "Reset password"}</button><div className="auth-links"><Link href="/auth/login">Back to sign in</Link></div></form></section></main>;
}
