import { Link } from "react-router-dom";
import { formatPrice, mediaUrl } from "../api.ts";
import { availabilityLabel, useLang } from "../i18n.tsx";
import { localizeProduct } from "../localize.ts";
import type { Product } from "../types.ts";

const PLACEHOLDER = "/logo/logo_loading.png";

export default function ProductCard({ product: raw }: { product: Product }) {
  const { lang, t } = useLang();
  const product = localizeProduct(raw, lang);
  const hasPhoto = Boolean(product.photos?.length);
  const photo = product.photos?.[0] ? mediaUrl(product.photos[0]) : PLACEHOLDER;
  const inStock = product.availability === "в наличии";
  const hasRating = typeof product.rating === "number" && product.rating > 0;
  const discount =
    product.old_price && product.old_price > product.price
      ? Math.round((1 - product.price / product.old_price) * 100)
      : product.discount_percent || 0;

  return (
    <Link
      to={`/product/${raw.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-line shadow-warm transition duration-300 hover:-translate-y-1 hover:shadow-warm-lg hover:ring-clay/60"
    >
      <div className="relative aspect-square overflow-hidden bg-line/40">
        <img
          src={photo}
          alt={product.title}
          className={`h-full w-full transition duration-500 ${
            hasPhoto ? "object-cover group-hover:scale-[1.05]" : "object-contain p-10 opacity-60"
          }`}
          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
        />
        {/* Мягкий кремовый бейдж вместо тяжёлой чёрной плашки */}
        {product.badges?.[0] && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-paper/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-clay-dark ring-1 ring-clay/20 backdrop-blur">
            {product.badges[0]}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-2.5 top-2.5 rounded-md bg-clay px-2 py-0.5 text-[11px] font-bold text-paper shadow-warm">
            −{discount}%
          </span>
        )}
        {/* Рейтинг поверх фото — сразу читается как маркетплейс */}
        {hasRating && (
          <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-md bg-ink/75 px-2 py-0.5 text-[11px] font-semibold text-paper backdrop-blur">
            <span className="text-gold">★</span>
            {product.rating!.toFixed(1)}
            {product.reviews_count ? <span className="text-paper/60">({product.reviews_count})</span> : null}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {product.brand && (
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-clay-dark/70">
            {product.brand}
          </p>
        )}
        <h3 className="mt-1 line-clamp-2 min-h-[2.6em] text-[15px] font-semibold leading-snug text-ink">
          {product.title}
        </h3>

        {(product.sales || product.views) && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-ink/45">
            {product.sales ? (
              <span className="font-medium text-ink/60">
                {product.sales} {t("soldSuffix")}
              </span>
            ) : null}
            {product.sales && product.views ? <span>·</span> : null}
            {product.views ? (
              <span>
                {product.views} {t("viewsSuffix")}
              </span>
            ) : null}
          </div>
        )}

        {/* Цена — главный элемент: крупнее, темнее, с воздухом сверху */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="min-w-0">
            <p className="font-display text-2xl leading-none text-clay-dark">
              {formatPrice(product.price, product.currency)}
            </p>
            {product.old_price && product.old_price > product.price ? (
              <p className="mt-1 text-xs text-ink/35 line-through">
                {formatPrice(product.old_price, product.currency)}
              </p>
            ) : null}
          </div>
          <span
            className={`mb-0.5 flex shrink-0 items-center gap-1 text-[11px] font-medium ${
              inStock ? "text-clay-dark" : "text-ink/40"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-clay" : "bg-ink/25"}`} />
            {inStock ? availabilityLabel(lang, "в наличии") : availabilityLabel(lang, product.availability || "под заказ")}
          </span>
        </div>
      </div>
    </Link>
  );
}
