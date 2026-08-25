import { useState } from "react";
import { nowIso, uid, useStore } from "../store";
import {
  Btn,
  Chip,
  Field,
  FlavorSelector,
  InfoTip,
  Kicker,
  PhotoUploader,
  Segmented,
  StepProgress,
} from "../ui";
import { IconArrowLeft, IconArrowRight, IconHeart } from "../icons";
import {
  GRAPE_LIST,
  SCALE_BODY,
  SCALE_FINISH,
  SCALE_LOW_HIGH,
  SCALE_SWEET_WINE,
  SCALE_TANNINS,
  WINE_COUNTRIES,
  WINE_LOCATIONS,
  WINE_NOTE_GROUPS,
  WINE_RATINGS,
  WINE_TYPES,
  type CoffeeEntry,
  type WineEntry,
} from "../types";

interface Nav {
  go: (v: "home" | "diary" | "discover" | "favorites" | "settings") => void;
  detail: (id: string) => void;
  newEntry: (prefill?: CoffeeEntry | WineEntry | null, editingId?: string | null) => void;
}

const TITLES = [
  "Qual vinho?",
  "O que você sentiu?",
  "As sensações",
  "Quanto você gostou?",
  "Contexto & impressões",
];

const blank = (): WineEntry => ({
  id: "",
  wine_name: "",
  grapes: [],
  flavor_notes: [],
  aroma_notes: [],
  is_favorite: false,
  created_at: "",
  updated_at: "",
});

