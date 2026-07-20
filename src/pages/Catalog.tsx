import { useEffect, useMemo, useState } from "react";
import { api, BOT_LINKS } from "../api.ts";
import Footer from "../components/Footer.tsx";
import ProductCard from "../components/ProductCard.tsx";
import LangSwitch from "../components/LangSwitch.tsx";
import { HornMark, OrnamentDivider } from "../components/Ornament.tsx";
import { categoryLabel, useLang } from "../i18n.tsx";
import type { Categories, Product, Stats } from "../types.ts";

type SortKey = "new" | "cheap" | "expensive" | "popular";

function plural(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

export default function Catalog() {
  const { lang, t } = useLang();
  const SORT_LABELS: Record<SortKey, string> = {
    new: t("sortNew"),
    cheap: t("sortCheap"),
    expensive: t("sortExpensive"),
    popular: t("sortPopular"),
  };
  const [categories, setCategories] = useState<Categories>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("new");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.categories().then(setCategories).catch(() => setCategories({}));
    api.stats().then(setStats).catch(() => setStats(null));
  }, []);

  useEffect(() => {
    setLoading(true);
    const handle = setTimeout(() => {
      api
        .products({ category, q })
        .then(setProducts)
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [category, q]);

  const sorted = useMemo(() => {
    const arr = [...products];
    switch (sort) {
      case "cheap":
        return arr.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "expensive":
        return arr.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "popular":
        return arr.sort((a, b) => (b.views || 0) - (a.views || 0));
      default:
        return arr; // API уже отдаёт новые первыми
    }
  }, [products, sort]);

  return (
    <div className="min-h-screen">
      {/* Тёмная чернильная шапка — контраст к бумажному контенту */}
      <header className="relative overflow-hidden bg-ink text-paper">
        <HornMark className="pointer-events-none absolute -right-16 -top-10 h-64 w-auto text-clay/15" />
        <HornMark className="pointer-events-none absolute -left-24 bottom-0 h-44 w-auto text-paper/5" />
        <div className="relative mx-auto max-w-6xl px-4 pb-9 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo/logo_mini.png" alt="" className="h-10 w-auto" />
              <span className="font-display text-2xl tracking-tight">Шебер</span>
            </div>
            <LangSwitch variant="dark" />
          </div>

          <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-[1fr_20rem] md:items-end">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl leading-[1.08] tracking-tight sm:text-[3.25rem]">
                {t("heroHeadline")}
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-paper/60">{t("tagline")}</p>
              {stats && stats.products > 0 && (
                <div className="mt-6 flex gap-8 text-sm">
                  <div>
                    <p className="font-display text-2xl text-clay">{stats.products}</p>
                    <p className="text-xs text-paper/45">
                      {plural(stats.products, t("products_one"), t("products_few"), t("products_many"))}
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-2xl text-clay">{stats.sellers}</p>
                    <p className="text-xs text-paper/45">
                      {plural(stats.sellers, t("sellers_one"), t("sellers_few"), t("sellers_many"))}
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-2xl text-clay">{stats.views}</p>
                    <p className="text-xs text-paper/45">
                      {plural(stats.views, t("views_one"), t("views_few"), t("views_many"))}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex w-full flex-col gap-3">
              <div className="relative">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/35"
                >
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="w-full rounded-xl border border-paper/15 bg-paper py-3.5 pl-11 pr-4 text-[15px] text-ink shadow-warm outline-none transition placeholder:text-ink/40 focus:border-clay focus:ring-2 focus:ring-clay/30"
                />
              </div>
              <a
                href={BOT_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-clay/60 px-4 py-2.5 text-center text-sm font-bold text-clay transition hover:bg-clay hover:text-paper"
              >
                {t("becomeSeller")}
              </a>
            </div>
          </div>
        </div>
        <div className="h-1 w-full bg-clay" />
      </header>

      {/* Категории + сортировка */}
      <div className="border-b border-line bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-4">
          <button
            onClick={() => setCategory("")}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              category === ""
                ? "bg-clay text-paper shadow-warm"
                : "bg-paper text-ink/60 ring-1 ring-line hover:ring-clay/40 hover:text-ink"
            }`}
          >
            {t("allProducts")}
          </button>
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                category === key
                  ? "bg-clay text-paper shadow-warm"
                  : "bg-paper text-ink/60 ring-1 ring-line hover:ring-clay/40 hover:text-ink"
              }`}
            >
              {categoryLabel(lang, key, label)}
            </button>
          ))}
          <span className="flex-1" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="shrink-0 rounded-full border-0 bg-paper px-3 py-1.5 text-sm font-medium text-ink/70 ring-1 ring-line outline-none focus:ring-clay/50"
          >
            {Object.entries(SORT_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {loading ? (
          <p className="animate-pulse py-16 text-center text-ink/40">{t("loadingProducts")}</p>
        ) : sorted.length === 0 ? (
          <div className="mx-auto max-w-sm py-20 text-center">
            <img src="/logo/logo_main.png" alt="" className="mx-auto h-16 w-auto opacity-15" />
            <p className="mt-4 text-ink/45">{t("emptyResults")}</p>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-ink/40">
              {sorted.length} {plural(sorted.length, t("products_one"), t("products_few"), t("products_many"))}
              {category && categories[category] ? ` · ${categoryLabel(lang, category, categories[category])}` : ""}
              {q ? ` · «${q}»` : ""}
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {sorted.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <OrnamentDivider className="mt-16" />
            <p className="mt-4 pb-4 text-center text-xs tracking-wide text-ink/35">{t("madeByHand")}</p>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
