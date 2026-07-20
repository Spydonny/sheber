import { NavLink } from "react-router-dom";
import { useLang } from "../i18n.tsx";

export default function TabNav() {
  const { t } = useLang();
  const base = "rounded-full px-4 py-1.5 text-sm font-semibold transition";
  const cls = ({ isActive }: { isActive: boolean }) =>
    `${base} ${isActive ? "bg-clay text-paper shadow-warm" : "text-paper/60 hover:text-paper"}`;

  return (
    <nav className="inline-flex shrink-0 gap-1 rounded-full bg-paper/5 p-1 ring-1 ring-paper/15">
      <NavLink to="/" end className={cls}>
        {t("tabHome")}
      </NavLink>
      <NavLink to="/catalog" className={cls}>
        {t("tabCatalog")}
      </NavLink>
    </nav>
  );
}
