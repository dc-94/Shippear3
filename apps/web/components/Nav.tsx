import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LoginButton from "@/components/LoginButton";

export default async function Nav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
      <nav className="flex items-center gap-5 text-sm">
        <Link href="/" className="text-lg font-bold">Plata Clara</Link>
        <Link href="/mercado">Mercado hoy</Link>
        {user && <Link href="/mis-avances">Mis avances</Link>}
      </nav>
      {user ? (
        <form action="/auth/signout" method="post" className="flex items-center gap-3 text-sm">
          <span>{user.user_metadata.full_name ?? user.email}</span>
          <button type="submit" className="rounded-lg border px-3 py-1">Salir</button>
        </form>
      ) : (
        <LoginButton />
      )}
    </header>
  );
}