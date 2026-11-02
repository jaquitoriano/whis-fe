"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function MfaPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const userId = form.get("user_id")?.toString();
    const result = await apiRequest("auth/mfa/verify", {
      method: "POST",
      body: JSON.stringify({ user_id: userId, code: form.get("code") }),
    });
    if (result.error) setError(result.error);
    else router.push("/");
  }

  return <main className="auth-page"><section className="auth-brand-panel"><div className="brand"><span className="brand-mark">W</span><span>Whis</span></div><div className="auth-copy"><h1>A final<br />check.</h1><p>Your workspace requires multi-factor verification for administrator access.</p></div></section><section className="auth-form-panel"><form className="auth-form" onSubmit={submit}><h2>Verify your identity</h2><p>Enter the user ID and the six-digit authenticator code.</p>{error && <div className="auth-error">{error}</div>}<label className="auth-field">User ID<input name="user_id" required placeholder="UUID from login response" /></label><label className="auth-field">Code<input name="code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required placeholder="000000" /></label><button className="auth-submit" type="submit">Verify and continue</button><div className="auth-links"><Link href="/auth/login">Back to sign in</Link></div></form></section></main>;
}
