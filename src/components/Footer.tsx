import { BOT_LINKS } from "../api.ts";
import { useLang } from "../i18n.tsx";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="relative mt-4 overflow-hidden bg-ink text-paper">
      <img
        src="/logo/logo_mini.png"
        alt=""
        className="pointer-events-none absolute -right-24 top-4 h-72 w-auto opacity-[0.05]"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="flex items-center gap-3">
          <img src="/logo/logo_main.png" alt="" className="h-10 w-auto" />
          <h2 className="font-display text-3xl">{t("footerTitle")}</h2>
        </div>

        {/* Шаги — крупные номера ведут взгляд 01 → 02 → 03; у каждого своя раскладка */}
        <div className="relative mt-16">
          {/* тонкая траектория, связывающая шаги */}
          <div className="pointer-events-none absolute inset-x-0 top-11 hidden h-px bg-gradient-to-r from-transparent via-paper/15 to-transparent md:block" />

          <div className="grid gap-y-16 md:grid-cols-3 md:gap-x-8">
            {/* 01 — номер сверху */}
            <div>
              <p className="font-display text-[5.5rem] leading-none text-clay">01</p>
              <div className="mt-6 max-w-[24ch]">
                <p className="font-semibold text-paper">{t("step1Title")}</p>
                <p className="mt-2 text-sm leading-relaxed text-paper/55">{t("step1Text")}</p>
              </div>
            </div>

            {/* 02 — номер слева, шаг опущен ниже */}
            <div className="flex items-start gap-5 md:pt-24">
              <p className="shrink-0 font-display text-[5.5rem] leading-none text-clay/85">02</p>
              <div className="max-w-[19ch] pt-5">
                <p className="font-semibold text-paper">{t("step2Title")}</p>
                <p className="mt-2 text-sm leading-relaxed text-paper/55">{t("step2Text")}</p>
              </div>
            </div>

            {/* 03 — номер справа, текст по правому краю */}
            <div className="flex flex-row-reverse items-start gap-5 text-right md:pt-10">
              <p className="shrink-0 font-display text-[5.5rem] leading-none text-clay/70">03</p>
              <div className="max-w-[19ch] pt-5">
                <p className="font-semibold text-paper">{t("step3Title")}</p>
                <p className="mt-2 text-sm leading-relaxed text-paper/55">{t("step3Text")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA — отдельная композиционная зона с воздухом и хвостовой линией */}
        <div className="mt-24 flex flex-wrap items-center gap-3 border-t border-paper/10 pt-12">
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

        <div className="mt-16 flex flex-col items-center gap-2 border-t border-paper/10 pt-6 text-center text-xs text-paper/40 sm:flex-row sm:justify-between">
          <span>{t("footerBrand")}</span>
          <span>
            {t("footerMade")} · {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
