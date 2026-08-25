import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ButtonHTMLAttributes,
} from "react";
import { IconCamera, IconHeart, IconInfo, IconPlus, IconX } from "./icons";
import { resizeImage } from "./store";
import type { NoteGroup } from "./types";

/* ---------- botão ---------- */

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Btn({ variant = "primary", size = "md", className = "", ...rest }: BtnProps) {
  const sizes = {
    sm: "px-4 py-1.5 text-[13px]",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-[15px]",
  };
  const variants = {
    primary:
      "bg-[var(--accent)] text-[#f8f7f4] hover:brightness-110 active:scale-[0.98] shadow-[0_1px_0_rgba(0,0,0,0.06)]",
    outline:
      "border border-linedark bg-panel text-ink hover:border-[var(--accent)] hover:text-[var(--accent-ink)] active:scale-[0.98]",
    ghost: "text-mute hover:text-ink hover:bg-[var(--accent-soft)] active:scale-[0.98]",
    danger: "text-[#a04040] hover:bg-[#a04040]/10 active:scale-[0.98]",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    />
  );
}

/* ---------- kicker (caixa alta editorial) ---------- */

export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`text-[11px] font-semibold uppercase tracking-[0.2em] text-mute ${className}`}>
      {children}
    </div>
  );
}

/* ---------- ornamento ---------- */

export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-linedark ${className}`} aria-hidden>
      <span className="h-px w-10 bg-line" />
      <svg width="7" height="7" viewBox="0 0 8 8" className="rotate-45">
        <rect x="1.5" y="1.5" width="5" height="5" fill="currentColor" />
      </svg>
      <span className="h-px w-10 bg-line" />
    </div>
  );
}

/* ---------- chip selecionável ---------- */

export function Chip({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-3.5 py-1.5 text-[13.5px] transition-all duration-200 active:scale-95 ${
        selected
          ? "border-transparent bg-[var(--accent)] text-[#f8f7f4] shadow-[0_2px_8px_var(--accent-glow)]"
          : "border-line bg-panel text-ink/75 hover:border-[var(--accent-mid)] hover:text-ink"
      } ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------- escala segmentada (3 opções) ---------- */

export function Segmented({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: string[];
  value?: string;
  onChange: (v: string) => void;
  ariaLabel?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="grid grid-cols-3 gap-1 rounded-full border border-line bg-paper p-1"
    >
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={`rounded-full py-1.5 text-[13px] font-medium transition-all duration-200 ${
            value === o
              ? "bg-[var(--accent)] text-[#f8f7f4] shadow-[0_2px_8px_var(--accent-glow)]"
              : "text-mute hover:text-ink"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/* ---------- stepper numérico ---------- */

export function Stepper({
  value,
  onChange,
  unit,
  step = 0.5,
  min = 0,
}: {
  value: number;
  onChange: (v: number) => void;
  unit: string;
  step?: number;
  min?: number;
}) {
  const dec = () => onChange(Math.max(min, +(value - step).toFixed(1)));
  const inc = () => onChange(+(value + step).toFixed(1));
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line bg-panel p-1">
      <button
        type="button"
        onClick={dec}
        aria-label="Diminuir"
        className="grid h-8 w-8 place-items-center rounded-full text-mute transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-ink)] active:scale-90"
      >
        <span className="text-lg leading-none">−</span>
      </button>
      <span className="min-w-[4.5rem] text-center font-display text-lg tabular-nums">
        {value} <span className="text-[13px] text-mute">{unit}</span>
      </span>
      <button
        type="button"
        onClick={inc}
        aria-label="Aumentar"
        className="grid h-8 w-8 place-items-center rounded-full text-mute transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-ink)] active:scale-90"
      >
        <span className="text-lg leading-none">+</span>
      </button>
    </div>
  );
}

/* ---------- campo com rótulo ---------- */

