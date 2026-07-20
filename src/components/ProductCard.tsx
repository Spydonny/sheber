import { Link } from "react-router-dom";
import { formatPrice } from "../api.ts";
import { availabilityLabel, useLang } from "../i18n.tsx";
import { localizeProduct } from "../localize.ts";
import type { Product } from "../types.ts";

const PLACEHOLDER = "/logo/logo_loading.png";

export default function ProductCard({ product: raw }: { product: Product }) {
  const { lang } = useLang();
  const product = localizeProduct(raw, lang);
  const hasPhoto = Boolean(product.photos?.length);
  const photo = product.photos?.[0] || PLACEHOLDER;
  const inStock = product.availability === "в наличии";
  return (
    <Link
      to={`/product/${raw.id}`}
      className="group block overflow-hidden rounded-2xl bg-card ring-1 ring-line shadow-warm transition duration-300 hover:-translate-y-1 hover:shadow-warm-lg hover:ring-clay/50"
    >
      <div className="relative aspect-square overflow-hidden bg-line/40">
        <img
          src={photo}
          alt={product.title}
          className={`h-full w-full transition duration-500 ${
            hasPhoto ? "object-cover group-hover:scale-[1.04]" : "object-contain p-10 opacity-60"
          }`}
          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
        />
        {product.badges?.[0] && (
          <span className="absolute left-3 top-3 rounded-md bg-ink/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-paper backdrop-blur">
            {product.badges[0]}
          </span>
        )}
      </div>
      <div className="p-4">
        {product.brand && (
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-clay-dark/70">
            {product.brand}
          </p>
        )}
        <h3 className="mt-1 truncate text-[15px] font-semibold leading-snug text-ink">
          {product.title}
        </h3>
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <p className="font-display text-xl text-clay">
            {formatPrice(product.price, product.currency)}
          </p>
          <span
            className={`shrink-0 text-[11px] font-medium ${
              inStock ? "text-clay-dark" : "text-ink/40"
            }`}
          >
            {inStock ? availabilityLabel(lang, "в наличии") : availabilityLabel(lang, product.availability || "под заказ")}
          </span>
        </div>
      </div>
    </Link>
  );
}
