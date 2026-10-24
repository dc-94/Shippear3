import TutorChat from "@/components/TutorChat";

export default function TutorPage() {
  return (
    <section className="view">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <span className="eyebrow">Tutor con IA</span>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,32px)", margin: "6px 0 4px" }}>
          Preguntale al tutor
        </h2>
        <p className="muted" style={{ maxWidth: "60ch", marginBottom: 18 }}>
          Te explica cualquier concepto a tu nivel y usa los datos de mercado de
          hoy. Es educativo: no da consejos de inversión.
        </p>
        <TutorChat />
      </div>
    </section>
  );
}
