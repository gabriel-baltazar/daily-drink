import { useState } from "react";
import { fmtLong, ratioOf, relative, useStore } from "../store";
import { Btn, HeartBtn, Kicker, StatRow, Reveal } from "../ui";
import {
  IconArrowLeft,
  IconCopy,
  IconHeart,
  IconPencil,
  IconTrash,
} from "../icons";
import {
  WINE_RATINGS,
  ratingLabel,
  resultLabel,
  type CoffeeEntry,
  type WineEntry,
} from "../types";

interface Nav {
  go: (v: "home" | "diary" | "discover" | "favorites" | "settings") => void;
  detail: (id: string) => void;
  newEntry: (prefill?: CoffeeEntry | WineEntry | null, editingId?: string | null) => void;
}

function Hearts({ n, size = 15 }: { n: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[var(--accent)]">
      {[0, 1, 2].map((i) => (
        <IconHeart key={i} size={size} filled={i < n} />
      ))}
    </span>
  );
}

export default function Detail({ nav, id }: { nav: Nav; id: string }) {
  const store = useStore();
  const [confirming, setConfirming] = useState(false);

  const coffee = store.coffees.find((c) => c.id === id);
  const wine = store.wines.find((w) => w.id === id);
  const entry = coffee ?? wine;
  if (!entry) {
    return (
      <div className="py-24 text-center">
        <p className="font-display text-xl">Registro não encontrado.</p>
        <Btn variant="outline" className="mt-6" onClick={() => nav.go("diary")}>
          Voltar ao diário
        </Btn>
      </div>
    );
  }

  const isCoffee = !!coffee;
  const c = entry as CoffeeEntry;
  const w = entry as WineEntry;
  const rating = WINE_RATINGS.find((r) => r.value === w.personal_rating);

  const onEdit = () => nav.newEntry(entry, entry.id);

  const onDuplicate = () => {
    const copy = { ...entry, personal_notes: "", is_favorite: false } as CoffeeEntry | WineEntry;
    nav.newEntry(copy, null);
    store.toast(isCoffee ? "Preparo carregado — ajuste o que mudou." : "Taça carregada — registre a nova prova.");
  };

  const onDelete = () => {
    if (isCoffee) store.deleteCoffee(entry.id);
    else store.deleteWine(entry.id);
    store.toast("Registro removido do diário.");
    nav.go("diary");
  };

  const toggleFav = () => {
    if (isCoffee) store.toggleFavCoffee(entry.id);
    else store.toggleFavWine(entry.id);
    store.toast(entry.is_favorite ? "Removido dos favoritos." : "Guardado nos favoritos.");
  };

  const stats: [string, string | undefined][] = isCoffee
    ? [
        ["Método", c.brew_method],
        ["Dose", c.dose_grams ? `${c.dose_grams} g` : undefined],
        ["Na xícara", c.yield_grams ? `${c.yield_grams} g` : undefined],
        ["Proporção", ratioOf(c.dose_grams, c.yield_grams) ?? undefined],
        ["Shot", c.shot_type ? (c.shot_type === "single" ? "Single" : "Double") : undefined],
        ["Tempo", c.extraction_time_seconds ? `${c.extraction_time_seconds} s` : undefined],
        ["Moagem", c.grinder_setting || undefined],
        ["Regulagem", c.grind_note || undefined],
        ["Água", c.brew_parameters?.water_grams ? `${c.brew_parameters.water_grams} g` : undefined],
        ["Temperatura", c.brew_parameters?.temperature ? `${c.brew_parameters.temperature} °C` : undefined],
        ["Processo", c.process && c.process !== "Não sei" ? c.process : undefined],
        ["Torrefação", c.roaster || undefined],
      ]
    : [
        ["Safra", w.vintage ? String(w.vintage) : undefined],
        ["Uva", w.grapes.length && w.grapes[0] !== "Não sei" ? w.grapes.join(", ") : undefined],
        ["Onde", w.location || undefined],
        ["Com quem", w.company || undefined],
        ["Comendo", w.food_pairing || undefined],
        ["Ocasião", w.occasion || undefined],
      ];

  const senses: [string, string | undefined][] = isCoffee
    ? [
        ["Corpo", c.body],
        ["Doçura", c.sweetness],
        ["Acidez", c.acidity],
      ]
    : [
        ["Corpo", w.body],
        ["Acidez", w.acidity],
        ["Taninos", w.tannins],
        ["Doçura", w.sweetness],
        ["Final", w.finish],
      ];

  return (
    <article className="pb-10">
      <div className="flex items-center justify-between pt-8">
        <button
          onClick={() => nav.go("diary")}
          className="inline-flex items-center gap-2 text-[13.5px] font-medium text-mute transition hover:text-ink"
        >
          <IconArrowLeft size={16} /> Voltar ao diário
        </button>
        <HeartBtn active={entry.is_favorite} onToggle={toggleFav} />
      </div>

      <Reveal className="mt-6">
        {entry.photo_url && (
          <img
            src={entry.photo_url}
            alt={isCoffee ? c.coffee_name : w.wine_name}
            className="mb-8 aspect-[4/3] w-full max-w-md rounded-xl border border-line object-cover shadow-[0_16px_40px_rgba(28,28,26,0.08)]"
          />
        )}

        <Kicker>
          {isCoffee
            ? [c.brew_method, c.shot_type ? (c.shot_type === "single" ? "Single shot" : "Double shot") : null]
                .filter(Boolean)
                .join(" · ")
            : [w.wine_type, w.country, w.region].filter(Boolean).join(" · ")}
        </Kicker>

        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
          {isCoffee ? c.coffee_name : w.wine_name}
        </h1>

        <p className="mt-3 text-[15px] text-mute">
          {isCoffee
            ? [c.roaster, [c.country, c.region].filter(Boolean).join(" — ") || null]
                .filter(Boolean)
                .join(" · ")
            : [w.producer, w.region, w.country].filter(Boolean).join(" · ")}
        </p>
      </Reveal>

      {(isCoffee ? c.overall_result : w.personal_rating) && (
        <Reveal className="mt-8">
          <div className="rounded-xl border border-line bg-panel px-6 py-5">
            <Kicker>{isCoffee ? "Resultado" : "Quanto gostei"}</Kicker>
            <div className="mt-2 flex items-center gap-3">
              {isCoffee ? (
                <span className="font-display text-2xl italic">
                  {resultLabel(c.overall_result)}
                </span>
              ) : (
                <>
                  <Hearts n={rating?.hearts ?? 0} size={18} />
                  <span className="font-display text-2xl italic">{ratingLabel(w.personal_rating)}</span>
                </>
              )}
            </div>
            {isCoffee && c.dose_grams && c.yield_grams && (
              <p className="mt-2 font-display text-[15px] text-mute">
                {c.dose_grams} g → {c.yield_grams} g
                {c.extraction_time_seconds ? ` · ${c.extraction_time_seconds} segundos` : ""}
                {ratioOf(c.dose_grams, c.yield_grams) ? ` · ratio ${ratioOf(c.dose_grams, c.yield_grams)}` : ""}
              </p>
            )}
          </div>
        </Reveal>
      )}

      {entry.flavor_notes.length > 0 && (
        <Reveal className="mt-8">
          <Kicker>{isCoffee ? "Notas percebidas" : "O que percebi"}</Kicker>
          <div className="mt-3 flex flex-wrap gap-2">
            {entry.flavor_notes.map((n) => (
              <span
                key={n}
                className="rounded-full border border-line bg-panel px-3.5 py-1.5 text-[13.5px] text-ink/80"
              >
                {n}
              </span>
            ))}
          </div>
        </Reveal>
      )}

      {(stats.some(([, v]) => v) || senses.some(([, v]) => v)) && (
        <Reveal className="mt-8 grid gap-x-10 sm:grid-cols-2">
          <div>
            <Kicker className="mb-2">{isCoffee ? "O preparo" : "A garrafa"}</Kicker>
            {stats.map(([k, v]) => (
              <StatRow key={k} label={k} value={v} />
            ))}
          </div>
          {senses.some(([, v]) => v) && (
            <div>
              <Kicker className="mb-2">Na boca</Kicker>
              {senses.map(([k, v]) => (
                <StatRow key={k} label={k} value={v} />
              ))}
            </div>
          )}
        </Reveal>
      )}

      {entry.personal_notes && (
        <Reveal className="mt-10">
          <blockquote className="relative pl-6">
            <span className="absolute -left-1 -top-5 font-display text-6xl italic text-[var(--accent-mid)]">
              “
            </span>
            <p className="font-display text-[21px] italic leading-relaxed text-ink/90">
              {entry.personal_notes}
            </p>
          </blockquote>
        </Reveal>
      )}

      <Reveal className="mt-10">
        <p className="text-[11.5px] uppercase tracking-[0.18em] text-faint">
          {fmtLong(entry.created_at)} · {relative(entry.created_at)}
          {entry.updated_at !== entry.created_at && (
            <span> · editado em {fmtLong(entry.updated_at)}</span>
          )}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <Btn variant="outline" onClick={onEdit}>
            <IconPencil size={15} /> Editar
          </Btn>
          <Btn variant="outline" onClick={onDuplicate}>
            <IconCopy size={15} /> {isCoffee ? "Duplicar preparo" : "Provar de novo"}
          </Btn>
          {!confirming ? (
            <Btn variant="danger" className="ml-auto" onClick={() => setConfirming(true)}>
              <IconTrash size={15} /> Excluir
            </Btn>
          ) : (
            <span className="anim-fade ml-auto inline-flex items-center gap-2">
              <span className="text-[13px] text-mute">Remover para sempre?</span>
              <Btn variant="danger" size="sm" onClick={onDelete}>
                Sim, excluir
              </Btn>
              <Btn variant="ghost" size="sm" onClick={() => setConfirming(false)}>
                Cancelar
              </Btn>
            </span>
          )}
        </div>
      </Reveal>
    </article>
  );
}
