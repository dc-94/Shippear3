import { TEMAS } from "@/lib/temas";

export default function AprenderPage() {
  return (
    <section className="view">
      <div className="wrap">
        <span className="eyebrow">El curso</span>
        <h2 style={{ fontSize: "clamp(24px,3.6vw,34px)", margin: "6px 0 4px" }}>
          Educación financiera, paso a paso
        </h2>
        <p className="muted" style={{ maxWidth: "66ch", marginBottom: 22 }}>
          Estos son los temas del curso. El contenido completo de cada lección se
          está incorporando. Por ahora podés probar el{" "}
          <a href="/cuestionario">cuestionario de nivel</a> y ver los{" "}
          <a href="/mercado">datos de mercado</a>.
        </p>
        <div className="grid-temas">
          {TEMAS.map((t) => (
            <div
              key={t.id}
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
              <span className="lvl">{t.nivel} · próximamente</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
