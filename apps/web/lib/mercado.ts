export type Punto = { fecha: string; valor: number };
export type Dolar = {
  casa: string;
  nombre: string;
  compra: number | null;
  venta: number | null;
  fechaActualizacion: string;
};

async function traer<T>(url: string, segundos: number): Promise<T | null> {
  try {
    const r = await fetch(url, { next: { revalidate: segundos } });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null; // si la API cae, la página muestra "dato no disponible"
  }
}

async function serie(url: string): Promise<Punto[] | null> {
  const d = await traer<Punto[]>(url, 6 * 3600);
  if (!d) return null;
  return d.filter((p) => p.valor != null).sort((a, b) => a.fecha.localeCompare(b.fecha));
}

const AD = "https://api.argentinadatos.com/v1/finanzas/indices";

export const dolares = () => traer<Dolar[]>("https://dolarapi.com/v1/dolares", 900);
export const inflacion = () => serie(`${AD}/inflacion`);
export const inflacionInteranual = () => serie(`${AD}/inflacionInteranual`);
export const uva = () => serie(`${AD}/uva`);
export const riesgoPais = () => serie(`${AD}/riesgo-pais`);

export const ultimo = (s: Punto[] | null) => (s && s.length ? s[s.length - 1] : null);
// ---------------------------------------------------------------------------
// Fuentes extra para gráficos y más mercados (todas APIs públicas).
// ---------------------------------------------------------------------------

type DolarHist = { compra: number | null; venta: number | null; fecha: string };

// Histórico de una casa de dólar (para graficar). Devuelve { fecha, valor: venta }.
export async function dolarHistorico(casa: string): Promise<Punto[] | null> {
  const d = await traer<DolarHist[]>(
    `https://api.argentinadatos.com/v1/cotizaciones/dolares/${casa}`,
    6 * 3600
  );
  if (!d) return null;
  return d
    .filter((p) => p.venta != null)
    .map((p) => ({ fecha: p.fecha, valor: p.venta as number }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

type SerieGob = { data: [string, number | null][] };

// EMAE (actividad económica) desde datos.gob.ar.
export async function emae(): Promise<Punto[] | null> {
  const d = await traer<SerieGob>(
    "https://apis.datos.gob.ar/series/api/series/?ids=143.3_NO_PR_2004_A_21&limit=120&sort=desc&format=json",
    24 * 3600
  );
  if (!d?.data) return null;
  return d.data
    .filter((r) => r[1] != null)
    .map((r) => ({ fecha: String(r[0]).slice(0, 10), valor: r[1] as number }))
    .reverse();
}

export type Cripto = { id: string; nombre: string; usd: number; cambio24h: number };

// Precio actual en USD + variación 24h (CoinGecko).
export async function cripto(): Promise<Cripto[] | null> {
  const d = await traer<Record<string, { usd: number; usd_24h_change: number }>>(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true",
    900
  );
  if (!d) return null;
  const pares: [string, string][] = [
    ["bitcoin", "Bitcoin"],
    ["ethereum", "Ethereum"],
  ];
  return pares
    .filter(([id]) => d[id])
    .map(([id, nombre]) => ({
      id,
      nombre,
      usd: d[id].usd,
      cambio24h: d[id].usd_24h_change ?? 0,
    }));
}
