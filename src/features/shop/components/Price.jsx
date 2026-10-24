import { formatPrice } from "../../../utils/formatters";

export default function Price({ price, salePrice, className = "" }) {
  const onSale = salePrice !== null && salePrice !== undefined && salePrice < price;
  return (
    <span className={`price ${className}`}>
      <span className={onSale ? "price__sale" : undefined}>{formatPrice(onSale ? salePrice : price)}</span>
      {onSale && <s className="price__was">{formatPrice(price)}</s>}
    </span>
  );
}