export default function WineForm({
  nav,
  prefill,
  editingId,
}: {
  nav: Nav;
  prefill?: WineEntry | null;
  editingId?: string | null;
}) {
  const { addWine, updateWine, toast } = useStore();
  const isEdit = !!editingId;
  const [f, setF] = useState<WineEntry>(() => (prefill ? { ...prefill, id: "" } : blank()));
  const [step, setStep] = useState(0);
  const [tried, setTried] = useState(false);

  const set = (patch: Partial<WineEntry>) => setF((p) => ({ ...p, ...patch }));
  const toggleNote = (n: string) =>
    setF((p) => ({
      ...p,
      flavor_notes: p.flavor_notes.includes(n)
        ? p.flavor_notes.filter((x) => x !== n)
        : [...p.flavor_notes, n],
      aroma_notes: p.flavor_notes.includes(n)
        ? p.aroma_notes.filter((x) => x !== n)
        : p.aroma_notes,
    }));

  const toggleGrape = (g: string) => {
    if (g === "Não sei") {
      set({ grapes: f.grapes.includes("Não sei") ? [] : ["Não sei"] });
      return;
    }
    const without = f.grapes.filter((x) => x !== "Não sei");
    set({
      grapes: without.includes(g) ? without.filter((x) => x !== g) : [...without, g],
    });
  };

  const save = () => {
    const entry: WineEntry = {
      ...f,
      id: editingId ?? uid(),
      wine_name: f.wine_name.trim(),
      created_at: isEdit && f.created_at ? f.created_at : nowIso(),
      updated_at: nowIso(),
    };
    if (isEdit && editingId) {
      updateWine(editingId, entry);
      toast("Registro atualizado.");
    } else {
      addWine(entry);
      toast("Vinho salvo no diário.");
    }
    nav.detail(entry.id);
  };

  const next = () => {
    if (step === 0 && !f.wine_name.trim()) return setTried(true);
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
          {isEdit ? "Editar vinho" : "Novo vinho"}
        </h1>
        <p className="mt-2 font-display text-lg italic text-[var(--accent)]">{TITLES[step]}</p>
        <div className="mt-5">
          <StepProgress step={step} total={TITLES.length} />
        </div>
      </header>

      <div key={step} className="anim-view mt-8 space-y-6">
        {step === 0 && (
          <>
            <Field label="Nome do vinho">
              <input
                className="field"
                placeholder="Ex.: Catena Malbec"
                value={f.wine_name}
                autoFocus
                onChange={(e) => set({ wine_name: e.target.value })}
              />
              {tried && !f.wine_name.trim() && (
                <span className="mt-1.5 block text-xs text-[#8c3232]">
                  Dê um nome para este vinho — o do rótulo serve.
                </span>
              )}
            </Field>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Produtor" optional>
                <input
                  className="field"
                  placeholder="Ex.: Bodega Catena Zapata"
                  value={f.producer ?? ""}
                  onChange={(e) => set({ producer: e.target.value || undefined })}
                />
              </Field>
              <Field label="Safra" optional>
                <input
                  className="field"
                  type="number"
                  inputMode="numeric"
                  placeholder="Ex.: 2022"
                  value={f.vintage ?? ""}
                  onChange={(e) => set({ vintage: e.target.value ? Number(e.target.value) : undefined })}
                />
              </Field>
              <Field label="País" optional>
                <input
                  className="field"
                  list="wine-countries"
                  placeholder="Ex.: Argentina"
                  value={f.country ?? ""}
                  onChange={(e) => set({ country: e.target.value || undefined })}
                />
                <datalist id="wine-countries">
                  {WINE_COUNTRIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
              <Field label="Região" optional>
                <input
                  className="field"
                  placeholder="Ex.: Mendoza, Douro…"
                  value={f.region ?? ""}
                  onChange={(e) => set({ region: e.target.value || undefined })}
                />
              </Field>
            </div>
            <Field label="Tipo" optional>
              <div className="flex flex-wrap gap-2">
                {WINE_TYPES.map((t) => (
                  <Chip
                    key={t}
                    selected={f.wine_type === t}
                    onClick={() => set({ wine_type: f.wine_type === t ? undefined : t })}
                  >
                    {t}
                  </Chip>
                ))}
              </div>
            </Field>
            <Field label="Uva" optional hint="Pode marcar mais de uma — ou nenhuma, se não souber.">
              <div className="flex flex-wrap gap-2">
                {GRAPE_LIST.map((g) => (
                  <Chip key={g} selected={f.grapes.includes(g)} onClick={() => toggleGrape(g)}>
                    {g}
                  </Chip>
                ))}
                <Chip selected={f.grapes.includes("Não sei")} onClick={() => toggleGrape("Não sei")}>
                  Não sei
                </Chip>
              </div>
            </Field>
          </>
        )}

        {step === 1 && (
          <FlavorSelector
            groups={WINE_NOTE_GROUPS}
            selected={f.flavor_notes}
            onToggle={toggleNote}
            customLabel="Adicionar outra nota"
          />
        )}

        {step === 2 && (
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
              <Field label="Acidez" optional>
                <Segmented
                  options={SCALE_LOW_HIGH}
                  value={f.acidity}
                  onChange={(v) => set({ acidity: f.acidity === v ? undefined : v })}
                  ariaLabel="Acidez"
                />
              </Field>
              <div>
                <span className="mb-1.5 flex items-center gap-2 text-[13px] font-semibold text-ink/80">
                  Taninos <span className="text-[11px] font-normal italic text-faint">opcional</span>
                  <InfoTip text="Taninos são aquela sensação de secura ou aspereza que você pode sentir na boca — parecida com chá preto forte." />
                </span>
                <Segmented
                  options={SCALE_TANNINS}
                  value={f.tannins}
                  onChange={(v) => set({ tannins: f.tannins === v ? undefined : v })}
                  ariaLabel="Taninos"
                />
              </div>
              <Field label="Doçura" optional>
                <Segmented
                  options={SCALE_SWEET_WINE}
                  value={f.sweetness}
                  onChange={(v) => set({ sweetness: f.sweetness === v ? undefined : v })}
                  ariaLabel="Doçura"
                />
              </Field>
              <Field label="Final" optional hint="Quanto tempo o sabor fica depois de engolir.">
                <Segmented
                  options={SCALE_FINISH}
                  value={f.finish}
                  onChange={(v) => set({ finish: f.finish === v ? undefined : v })}
                  ariaLabel="Final"
                />
              </Field>
            </div>
            <p className="rounded-xl bg-[var(--accent-soft)] px-4 py-3.5 text-[13.5px] italic leading-relaxed text-[var(--accent-ink)]">
              Não existe resposta certa. Registre como você sentiu.
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <Kicker className="mb-1">Quanto você gostou?</Kicker>
            <div className="space-y-2">
              {WINE_RATINGS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => set({ personal_rating: f.personal_rating === r.value ? undefined : r.value })}
                  className={`flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 active:scale-[0.99] ${
                    f.personal_rating === r.value
                      ? "border-transparent bg-[var(--accent)] text-[#f8f7f4] shadow-[0_4px_14px_var(--accent-glow)]"
                      : "border-line bg-panel hover:border-[var(--accent-mid)]"
                  }`}
                >
                  <span
                    className={`inline-flex items-center gap-1 ${
                      f.personal_rating === r.value ? "text-[#f8f7f4]" : "text-[var(--accent)]"
                    }`}
                  >
                    {r.hearts === 0 ? (
                      <IconHeart size={16} />
                    ) : (
                      [0, 1, 2].map((i) => <IconHeart key={i} size={16} filled={i < r.hearts} />)
                    )}
                  </span>
                  <span className="text-[14.5px] font-medium">{r.label}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => set({ is_favorite: !f.is_favorite })}
              className={`mt-2 flex items-center gap-2.5 rounded-full border px-4 py-2 text-[13.5px] font-medium transition-all duration-200 active:scale-95 ${
                f.is_favorite
                  ? "border-transparent bg-[var(--accent)] text-[#f8f7f4]"
                  : "border-line bg-panel text-mute hover:text-[var(--accent-ink)]"
              }`}
            >
              <IconHeart size={16} filled={f.is_favorite} />
              {f.is_favorite ? "Adicionado aos favoritos" : "Adicionar aos favoritos"}
            </button>
          </>
        )}

        {step === 4 && (
          <>
            <Field label="Onde você tomou?" optional>
              <div className="flex flex-wrap gap-2">
                {WINE_LOCATIONS.map((l) => (
                  <Chip
                    key={l}
                    selected={f.location === l}
                    onClick={() => set({ location: f.location === l ? undefined : l })}
                  >
                    {l}
                  </Chip>
                ))}
              </div>
            </Field>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Com quem?" optional>
                <input
                  className="field"
                  placeholder="Ex.: Júlia, sozinho, amigos…"
                  value={f.company ?? ""}
                  onChange={(e) => set({ company: e.target.value || undefined })}
                />
              </Field>
              <Field label="O que estava comendo?" optional>
                <input
                  className="field"
                  placeholder="Ex.: massa, queijos, petiscos…"
                  value={f.food_pairing ?? ""}
                  onChange={(e) => set({ food_pairing: e.target.value || undefined })}
                />
              </Field>
            </div>
            <Field label="Ocasião" optional>
              <input
                className="field"
                placeholder="Ex.: sexta-feira à noite, aniversário…"
                value={f.occasion ?? ""}
                onChange={(e) => set({ occasion: e.target.value || undefined })}
              />
            </Field>
            <Field
              label="Minhas impressões"
              optional
              hint="Ex.: “No começo achei forte, mas depois de alguns minutos ficou mais frutado.”"
            >
              <textarea
                className="field min-h-[120px] resize-y leading-relaxed"
                placeholder="Escreva sem pressa — é a parte mais valiosa do diário."
                value={f.personal_notes ?? ""}
                onChange={(e) => set({ personal_notes: e.target.value || undefined })}
              />
            </Field>
            <Field label="Foto da garrafa" optional>
              <PhotoUploader
                photo={f.photo_url}
                onPhoto={(url) => set({ photo_url: url })}
                label="Adicionar foto da garrafa"
              />
            </Field>
          </>
        )}
      </div>

      <footer className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
        <Btn variant="ghost" onClick={back}>
          <IconArrowLeft size={15} /> Voltar
        </Btn>
        <Btn size="lg" onClick={next}>
          {last ? "Salvar vinho" : "Continuar"} {!last && <IconArrowRight size={16} />}
        </Btn>
      </footer>
    </div>
  );
}
