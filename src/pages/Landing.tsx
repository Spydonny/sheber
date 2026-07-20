import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, BOT_LINKS } from "../api.ts";
import Footer from "../components/Footer.tsx";
import ProductCard from "../components/ProductCard.tsx";
import SiteHeader from "../components/SiteHeader.tsx";
import { plural, useLang } from "../i18n.tsx";
import type { Product, Stats } from "../types.ts";

/** Иконки-акценты для блока преимуществ (тонкая обводка, наследует currentColor). */
const VALUE_ICONS = [
  // прямой контакт с мастером — реплика чата
  <path key="chat" d="M20 11.5a7.5 7.5 0 0 1-10.9 6.7L4 19.5l1.3-4.2A7.5 7.5 0 1 1 20 11.5Z" />,
  // без комиссий — знак процента
  <g key="percent">
    <circle cx="8" cy="8" r="2" />
    <circle cx="16" cy="16" r="2" />
    <path d="M6.5 17.5 17.5 6.5" />
  </g>,
  // собрано ИИ — искра
  <g key="spark">
    <path d="M12 4l1.7 4.8L18.5 10.5l-4.8 1.7L12 17l-1.7-4.8L5.5 10.5l4.8-1.7z" />
    <path d="M18 4.5l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6z" />
  </g>,
];

/** Неравные колонки + вертикальный сдвиг — намеренно ломаем ровную сетку 3×1. */
const VALUE_COLS = ["md:col-span-5", "md:col-span-3 md:mt-24", "md:col-span-4 md:mt-10"];
/** Разная ширина заголовка → разное число строк и разная высота блоков. */
const VALUE_TITLE_W = ["md:max-w-[11ch]", "md:max-w-[7ch]", "md:max-w-[9ch]"];

export default function Landing() {
  const { t } = useLang();
  const [stats, setStats] = useState<Stats | null>(null);
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    api.stats().then(setStats).catch(() => setStats(null));
    api
      .products()
      .then((list) => setFeatured(list.slice(0, 4)))
      .catch(() => setFeatured([]));
  }, []);

  const VALUES = [
    { title: t("value1Title"), text: t("value1Text") },
    { title: t("value2Title"), text: t("value2Text") },
    { title: t("value3Title"), text: t("value3Text") },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* ГЕРОЙ — тёплое свечение + зеркальные рога поверх чернильного фона */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(680px 340px at 50% -8%, rgba(188,91,53,.20), transparent 70%)",
          }}
        />
        <img
          src="/logo/logo_mini.png"
          alt=""
          className="pointer-events-none absolute -right-16 -top-12 h-60 w-auto opacity-[0.12]"
        />
        <img
          src="/logo/logo_mini.png"
          alt=""
          className="pointer-events-none absolute -left-24 -bottom-12 h-44 w-auto opacity-[0.06]"
        />

        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-paper/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-clay ring-1 ring-paper/15">
            <img src="/logo/logo_mini.png" alt="" className="h-3.5 w-auto" />
            {t("heroEyebrow")}
          </span>

          <h1 className="mt-6 font-display text-[2.5rem] leading-[1.06] tracking-tight sm:text-6xl">
            {t("heroHeadline")}
          </h1>

          <div className="mx-auto mt-7 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-paper/20" />
            <img src="/logo/logo_main.png" alt="" className="h-9 w-auto" />
            <span className="h-px w-12 bg-paper/20" />
          </div>

          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-paper/60">{t("tagline")}</p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/catalog"
              className="rounded-xl bg-clay px-7 py-3.5 text-[15px] font-bold text-paper shadow-warm-lg transition hover:bg-clay-dark"
            >
              {t("exploreCatalog")}
            </Link>
            <a
              href={BOT_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-paper/25 px-7 py-3.5 text-[15px] font-bold text-paper/90 transition hover:border-clay hover:text-paper"
            >
              {t("becomeSeller")}
            </a>
          </div>

          {stats && stats.products > 0 && (
            <div className="mx-auto mt-14 flex max-w-md items-center justify-center divide-x divide-paper/10">
              {[
                [stats.products, t("products_one"), t("products_few"), t("products_many")],
                [stats.sellers, t("sellers_one"), t("sellers_few"), t("sellers_many")],
                [stats.views, t("views_one"), t("views_few"), t("views_many")],
              ].map(([n, one, few, many], i) => (
                <div key={i} className="flex-1 px-4">
                  <p className="font-display text-3xl text-gold">{n as number}</p>
                  <p className="mt-0.5 text-xs text-paper/45">
                    {plural(n as number, one as string, few as string, many as string)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="h-1 w-full bg-clay" />
      </section>

      {/* ПОЧЕМУ ЗДЕСЬ — редакторская выкладка вместо одинаковых карточек */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:py-28">
        <div className="grid gap-x-10 gap-y-16 md:grid-cols-12">
          {VALUES.map((v, i) => (
            <div key={v.title} className={VALUE_COLS[i]}>
              <div className="relative border-t border-line pt-8">
                {/* бронзовая насечка на линии — единственный «декор» */}
                <span className="absolute left-0 top-0 h-0.5 w-12 -translate-y-px bg-clay" />
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-clay-dark"
                  aria-hidden="true"
                >
                  {VALUE_ICONS[i]}
                </svg>
                <h3 className={`mt-6 font-display text-[1.7rem] leading-[1.15] text-ink ${VALUE_TITLE_W[i]}`}>
                  {v.title}
                </h3>
                <p className="mt-3 max-w-[30ch] text-[15px] leading-relaxed text-ink/55">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* СВЕЖЕЕ НА ВИТРИНЕ — превью последних изделий */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-20">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-3xl text-ink">{t("featuredTitle")}</h2>
              <p className="mt-1.5 text-sm text-ink/45">{t("featuredSubtitle")}</p>
            </div>
            <Link
              to="/catalog"
              className="shrink-0 text-sm font-semibold text-clay transition hover:text-clay-dark"
            >
              {t("allProductsLink")}
            </Link>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Как стать продавцом + ссылки на ботов */}
      <Footer />
    </div>
  );
}
