import { Link } from "react-router-dom";
import TabNav from "./TabNav.tsx";
import LangSwitch from "./LangSwitch.tsx";

export default function SiteHeader() {
  return (
    <header className="relative overflow-hidden bg-ink text-paper">
      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo/logo_main.png" alt="" className="h-9 w-auto" />
          <span className="font-display text-xl tracking-tight">Шебер</span>
        </Link>
        <TabNav />
        <LangSwitch variant="dark" />
      </div>
      <div className="h-1 w-full bg-clay" />
    </header>
  );
}
