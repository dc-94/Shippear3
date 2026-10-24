// Metadata de los temas del curso (solo para las tarjetas: título, resumen,
// nivel, color e ícono). El contenido completo de cada lección (territorio del
// encargado de contenido) se incorporará en una fase posterior.

export type Tema = {
  id: string;
  title: string;
  corta: string;
  nivel: string;
  color: string; // valor CSS para --tc (ej. "var(--blue)" o "#0891B2")
  icon: string; // contenido interno de un <svg viewBox="0 0 24 24">
  cat: "rf" | "rv" | "fondos" | "ma";
};

export const TEMAS: Tema[] = [
  { id: "acciones", title: "Acciones", corta: "Ser dueño de una parte de una empresa.", nivel: "Principiante", color: "var(--accent)", cat: "rv", icon: '<path d="M4 18 L10 11 L14 15 L20 7"/><path d="M15 7h5v5"/>' },
  { id: "cedears", title: "CEDEARs", corta: "Acciones del exterior, en pesos.", nivel: "Principiante", color: "var(--pink)", cat: "rv", icon: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>' },
  { id: "cripto", title: "Criptomonedas", corta: "Qué es Bitcoin y cómo funciona.", nivel: "Principiante", color: "var(--violet)", cat: "rv", icon: '<circle cx="12" cy="12" r="8"/><path d="M9.5 8.5h4a2 2 0 0 1 0 4h-4m0 0h4.3a2 2 0 0 1 0 4H9.5m0-8V6.5m0 11V16m2.5-9.5V6m0 12v-.5"/>' },
  { id: "plazofijo", title: "Plazo fijo", corta: "Guardar plata a cambio de interés.", nivel: "Principiante", color: "var(--amber)", cat: "rf", icon: '<rect x="4" y="9" width="16" height="11" rx="2"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/>' },
  { id: "bonos", title: "Bonos", corta: "Prestarle al Estado o a una empresa.", nivel: "Intermedio", color: "#0891B2", cat: "rf", icon: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>' },
  { id: "fci", title: "Fondos (FCI)", corta: "Invertir junto a otros, de a poco.", nivel: "Principiante", color: "#4F46E5", cat: "fondos", icon: '<path d="M12 3v9l6 4"/><circle cx="12" cy="12" r="9"/>' },
  { id: "dolar", title: "El dólar", corta: "Oficial, blue, MEP, CCL: qué es cada uno.", nivel: "Principiante", color: "var(--blue)", cat: "ma", icon: '<path d="M12 2v20"/><path d="M16 6.5C16 4.6 14 4 12 4S8 4.6 8 7s2 3 4 3.5 4 1.3 4 3.5-2 3-4 3-4-.6-4-2.5"/>' },
  { id: "inflacion", title: "Inflación e IPC", corta: "Por qué la plata pierde valor.", nivel: "Principiante", color: "var(--neg)", cat: "ma", icon: '<path d="M4 16 L10 10 L14 13 L20 5"/><path d="M15 5h5v5"/>' },
  { id: "uva", title: "UVA", corta: "La unidad que ajusta por inflación.", nivel: "Intermedio", color: "#C026D3", cat: "ma", icon: '<path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10z"/><circle cx="12" cy="11" r="2.4"/>' },
  { id: "pbi", title: "PBI", corta: "Qué mide y por qué importa.", nivel: "Intermedio", color: "#65A30D", cat: "ma", icon: '<path d="M4 20h16"/><rect x="6" y="12" width="3" height="6"/><rect x="11" y="8" width="3" height="10"/><rect x="16" y="4" width="3" height="14"/>' },
];
