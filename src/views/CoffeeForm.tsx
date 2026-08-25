import { useState } from "react";
import { nowIso, ratioOf, uid, useStore } from "../store";
import {
  Btn,
  Chip,
  Field,
  FlavorSelector,
  Kicker,
  PhotoUploader,
  Segmented,
  StepProgress,
  Stepper,
} from "../ui";
import { IconArrowLeft, IconArrowRight, IconHeart } from "../icons";
import {
  COFFEE_COUNTRIES,
  COFFEE_METHODS,
  COFFEE_NOTE_GROUPS,
  COFFEE_PROCESSES,
  COFFEE_RESULTS,
  GRIND_NOTES,
  SCALE_BODY,
  SCALE_LOW_HIGH,
  type BrewParameters,
  type CoffeeEntry,
  type WineEntry,
} from "../types";

interface Nav {
  go: (v: "home" | "diary" | "discover" | "favorites" | "settings") => void;
  detail: (id: string) => void;
  newEntry: (prefill?: CoffeeEntry | WineEntry | null, editingId?: string | null) => void;
}

const TITLES = [
  "Qual café?",
  "Como você preparou?",
  "Como ficou?",
  "O que você sentiu?",
  "Textura e sensação",
  "Para terminar",
];

const blank = (): CoffeeEntry => ({
  id: "",
  coffee_name: "",
  brew_method: "",
  flavor_notes: [],
  is_favorite: false,
  created_at: "",
  updated_at: "",
});

