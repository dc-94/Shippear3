import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LoginButton from "@/components/LoginButton";
import ThemeToggle from "@/components/ThemeToggle";
import NavTabs from "@/components/NavTabs";
import UserMenu from "@/components/UserMenu";

export default async function Topbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const name = user?.user_metadata?.full_name ?? user?.email ?? "";

  return (
    <header className="topbar">
      <div className="wrap">
        <Link href="/" className="brand">
          <span className="logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 18 L10 11 L14 15 L20 7" />
              <path d="M15 7h5v5" />
            </svg>
          </span>
          Plata&nbsp;Clara
        </Link>
        <NavTabs />
        <div className="right">
          <ThemeToggle />
          {user ? (
            <UserMenu name={name} email={user.email ?? ""} />
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}
