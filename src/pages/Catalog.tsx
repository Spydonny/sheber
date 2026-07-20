import { useEffect, useMemo, useState } from "react";
import { api } from "../api.ts";
import Footer from "../components/Footer.tsx";
import ProductCard from "../components/ProductCard.tsx";
import SiteHeader from "../components/SiteHeader.tsx";
import { OrnamentDivider } from "../components/Ornament.tsx";
import { categoryLabel, plural, useLang } from "../i18n.tsx";
import type { Categories, Product } from "../types.ts";

type SortKey = "new" | "cheap" | "expensive" | "popular";

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
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("new");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.categories().then(setCategories).catch(() => setCategories({}));
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
      <SiteHeader />

      {/* Поиск + категории + сортировка */}
      <div className="border-b border-line bg-card/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <div className="relative max-w-lg">
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
              className="w-full rounded-xl border border-line bg-paper py-3 pl-11 pr-4 text-[15px] text-ink shadow-warm outline-none transition placeholder:text-ink/40 focus:border-clay focus:ring-2 focus:ring-clay/30"
            />
          </div>
        </div>
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
            <img src="/logo/logo_loading.png" alt="" className="mx-auto h-16 w-auto opacity-15" />
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
