import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LoginButton from "@/components/LoginButton";
import { TEMAS } from "@/lib/temas";
import { dolares, inflacion, riesgoPais, ultimo } from "@/lib/mercado";

function fmtPeso(n: number | null | undefined) {
  if (n == null) return "—";
  return "$ " + n.toLocaleString("es-AR", { maximumFractionDigits: 2 });
}

async function getTiles() {
  const [ds, infl, rp] = await Promise.all([dolares(), inflacion(), riesgoPais()]);
  const casa = (c: string) => ds?.find((d) => d.casa === c) ?? null;
  const uInfl = ultimo(infl);
  const uRp = ultimo(rp);
  return [
    { k: "Dólar oficial", v: fmtPeso(casa("oficial")?.venta), tc: "var(--blue)" },
    { k: "Dólar blue", v: fmtPeso(casa("blue")?.venta), tc: "var(--violet)" },
    { k: "Dólar MEP", v: fmtPeso(casa("bolsa")?.venta), tc: "var(--accent)" },
    { k: "Inflación mensual", v: uInfl ? `${uInfl.valor} %` : "—", tc: "var(--neg)" },
    { k: "Riesgo país", v: uRp ? `${uRp.valor} pb` : "—", tc: "var(--amber)" },
  ];
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const tiles = await getTiles();
  const firstName = (user?.user_metadata?.full_name ?? user?.email ?? "").split(
    " "
  )[0];

  return (
    <section className="view">
      <div className="wrap">
        {/* HERO */}
        <div className="hero">
          <div className="glow" />
          <div className="inner">
            <div>
              <span className="eyebrow">Educación financiera gratuita</span>
              <h1>
                Aprendé a manejar tu plata, <em>sin vueltas.</em>
              </h1>
              <p className="lead">
                Qué es una acción, una cripto, el dólar, un plazo fijo o un fondo
                común. Renta fija y renta variable, explicadas desde cero. En
                castellano, para cualquiera.
              </p>
              <div className="cta-row">
                <Link href="/aprender" className="btn primary">
                  Empezar a aprender
                </Link>
                {!user && <LoginButton />}
              </div>
              <div className="chips">
                <span className="chip g">100% gratis</span>
                <span className="chip">Guardá tus avances con Google</span>
                <span className="chip">Pensado para Argentina 🇦🇷</span>
              </div>
            </div>

            <div className="side-card">
              {user ? (
                <>
                  <h3>¡Hola, {firstName}!</h3>
                  <p className="muted" style={{ fontSize: 13.5, marginTop: 6 }}>
                    Seguí aprendiendo y mirá cómo venís.
                  </p>
                  <Link
                    href="/mis-avances"
                    className="btn primary"
                    style={{ marginTop: 14, width: "100%" }}
                  >
                    Ver mis avances
                  </Link>
                </>
              ) : (
                <>
                  <h3>Empezá en 10 segundos</h3>
                  <p className="muted" style={{ fontSize: 13.5, marginTop: 6 }}>
                    Entrá con Google y guardá tu progreso, puntajes y logros. Sin
                    formularios.
                  </p>
                  <div style={{ marginTop: 14 }}>
                    <LoginButton />
                  </div>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--muted)",
                      marginTop: 8,
                    }}
                  >
                    O explorá sin cuenta desde “Empezar a aprender”.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* NÚMEROS DEL DÍA */}
        <div style={{ marginTop: 46 }}>
          <div className="sectionhead">
            <div>
              <span className="eyebrow">Mercado hoy</span>
              <h2>Los números del día</h2>
            </div>
            <Link href="/mercado" className="btn ghost sm">
              Ver todo
            </Link>
          </div>
          <div className="strip">
            {tiles.map((t) => (
              <div
                key={t.k}
                className="tile"
                style={{ "--tc": t.tc } as React.CSSProperties}
              >
                <div className="k">{t.k}</div>
                <div className="v">{t.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* EXPLORÁ POR TEMA */}
        <div style={{ marginTop: 46 }}>
          <div className="sectionhead">
            <div>
              <span className="eyebrow">Temario</span>
              <h2>Explorá por tema</h2>
            </div>
            <Link href="/aprender" className="btn ghost sm">
              Ver el curso completo
            </Link>
          </div>
          <div className="grid-temas">
            {TEMAS.map((t) => (
              <Link
                key={t.id}
                href="/aprender"
                className="tema"
                style={{ "--tc": t.color } as React.CSSProperties}
              >
                <span
                  className="ic"
                  dangerouslySetInnerHTML={{
                    __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${t.icon}</svg>`,
                  }}
                />
                <h3>{t.title}</h3>
                <p>{t.corta}</p>
                <span className="lvl">{t.nivel}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
