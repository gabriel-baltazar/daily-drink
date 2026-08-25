import { useEffect, useState } from "react";
import { StoreProvider, useStore } from "./store";
import type { CoffeeEntry, WineEntry } from "./types";
import { IconBook, IconCompass, IconCup, IconGear, IconGlass, IconHeart, IconHome, IconPlus, IconSearch } from "./icons";
import Auth from "./views/Auth";
import Home from "./views/Home";
import Diary from "./views/Diary";
import Detail from "./views/Detail";
import CoffeeForm from "./views/CoffeeForm";
import WineForm from "./views/WineForm";
import Discover from "./views/Discover";
import Favorites from "./views/Favorites";
import Settings from "./views/Settings";
import SearchOverlay from "./views/SearchOverlay";

type ViewName = "home" | "diary" | "discover" | "favorites" | "settings" | "new" | "detail";

interface View {
  name: ViewName;
  id?: string;
  prefill?: CoffeeEntry | WineEntry | null;
  editingId?: string | null;
}

interface Nav {
  go: (v: "home" | "diary" | "discover" | "favorites" | "settings") => void;
  detail: (id: string) => void;
  newEntry: (prefill?: CoffeeEntry | WineEntry | null, editingId?: string | null) => void;
}

/* ---------- alternador café / vinho ---------- */

function ModeSwitcher({ onSwitch }: { onSwitch: (m: "coffee" | "wine") => void }) {
  const { mode } = useStore();
  return (
    <div
      className="relative grid w-[9.4rem] shrink-0 grid-cols-2 rounded-full border border-line bg-panel p-1 sm:w-[10.5rem]"
      role="tablist"
      aria-label="Alternar entre café e vinho"
    >
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-[var(--accent)] shadow-[0_2px_10px_var(--accent-glow)] transition-transform duration-300 ease-out"
        style={{ transform: mode === "wine" ? "translateX(100%)" : "translateX(0)" }}
      />
      {(
        [
          ["coffee", "Café", IconCup],
          ["wine", "Vinho", IconGlass],
        ] as const
      ).map(([m, label, Ic]) => (
        <button
          key={m}
          role="tab"
          aria-selected={mode === m}
          onClick={() => onSwitch(m)}
          className={`relative z-10 flex items-center justify-center gap-1.5 rounded-full py-1.5 text-[13.5px] font-medium transition-colors duration-300 ${
            mode === m ? "text-[#f8f7f4]" : "text-mute hover:text-ink"
          }`}
        >
          <Ic size={15} /> {label}
        </button>
      ))}
    </div>
  );
}

/* ---------- toasts ---------- */

function ToastHost() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-4 md:bottom-8">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="anim-toast rounded-full bg-ink px-5 py-2.5 text-[13.5px] text-paper shadow-[0_12px_32px_rgba(28,28,26,0.3)]"
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ---------- fundo ambiente ---------- */

function Ambient({ mode }: { mode: "coffee" | "wine" }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-paper" />
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: mode === "coffee" ? 1 : 0,
          background:
            "radial-gradient(55rem 38rem at 88% -12%, rgba(123,87,62,0.13), transparent 60%), radial-gradient(45rem 32rem at -12% 112%, rgba(123,87,62,0.09), transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: mode === "wine" ? 1 : 0,
          background:
            "radial-gradient(55rem 38rem at 88% -12%, rgba(107,46,53,0.13), transparent 60%), radial-gradient(45rem 32rem at -12% 112%, rgba(107,46,53,0.09), transparent 55%)",
        }}
      />
    </div>
  );
}

/* ---------- navegação ---------- */

function NavTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-1.5 transition-colors duration-200 ${
        active ? "text-[var(--accent-ink)]" : "text-faint hover:text-mute"
      }`}
    >
      {icon}
      <span className="text-[9.5px] font-semibold uppercase tracking-[0.14em]">{label}</span>
      <span
        className={`h-1 w-1 rounded-full bg-[var(--accent)] transition-all duration-300 ${
          active ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      />
    </button>
  );
}

const DESKTOP_LINKS: { v: "home" | "diary" | "discover" | "favorites"; label: string }[] = [
  { v: "home", label: "Início" },
  { v: "diary", label: "Diário" },
  { v: "discover", label: "Descobrir" },
  { v: "favorites", label: "Favoritos" },
];

/* ---------- shell ---------- */

