import { useState } from "react";
import { useStore } from "../store";
import { Chip, Kicker, Modal, Ornament, Reveal } from "../ui";
import { IconArrowRight, IconSpark } from "../icons";
import {
  EXTRACTION_TROUBLE,
  GRAPE_DISCLAIMER,
  GRAPE_GUIDES,
  GUIDES_COFFEE,
  GUIDES_WINE,
  KEEP_GUIDES,
  type Guide,
} from "../content";

function GuideCard({ guide, onOpen, delay }: { guide: Guide; onOpen: () => void; delay: number }) {
  return (
    <Reveal delay={delay}>
      <button
        onClick={onOpen}
        className="group flex w-full items-center justify-between gap-4 rounded-xl border border-line bg-panel px-5 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-mid)] hover:shadow-[0_12px_32px_var(--accent-soft)]"
      >
        <span>
          <span className="mb-1 block text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            {guide.tag}
          </span>
          <span className="font-display text-[17px] leading-snug">{guide.title}</span>
        </span>
        <span className="shrink-0 text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--accent)]">
          <IconArrowRight size={17} />
        </span>
      </button>
    </Reveal>
  );
}

export default function Discover() {
  const { mode } = useStore();
  const isCoffee = mode === "coffee";
  const [guide, setGuide] = useState<Guide | null>(null);
  const [trouble, setTrouble] = useState<string | null>(null);
  const [keep, setKeep] = useState<string | null>(null);

  const guides = isCoffee ? GUIDES_COFFEE : GUIDES_WINE;
  const selectedTrouble = EXTRACTION_TROUBLE.find((t) => t.id === trouble);
  const selectedKeep = KEEP_GUIDES.find((k) => k.type === keep);

  return (
    <div className="pb-8">
      <header className="pt-10 sm:pt-14">
        <Kicker>Descobrir</Kicker>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">
          {isCoffee ? "Aprenda sobre café" : "Aprenda sobre vinho"}
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-mute">
          {isCoffee
            ? "Textos curtos e diretos para entender sua xícara — sem manual científico."
            : "Você não precisa saber tudo sobre vinho para começar a perceber mais."}
        </p>
      </header>

      {/* ajustador de extração / conservação */}
      <Reveal className="mt-10">
        <section className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="mt-1 text-[var(--accent)]">
              <IconSpark size={16} />
            </span>
            <div>
              <h2 className="font-display text-2xl">
                {isCoffee ? "Meu café não ficou como eu queria" : "Abriu a garrafa?"}
              </h2>
              <p className="mt-1 text-[14px] text-mute">
                {isCoffee
                  ? "Conte como ficou a xícara e receba sugestões simples de ajuste."
                  : "Veja como conservar cada tipo de vinho depois de aberto."}
              </p>
            </div>
          </div>

          {isCoffee ? (
            <div className="mt-6">
              <Kicker className="mb-3">Como seu café ficou?</Kicker>
              <div className="flex flex-wrap gap-2">
                {EXTRACTION_TROUBLE.map((t) => (
                  <Chip key={t.id} selected={trouble === t.id} onClick={() => setTrouble(t.id)}>
                    {t.label}
                  </Chip>
                ))}
              </div>

              {selectedTrouble && (
                <div key={selectedTrouble.id} className="anim-view mt-7 border-t border-line pt-6">
                  <p className="font-display text-[22px] italic">{selectedTrouble.title}</p>
                  <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-mute">
                    {selectedTrouble.body}
                  </p>
                  <ol className="mt-6 space-y-4">
                    {selectedTrouble.steps.map((s, i) => (
                      <li key={s.title} className="flex gap-4">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--accent-mid)] font-display text-[14px] italic text-[var(--accent)]">
                          {i + 1}
                        </span>
                        <span>
                          <span className="block text-[14.5px] font-semibold">
                            {i === 0 ? "Tente primeiro: " : i === 1 ? "Depois: " : "Se necessário: "}
                            {s.title.toLowerCase()}
                          </span>
                          <span className="mt-0.5 block max-w-xl text-[13.5px] leading-relaxed text-mute">
                            {s.detail}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-6 rounded-xl bg-[var(--accent-soft)] px-4 py-3 text-[13.5px] italic leading-relaxed text-[var(--accent-ink)]">
                    Dica: {selectedTrouble.tip}
                  </p>
                  <button
                    onClick={() => setTrouble(null)}
                    className="link-quiet mt-5 text-[13px] font-medium text-mute hover:text-ink"
                  >
                    Descrever outro resultado
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6">
              <Kicker className="mb-3">Que tipo de vinho é?</Kicker>
              <div className="flex flex-wrap gap-2">
                {KEEP_GUIDES.map((k) => (
                  <Chip key={k.type} selected={keep === k.type} onClick={() => setKeep(k.type)}>
                    {k.type}
                  </Chip>
                ))}
              </div>

              {selectedKeep && (
                <div key={selectedKeep.type} className="anim-view mt-7 border-t border-line pt-6">
                  <p className="font-display text-[22px] italic">{selectedKeep.title}</p>
                  <div className="mt-2 max-w-xl space-y-2.5">
                    {selectedKeep.body.map((p) => (
                      <p key={p.slice(0, 24)} className="text-[14.5px] leading-relaxed text-mute">
                        {p}
                      </p>
                    ))}
                  </div>
                  <p className="mt-5 rounded-xl bg-[var(--accent-soft)] px-4 py-3 text-[13.5px] italic leading-relaxed text-[var(--accent-ink)]">
                    {selectedKeep.window} Observe aroma e sabor — pode variar de garrafa para garrafa.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </Reveal>

      {/* biblioteca de guias */}
      <section className="mt-14">
        <Kicker>Leituras curtas</Kicker>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {guides.map((g, i) => (
            <GuideCard key={g.id} guide={g} onOpen={() => setGuide(g)} delay={(i % 4) * 60} />
          ))}
        </div>
      </section>

      {/* uvas */}
      {!isCoffee && (
        <section className="mt-14">
          <Kicker>Conheça as uvas</Kicker>
          <p className="mt-2 max-w-lg text-[14px] text-mute">
            Um retrato simples de cada uva — só para orientar a curiosidade.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {GRAPE_GUIDES.map((g, i) => (
              <Reveal key={g.name} delay={(i % 4) * 60}>
                <div className="h-full rounded-xl border border-line bg-panel p-5 transition-all duration-300 hover:border-[var(--accent-mid)]">
                  <h3 className="font-display text-[19px]">{g.name}</h3>
                  <p className="mt-1 text-[13px] italic leading-relaxed text-mute">{g.line}</p>
                  <p className="mt-3.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-faint">
                    Normalmente apresenta
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {g.notes.map((n) => (
                      <span
                        key={n}
                        className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[12px] text-[var(--accent-ink)]"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-faint">
                    Onde é comum encontrar
                  </p>
                  <p className="mt-1.5 text-[13px] text-ink/75">{g.places.join(" · ")}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-5 max-w-xl text-[12.5px] italic leading-relaxed text-faint">
            {GRAPE_DISCLAIMER}
          </p>
        </section>
      )}

      <Ornament className="mt-14" />

      {/* leitor de guias */}
      <Modal open={!!guide} onClose={() => setGuide(null)}>
        {guide && (
          <div className="p-7 sm:p-9">
            <Kicker>{guide.tag}</Kicker>
            <h2 className="mt-2 pr-8 font-display text-3xl leading-tight">{guide.title}</h2>
            <div className="mt-5 space-y-4">
              {guide.body.map((p) => (
                <p key={p.slice(0, 28)} className="text-[15px] leading-[1.75] text-ink/85">
                  {p}
                </p>
              ))}
            </div>
            <Ornament className="mt-8" />
            <p className="mt-4 text-center text-[12px] italic text-faint">
              Nada aqui é regra absoluta — seu paladar é quem decide.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
