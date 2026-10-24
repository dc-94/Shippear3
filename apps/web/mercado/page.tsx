import { dolares, inflacion, inflacionInteranual, uva, riesgoPais, ultimo } from "@/lib/mercado";

export const revalidate = 900;

const CASAS = ["oficial", "blue", "bolsa", "contadoconliqui"];
const NOMBRES: Record<string, string> = {
  oficial: "Dólar oficial",
  blue: "Dólar blue",
  bolsa: "Dólar MEP",
  contadoconliqui: "Dólar CCL",
};
const fmt = (n: number | null | undefined, dec = 2) =>
  n == null ? "—" : n.toLocaleString("es-AR", { maximumFractionDigits: dec });

function Tarjeta({ titulo, valor, detalle }: { titulo: string; valor: string; detalle?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <p className="text-sm text-gray-500">{titulo}</p>
      <p className="text-2xl font-bold">{valor}</p>
      {detalle && <p className="text-xs text-gray-400">{detalle}</p>}
    </div>
  );
}

export default async function Mercado() {
  const [d, ipc, ipcIa, u, rp] = await Promise.all([
    dolares(), inflacion(), inflacionInteranual(), uva(), riesgoPais(),
  ]);
  const ipcU = ultimo(ipc), iaU = ultimo(ipcIa), uvaU = ultimo(u), rpU = ultimo(rp);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-1 text-2xl font-bold">Mercado hoy</h1>
      <p className="mb-6 text-sm text-gray-500">
        Datos informativos de fuentes públicas (dolarapi.com y ArgentinaDatos). No es una recomendación de inversión.
      </p>

      <h2 className="mb-2 font-semibold">Dólar</h2>
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {d
          ? CASAS.map((c) => {
              const x = d.find((i) => i.casa === c);
              return (
                <Tarjeta
                  key={c}
                  titulo={NOMBRES[c]}
                  valor={`$ ${fmt(x?.venta, 0)}`}
                  detalle={x ? `compra $ ${fmt(x.compra, 0)}` : "dato no disponible"}
                />
              );
            })
          : <p className="col-span-4 text-gray-500">Dato no disponible por ahora.</p>}
      </div>

      <h2 className="mb-2 font-semibold">Indicadores</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tarjeta titulo="Inflación mensual" valor={ipcU ? `${fmt(ipcU.valor, 1)} %` : "—"} detalle={ipcU?.fecha} />
        <Tarjeta titulo="Inflación interanual" valor={iaU ? `${fmt(iaU.valor, 1)} %` : "—"} detalle={iaU?.fecha} />
        <Tarjeta titulo="UVA" valor={uvaU ? `$ ${fmt(uvaU.valor)}` : "—"} detalle={uvaU?.fecha} />
        <Tarjeta titulo="Riesgo país" valor={rpU ? `${fmt(rpU.valor, 0)} pb` : "—"} detalle={rpU?.fecha} />
      </div>
    </main>
  );
}