function Shell() {
  const { user, mode, setMode, coffees, wines } = useStore();
  const [view, setView] = useState<View>({ name: "home" });
  const [searchOpen, setSearchOpen] = useState(false);

  const nav: Nav = {
    go: (v) => setView({ name: v }),
    detail: (id) => {
      if (coffees.some((c) => c.id === id) && mode !== "coffee") setMode("coffee");
      else if (wines.some((w) => w.id === id) && mode !== "wine") setMode("wine");
      setView({ name: "detail", id });
    },
    newEntry: (prefill = null, editingId = null) => setView({ name: "new", prefill, editingId }),
  };

  const switchMode = (m: "coffee" | "wine") => {
    if (m === mode) return;
    setMode(m);
    if (view.name === "new") setView({ name: "home" });
    if (view.name === "detail" && view.id) {
      const inCoffee = coffees.some((c) => c.id === view.id);
      const inWine = wines.some((w) => w.id === view.id);
      if ((m === "coffee" && !inCoffee) || (m === "wine" && !inWine)) setView({ name: "home" });
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view.name, view.id, view.editingId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (user) setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [user]);

  const activeSection: ViewName =
    view.name === "detail" || view.name === "new" ? "diary" : view.name;

  const viewKey = `${view.name}|${view.id ?? ""}|${view.editingId ?? ""}|${mode}`;

  return (
    <div className="min-h-screen">
      <Ambient mode={mode} />

      {/* cabeçalho */}
      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto max-w-[52rem] px-5 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-3">
            <button
              onClick={() => nav.go("home")}
              className="font-display text-[23px] italic leading-none transition-opacity hover:opacity-75"
              aria-label="Ir para o início"
            >
              Notas<span className="text-[var(--accent)]">.</span>
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Buscar (Ctrl+K)"
                title="Buscar (Ctrl+K)"
                className="grid h-9 w-9 place-items-center rounded-full text-mute transition-all duration-200 hover:bg-[var(--accent-soft)] hover:text-[var(--accent-ink)] active:scale-90"
              >
                <IconSearch size={18} />
              </button>
              <button
                onClick={() => nav.go("settings")}
                aria-label="Configurações"
                className={`grid h-9 w-9 place-items-center rounded-full transition-all duration-200 active:scale-90 ${
                  view.name === "settings"
                    ? "bg-[var(--accent-soft)] text-[var(--accent-ink)]"
                    : "text-mute hover:bg-[var(--accent-soft)] hover:text-[var(--accent-ink)]"
                }`}
              >
                <IconGear size={18} />
              </button>
              <ModeSwitcher onSwitch={switchMode} />
            </div>
          </div>
          <nav className="hidden items-center gap-7 pb-3 md:flex">
            {DESKTOP_LINKS.map((l) => (
              <button
                key={l.v}
                onClick={() => nav.go(l.v)}
                className={`link-quiet text-[12.5px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ${
                  activeSection === l.v ? "active text-[var(--accent-ink)]" : "text-mute hover:text-ink"
                }`}
              >
                {l.label}
              </button>
            ))}
            <span className="ml-auto text-[12px] tabular-nums text-faint">
              {mode === "coffee"
                ? `${coffees.length} ${coffees.length === 1 ? "registro" : "registros"}`
                : `${wines.length} ${wines.length === 1 ? "registro" : "registros"}`}
            </span>
          </nav>
        </div>
      </header>

      {/* conteúdo */}
      <main className="mx-auto max-w-[52rem] px-5 pb-32 sm:px-6 md:pb-12">
        <div key={viewKey} className="anim-view">
          {view.name === "home" && <Home nav={nav} />}
          {view.name === "diary" && <Diary nav={nav} />}
          {view.name === "discover" && <Discover />}
          {view.name === "favorites" && <Favorites nav={nav} />}
          {view.name === "settings" && <Settings />}
          {view.name === "detail" && view.id && <Detail nav={nav} id={view.id} />}
          {view.name === "new" &&
            (mode === "coffee" ? (
              <CoffeeForm
                nav={nav}
                prefill={(view.prefill as CoffeeEntry | null) ?? null}
                editingId={view.editingId ?? null}
              />
            ) : (
              <WineForm
                nav={nav}
                prefill={(view.prefill as WineEntry | null) ?? null}
                editingId={view.editingId ?? null}
              />
            ))}
        </div>

        <footer className="mt-16 hidden border-t border-line py-8 text-center text-[12px] text-faint md:block">
          <span className="font-display italic text-[13px]">
            Notas<span className="text-[var(--accent)]">.</span>
          </span>
          <span className="mx-3">·</span>
          um pequeno diário de café e vinho
          <span className="mx-3">·</span>
          <kbd className="rounded border border-line bg-panel px-1.5 py-0.5 text-[10.5px]">Ctrl</kbd>
          {" + "}
          <kbd className="rounded border border-line bg-panel px-1.5 py-0.5 text-[10.5px]">K</kbd>{" "}
          para buscar
        </footer>
      </main>

      {/* navegação mobile */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Navegação principal"
      >
        <div className="grid grid-cols-5 items-end px-2 pb-1.5 pt-1">
          <NavTab
            active={activeSection === "home"}
            onClick={() => nav.go("home")}
            icon={<IconHome size={21} />}
            label="Início"
          />
          <NavTab
            active={activeSection === "diary"}
            onClick={() => nav.go("diary")}
            icon={<IconBook size={21} />}
            label="Diário"
          />
          <div className="flex justify-center">
            <button
              onClick={() => nav.newEntry()}
              aria-label={mode === "coffee" ? "Registrar café" : "Registrar vinho"}
              className="-mt-7 grid h-14 w-14 place-items-center rounded-full bg-[var(--accent)] text-[#f8f7f4] shadow-[0_10px_28px_var(--accent-glow)] transition-all duration-200 hover:brightness-110 active:scale-90"
            >
              <IconPlus size={22} />
            </button>
          </div>
          <NavTab
            active={activeSection === "discover"}
            onClick={() => nav.go("discover")}
            icon={<IconCompass size={21} />}
            label="Descobrir"
          />
          <NavTab
            active={activeSection === "favorites"}
            onClick={() => nav.go("favorites")}
            icon={<IconHeart size={21} filled={activeSection === "favorites"} />}
            label="Favoritos"
          />
        </div>
      </nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} nav={nav} />
    </div>
  );
}

function Root() {
  const { user, mode } = useStore();
  return (
    <div className={`${mode === "coffee" ? "mode-coffee" : "mode-wine"} grain font-sans`}>
      {user ? <Shell /> : <Auth />}
      <ToastHost />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Root />
    </StoreProvider>
  );
}
