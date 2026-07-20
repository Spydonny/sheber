import type { Lang } from "./i18n.tsx";
import type { Product } from "./types.ts";

/** Накладывает kk-перевод (если есть) поверх базовой (русской) карточки товара.
 * Поля без перевода (цена, наличие, sku и т.п.) остаются как есть. */
export function localizeProduct(p: Product, lang: Lang): Product {
  const kk = p.translations?.kk;
  if (lang !== "kk" || !kk) return p;
  return { ...p, ...kk };
}
