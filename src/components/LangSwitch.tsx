import { useLang } from "../i18n.tsx";

export default function LangSwitch({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const { lang, setLang } = useLang();
  const ring = variant === "dark" ? "ring-paper/20" : "ring-line";
  const inactive = variant === "dark" ? "text-paper/60 hover:text-paper" : "text-ink/50 hover:text-ink";

  return (
    <div className={`inline-flex shrink-0 overflow-hidden rounded-full ring-1 ${ring} text-xs font-semibold`}>
      <button
        onClick={() => setLang("ru")}
        className={`px-2.5 py-1 transition ${lang === "ru" ? "bg-clay text-paper" : inactive}`}
      >
        RU
      </button>
      <button
        onClick={() => setLang("kk")}
        className={`px-2.5 py-1 transition ${lang === "kk" ? "bg-clay text-paper" : inactive}`}
      >
        ҚАЗ
      </button>
    </div>
  );
}
