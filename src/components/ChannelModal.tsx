import { useEffect } from "react";
import { BOT_LINKS } from "../api.ts";
import { useLang } from "../i18n.tsx";

export default function ChannelModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="channel-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-paper p-7 shadow-warm-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="channel-modal-title" className="font-display text-2xl text-ink">
          {t("chooseChannelTitle")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/55">{t("chooseChannelText")}</p>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={BOT_LINKS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-clay px-6 py-3.5 text-center font-bold text-paper transition hover:bg-clay-dark"
            onClick={onClose}
          >
            {t("startTelegram")}
          </a>
          <a
            href={BOT_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-line px-6 py-3.5 text-center font-bold text-ink/90 transition hover:border-clay hover:text-ink"
            onClick={onClose}
          >
            {t("startWhatsapp")}
          </a>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full text-center text-sm font-semibold text-ink/40 transition hover:text-ink/70"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}
