import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CoffeeEntry, Mode, User, WineEntry } from "./types";
import { sampleCoffees, sampleWines } from "./content";

/* ---------------- helpers ---------------- */

export const uid = () =>
  Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

export const nowIso = () => new Date().toISOString();

export function fmtLong(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

export function fmtShort(iso: string) {
  const d = new Date(iso);
  const s = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" }).format(d);
  return s.replace(".", "");
}

export function relative(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const day = (t: Date) => new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
  const diff = Math.round((day(today) - day(d)) / 86400000);
  if (diff <= 0) return "Hoje";
  if (diff === 1) return "Ontem";
  if (diff < 7) return `${diff} dias atrás`;
  return fmtShort(iso);
}

export function monthKey(iso: string) {
  return new Date(iso)
    .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    .toUpperCase();
}

export function ratioOf(dose?: number, yld?: number) {
  if (!dose || !yld || dose <= 0) return null;
  return `1:${(yld / dose).toFixed(1).replace(/\.0$/, "")}`;
}

export function resizeImage(file: File, max = 1100, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("canvas"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("img"));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error("read"));
    reader.readAsDataURL(file);
  });
}

/* ---------------- insights ---------------- */

function countBy(list: string[]) {
  const m = new Map<string, number>();
  list.forEach((n) => m.set(n, (m.get(n) ?? 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export function computeInsights(mode: Mode, coffees: CoffeeEntry[], wines: WineEntry[]): string[] {
  const out: string[] = [];
  if (mode === "coffee") {
    if (coffees.length < 3) return out;
    const notes = countBy(coffees.flatMap((c) => c.flavor_notes));
    const top = notes.filter(([, n]) => n >= 2).slice(0, 3).map(([k]) => k.toLowerCase());
    if (top.length >= 2)
      out.push(`Você parece gostar mais de cafés com ${top.join(", ")}.`);
    const times = coffees.filter(
      (c) => c.extraction_time_seconds && c.overall_result === "equilibrado"
    ).map((c) => c.extraction_time_seconds as number);
    if (times.length >= 2) {
      const min = Math.min(...times);
      const max = Math.max(...times);
      out.push(`Suas extrações mais equilibradas ficaram entre ${min} e ${max} segundos.`);
    }
    const bodies = countBy(coffees.filter((c) => c.body).map((c) => c.body as string));
    if (bodies[0] && bodies[0][1] >= 2)
      out.push(`Corpo ${bodies[0][0].toLowerCase()} aparece bastante nas suas xícaras favoritas.`);
  } else {
    if (wines.length < 3) return out;
    const grapes = countBy(wines.flatMap((w) => w.grapes).filter((g) => g !== "Não sei"));
    const top = grapes.filter(([, n]) => n >= 2).slice(0, 3).map(([k]) => k);
    if (top.length >= 2)
      out.push(`Você tem registrado bastante ${top.join(" e ")}.`);
    const loved = wines.filter((w) => w.personal_rating === "adorei" || w.personal_rating === "bastante");
    const bodies = countBy(loved.filter((w) => w.body).map((w) => w.body as string));
    if (bodies[0] && bodies[0][1] >= 2)
      out.push(`Você costuma gostar mais de vinhos de corpo ${bodies[0][0].toLowerCase()}.`);
    const notes = countBy(loved.flatMap((w) => w.flavor_notes));
    if (notes[0] && notes[0][1] >= 2)
      out.push(`Notas de ${notes[0][0].toLowerCase()} costumam aparecer nos vinhos que você mais gostou.`);
  }
  return out.slice(0, 2);
}

/* ---------------- persistência ---------------- */

const LS_DATA = "notas:data:v1";
const LS_SESSION = "notas:session:v1";
const LS_USERS = "notas:users:v1";

interface DataShape {
  mode: Mode;
  coffees: CoffeeEntry[];
  wines: WineEntry[];
  seeded: boolean;
}

interface Toast {
  id: number;
  msg: string;
}

interface Store {
  user: User | null;
  mode: Mode;
  coffees: CoffeeEntry[];
  wines: WineEntry[];
  seeded: boolean;
  toasts: Toast[];
  setMode: (m: Mode) => void;
  toast: (msg: string) => void;
  signIn: (email: string, pass: string) => Promise<string | null>;
  signUp: (name: string, email: string, pass: string) => Promise<string | null>;
  googleSignIn: () => Promise<void>;
  guestSignIn: (withSamples: boolean) => Promise<void>;
  signOut: () => void;
  updateName: (name: string) => void;
  addCoffee: (c: CoffeeEntry) => void;
  updateCoffee: (id: string, c: CoffeeEntry) => void;
  deleteCoffee: (id: string) => void;
  toggleFavCoffee: (id: string) => void;
  addWine: (w: WineEntry) => void;
  updateWine: (id: string, w: WineEntry) => void;
  deleteWine: (id: string) => void;
  toggleFavWine: (id: string) => void;
  loadSamples: () => void;
  clearAll: () => void;
}

const Ctx = createContext<Store | null>(null);

function loadData(): DataShape {
  try {
    const raw = localStorage.getItem(LS_DATA);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        mode: p.mode === "wine" ? "wine" : "coffee",
        coffees: Array.isArray(p.coffees) ? p.coffees : [],
        wines: Array.isArray(p.wines) ? p.wines : [],
        seeded: !!p.seeded,
      };
    }
  } catch {
    /* ignore */
  }
  return { mode: "coffee", coffees: [], wines: [], seeded: false };
}

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(LS_SESSION);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataShape>(loadData);
  const [user, setUser] = useState<User | null>(loadSession);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_DATA, JSON.stringify(data));
    } catch {
      /* quota — ignora silenciosamente */
    }
  }, [data]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(LS_SESSION, JSON.stringify(user));
      else localStorage.removeItem(LS_SESSION);
    } catch {
      /* ignore */
    }
  }, [user]);

  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const setMode = useCallback((m: Mode) => {
    setData((d) => ({ ...d, mode: m }));
  }, []);

  /* ---------- autenticação (demonstração local) ---------- */

  const users = (): Record<string, { name: string; pass: string }> => {
    try {
      return JSON.parse(localStorage.getItem(LS_USERS) ?? "{}");
    } catch {
      return {};
    }
  };
  const saveUsers = (u: Record<string, { name: string; pass: string }>) =>
    localStorage.setItem(LS_USERS, JSON.stringify(u));

  const wait = (ms = 650) => new Promise((r) => setTimeout(r, ms));

  const signIn = async (email: string, pass: string) => {
    await wait();
    const u = users()[email.toLowerCase().trim()];
    if (!u) return "Não encontramos uma conta com este e-mail.";
    if (u.pass !== pass) return "Senha incorreta. Tente de novo.";
    setUser({ name: u.name, email: email.toLowerCase().trim(), provider: "email" });
    toast(`Bem-vindo(a) de volta, ${u.name.split(" ")[0]}.`);
    return null;
  };

  const signUp = async (name: string, email: string, pass: string) => {
    await wait();
    const key = email.toLowerCase().trim();
    const all = users();
    if (all[key]) return "Já existe uma conta com este e-mail.";
    all[key] = { name: name.trim(), pass };
    saveUsers(all);
    setUser({ name: name.trim(), email: key, provider: "email" });
    toast(`Diário criado. Bem-vindo(a), ${name.trim().split(" ")[0]}.`);
    return null;
  };

  const googleSignIn = async () => {
    await wait(900);
    const key = "voce@gmail.com";
    const all = users();
    if (!all[key]) all[key] = { name: "Você", pass: "google-demo" };
    saveUsers(all);
    setUser({ name: all[key].name, email: key, provider: "google" });
    toast("Sessão iniciada com Google (demonstração).");
  };

  const guestSignIn = async (withSamples: boolean) => {
    await wait(500);
    if (withSamples) {
      setData((d) => ({
        ...d,
        coffees: d.coffees.length ? d.coffees : sampleCoffees(),
        wines: d.wines.length ? d.wines : sampleWines(),
        seeded: true,
      }));
    }
    setUser({ name: "Convidado", email: "", provider: "demo" });
    toast("Diário aberto. Fique à vontade.");
  };

  const signOut = () => {
    setUser(null);
    toast("Sessão encerrada. Seu diário continua guardado.");
  };

  const updateName = (name: string) => {
    setUser((u) => (u ? { ...u, name } : u));
    toast("Nome atualizado.");
  };

  /* ---------- registros ---------- */

  const addCoffee = (c: CoffeeEntry) => setData((d) => ({ ...d, coffees: [c, ...d.coffees] }));
  const updateCoffee = (id: string, c: CoffeeEntry) =>
    setData((d) => ({ ...d, coffees: d.coffees.map((x) => (x.id === id ? c : x)) }));
  const deleteCoffee = (id: string) =>
    setData((d) => ({ ...d, coffees: d.coffees.filter((x) => x.id !== id) }));
  const toggleFavCoffee = (id: string) =>
    setData((d) => ({
      ...d,
      coffees: d.coffees.map((x) => (x.id === id ? { ...x, is_favorite: !x.is_favorite } : x)),
    }));

  const addWine = (w: WineEntry) => setData((d) => ({ ...d, wines: [w, ...d.wines] }));
  const updateWine = (id: string, w: WineEntry) =>
    setData((d) => ({ ...d, wines: d.wines.map((x) => (x.id === id ? w : x)) }));
  const deleteWine = (id: string) => setData((d) => ({ ...d, wines: d.wines.filter((x) => x.id !== id) }));
  const toggleFavWine = (id: string) =>
    setData((d) => ({
      ...d,
      wines: d.wines.map((x) => (x.id === id ? { ...x, is_favorite: !x.is_favorite } : x)),
    }));

  const loadSamples = () => {
    setData((d) => ({
      ...d,
      coffees: [...sampleCoffees().filter((s) => !d.coffees.some((c) => c.id === s.id)), ...d.coffees],
      wines: [...sampleWines().filter((s) => !d.wines.some((w) => w.id === s.id)), ...d.wines],
      seeded: true,
    }));
    toast("Dados de exemplo adicionados.");
  };

  const clearAll = () => {
    setData((d) => ({ ...d, coffees: [], wines: [], seeded: false }));
    toast("Diário esvaziado.");
  };

  const value = useMemo<Store>(
    () => ({
      user,
      mode: data.mode,
      coffees: data.coffees,
      wines: data.wines,
      seeded: data.seeded,
      toasts,
      setMode,
      toast,
      signIn,
      signUp,
      googleSignIn,
      guestSignIn,
      signOut,
      updateName,
      addCoffee,
      updateCoffee,
      deleteCoffee,
      toggleFavCoffee,
      addWine,
      updateWine,
      deleteWine,
      toggleFavWine,
      loadSamples,
      clearAll,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, data, toasts]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore fora do StoreProvider");
  return s;
}
