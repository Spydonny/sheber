import type { Categories, LeadResponse, Product, Stats, Storyboard } from "./types";

/** База API. VITE_API_BASE иногда задают без схемы (напр. "host.up.railway.app") —
 * тогда fetch трактует её как относительный путь и уходит на origin витрины.
 * Достраиваем https:// принудительно. */
function normalizeBase(raw: string | undefined): string {
  const v = (raw || "http://localhost:8000").trim().replace(/\/+$/, "");
  if (!v) return "http://localhost:8000";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

const API_BASE = normalizeBase(import.meta.env.VITE_API_BASE);

/** Ссылки на ботов-каналы приёма мастеров (задаются в front/.env). */
export const BOT_LINKS = {
  telegram: import.meta.env.VITE_TG_BOT_URL || "https://t.me/sheber_market_bot",
  whatsapp: import.meta.env.VITE_WA_BOT_URL || "https://wa.me/",
};

async function req<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, opts);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  categories: () => req<Categories>("/api/categories"),
  products: (params: Record<string, string> = {}): Promise<Product[]> => {
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v));
    const qs = new URLSearchParams(clean).toString();
    return req<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
  },
  product: (id: string) => req<Product>(`/api/products/${id}`),
  /** Сториборд товара — 404 если бот его ещё не сгенерировал (/cards). */
  storyboard: (id: string) => req<Storyboard>(`/api/products/${id}/storyboard`),
  lead: (id: string) => req<LeadResponse>(`/api/products/${id}/lead`, { method: "POST" }),
  stats: () => req<Stats>("/api/stats"),
};

export function formatPrice(v: number | null | undefined, currency = "₸"): string {
  if (!v) return "—";
  return `${v.toLocaleString("ru-RU")} ${currency}`;
}

/** Достраивает ссылку на фото товара до абсолютной, читаемой из Mongo (GridFS).
 * API отдаёт относительные пути `/media/{id}`; медиа раздаёт именно API_BASE. */
export function mediaUrl(ref: string): string {
  if (!ref) return ref;
  if (/^https?:\/\//i.test(ref)) return ref;
  if (ref.startsWith("/media/")) return `${API_BASE}${ref}`;
  return `${API_BASE}/media/${ref}`;
}
