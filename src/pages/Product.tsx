import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, formatPrice } from "../api.ts";
import Footer from "../components/Footer.tsx";
import ProductCard from "../components/ProductCard.tsx";
import LangSwitch from "../components/LangSwitch.tsx";
import { OrnamentDivider } from "../components/Ornament.tsx";
import { availabilityLabel, useLang } from "../i18n.tsx";
import { localizeProduct } from "../localize.ts";
import type { Product as ProductType } from "../types.ts";

const PLACEHOLDER = "/logo/logo_loading.png";

export default function Product() {
  const { lang, t } = useLang();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [similar, setSimilar] = useState<ProductType[]>([]);
  const [error, setError] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [contacting, setContacting] = useState(false);
  const [copied, setCopied] = useState(false);
  const fetchedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!id || fetchedFor.current === id) return;
    // GET /api/products/{id} увеличивает счётчик просмотров на бэкенде — этот
    // запрос не идемпотентен, поэтому явно защищаемся от повторного вызова
    // (React 18 StrictMode в dev монтирует эффекты дважды).
    fetchedFor.current = id;
    setProduct(null);
    setSimilar([]);
    setActivePhoto(0);
    setError(false);
    window.scrollTo({ top: 0 });
    api
      .product(id)
      .then((p) => {
        setProduct(p);
        // Похожие изделия той же категории (кроме текущего)
        api
          .products({ category: p.category })
          .then((list) => setSimilar(list.filter((x) => x.id !== p.id).slice(0, 4)))
          .catch(() => setSimilar([]));
      })
      .catch(() => setError(true));
  }, [id]);

  async function handleContact() {
    if (!id) return;
    setContacting(true);
    try {
      const { contact_url } = await api.lead(id);
      if (contact_url) {
        window.open(contact_url, "_blank", "noopener,noreferrer");
      } else {
        alert(t("noContact"));
      }
    } catch {
      alert(t("contactFailed"));
    } finally {
      setContacting(false);
    }
  }

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* клипборд недоступен — молча пропускаем */
    }
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <img src="/logo/logo_main.png" alt="" className="mx-auto h-16 w-auto opacity-15" />
          <p className="mb-4 mt-4 text-ink/55">{t("productNotFound")}</p>
          <Link to="/" className="font-medium text-clay hover:underline">
            {t("backToCatalogLink")}
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink/40">
        <span className="animate-pulse">{t("loading")}</span>
      </div>
    );
  }

  const localized = localizeProduct(product, lang);
  const hasPhoto = Boolean(localized.photos?.length);
  const photos = localized.photos?.length ? localized.photos : [PLACEHOLDER];
  const inStock = localized.availability === "в наличии";

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
        <Link to="/" className="text-sm font-medium text-ink/50 transition hover:text-clay">
          {t("backToCatalog")}
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo/logo_mini.png" alt="" className="h-8 w-auto" />
            <span className="font-display text-xl text-ink">Шебер</span>
          </Link>
          <LangSwitch variant="light" />
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl bg-line/40 ring-1 ring-line shadow-warm">
              <img
                src={photos[activePhoto]}
                alt={localized.title}
                className={
                  hasPhoto ? "h-full w-full object-cover" : "h-full w-full object-contain p-16 opacity-60"
                }
                onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
              />
            </div>
            {photos.length > 1 && (
              <div className="mt-3 flex gap-2">
                {photos.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`h-16 w-16 overflow-hidden rounded-xl ring-2 transition ${
                      i === activePhoto ? "ring-clay" : "ring-line hover:ring-clay/40"
                    }`}
                  >
                    <img src={p} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Условия покупки */}
            <div className="mt-5 space-y-2.5 rounded-2xl bg-card p-5 text-sm ring-1 ring-line">
              <p className="flex items-start gap-2.5 text-ink/70">
                <span className="mt-0.5 text-clay">✓</span>
                {localized.delivery || t("deliveryDefault")}
              </p>
              <p className="flex items-start gap-2.5 text-ink/70">
                <span className="mt-0.5 text-clay">✓</span>
                {t("directPayment")}
              </p>
              <p className="flex items-start gap-2.5 text-ink/70">
                <span className="mt-0.5 text-clay">✓</span>
                {t("customOrder")}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-card p-6 ring-1 ring-line shadow-warm sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                {localized.brand && (
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-ink/40">
                    {localized.brand}
                  </p>
                )}
                <h1 className="mt-1 font-display text-3xl leading-snug text-ink">{localized.title}</h1>
              </div>
              <button
                onClick={handleShare}
                title={t("copyLink")}
                className="shrink-0 rounded-xl bg-paper px-3 py-2 text-xs font-semibold text-ink/60 ring-1 ring-line transition hover:text-clay hover:ring-clay/50"
              >
                {copied ? t("copied") : t("copyLink")}
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/40">
              {localized.sku && <span>Арт. {localized.sku}</span>}
              {localized.reviews_count !== undefined && (
                <span className="text-gold">
                  ★ {localized.rating?.toFixed(1) ?? "0.0"}{" "}
                  <span className="text-ink/40">({localized.reviews_count})</span>
                </span>
              )}
              <span>
                {localized.views || 0} {t("viewsSuffix")}
              </span>
            </div>

            {localized.badges && localized.badges.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {localized.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-lg bg-clay/10 px-2.5 py-1 text-xs font-semibold text-clay-dark"
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-5 font-display text-4xl text-clay">
              {formatPrice(localized.price, localized.currency)}
            </p>
            {localized.price_note && <p className="mt-1 text-xs text-ink/40">{localized.price_note}</p>}
            <p className="mt-2 text-sm text-ink/60">
              <span className={inStock ? "font-semibold text-clay-dark" : ""}>
                {inStock ? `● ${availabilityLabel(lang, "в наличии")}` : availabilityLabel(lang, localized.availability || "под заказ")}
              </span>
            </p>

            <OrnamentDivider className="my-6" />

            <p className="whitespace-pre-line leading-relaxed text-ink/80">{localized.description}</p>

            {localized.options && localized.options.length > 0 && (
              <div className="mt-6 space-y-3">
                {localized.options.map((opt) => (
                  <div key={opt.name}>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink/45">
                      {opt.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {opt.values.map((v) => (
                        <span
                          key={v}
                          className="rounded-xl bg-paper px-3 py-1.5 text-sm text-ink/75 ring-1 ring-line"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {localized.characteristics && Object.keys(localized.characteristics).length > 0 && (
              <div className="mt-7">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink/45">
                  {t("characteristics")}
                </h2>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(localized.characteristics).map(([k, v]) => (
                      <tr key={k} className="border-t border-line">
                        <td className="py-2 pr-4 align-top text-ink/50">{k}</td>
                        <td className="py-2 text-ink/85">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {localized.hashtags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {localized.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-paper px-3 py-1 text-xs text-ink/45 ring-1 ring-line"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={handleContact}
              disabled={contacting}
              className="mt-8 w-full rounded-xl bg-clay py-3.5 font-bold text-paper shadow-warm transition hover:bg-clay-dark disabled:opacity-60"
            >
              {contacting ? t("contacting") : t("contactSeller")}
            </button>
            <p className="mt-3 text-center text-xs text-ink/35">{t("contactHint")}</p>
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-16">
            <OrnamentDivider />
            <h2 className="mt-8 font-display text-2xl text-ink">{t("similarProducts")}</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
              {similar.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
