import {
  dolares,
  inflacion,
  inflacionInteranual,
  uva,
  riesgoPais,
  ultimo,
  dolarHistorico,
  emae,
  cripto,
  type Punto,
} from "@/lib/mercado";
import Chart from "@/components/Chart";

export const revalidate = 900;

const fmt = (n: number | null | undefined, dec = 2) =>
  n == null
    ? "—"
    : n.toLocaleString("es-AR", {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
      });

const CASAS: [string, string][] = [
  ["oficial", "Dólar oficial"],
  ["blue", "Dólar blue"],
  ["bolsa", "Dólar MEP"],
  ["contadoconliqui", "Dólar CCL"],
];

function Badge({ chg }: { chg: number }) {
  const cls = chg >= 0 ? "pos" : "neg";
  return (
    <span className={`chgbadge ${cls}`}>
      {chg >= 0 ? "+" : ""}
      {chg.toFixed(1)}%
    </span>
  );
}

function ChartCard({
  title,
  data,
  prefijo = "",
  sufijo = "",
  dec = 0,
  max = 90,
}: {
  title: string;
  data: Punto[] | null;
  prefijo?: string;
  sufijo?: string;
  dec?: number;
  max?: number;
}) {
  if (!data || data.length < 2) {
    return (
      <div className="chartwrap">
        <div className="nm" style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
          {title}
        </div>
        <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>
          Dato no disponible por ahora.
        </p>
      </div>
    );
  }
  const pts = data.slice(-max);
  const first = pts[0].valor;
  const last = pts[pts.length - 1].valor;
  const chg = first ? ((last - first) / first) * 100 : 0;

  return (
    <div className="chartwrap">
      <div className="detail-head" style={{ marginBottom: 10 }}>
        <div>
          <div className="nm" style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
            {title}
          </div>
          <div className="detail-val">
            {prefijo}
            {fmt(last, dec)}
            {sufijo}
          </div>
        </div>
        <Badge chg={chg} />
      </div>
      <Chart data={data} max={max} />
      <p className="muted" style={{ fontSize: 11.5, marginTop: 8 }}>
        {pts[0].fecha} → {pts[pts.length - 1].fecha} · últimos {pts.length} datos
      </p>
    </div>
  );
}

export default async function Mercado() {
  const [d, ipc, ipcIa, u, rp, blueHist, oficialHist, emaeSerie, cripts] =
    await Promise.all([
      dolares(),
      inflacion(),
      inflacionInteranual(),
      uva(),
      riesgoPais(),
      dolarHistorico("blue"),
      dolarHistorico("oficial"),
      emae(),
      cripto(),
    ]);

  const ipcU = ultimo(ipc);
  const iaU = ultimo(ipcIa);
  const uvaU = ultimo(u);
  const rpU = ultimo(rp);

  const acento = { "--tc": "var(--accent)" } as React.CSSProperties;

  return (
    <section className="view">
      <div className="wrap">
        <span className="eyebrow">Datos en vivo</span>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,32px)", margin: "6px 0 4px" }}>
          Mercado hoy
        </h2>
        <p className="muted" style={{ maxWidth: "66ch" }}>
          Fuentes públicas: dolarapi, ArgentinaDatos, datos.gob.ar y CoinGecko.
          Información orientativa, no es una recomendación de inversión.
        </p>

        {/* ---- Dólar ---- */}
        <div className="mkt-group" style={acento}>
          <div className="gh">
            <span className="dot" />
            <h3>Dólar</h3>
            <span>pesos por USD</span>
          </div>
          <div className="mkt-cards">
            {CASAS.map(([casa, nombre]) => {
              const x = d?.find((i) => i.casa === casa);
              return (
                <div key={casa} className="mkt-card" style={acento}>
                  <div className="nm">{nombre}</div>
                  <div className="vl">$ {fmt(x?.venta, 0)}</div>
                  <div className="row">
                    <span className="tk">
                      {x ? `compra $ ${fmt(x.compra, 0)}` : "no disponible"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- Evolución (gráficos) ---- */}
        <div className="mkt-group" style={acento}>
          <div className="gh">
            <span className="dot" />
            <h3>Evolución</h3>
            <span>histórico</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: 14,
            }}
          >
            <ChartCard title="Dólar blue" data={blueHist} prefijo="$ " dec={0} max={90} />
            <ChartCard title="Dólar oficial" data={oficialHist} prefijo="$ " dec={0} max={90} />
            <ChartCard title="Riesgo país" data={rp} sufijo=" pb" dec={0} max={120} />
            <ChartCard title="Inflación mensual" data={ipc} sufijo=" %" dec={1} max={24} />
            <ChartCard title="UVA" data={u} prefijo="$ " dec={2} max={120} />
            <ChartCard title="Actividad económica (EMAE)" data={emaeSerie} dec={1} max={120} />
          </div>
        </div>

        {/* ---- Indicadores ---- */}
        <div className="mkt-group" style={acento}>
          <div className="gh">
            <span className="dot" />
            <h3>Indicadores</h3>
            <span>último dato</span>
          </div>
          <div className="mkt-cards">
            <div className="mkt-card" style={acento}>
              <div className="nm">Inflación mensual</div>
              <div className="vl">{ipcU ? `${fmt(ipcU.valor, 1)} %` : "—"}</div>
              <div className="row">
                <span className="tk">{ipcU?.fecha ?? ""}</span>
              </div>
            </div>
            <div className="mkt-card" style={acento}>
              <div className="nm">Inflación interanual</div>
              <div className="vl">{iaU ? `${fmt(iaU.valor, 1)} %` : "—"}</div>
              <div className="row">
                <span className="tk">{iaU?.fecha ?? ""}</span>
              </div>
            </div>
            <div className="mkt-card" style={acento}>
              <div className="nm">UVA</div>
              <div className="vl">{uvaU ? `$ ${fmt(uvaU.valor, 2)}` : "—"}</div>
              <div className="row">
                <span className="tk">{uvaU?.fecha ?? ""}</span>
              </div>
            </div>
            <div className="mkt-card" style={acento}>
              <div className="nm">Riesgo país</div>
              <div className="vl">{rpU ? `${fmt(rpU.valor, 0)} pb` : "—"}</div>
              <div className="row">
                <span className="tk">{rpU?.fecha ?? ""}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Cripto ---- */}
        {cripts && cripts.length > 0 && (
          <div className="mkt-group" style={acento}>
            <div className="gh">
              <span className="dot" />
              <h3>Cripto</h3>
              <span>USD · 24 h</span>
            </div>
            <div className="mkt-cards">
              {cripts.map((c) => (
                <div key={c.id} className="mkt-card" style={acento}>
                  <div className="nm">{c.nombre}</div>
                  <div className="vl">US$ {fmt(c.usd, 0)}</div>
                  <div className="row">
                    <Badge chg={c.cambio24h} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
