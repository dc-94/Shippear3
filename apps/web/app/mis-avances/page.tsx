import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function MisAvances() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: progreso } = await supabase.from("lesson_progress").select("*");

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Hola, {user.user_metadata.full_name ?? user.email}</h1>
      <p>Lecciones completadas: {progreso?.length ?? 0}</p>
      <form action="/auth/signout" method="post">
        <button type="submit">Salir</button>
      </form>
    </main>
  );
}