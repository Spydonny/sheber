import type { Categories, LeadResponse, Product, Stats } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

/** Ссылки на ботов-каналы приёма мастеров (задаются в front/.env). */
export const BOT_LINKS = {
  telegram: import.meta.env.VITE_TG_BOT_URL || "https://t.me/sheber_bot",
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
  lead: (id: string) => req<LeadResponse>(`/api/products/${id}/lead`, { method: "POST" }),
  stats: () => req<Stats>("/api/stats"),
};

export function formatPrice(v: number | null | undefined, currency = "₸"): string {
  if (!v) return "—";
  return `${v.toLocaleString("ru-RU")} ${currency}`;
}
