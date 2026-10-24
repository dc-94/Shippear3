# Plata Clara

Web de educación financiera para personas comunes en Argentina. Login con Google, módulos con progreso y datos de mercado en vivo.

## Stack
Next.js (App Router) + Tailwind · Supabase (Auth con Google + Postgres con RLS) · APIs públicas (dolarapi, ArgentinaDatos)

## Cómo correrlo
cd apps/web
npm install
# crear apps/web/.env.local con las claves de .env.example (pedirlas al equipo; NO se suben)
npm run dev   # http://localhost:3000

## Estructura
- apps/web: la app
- docs/mockups: maqueta de diseño (Cesar)
- docs/specs: diseño de la Fase 1