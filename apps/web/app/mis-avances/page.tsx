import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LoginButton from "@/components/LoginButton";

const NIVEL: Record<string, string> = {
  inicial: "Inicial",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

const CHECK = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12l4 4L19 6" />
  </svg>
);

export default async function MisAvances() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- Estado no logueado: invitación a entrar ---
  if (!user) {
    return (
      <section className="view">
        <div className="wrap">
          <div className="panel lock">
            <div className="box">
              <div className="bigic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15v2M6 10V7a6 6 0 0 1 12 0v3" />
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                </svg>
              </div>
              <h2 style={{ fontSize: 24 }}>Guardá y seguí tus avances</h2>
              <p className="muted">
                Iniciá sesión con Google para que tus lecciones completadas,
                puntajes y logros queden guardados y los veas desde cualquier
                dispositivo.
              </p>
              <LoginButton />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- Datos reales del usuario ---
  const { data: progreso } = await supabase
    .from("lesson_progress")
    .select("id");
  const { data: intentos } = await supabase
    .from("quiz_attempt")
    .select("level,score,created_at")
    .order("created_at", { ascending: false })
    .limit(1);

  const lecciones = progreso?.length ?? 0;
  const ultimo = intentos?.[0] ?? null;
  const nivel = ultimo ? NIVEL[ultimo.level] ?? ultimo.level : "—";
  const nombre = String(user.user_metadata?.full_name ?? user.email ?? "");
  const firstName = nombre.split(" ")[0];

  const acento = { "--tc": "var(--accent)" } as React.CSSProperties;

  const logros = [
    { t: "Diagnóstico hecho", s: "Hiciste el cuestionario", on: !!ultimo },
    { t: "Primera lección", s: "Completá una lección", on: lecciones >= 1 },
    { t: "En marcha", s: "3 lecciones completadas", on: lecciones >= 3 },
    { t: "Inversor junior", s: "Completá 5 temas", on: lecciones >= 5 },
  ];

  return (
    <section className="view">
      <div className="wrap">
        <div className="dashtop">
          <div className="who">
            <h2>¡Hola de nuevo, {firstName}!</h2>
            <span className="sync">Sincronizado con tu cuenta · {user.email}</span>
          </div>
        </div>

        <div className="stats">
          <div className="stat" style={acento}>
            <div className="n">{lecciones}</div>
            <div className="l">Lecciones completadas</div>
          </div>
          <div className="stat" style={acento}>
            <div className="n">{nivel}</div>
            <div className="l">Tu nivel</div>
          </div>
          <div className="stat" style={acento}>
            <div className="n">{ultimo ? ultimo.score : "—"}</div>
            <div className="l">Puntaje del cuestionario</div>
          </div>
        </div>

        <div className="continue">
          <div className="meta">
            <span className="eyebrow">Seguí aprendiendo</span>
            <h3 style={{ fontSize: 18, marginTop: 4 }}>
              Explorá los temas del curso
            </h3>
            <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
              Acciones, dólar, plazo fijo, bonos y más.
            </p>
          </div>
          <Link href="/aprender" className="btn primary">
            Ir al curso
          </Link>
        </div>

        <h3 style={{ marginTop: 26, fontSize: 18 }}>Tus logros</h3>
        <div className="badges">
          {logros.map((b) => (
            <div key={b.t} className={`badge${b.on ? "" : " off"}`}>
              <span
                className="b-ic"
                style={b.on ? { background: "var(--accent)" } : undefined}
              >
                {CHECK}
              </span>
              <span>
                <span className="b-t">{b.t}</span>
                <br />
                <span className="b-s">{b.s}</span>
              </span>
            </div>
          ))}
        </div>

        <form action="/auth/signout" method="post" style={{ marginTop: 24 }}>
          <button type="submit" className="btn ghost">
            Cerrar sesión
          </button>
        </form>
      </div>
    </section>
  );
}
