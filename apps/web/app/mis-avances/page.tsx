import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function MisAvances() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: progreso } = await supabase.from("lesson_progress").select("*");
  const nombre = user.user_metadata?.full_name ?? user.email;

  return (
    <section className="view">
      <div className="wrap">
        <div className="dashtop">
          <div className="who">
            <h2>¡Hola, {nombre}!</h2>
            <span className="sync">Sincronizado con tu cuenta · {user.email}</span>
          </div>
        </div>

        <div className="stats">
          <div className="stat" style={{ "--tc": "var(--accent)" } as React.CSSProperties}>
            <div className="n">{progreso?.length ?? 0}</div>
            <div className="l">Lecciones completadas</div>
          </div>
        </div>

        <form action="/auth/signout" method="post" style={{ marginTop: 20 }}>
          <button type="submit" className="btn ghost">
            Cerrar sesión
          </button>
        </form>
      </div>
    </section>
  );
}
