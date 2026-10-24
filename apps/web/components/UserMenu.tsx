"use client";

import { useState } from "react";
import Link from "next/link";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const ini = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return ini.toUpperCase() || "U";
}

export default function UserMenu({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button className="userchip" onClick={() => setOpen((o) => !o)}>
        <span className="avatar">{initials(name)}</span>
        <span>
          <span className="nm">{name}</span>
          <br />
          <span className="em">{email}</span>
        </span>
      </button>

      {open && (
        <div className="menu">
          <div className="mu-head">
            <div className="nm">{name}</div>
            <div className="em">{email}</div>
          </div>
          <Link href="/mis-avances" onClick={() => setOpen(false)}>
            Mis avances
          </Link>
          <form action="/auth/signout" method="post">
            <button type="submit">Cerrar sesión</button>
          </form>
        </div>
      )}
    </div>
  );
}
