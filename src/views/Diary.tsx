import { useMemo, useState } from "react";
import { relative, useStore } from "../store";
import { Chip, EmptyState, Kicker, Reveal, Btn } from "../ui";
import { IconCup, IconGlass, IconHeart, IconSearch, IconPlus } from "../icons";
import { FILTER_METHODS, ratingLabel, resultLabel, type CoffeeEntry, type WineEntry } from "../types";

interface Nav {
  go: (v: "home" | "diary" | "discover" | "favorites" | "settings") => void;
  detail: (id: string) => void;
  newEntry: (prefill?: CoffeeEntry | WineEntry | null, editingId?: string | null) => void;
}

const FILTERS: Record<"coffee" | "wine", { id: string; label: string }[]> = {
  coffee: [
    { id: "todos", label: "Todos" },
    { id: "espresso", label: "Espresso" },
    { id: "filtro", label: "Filtro" },
    { id: "favoritos", label: "Favoritos" },
  ],
  wine: [
    { id: "todos", label: "Todos" },
    { id: "tintos", label: "Tintos" },
    { id: "brancos", label: "Brancos" },
    { id: "espumantes", label: "Espumantes" },
    { id: "favoritos", label: "Favoritos" },
  ],
};

function matchCoffee(c: CoffeeEntry, q: string) {
  const hay = [
    c.coffee_name,
    c.roaster,
    c.country,
    c.region,
    c.brew_method,
    c.process,
    resultLabel(c.overall_result),
    ...c.flavor_notes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

function matchWine(w: WineEntry, q: string) {
  const hay = [
    w.wine_name,
    w.producer,
    w.country,
    w.region,
    w.wine_type,
    ratingLabel(w.personal_rating),
    ...w.grapes,
    ...w.flavor_notes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export default function Diary({ nav }: { nav: Nav }) {
  const { mode, coffees, wines } = useStore();
  const isCoffee = mode === "coffee";
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("todos");

  const all = isCoffee
    ? [...coffees].sort((a, b) => b.created_at.localeCompare(a.created_at))
    : [...wines].sort((a, b) => b.created_at.localeCompare(a.created_at));

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((e) => {
      if (filter === "favoritos" && !e.is_favorite) return false;
      if (isCoffee) {
        const c = e as CoffeeEntry;
        if (filter === "espresso" && c.brew_method !== "Espresso") return false;
        if (filter === "filtro" && !FILTER_METHODS.includes(c.brew_method)) return false;
        if (q && !matchCoffee(c, q)) return false;
      } else {
        const w = e as WineEntry;
        if (filter === "tintos" && w.wine_type !== "Tinto") return false;
        if (filter === "brancos" && w.wine_type !== "Branco") return false;
        if (filter === "espumantes" && w.wine_type !== "Espumante") return false;
        if (q && !matchWine(w, q)) return false;
      }
      return true;
    });
  }, [all, filter, query, isCoffee]);

  const groups = useMemo(() => {
    const m = new Map<string, typeof list>();
    list.forEach((e) => {
      const k = new Date(e.created_at).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
      const key = k.charAt(0).toUpperCase() + k.slice(1);
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(e);
    });
    return [...m.entries()];
  }, [list]);

  const searching = query.trim().length > 0 || filter !== "todos";

  return (
    <div className="pb-8">
      <header className="pt-10 sm:pt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Kicker>{isCoffee ? "Diário de cafés" : "Diário de vinhos"}</Kicker>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">
              {isCoffee ? "Suas xícaras" : "Suas taças"}
            </h1>
          </div>
          <span className="mb-1.5 text-[13px] tabular-nums text-faint">
            {all.length} {all.length === 1 ? "registro" : "registros"}
          </span>
        </div>

        {all.length > 0 && (
          <div className="mt-7 space-y-4">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint">
                <IconSearch size={17} />
              </span>
              <input
                className="field pl-11"
                placeholder={isCoffee ? "Buscar café, origem, método, notas…" : "Buscar vinho, uva, país, notas…"}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Buscar no diário"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTERS[mode].map((f) => (
                <Chip key={f.id} selected={filter === f.id} onClick={() => setFilter(f.id)}>
                  {f.label}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="mt-10">
        {all.length === 0 ? (
          <EmptyState
            icon={isCoffee ? <IconCup size={30} /> : <IconGlass size={30} />}
            title={isCoffee ? "Seu diário ainda está vazio." : "Ainda não há nenhum vinho por aqui."}
            text={
              isCoffee
                ? "Seu próximo café pode ser o primeiro registro."
                : "Abra uma garrafa e comece seu diário."
            }
            action={
              <Btn onClick={() => nav.newEntry()}>
                <IconPlus size={16} />
                {isCoffee ? "Registrar meu primeiro café" : "Registrar meu primeiro vinho"}
              </Btn>
            }
          />
        ) : list.length === 0 ? (
          <div className="py-14 text-center">
            <p className="font-display text-xl">Nada encontrado por aqui.</p>
            <p className="mt-2 text-[14px] text-mute">
              {searching ? "Tente outra busca ou limpe os filtros." : ""}
            </p>
            {searching && (
              <Btn
                variant="ghost"
                className="mt-4"
                onClick={() => {
                  setQuery("");
                  setFilter("todos");
                }}
              >
                Limpar busca
              </Btn>
            )}
          </div>
        ) : (
          groups.map(([month, entries], gi) => (
            <section key={month} className="mb-10">
              <Kicker className="mb-4">{month}</Kicker>
              <div className="divide-y divide-line border-y border-line">
                {entries.map((e, i) => {
                  const c = e as CoffeeEntry;
                  const w = e as WineEntry;
                  const title = isCoffee ? c.coffee_name : w.wine_name;
                  const meta = isCoffee
                    ? [
                        c.brew_method,
                        c.dose_grams ? `${c.dose_grams} g` : null,
                        c.extraction_time_seconds ? `${c.extraction_time_seconds} s` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")
                    : [w.country, w.vintage ? String(w.vintage) : null, w.grapes[0] && w.grapes[0] !== "Não sei" ? w.grapes[0] : null]
                        .filter(Boolean)
                        .join(" · ");
                  const tag = isCoffee ? resultLabel(c.overall_result) : ratingLabel(w.personal_rating);
                  const notes = e.flavor_notes.slice(0, 3).join(" · ");
                  return (
                    <Reveal key={e.id} delay={Math.min(i, 5) * 40 + gi * 20}>
                      <button
                        onClick={() => nav.detail(e.id)}
                        className="group flex w-full items-center gap-4 px-1 py-4 text-left transition-all duration-200 hover:bg-[var(--accent-soft)] sm:px-3"
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-panel text-[var(--accent)] transition-colors duration-200 group-hover:border-transparent group-hover:bg-[var(--accent)] group-hover:text-[#f8f7f4]">
                          {isCoffee ? <IconCup size={18} /> : <IconGlass size={18} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate font-display text-[17.5px]">{title}</span>
                            {e.is_favorite && (
                              <span className="shrink-0 text-[var(--accent)]">
                                <IconHeart size={12} filled />
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 block truncate text-[12.5px] text-mute">
                            {[meta, tag].filter(Boolean).join(" · ")}
                          </span>
                          {notes && (
                            <span className="mt-0.5 block truncate text-[12.5px] italic text-faint">
                              {notes}
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 text-right text-[11.5px] uppercase tracking-[0.12em] text-faint">
                          {relative(e.created_at)}
                        </span>
                      </button>
                    </Reveal>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
