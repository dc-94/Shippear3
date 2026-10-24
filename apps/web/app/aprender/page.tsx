import Link from "next/link";
import { CAT, CURSOS, GROUPS } from "@/lib/cursos";
import Icon from "@/components/Icon";

function RfRvBox({ k }: { k: string }) {
  const c = CAT[k];
  return (
    <div className="box" style={{ "--tc": c.c } as React.CSSProperties}>
      <h3>
        <span className="ic">
          <Icon paths={c.ic} />
        </span>
        {c.n}
      </h3>
      <p>{c.d}</p>
      <ul>
        {c.ej.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </div>
  );
}

function TemaCard({ id }: { id: string }) {
  const x = CURSOS[id];
  return (
    <Link
      href={`/aprender/${id}`}
      className="tema"
      style={{ "--tc": x.c } as React.CSSProperties}
    >
      <span className="ic">
        <Icon paths={x.ic} />
      </span>
      <h3>{x.t}</h3>
      <p>{x.corta}</p>
      <span className="lvl">{x.nivel}</span>
    </Link>
  );
}

export default function AprenderIndex() {
  return (
    <section className="view">
      <div className="wrap">
        <span className="eyebrow">El curso</span>
        <h2 style={{ fontSize: "clamp(24px,3.6vw,34px)", margin: "6px 0 4px" }}>
          Educación financiera, paso a paso
        </h2>
        <p className="muted" style={{ maxWidth: "66ch", marginBottom: 22 }}>
          Antes de ver cada instrumento, la base: casi todo lo que se invierte
          cae en dos grandes familias.
        </p>

        <div className="rfrv">
          <RfRvBox k="rf" />
          <RfRvBox k="rv" />
        </div>

        <p className="muted" style={{ fontSize: 13, margin: "6px 0 2px" }}>
          Además de estas dos familias, están los <b>fondos</b> (que pueden ser
          de una u otra) y las <b>variables macro</b> que conviene entender.
          Elegí un tema para empezar:
        </p>

        {GROUPS.map(([catKey, keys]) => {
          const cat = CAT[catKey];
          return (
            <div
              key={catKey}
              className="group"
              style={{ "--tc": cat.c } as React.CSSProperties}
            >
              <div className="gh">
                <span className="dot" />
                <h3>{cat.n}</h3>
                <span>
                  {keys.length} tema{keys.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid-temas">
                {keys.map((k) => (
                  <TemaCard key={k} id={k} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
