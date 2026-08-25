import { useEffect, useMemo, useRef, useState } from "react";
import { relative, useStore } from "../store";
import { Kicker } from "../ui";
import { IconCup, IconGlass, IconSearch, IconX } from "../icons";
import { ratingLabel, resultLabel, type CoffeeEntry, type WineEntry } from "../types";

interface Nav {
  detail: (id: string) => void;
}

function hay(...parts: (string | string[] | undefined)[]) {
  return parts
    .flat()
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function SearchOverlay({
  open,
  onClose,
  nav,
}: {
  open: boolean;
  onClose: () => void;
  nav: Nav;
}) {
  const { mode, coffees, wines } = useStore();
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<"mode" | "all">("mode");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const query = q.trim().toLowerCase();

  const coffeeHits = useMemo(
    () =>
      !query || scope === "all" || mode === "coffee"
        ? coffees.filter((c) =>
            query
              ? hay(c.coffee_name, c.roaster, c.country, c.region, c.brew_method, c.process, c.flavor_notes).includes(query)
              : true
          )
        : [],
    [coffees, query, scope, mode]
  );

  const wineHits = useMemo(
    () =>
      !query || scope === "all" || mode === "wine"
        ? wines.filter((w) =>
            query
              ? hay(w.wine_name, w.producer, w.country, w.region, w.wine_type, w.grapes, w.flavor_notes).includes(query)
              : true
          )
        : [],
    [wines, query, scope, mode]
  );

  if (!open) return null;

  const showCoffees = scope === "all" ? coffeeHits : mode === "coffee" ? coffeeHits : [];
  const showWines = scope === "all" ? wineHits : mode === "wine" ? wineHits : [];
  const recent = [...showCoffees, ...showWines]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 8);
  const total = showCoffees.length + showWines.length;

  return (
    <div
      className="anim-fade fixed inset-0 z-50 flex items-start justify-center bg-ink/35 px-4 pt-[12vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Busca"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="anim-view w-full max-w-xl overflow-hidden rounded-xl border border-line bg-paper shadow-[0_24px_60px_rgba(28,28,26,0.3)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <span className="text-[var(--accent)]">
            <IconSearch size={19} />
          </span>
          <input
            ref={inputRef}
            className="w-full bg-transparent text-[16px] outline-none placeholder:text-faint"
            placeholder={mode === "coffee" ? "Buscar café, origem, notas…" : "Buscar vinho, uva, notas…"}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="flex shrink-0 gap-1 rounded-full border border-line bg-panel p-0.5">
            {(["mode", "all"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all duration-200 ${
                  scope === s ? "bg-[var(--accent)] text-[#f8f7f4]" : "text-mute hover:text-ink"
                }`}
              >
                {s === "mode" ? (mode === "coffee" ? "Café" : "Vinho") : "Tudo"}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar busca"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-mute transition hover:bg-ink/5 hover:text-ink"
          >
            <IconX size={16} />
          </button>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-3">
          {!query && (
            <p className="px-3 py-4 text-[13px] text-faint">
              Busque por nome, origem, método, uva, país ou notas sensoriais — por exemplo,
              <em className="text-mute"> “chocolate”</em>.
            </p>
          )}

          {query && total === 0 && (
            <p className="px-3 py-6 text-center text-[14px] text-mute">
              Nada encontrado para “{q}”.
            </p>
          )}

          {showCoffees.length > 0 && (
            <div className="mb-2">
              {scope === "all" && (
                <Kicker className="px-3 pb-1 pt-2">
                  Cafés com {query ? `“${q}”` : "registros"} · {showCoffees.length}
                </Kicker>
              )}
              {showCoffees.slice(0, 6).map((c: CoffeeEntry) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onClose();
                    nav.detail(c.id);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-[var(--accent-soft)]"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-panel text-[var(--accent)]">
                    <IconCup size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[15.5px]">{c.coffee_name}</span>
                    <span className="block truncate text-[12px] text-mute">
                      {[c.brew_method, resultLabel(c.overall_result), c.flavor_notes.slice(0, 2).join(" · ")]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                  <span className="shrink-0 text-[11px] uppercase tracking-[0.12em] text-faint">
                    {relative(c.created_at)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {showWines.length > 0 && (
            <div>
              {scope === "all" && (
                <Kicker className="px-3 pb-1 pt-2">
                  Vinhos com {query ? `“${q}”` : "registros"} · {showWines.length}
                </Kicker>
              )}
              {showWines.slice(0, 6).map((w: WineEntry) => (
                <button
                  key={w.id}
                  onClick={() => {
                    onClose();
                    nav.detail(w.id);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-[var(--accent-soft)]"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-panel text-[var(--accent)]">
                    <IconGlass size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[15.5px]">{w.wine_name}</span>
                    <span className="block truncate text-[12px] text-mute">
                      {[
                        w.country,
                        w.vintage ? String(w.vintage) : null,
                        ratingLabel(w.personal_rating),
                        w.flavor_notes.slice(0, 2).join(" · "),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                  <span className="shrink-0 text-[11px] uppercase tracking-[0.12em] text-faint">
                    {relative(w.created_at)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {!query && recent.length > 0 && (
            <div className="border-t border-line pt-2">
              <Kicker className="px-3 pb-1 pt-2">Recentes</Kicker>
              {recent.map((e) => {
                const isC = "coffee_name" in e;
                return (
                  <button
                    key={e.id}
                    onClick={() => {
                      onClose();
                      nav.detail(e.id);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-[var(--accent-soft)]"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-panel text-[var(--accent)]">
                      {isC ? <IconCup size={16} /> : <IconGlass size={16} />}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-display text-[15px]">
                      {isC ? (e as CoffeeEntry).coffee_name : (e as WineEntry).wine_name}
                    </span>
                    <span className="shrink-0 text-[11px] uppercase tracking-[0.12em] text-faint">
                      {relative(e.created_at)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
