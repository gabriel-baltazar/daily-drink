import { useState, type FormEvent } from "react";
import { useStore } from "../store";
import { Btn } from "../ui";
import { IconGoogle } from "../icons";
import { IMG } from "../content";

function Spinner() {
  return (
    <span className="anim-spin inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent" />
  );
}

export default function Auth() {
  const { signIn, signUp, googleSignIn, guestSignIn } = useStore();
  const [tab, setTab] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"form" | "google" | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (tab === "up" && name.trim().length < 2) return setError("Conte seu nome (ou como quer ser chamado).");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Digite um e-mail válido.");
    if (pass.length < 4) return setError("A senha precisa de pelo menos 4 caracteres.");
    setBusy("form");
    const err = tab === "in" ? await signIn(email, pass) : await signUp(name, email, pass);
    setBusy(null);
    if (err) setError(err);
  };

  const google = async () => {
    setBusy("google");
    await googleSignIn();
    setBusy(null);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* painel visual */}
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={IMG.auth}
          alt="Uma xícara de café e uma taça de vinho lado a lado"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
        <div className="absolute left-10 top-10 font-display text-2xl italic text-paper/95">
          Notas<span className="text-[#e8c9a0]">.</span>
        </div>
        <div className="absolute bottom-12 left-10 right-16">
          <p className="font-display text-3xl italic leading-snug text-paper">
            “Anotar hoje é lembrar melhor amanhã —<br />
            uma xícara e uma taça de cada vez.”
          </p>
        </div>
      </div>

      {/* formulário */}
      <div className="flex items-center justify-center px-6 py-14">
        <div className="anim-view w-full max-w-sm">
          <div className="mb-10">
            <div className="font-display text-4xl italic">
              Notas<span className="text-[var(--accent)]">.</span>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-mute">
              Um diário pessoal para quem gosta de café e vinho.
              <br />
              Registre o que prova, lembre do que gostou, aprenda devagar.
            </p>
          </div>

          <div className="mb-6 flex gap-6 border-b border-line">
            {(["in", "up"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setError(null);
                }}
                className={`-mb-px border-b-2 pb-2.5 text-sm font-medium transition-all duration-300 ${
                  tab === t
                    ? "border-[var(--accent)] text-ink"
                    : "border-transparent text-mute hover:text-ink"
                }`}
              >
                {t === "in" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {tab === "up" && (
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink/80">Nome</label>
                <input
                  className="field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como quer ser chamado?"
                  autoComplete="name"
                />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-ink/80">E-mail</label>
              <input
                className="field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-ink/80">Senha</label>
              <input
                className="field"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                autoComplete={tab === "in" ? "current-password" : "new-password"}
              />
            </div>

            {error && (
              <p className="anim-fade rounded-lg bg-[#a04040]/10 px-3.5 py-2.5 text-[13px] text-[#8c3232]">
                {error}
              </p>
            )}

            <Btn type="submit" size="lg" className="w-full" disabled={busy !== null}>
              {busy === "form" ? <Spinner /> : tab === "in" ? "Abrir meu diário" : "Começar meu diário"}
            </Btn>
          </form>

          <div className="my-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-faint">
            <span className="h-px flex-1 bg-line" />
            ou
            <span className="h-px flex-1 bg-line" />
          </div>

          <Btn
            variant="outline"
            size="lg"
            className="w-full"
            onClick={google}
            disabled={busy !== null}
          >
            {busy === "google" ? <Spinner /> : <IconGoogle />}
            Continuar com Google
          </Btn>

          <div className="mt-8 space-y-1 text-center text-[13.5px]">
            <button
              onClick={() => guestSignIn(true)}
              className="link-quiet font-medium text-[var(--accent-ink)]"
            >
              Explorar com dados de exemplo →
            </button>
            <p>
              <button onClick={() => guestSignIn(false)} className="link-quiet text-mute">
                ou começar com um diário vazio
              </button>
            </p>
            <p className="pt-3 text-[11.5px] leading-relaxed text-faint">
              Demonstração local: seus dados ficam guardados apenas neste navegador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