export function Field({
  label,
  optional,
  children,
  hint,
}: {
  label: string;
  optional?: boolean;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-2 text-[13px] font-semibold text-ink/80">
        {label}
        {optional && <span className="text-[11px] font-normal italic text-faint">opcional</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-mute">{hint}</span>}
    </label>
  );
}

/* ---------- revelação ao rolar ---------- */

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.disconnect();
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------- modal ---------- */

export function Modal({
  open,
  onClose,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="anim-fade fixed inset-0 z-50 flex items-end justify-center bg-ink/35 p-0 sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`anim-view relative max-h-[88vh] w-full overflow-y-auto rounded-t-2xl border border-line bg-paper shadow-[0_24px_60px_rgba(28,28,26,0.25)] sm:rounded-xl ${
          wide ? "sm:max-w-2xl" : "sm:max-w-xl"
        }`}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full text-mute transition hover:bg-ink/5 hover:text-ink"
        >
          <IconX size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

/* ---------- estado vazio ---------- */

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="anim-breathe mb-6 grid h-20 w-20 place-items-center rounded-full border border-dashed border-linedark text-[var(--accent)]">
        {icon}
      </div>
      <h3 className="font-display text-2xl">{title}</h3>
      <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-mute">{text}</p>
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}

/* ---------- dica com popover (taninos) ---------- */

export function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-label="Explicação"
        onClick={() => setOpen((o) => !o)}
        className={`inline-grid h-5 w-5 place-items-center rounded-full transition ${
          open ? "bg-[var(--accent)] text-[#f8f7f4]" : "text-faint hover:text-[var(--accent)]"
        }`}
      >
        <IconInfo size={14} />
      </button>
      {open && (
        <>
          <span className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <span className="anim-view absolute left-1/2 top-7 z-30 block w-60 -translate-x-1/2 rounded-lg border border-line bg-panel p-3 text-left text-[12.5px] leading-relaxed text-mute shadow-[0_12px_32px_rgba(28,28,26,0.12)]">
            {text}
          </span>
        </>
      )}
    </span>
  );
}

/* ---------- coração ---------- */

export function HeartBtn({
  active,
  onToggle,
  label = "Favorito",
  className = "",
}: {
  active: boolean;
  onToggle: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      aria-pressed={active}
      title={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={`inline-flex items-center gap-2 rounded-full px-2 py-1.5 transition-all duration-200 active:scale-90 ${
        active ? "text-[var(--accent)]" : "text-faint hover:text-[var(--accent)]"
      } ${className}`}
    >
      <span key={active ? "on" : "off"} className={active ? "anim-heart inline-flex" : "inline-flex"}>
        <IconHeart size={19} filled={active} />
      </span>
    </button>
  );
}

/* ---------- barra de progresso dos passos ---------- */

export function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="h-[2px] w-full overflow-hidden rounded-full bg-line">
      <div
        className="h-full rounded-full bg-[var(--accent)] transition-all duration-500 ease-out"
        style={{ width: `${((step + 1) / total) * 100}%` }}
      />
    </div>
  );
}

/* ---------- linha de estatística (detalhe) ---------- */

export function StatRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-line py-3">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">{label}</span>
      <span className="text-right font-display text-[17px] text-ink">{value}</span>
    </div>
  );
}

/* ---------- upload de foto ---------- */

export function PhotoUploader({
  photo,
  onPhoto,
  label = "Adicionar foto",
}: {
  photo?: string;
  onPhoto: (url: string | undefined) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = async (file?: File) => {
    if (!file) return;
    setErr(false);
    setBusy(true);
    try {
      const url = await resizeImage(file);
      onPhoto(url);
    } catch {
      setErr(true);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
      {photo ? (
        <div className="relative inline-block">
          <img
            src={photo}
            alt=""
            className="h-36 w-48 rounded-lg border border-line object-cover"
          />
          <button
            type="button"
            aria-label="Remover foto"
            onClick={() => onPhoto(undefined)}
            className="absolute -right-2.5 -top-2.5 grid h-7 w-7 place-items-center rounded-full border border-line bg-panel text-mute shadow-sm transition hover:text-ink active:scale-90"
          >
            <IconX size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex items-center gap-2.5 rounded-lg border border-dashed border-linedark px-4 py-3 text-[13.5px] font-medium text-mute transition-all duration-200 hover:border-[var(--accent-mid)] hover:text-[var(--accent-ink)] active:scale-[0.98]"
        >
          {busy ? (
            <span className="anim-spin inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <IconCamera size={18} />
          )}
          {busy ? "Carregando…" : label}
        </button>
      )}
      {err && <p className="mt-2 text-xs text-[#8c3232]">Não foi possível carregar esta imagem.</p>}
    </div>
  );
}

/* ---------- seletor de notas sensoriais ---------- */

export function FlavorSelector({
  groups,
  selected,
  onToggle,
  customLabel = "Adicionar minha própria nota",
}: {
  groups: NoteGroup[];
  selected: string[];
  onToggle: (note: string) => void;
  customLabel?: string;
}) {
  const [text, setText] = useState("");
  const known = new Set(groups.flatMap((g) => g.notes));
  const custom = selected.filter((n) => !known.has(n));

  const addCustom = () => {
    const t = text.trim();
    if (!t || selected.includes(t)) return;
    onToggle(t);
    setText("");
  };

  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <div key={g.group}>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
            {g.group}
          </div>
          <div className="flex flex-wrap gap-2">
            {g.notes.map((n) => (
              <Chip key={n} selected={selected.includes(n)} onClick={() => onToggle(n)}>
                {n}
              </Chip>
            ))}
          </div>
        </div>
      ))}
      {custom.length > 0 && (
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
            Minhas notas
          </div>
          <div className="flex flex-wrap gap-2">
            {custom.map((n) => (
              <Chip key={n} selected onClick={() => onToggle(n)}>
                {n}
              </Chip>
            ))}
          </div>
        </div>
      )}
      <div className="flex max-w-sm gap-2 pt-1">
        <input
          className="field"
          placeholder={customLabel}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
        />
        <button
          type="button"
          onClick={addCustom}
          aria-label="Adicionar nota"
          className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[0.65rem] border border-line bg-panel text-mute transition hover:border-[var(--accent-mid)] hover:text-[var(--accent-ink)] active:scale-95"
        >
          <IconPlus size={17} />
        </button>
      </div>
    </div>
  );
}
