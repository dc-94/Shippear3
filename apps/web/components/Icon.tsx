// Dibuja un ícono a partir del interior de un <svg viewBox="0 0 24 24">.
// El tamaño lo controla el CSS según el contenedor (.tema .ic svg, etc.).
// Los paths vienen de constantes nuestras (no de entrada de usuario), así que
// dangerouslySetInnerHTML es seguro acá.
export default function Icon({ paths }: { paths: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: paths }}
    />
  );
}
