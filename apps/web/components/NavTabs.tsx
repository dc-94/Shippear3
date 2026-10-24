"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Inicio" },
  { href: "/aprender", label: "Aprender" },
  { href: "/mercado", label: "Mercado hoy" },
  { href: "/glosario", label: "Glosario" },
  { href: "/mis-avances", label: "Mis avances" },
];

export default function NavTabs() {
  const pathname = usePathname();
  return (
    <nav className="tabs">
      {TABS.map((t) => {
        const active =
          t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "true" : "false"}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
