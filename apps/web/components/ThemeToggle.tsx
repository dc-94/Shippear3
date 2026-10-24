"use client";

export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const cur = root.getAttribute("data-theme");
    const isDark = cur
      ? cur === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = isDark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("pc-theme", next);
    } catch {
      /* localStorage bloqueado: igual cambia el tema en esta sesión */
    }
  }

  return (
    <button
      className="icon-btn"
      onClick={toggle}
      title="Cambiar tema"
      aria-label="Cambiar tema"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
