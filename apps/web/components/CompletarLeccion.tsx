"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LoginButton from "@/components/LoginButton";

type Estado =
  | "cargando"
  | "anon"
  | "pendiente"
  | "guardando"
  | "completada"
  | "error";

export default function CompletarLeccion({
  lessonId,
  moduleId,
}: {
  lessonId: string;
  moduleId: string;
}) {
  const [estado, setEstado] = useState<Estado>("cargando");

  // Al montar: ver si hay sesión y si esta lección ya está completada.
  useEffect(() => {
    let vivo = true;
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!vivo) return;
      if (!user) {
        setEstado("anon");
        return;
      }
      const { data } = await supabase
        .from("lesson_progress")
        .select("id")
        .eq("lesson_id", lessonId)
        .limit(1);
      if (!vivo) return;
      setEstado(data && data.length > 0 ? "completada" : "pendiente");
    })();
    return () => {
      vivo = false;
    };
  }, [lessonId]);

  async function completar() {
    setEstado("guardando");
    const supabase = createClient();
    // user_id lo completa la base con auth.uid() (ver supabase/schema.sql).
    const { error } = await supabase
      .from("lesson_progress")
      .insert({ lesson_id: lessonId, module_id: moduleId });
    // 23505 = clave duplicada: ya estaba completada, lo tratamos como éxito.
    if (!error || error.code === "23505") setEstado("completada");
    else setEstado("error");
  }

  return (
    <div
      className="panel"
      style={{
        marginTop: 6,
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      {estado === "cargando" && (
        <span className="muted" style={{ fontSize: 14 }}>
          Cargando tu progreso…
        </span>
      )}

      {estado === "anon" && (
        <>
          <span className="muted" style={{ fontSize: 14 }}>
            Iniciá sesión para guardar tu progreso.
          </span>
          <LoginButton />
        </>
      )}

      {(estado === "pendiente" || estado === "guardando") && (
        <>
          <span style={{ fontSize: 14, fontWeight: 600 }}>
            ¿Terminaste esta lección?
          </span>
          <button
            className="btn primary"
            onClick={completar}
            disabled={estado === "guardando"}
          >
            {estado === "guardando" ? "Guardando…" : "Marcar como completada"}
          </button>
        </>
      )}

      {estado === "completada" && (
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--pos)" }}>
          ✓ Lección completada
        </span>
      )}

      {estado === "error" && (
        <>
          <span style={{ fontSize: 14, color: "var(--neg)" }}>
            No se pudo guardar. ¿Corriste el schema en Supabase?
          </span>
          <button className="btn ghost" onClick={completar}>
            Reintentar
          </button>
        </>
      )}
    </div>
  );
}