export default function CoffeeForm({
  nav,
  prefill,
  editingId,
}: {
  nav: Nav;
  prefill?: CoffeeEntry | null;
  editingId?: string | null;
}) {
  const { addCoffee, updateCoffee, toast } = useStore();
  const isEdit = !!editingId;
  const [f, setF] = useState<CoffeeEntry>(() => (prefill ? { ...prefill, id: "" } : blank()));
  const [step, setStep] = useState(0);
  const [tried, setTried] = useState(false);

  const set = (patch: Partial<CoffeeEntry>) => setF((p) => ({ ...p, ...patch }));
  const setBrew = (patch: Partial<BrewParameters>) =>
    setF((p) => ({ ...p, brew_parameters: { ...p.brew_parameters, ...patch } }));
  const toggleNote = (n: string) =>
    setF((p) => ({
      ...p,
      flavor_notes: p.flavor_notes.includes(n)
        ? p.flavor_notes.filter((x) => x !== n)
        : [...p.flavor_notes, n],
    }));

  const isEspresso = f.brew_method === "Espresso";
  const ratio = ratioOf(f.dose_grams, f.yield_grams);

  const save = () => {
    const entry: CoffeeEntry = {
      ...f,
      id: editingId ?? uid(),
      coffee_name: f.coffee_name.trim(),
      created_at: isEdit && f.created_at ? f.created_at : nowIso(),
      updated_at: nowIso(),
    };
    if (isEdit && editingId) {
      updateCoffee(editingId, entry);
      toast("Registro atualizado.");
    } else {
      addCoffee(entry);
      toast("Café salvo no diário.");
    }
    nav.detail(entry.id);
  };

  const next = () => {
    if (step === 0 && !f.coffee_name.trim()) return setTried(true);
    if (step === 1 && !f.brew_method) return setTried(true);
    setTried(false);
    if (step === TITLES.length - 1) return save();
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    if (step === 0) return nav.go("diary");
    setTried(false);
    setStep((s) => s - 1);
  };

  const last = step === TITLES.length - 1;

  return (
    <div className="pb-10">
      <header className="pt-8">
        <div className="flex items-center justify-between">
          <button
            onClick={back}
            className="inline-flex items-center gap-2 text-[13.5px] font-medium text-mute transition hover:text-ink"
          >
            <IconArrowLeft size={16} /> {step === 0 ? "Cancelar" : "Voltar"}
          </button>
          <Kicker>
            Passo {step + 1} de {TITLES.length}
          </Kicker>
        </div>
        <h1 className="mt-5 font-display text-4xl sm:text-5xl">
          {isEdit ? "Editar café" : "Novo café"}
        </h1>
        <p className="mt-2 font-display text-lg italic text-[var(--accent)]">{TITLES[step]}</p>
        <div className="mt-5">
          <StepProgress step={step} total={TITLES.length} />
        </div>
      </header>

      <div key={step} className="anim-view mt-8 space-y-6">
        {step === 0 && (
          <>
            <Field label="Nome do café">
              <input
                className="field"
                placeholder="Ex.: Colômbia Huila"
                value={f.coffee_name}
                autoFocus
                onChange={(e) => set({ coffee_name: e.target.value })}
              />
              {tried && !f.coffee_name.trim() && (
                <span className="mt-1.5 block text-xs text-[#8c3232]">
                  Dê um nome para este café — pode ser simples.
                </span>
              )}
            </Field>
            <Field label="Marca ou torrefação" optional>
              <input
                className="field"
                placeholder="Ex.: Seven Seeds"
                value={f.roaster ?? ""}
                onChange={(e) => set({ roaster: e.target.value || undefined })}
              />
            </Field>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Origem" optional>
                <input
                  className="field"
                  list="coffee-countries"
                  placeholder="Ex.: Colômbia"
                  value={f.country ?? ""}
                  onChange={(e) => set({ country: e.target.value || undefined })}
                />
                <datalist id="coffee-countries">
                  {COFFEE_COUNTRIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
              <Field label="Região" optional>
                <input
                  className="field"
                  placeholder="Ex.: Huila, Cerrado Mineiro…"
                  value={f.region ?? ""}
                  onChange={(e) => set({ region: e.target.value || undefined })}
                />
              </Field>
            </div>
            <Field label="Processo" optional hint="Se não souber, sem problema — pule.">
              <div className="flex flex-wrap gap-2">
                {COFFEE_PROCESSES.map((p) => (
                  <Chip
                    key={p}
                    selected={f.process === p}
                    onClick={() => set({ process: f.process === p ? undefined : p })}
                  >
                    {p}
                  </Chip>
                ))}
              </div>
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <Kicker className="mb-3">Método de preparo</Kicker>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {COFFEE_METHODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      set({ brew_method: m });
                      setTried(false);
                    }}
                    className={`rounded-xl border px-3 py-3.5 text-[14px] font-medium transition-all duration-200 active:scale-95 ${
                      f.brew_method === m
                        ? "border-transparent bg-[var(--accent)] text-[#f8f7f4] shadow-[0_4px_14px_var(--accent-glow)]"
                        : "border-line bg-panel text-ink/80 hover:border-[var(--accent-mid)]"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              {tried && !f.brew_method && (
                <p className="mt-2 text-xs text-[#8c3232]">Escolha como você preparou.</p>
              )}
            </div>

            {f.brew_method && isEspresso && (
              <div className="anim-view space-y-6 rounded-xl border border-line bg-panel p-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <Field label="Dose">
                    <Stepper
                      value={f.dose_grams ?? 18}
                      onChange={(v) => set({ dose_grams: v })}
                      unit="g"
                      step={0.5}
                    />
                  </Field>
                  <Field label="Shot">
                    <div className="flex gap-1 rounded-full border border-line bg-paper p-1">
                      {(["single", "double"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => set({ shot_type: s })}
                          className={`rounded-full px-4 py-1.5 text-[13px] font-medium capitalize transition-all duration-200 ${
                            (f.shot_type ?? "double") === s
                              ? "bg-[var(--accent)] text-[#f8f7f4]"
                              : "text-mute hover:text-ink"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field
                    label="Regulagem / moagem"
                    optional
                    hint="Cada máquina tem a própria escala — anote como fizer sentido."
                  >
                    <input
                      className="field"
                      placeholder="Ex.: 12"
                      value={f.grinder_setting ?? ""}
                      onChange={(e) => set({ grinder_setting: e.target.value || undefined })}
                    />
                  </Field>
                  <Field label="Tempo de extração" optional>
                    <div className="relative">
                      <input
                        className="field pr-10"
                        type="number"
                        inputMode="numeric"
                        placeholder="Ex.: 28"
                        value={f.extraction_time_seconds ?? ""}
                        onChange={(e) =>
                          set({
                            extraction_time_seconds: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-faint">
                        s
                      </span>
                    </div>
                  </Field>
                </div>
                <Field label="Como estava a moagem?" optional>
                  <div className="flex flex-wrap gap-2">
                    {GRIND_NOTES.map((g) => (
                      <Chip
                        key={g}
                        selected={f.grind_note === g}
                        onClick={() => set({ grind_note: f.grind_note === g ? undefined : g })}
                      >
                        {g}
                      </Chip>
                    ))}
                  </div>
                </Field>
                <div className="flex flex-wrap items-end gap-6">
                  <Field label="Quantidade na xícara" optional>
                    <div className="relative">
                      <input
                        className="field pr-10"
                        type="number"
                        inputMode="decimal"
                        placeholder="Ex.: 36"
                        value={f.yield_grams ?? ""}
                        onChange={(e) =>
                          set({ yield_grams: e.target.value ? Number(e.target.value) : undefined })
                        }
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-faint">
                        g
                      </span>
                    </div>
                  </Field>
                  {ratio && f.dose_grams && f.yield_grams && (
                    <p className="anim-fade pb-1.5 font-display text-[17px] italic text-[var(--accent)]">
                      {f.dose_grams} g → {f.yield_grams} g · ratio {ratio}
                    </p>
                  )}
                </div>
              </div>
            )}

            {f.brew_method && !isEspresso && (
              <div className="anim-view grid gap-6 rounded-xl border border-line bg-panel p-5 sm:grid-cols-3">
                <Field label="Água" optional>
                  <div className="relative">
                    <input
                      className="field pr-10"
                      type="number"
                      inputMode="decimal"
                      placeholder="Ex.: 240"
                      value={f.brew_parameters?.water_grams ?? ""}
                      onChange={(e) =>
                        setBrew({ water_grams: e.target.value ? Number(e.target.value) : undefined })
                      }
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-faint">g</span>
                  </div>
                </Field>
                <Field label="Temperatura" optional>
                  <div className="relative">
                    <input
                      className="field pr-10"
                      type="number"
                      inputMode="decimal"
                      placeholder="Ex.: 93"
                      value={f.brew_parameters?.temperature ?? ""}
                      onChange={(e) =>
                        setBrew({ temperature: e.target.value ? Number(e.target.value) : undefined })
                      }
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-faint">°C</span>
                  </div>
                </Field>
                <Field label="Tempo total" optional>
                  <div className="relative">
                    <input
                      className="field pr-10"
                      type="number"
                      inputMode="numeric"
                      placeholder="Ex.: 150"
                      value={f.brew_parameters?.brew_time ?? ""}
                      onChange={(e) =>
                        setBrew({ brew_time: e.target.value ? Number(e.target.value) : undefined })
                      }
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-faint">s</span>
                  </div>
                </Field>
                {f.dose_grams === undefined && (
                  <Field label="Dose de café" optional>
                    <div className="relative">
                      <input
                        className="field pr-10"
                        type="number"
                        inputMode="decimal"
                      placeholder="Ex.: 15"
                      value={f.dose_grams ?? ""}                        onChange={(e) =>
                          set({ dose_grams: e.target.value ? Number(e.target.value) : undefined })
                        }
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-faint">g</span>
                    </div>
                  </Field>
                )}
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-[15px] text-mute">Sem julgamento — é só para o diário entender a xícara.</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {COFFEE_RESULTS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => set({ overall_result: f.overall_result === r.value ? undefined : r.value })}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 active:scale-[0.98] ${
                    f.overall_result === r.value
                      ? "border-transparent bg-[var(--accent)] text-[#f8f7f4] shadow-[0_4px_14px_var(--accent-glow)]"
                      : "border-line bg-panel hover:border-[var(--accent-mid)]"
                  }`}
                >
                  <span className="text-xl" aria-hidden>
                    {r.emoji}
                  </span>
                  <span className="text-[14.5px] font-medium">{r.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <FlavorSelector groups={COFFEE_NOTE_GROUPS} selected={f.flavor_notes} onToggle={toggleNote} />
        )}

        {step === 4 && (
          <>
            <div className="space-y-6">
              <Field label="Corpo" optional>
                <Segmented
                  options={SCALE_BODY}
                  value={f.body}
                  onChange={(v) => set({ body: f.body === v ? undefined : v })}
                  ariaLabel="Corpo"
                />
              </Field>
              <Field label="Doçura" optional>
                <Segmented
                  options={SCALE_LOW_HIGH}
                  value={f.sweetness}
                  onChange={(v) => set({ sweetness: f.sweetness === v ? undefined : v })}
                  ariaLabel="Doçura"
                />
              </Field>
              <Field label="Acidez" optional>
                <Segmented
                  options={SCALE_LOW_HIGH}
                  value={f.acidity}
                  onChange={(v) => set({ acidity: f.acidity === v ? undefined : v })}
                  ariaLabel="Acidez"
                />
              </Field>
            </div>
            <p className="rounded-xl bg-[var(--accent-soft)] px-4 py-3.5 text-[13.5px] italic leading-relaxed text-[var(--accent-ink)]">
              Não existe resposta certa. Registre como você sentiu.
            </p>
          </>
        )}

        {step === 5 && (
          <>
            <Field
              label="Minhas anotações"
              optional
              hint="Ex.: “Ficou mais doce do que da última vez. Acho que a moagem mais fina ajudou.”"
            >
              <textarea
                className="field min-h-[120px] resize-y leading-relaxed"
                placeholder="Escreva como se contasse para um amigo…"
                value={f.personal_notes ?? ""}
                onChange={(e) => set({ personal_notes: e.target.value || undefined })}
              />
            </Field>
            <Field label="Foto" optional>
              <PhotoUploader
                photo={f.photo_url}
                onPhoto={(url) => set({ photo_url: url })}
                label="Adicionar foto do café"
              />
            </Field>
            <button
              type="button"
              onClick={() => set({ is_favorite: !f.is_favorite })}
              className={`flex items-center gap-2.5 rounded-full border px-4 py-2 text-[13.5px] font-medium transition-all duration-200 active:scale-95 ${
                f.is_favorite
                  ? "border-transparent bg-[var(--accent)] text-[#f8f7f4]"
                  : "border-line bg-panel text-mute hover:text-[var(--accent-ink)]"
              }`}
            >
              <IconHeart size={16} filled={f.is_favorite} />
              {f.is_favorite ? "Marcado como favorito" : "Adicionar aos favoritos"}
            </button>
          </>
        )}
      </div>

      <footer className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
        <Btn variant="ghost" onClick={back}>
          <IconArrowLeft size={15} /> Voltar
        </Btn>
        <Btn size="lg" onClick={next}>
          {last ? "Salvar café" : "Continuar"} {!last && <IconArrowRight size={16} />}
        </Btn>
      </footer>
    </div>
  );
}
