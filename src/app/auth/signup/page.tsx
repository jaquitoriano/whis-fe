 "use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await apiRequest("auth/signup", {
      method: "POST",
      body: JSON.stringify({ display_name: form.get("display_name"), email: form.get("email"), password: form.get("password") }),
    });
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/auth/login");
  }

  return <main className="auth-page"><section className="auth-brand-panel"><div className="brand"><span className="brand-mark">W</span><span>Whis</span></div><div className="auth-copy"><h1>Your team,<br />under control.</h1><p>Create a workspace with identity, billing, configuration, and queue operations connected.</p></div></section><section className="auth-form-panel"><form className="auth-form" onSubmit={submit}><h2>Create your workspace</h2><p>Start with an administrator account.</p>{error && <div className="auth-error">{error}</div>}<label className="auth-field">Full name<input name="display_name" placeholder="Display name" /></label><label className="auth-field">Work email<input name="email" type="email" required placeholder="name@company.com" /></label><label className="auth-field">Password<input name="password" type="password" minLength={12} required placeholder="At least 12 characters" /></label><button className="auth-submit" type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create account"}</button><div className="auth-links">Already registered? <Link href="/auth/login">Sign in</Link></div></form></section></main>;
}
