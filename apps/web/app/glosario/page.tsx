export default function GlosarioPage() {
  return (
    <section className="view">
      <div className="wrap">
        <span className="eyebrow">Diccionario</span>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,32px)", marginTop: 6 }}>
          Glosario
        </h2>
        <p className="muted" style={{ maxWidth: "60ch", marginTop: 10 }}>
          Próximamente: los términos financieros (acción, UVA, CEDEAR, riesgo
          país…) explicados en una o dos líneas, con buscador.
        </p>
      </div>
    </section>
  );
}
