const STOCK_STATUS = {
  outOfStock: { text: 'Agotado', className: 'text-red-600 bg-red-100' },
  lowStock: { text: 'Pocas unidades', className: 'text-yellow-600 bg-yellow-100' },
  inStock: { text: 'En Stock', className: 'text-green-600 bg-green-100' },
} as const;

interface StockStatus {
  text: string;
  className: string;
}

export function getStockStatus(stock?: number): StockStatus {
  if (!stock || stock === 0) {
    return STOCK_STATUS.outOfStock;
  }
  if (stock < 10) {
    return STOCK_STATUS.lowStock;
  }
  return STOCK_STATUS.inStock;
}

interface ProductStockBadgeProps {
  stock?: number;
}

export function ProductStockBadge({ stock }: ProductStockBadgeProps) {
  const status = getStockStatus(stock);

  return (
    <span
      className={`inline-block text-xs ${status.className} px-3 py-1 rounded-full font-semibold`}
    >
      {status.text}
    </span>
  );
}
