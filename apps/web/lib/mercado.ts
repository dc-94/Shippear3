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