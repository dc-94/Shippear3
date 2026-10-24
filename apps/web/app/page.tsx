import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-3 text-4xl font-bold">Aprendé de plata, sin vueltas</h1>
      <p className="mb-6 text-lg text-gray-600">
        Módulos cortos para entender inflación, dólar, ahorro e inversión. Ingresá con Google para guardar tu progreso.
      </p>
      <div className="flex gap-3">
        <Link href="/mercado" className="rounded-lg bg-black px-4 py-2 text-white">Ver mercado hoy</Link>
        <Link href="/mis-avances" className="rounded-lg border px-4 py-2">Mis avances</Link>
      </div>
    </main>
  );
}