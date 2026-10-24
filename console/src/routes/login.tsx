import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({component:Login});
function Login() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [register,setRegister]=useState(false);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(e:FormEvent) {
    e.preventDefault();setError("");setBusy(true);
    try {
      const result=register
        ? await authClient.signUp.email({name:name.trim(),email:email.trim(),password})
        : await authClient.signIn.email({email:email.trim(),password});
      if (result.error) throw new Error(result.error.message || "Authentication failed");
      window.location.assign("/");
    } catch(err) {setError(err instanceof Error?err.message:"Authentication failed");setBusy(false);}
  }
  return <main className="flex min-h-dvh items-center justify-center bg-[#090e0b] p-6 text-white">
    <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-xl border border-emerald-900 bg-[#101a14] p-8">
      <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">CodingAgent · Private Workspace</div>
      <h1 className="text-3xl font-bold">{register?"Create account":"Sign in"}</h1>
      <p className="text-sm text-neutral-400">Your coding sessions are stored in an authenticated, per-user PostgreSQL workspace.</p>
      {register && <label className="block text-sm">Name<input className="mt-1 w-full rounded border border-neutral-600 bg-black p-3" required value={name} onChange={e=>setName(e.target.value)}/></label>}
      <label className="block text-sm">Email<input className="mt-1 w-full rounded border border-neutral-600 bg-black p-3" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
      <label className="block text-sm">Password<input className="mt-1 w-full rounded border border-neutral-600 bg-black p-3" type="password" minLength={8} autoComplete={register?"new-password":"current-password"} required value={password} onChange={e=>setPassword(e.target.value)}/></label>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <button disabled={busy} className="w-full rounded bg-emerald-600 p-3 font-bold disabled:opacity-50">{busy?"Please wait…":register?"Create account":"Sign in"}</button>
      <button type="button" className="text-sm text-emerald-300 underline" onClick={()=>{setRegister(!register);setError("");}}>{register?"Already have an account? Sign in":"Need an account? Register"}</button>
    </form>
  </main>;
}
