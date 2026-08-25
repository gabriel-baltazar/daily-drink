import { useState } from "react";
import { computeInsights, relative, useStore } from "../store";
import { Kicker, Ornament, Reveal, EmptyState, Btn } from "../ui";
import { IconCup, IconGlass, IconHeart, IconSpark, IconArrowRight, IconPlus } from "../icons";
import { QUOTES } from "../content";
import type { CoffeeEntry, WineEntry } from "../types";
import { ratingLabel, resultLabel } from "../types";

interface Nav {
  go: (v: "home" | "diary" | "discover" | "favorites" | "settings") => void;
  detail: (id: string) => void;
  newEntry: (prefill?: CoffeeEntry | WineEntry | null, editingId?: string | null) => void;
}

export default function Home({ nav }: { nav: Nav }) {
  const { user, mode, coffees, wines } = useStore();
  const isCoffee = mode === "coffee";
  const entries = isCoffee
    ? [...coffees].sort((a, b) => b.created_at.localeCompare(a.created_at))
    : [...wines].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const last = entries[0];
  const insights = computeInsights(mode, coffees, wines);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const firstName = user?.name?.split(" ")[0] ?? "";

  const [quote] = useState(() => {
    const list = QUOTES[mode];
    return list[Math.floor(Math.random() * list.length)];
  });

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const lastMeta =
    last && isCoffee
      ? `${(last as CoffeeEntry).brew_method}${
          (last as CoffeeEntry).dose_grams ? ` · ${(last as CoffeeEntry).dose_grams} g` : ""
        }${(last as CoffeeEntry).extraction_time_seconds ? ` · ${(last as CoffeeEntry).extraction_time_seconds} s` : ""}`
      : last
        ? [
            (last as WineEntry).country,
            (last as WineEntry).vintage ? String((last as WineEntry).vintage) : null,
          ]
            .filter(Boolean)
            .join(" · ")
        : "";

  const lastTag = last
    ? isCoffee
      ? resultLabel((last as CoffeeEntry).overall_result)
      : ratingLabel((last as WineEntry).personal_rating)
    : "";

  return (
    <div className="pb-8">
      {/* abertura do diário */}
      <header className="pt-10 sm:pt-16">
        <Kicker>{today}</Kicker>
        <h1 className="mt-4 font-display text-[2.75rem] leading-[1.05] sm:text-6xl">
          <span className="mask-line">
            <span style={{ animationDelay: "60ms" }}>
              {greeting}
              {firstName ? "," : "."}
            </span>
          </span>
          {firstName && (
            <span className="mask-line italic text-[var(--accent)]">
              <span style={{ animationDelay: "180ms" }}>{firstName}.</span>
            </span>
          )}
        </h1>
        <p className="mt-5 max-w-md text-[17px] leading-relaxed text-mute">
          {isCoffee ? "Qual café você vai preparar hoje?" : "Qual vinho vai abrir hoje?"}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Btn size="lg" onClick={() => nav.newEntry()}>
            <IconPlus size={17} />
            {isCoffee ? "Registrar café" : "Registrar vinho"}
          </Btn>
          <button
            onClick={() => nav.go("diary")}
            className="link-quiet text-[14px] font-medium text-mute hover:text-ink"
          >
            Abrir o diário
          </button>
        </div>

        <Reveal className="mt-10 max-w-lg">
          <blockquote className="relative border-l-2 border-[var(--accent-mid)] pl-5">
            <p className="font-display text-[19px] italic leading-relaxed text-ink/85">“{quote}”</p>
          </blockquote>
        </Reveal>
      </header>

      <Ornament className="my-12" />

      {/* último registro */}
      <section>
        <div className="flex items-baseline justify-between">
          <Kicker>{isCoffee ? "Seu último café" : "Sua última taça"}</Kicker>
          {entries.length > 0 && (
            <button
              onClick={() => nav.go("diary")}
              className="link-quiet flex items-center gap-1.5 text-[12.5px] font-medium text-mute hover:text-[var(--accent-ink)]"
            >
              ver todos <IconArrowRight size={13} />
            </button>
          )}
        </div>

        {last ? (
          <Reveal className="mt-5">
            <button
              onClick={() => nav.detail(last.id)}
              className="group flex w-full items-center gap-4 rounded-xl border border-line bg-panel p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-mid)] hover:shadow-[0_12px_32px_var(--accent-soft)] sm:p-5"
            >
              {last.photo_url ? (
                <img
                  src={last.photo_url}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-full border border-line object-cover"
                />
              ) : (
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-dashed border-linedark text-[var(--accent)]">
                  {isCoffee ? <IconCup size={26} /> : <IconGlass size={26} />}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="truncate font-display text-[19px]">
                    {isCoffee ? (last as CoffeeEntry).coffee_name : (last as WineEntry).wine_name}
                  </span>
                  {(last as CoffeeEntry | WineEntry).is_favorite && (
                    <span className="text-[var(--accent)]">
                      <IconHeart size={13} filled />
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-[13px] text-mute">
                  {lastMeta}
                  {lastTag ? ` · ${lastTag}` : ""}
                </span>
                <span className="mt-0.5 block truncate text-[12.5px] italic text-faint">
                  {last.flavor_notes.slice(0, 3).join(" · ") || last.personal_notes || "sem notas"}
                </span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-2">
                <span className="text-[11.5px] uppercase tracking-[0.14em] text-faint">
                  {relative(last.created_at)}
                </span>
                <span className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--accent-ink)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Ver registro <IconArrowRight size={13} />
                </span>
              </span>
            </button>
          </Reveal>
        ) : (
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
        )}
      </section>

      {/* insights */}
      {insights.length > 0 && (
        <section className="mt-12">
          <Kicker>Algumas coisas que você pode ter percebido</Kicker>
          <div className="mt-4 space-y-3">
            {insights.map((line, i) => (
              <Reveal key={line} delay={i * 90}>
                <p className="flex items-start gap-3 text-[15.5px] leading-relaxed text-ink/85">
                  <span className="mt-1 shrink-0 text-[var(--accent)]">
                    <IconSpark size={14} />
                  </span>
                  {line}
                </p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* rodapé silencioso */}
      <Reveal className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-[13px] text-faint">
          <span>
            {coffees.length} {coffees.length === 1 ? "café" : "cafés"} · {wines.length}{" "}
            {wines.length === 1 ? "vinho" : "vinhos"} no diário
          </span>
          <button
            onClick={() => nav.go("discover")}
            className="link-quiet font-medium text-mute hover:text-[var(--accent-ink)]"
          >
            {isCoffee ? "Ajustar minha extração →" : "Quanto tempo dura um vinho aberto? →"}
          </button>
        </div>
      </Reveal>
    </div>
  );
}
