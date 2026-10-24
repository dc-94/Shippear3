"use client";
import { createClient } from "@/lib/supabase/client";

export default function LoginButton() {
  const login = () =>
    createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });

  return (
    <button onClick={login} className="rounded-lg bg-black px-4 py-2 text-white">
      Ingresar con Google
    </button>
  );
}