import { BOT_LINKS } from "../api.ts";
import { HornMark } from "./Ornament.tsx";
import { useLang } from "../i18n.tsx";

export default function Footer() {
  const { t } = useLang();

  const STEPS = [
    { n: "01", title: t("step1Title"), text: t("step1Text") },
    { n: "02", title: t("step2Title"), text: t("step2Text") },
    { n: "03", title: t("step3Title"), text: t("step3Text") },
  ];

  return (
    <footer className="relative mt-4 overflow-hidden bg-ink text-paper">
      <HornMark className="pointer-events-none absolute -right-20 top-6 h-72 w-auto text-paper/5" />
      <div className="relative mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-center gap-3">
          <img src="/logo/logo_mini.png" alt="" className="h-10 w-auto" />
          <h2 className="font-display text-3xl">{t("footerTitle")}</h2>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-paper/10 bg-paper/5 p-5">
              <p className="font-display text-2xl text-clay">{s.n}</p>
              <p className="mt-2 font-semibold">{s.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-paper/55">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={BOT_LINKS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-clay px-6 py-3 font-bold text-paper transition hover:bg-clay-dark"
          >
            {t("startTelegram")}
          </a>
          <a
            href={BOT_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-paper/20 px-6 py-3 font-bold text-paper/90 transition hover:border-clay hover:text-paper"
          >
            {t("startWhatsapp")}
          </a>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 border-t border-paper/10 pt-6 text-center text-xs text-paper/40 sm:flex-row sm:justify-between">
          <span>{t("footerBrand")}</span>
          <span>
            {t("footerMade")} · {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
