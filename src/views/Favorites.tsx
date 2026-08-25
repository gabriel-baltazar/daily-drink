import { useMemo, useState } from "react";
import { relative, useStore } from "../store";
import { EmptyState, HeartBtn, Kicker, Reveal, Btn } from "../ui";
import { IconCup, IconGlass, IconPlus, IconHeart } from "../icons";
import { ratingLabel, resultLabel, type CoffeeEntry, type WineEntry, type WineRating } from "../types";

interface Nav {
  go: (v: "home" | "diary" | "discover" | "favorites" | "settings") => void;
  detail: (id: string) => void;
  newEntry: (prefill?: CoffeeEntry | WineEntry | null, editingId?: string | null) => void;
}

const RATING_ORDER: Record<WineRating, number> = { adorei: 3, bastante: 2, gostei: 1, nao: 0 };

export default function Favorites({ nav }: { nav: Nav }) {
  const { mode, coffees, wines, toggleFavCoffee, toggleFavWine } = useStore();
  const isCoffee = mode === "coffee";
  const [sort, setSort] = useState<"recentes" | "antigos" | "apreciados">("recentes");

  const favs = useMemo(() => {
    const base = (isCoffee ? coffees : wines).filter((e) => e.is_favorite);
    const byRecent = (a: { created_at: string }, b: { created_at: string }) =>
      b.created_at.localeCompare(a.created_at);
    if (sort === "recentes") return [...base].sort(byRecent);
    if (sort === "antigos") return [...base].sort((a, b) => a.created_at.localeCompare(b.created_at));
    if (isCoffee) {
      return [...base].sort((a, b) => {
        const ea = (a as CoffeeEntry).overall_result === "equilibrado" ? 1 : 0;
        const eb = (b as CoffeeEntry).overall_result === "equilibrado" ? 1 : 0;
        return eb - ea || byRecent(a, b);
      });
    }
    return [...base].sort((a, b) => {
      const ra = RATING_ORDER[(a as WineEntry).personal_rating ?? "nao"];
      const rb = RATING_ORDER[(b as WineEntry).personal_rating ?? "nao"];
      return rb - ra || byRecent(a, b);
    });
  }, [coffees, wines, isCoffee, sort]);

  return (
    <div className="pb-8">
      <header className="pt-10 sm:pt-14">
        <Kicker>Favoritos</Kicker>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">
          {isCoffee ? "Meus cafés favoritos" : "Meus vinhos favoritos"}
        </h1>
        <p className="mt-3 max-w-md text-[15px] text-mute">
          {isCoffee
            ? "Os cafés que você guardaria para repetir sem pensar duas vezes."
            : "As garrafas que marcaram — aquelas que você abriria de novo."}
        </p>
      </header>

      {favs.length > 0 && (
        <div className="mt-7 flex flex-wrap gap-2">
          {(
            [
              ["recentes", "Mais recentes"],
              ["antigos", "Mais antigos"],
              ["apreciados", "Mais apreciados"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSort(id)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-all duration-200 ${
                sort === id
                  ? "border-transparent bg-[var(--accent)] text-[#f8f7f4]"
                  : "border-line bg-panel text-mute hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        {favs.length === 0 ? (
          <EmptyState
            icon={<IconHeart size={28} filled />}
            title={isCoffee ? "Nenhum café favorito ainda." : "Nenhum vinho favorito ainda."}
            text={
              isCoffee
                ? "Toque no coração de um registro para guardá-lo aqui."
                : "Toque no coração de uma taça para guardá-la aqui."
            }
            action={
              <Btn variant="outline" onClick={() => nav.go("diary")}>
                Ir para o diário
              </Btn>
            }
          />
        ) : (
          <ol className="space-y-2">
            {favs.map((e, i) => {
              const c = e as CoffeeEntry;
              const w = e as WineEntry;
              const title = isCoffee ? c.coffee_name : w.wine_name;
              const sub = isCoffee
                ? [c.brew_method, c.dose_grams ? `${c.dose_grams} g` : null, c.flavor_notes.slice(0, 2).join(" · ")]
                    .filter(Boolean)
                    .join(" · ")
                : [
                    w.country,
                    w.grapes[0] && w.grapes[0] !== "Não sei" ? w.grapes[0] : null,
                    ratingLabel(w.personal_rating),
                  ]
                    .filter(Boolean)
                    .join(" · ");
              return (
                <Reveal key={e.id} delay={Math.min(i, 6) * 50}>
                  <li className="group flex items-center gap-4 rounded-xl px-2 py-3.5 transition-colors duration-200 hover:bg-[var(--accent-soft)] sm:px-4">
                    <span className="w-8 shrink-0 font-display text-xl italic text-faint transition-colors group-hover:text-[var(--accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <button onClick={() => nav.detail(e.id)} className="min-w-0 flex-1 text-left">
                      <span className="block truncate font-display text-[18.5px]">{title}</span>
                      <span className="mt-0.5 block truncate text-[12.5px] text-mute">
                        {sub}
                        {!isCoffee && w.flavor_notes.length > 0 && ` · ${w.flavor_notes.slice(0, 2).join(" · ")}`}
                      </span>
                      <span className="mt-0.5 block text-[11px] uppercase tracking-[0.14em] text-faint">
                        {relative(e.created_at)}
                        {isCoffee && c.overall_result ? ` · ${resultLabel(c.overall_result)}` : ""}
                      </span>
                    </button>
                    <HeartBtn
                      active
                      onToggle={() => (isCoffee ? toggleFavCoffee(e.id) : toggleFavWine(e.id))}
                    />
                  </li>
                </Reveal>
              );
            })}
          </ol>
        )}
      </div>

      {favs.length === 0 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => nav.newEntry()}
            className="link-quiet text-[13.5px] font-medium text-[var(--accent-ink)]"
          >
            <span className="inline-flex items-center gap-1.5">
              <IconPlus size={14} /> {isCoffee ? "Registrar um café" : "Registrar um vinho"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
