const DISCLAIMER_TITLE = 'Aviso:';
const DISCLAIMER_TEXT =
  'Este sitio web es un proyecto de práctica con fines educativos. No se realizan transacciones reales, no se recopilan datos personales sensibles, y no se envían productos físicos. Todos los pedidos son simulaciones.';

export function CheckoutDisclaimer() {
  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
      <p className="text-xs text-gray-600 text-center">
        <strong>{DISCLAIMER_TITLE}</strong> {DISCLAIMER_TEXT}
      </p>
    </div>
  );
}
