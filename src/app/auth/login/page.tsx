 "use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";
import { setAuthSession } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const result = await apiRequest<{ mfa_required?: boolean; user_id?: string; display_name?: string }>("auth/login", {
      method: "POST",
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setAuthSession({ email, userId: result.data?.user_id, displayName: result.data?.display_name });
    if (result.data?.mfa_required) router.push("/auth/mfa");
    else {
      router.replace("/");
      router.refresh();
    }
  }

  return <main className="auth-page"><section className="auth-brand-panel"><div className="brand"><span className="brand-mark">W</span><span>Whis</span></div><div className="auth-copy"><h1>One workspace.<br />Every identity.</h1><p>Manage users, groups, permissions, and secure workspace configuration.</p></div></section><section className="auth-form-panel"><form className="auth-form" onSubmit={submit}><h2>Welcome back</h2><p>Sign in to your administration workspace.</p>{error && <div className="auth-error">{error}</div>}<label className="auth-field">Email address<input name="email" type="email" required placeholder="name@company.com" /></label><label className="auth-field">Password<input name="password" type="password" required placeholder="Enter your password" /></label><button className="auth-submit" type="submit" disabled={submitting}>{submitting ? "Signing in..." : "Sign in"}</button><div className="auth-links"><Link href="/auth/reset">Reset password</Link><br />New to Whis? <Link href="/auth/signup">Create an account</Link></div></form></section></main>;
}
