import Link from "next/link";
import { notFound } from "next/navigation";
import { CAT, CURSOS, ORDER } from "@/lib/cursos";
import Icon from "@/components/Icon";
import MiniQuiz from "@/components/MiniQuiz";

// Prerenderiza una página por cada tema conocido.
export function generateStaticParams() {
  return ORDER.map((tema) => ({ tema }));
}

export default async function LeccionPage({
  params,
}: {
  params: Promise<{ tema: string }>;
}) {
  const { tema } = await params;
  const x = CURSOS[tema];
  if (!x) notFound();
  const cat = CAT[x.cat];
  const i = ORDER.indexOf(tema);
  const prev = i > 0 ? ORDER[i - 1] : null;
  const next = i < ORDER.length - 1 ? ORDER[i + 1] : null;

  return (
    <section className="view">
      <div className="wrap">
        <div
          className="lesson-head"
          style={{ "--tc": x.c, "--cc": cat.c } as React.CSSProperties}
        >
          <Link href="/aprender" className="backbtn">
            <Icon paths='<path d="M15 18l-6-6 6-6"/>' /> Volver al curso
          </Link>
          <span className="catbadge">{cat.n}</span>
          <div className="lesson-title">
            <span className="ic">
              <Icon paths={x.ic} />
            </span>
            <h2>{x.t}</h2>
          </div>
        </div>

        <div
          className="lesson-grid"
          style={{ "--tc": x.c } as React.CSSProperties}
        >
          <div>
            {x.bloques.map((b) => (
              <div key={b.h} className="block">
                <h3>{b.h}</h3>
                <p>{b.p}</p>
              </div>
            ))}

            <MiniQuiz quiz={x.quiz} />

            <div className="lessonnav">
              {prev ? (
                <Link className="navbtn prev" href={`/aprender/${prev}`}>
                  <small>Anterior</small>
                  {CURSOS[prev].t}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link className="navbtn next" href={`/aprender/${next}`}>
                  <small>Siguiente</small>
                  {CURSOS[next].t}
                </Link>
              ) : (
                <span />
              )}
            </div>
          </div>

          <div className="aside">
            <div className="card frasecard">
              <div className="lab">En una frase</div>
              <div className="f">{x.frase}</div>
            </div>
            <div className="card">
              <div className="cardlab">Claves</div>
              <ul className="keypoints">
                {x.claves.map((c) => (
                  <li key={c}>
                    <Icon paths='<path d="M5 12l4 4L19 6"/>' />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <div className="cardlab">Términos relacionados</div>
              <div className="rel-terms">
                {x.rel.map((r) => (
                  <Link key={r} href="/glosario">
                    {r}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
