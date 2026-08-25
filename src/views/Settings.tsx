import { useState } from "react";
import { useStore } from "../store";
import { Btn, Field, Kicker, Ornament } from "../ui";
import { IconTrash } from "../icons";

export default function Settings() {
  const { user, coffees, wines, seeded, updateName, loadSamples, clearAll, signOut, toast } =
    useStore();
  const [name, setName] = useState(user?.name ?? "");
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="pb-10">
      <header className="pt-10 sm:pt-14">
        <Kicker>Configurações</Kicker>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">Seu diário, seu ritmo</h1>
      </header>

      <div className="mt-10 space-y-10">
        <section className="max-w-md">
          <h2 className="font-display text-xl">Perfil</h2>
          <div className="mt-4 space-y-4">
            <Field label="Como quer ser chamado">
              <div className="flex gap-2">
                <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
                <Btn
                  variant="outline"
                  onClick={() => name.trim().length >= 2 && updateName(name.trim())}
                  disabled={name.trim().length < 2 || name.trim() === user?.name}
                >
                  Salvar
                </Btn>
              </div>
            </Field>
            {user?.email && (
              <p className="text-[13px] text-mute">
                E-mail: <span className="text-ink/75">{user.email}</span>
                {user.provider === "google" && " · conta Google (demonstração)"}
                {user.provider === "demo" && " · sessão de convidado"}
              </p>
            )}
          </div>
        </section>

        <section className="max-w-md border-t border-line pt-8">
          <h2 className="font-display text-xl">Dados</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-mute">
            {coffees.length} {coffees.length === 1 ? "café" : "cafés"} e {wines.length}{" "}
            {wines.length === 1 ? "vinho" : "vinhos"} guardados neste navegador.
            {seeded && " (inclui dados de exemplo)"}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Btn variant="outline" onClick={loadSamples}>
              Carregar dados de exemplo
            </Btn>
            {!confirming ? (
              <Btn variant="danger" onClick={() => setConfirming(true)}>
                <IconTrash size={15} /> Limpar diário
              </Btn>
            ) : (
              <span className="anim-fade inline-flex items-center gap-2">
                <span className="text-[13px] text-mute">Apagar todos os registros?</span>
                <Btn
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    clearAll();
                    setConfirming(false);
                  }}
                >
                  Sim, apagar
                </Btn>
                <Btn variant="ghost" size="sm" onClick={() => setConfirming(false)}>
                  Cancelar
                </Btn>
              </span>
            )}
          </div>
        </section>

        <section className="max-w-md border-t border-line pt-8">
          <h2 className="font-display text-xl">Conta</h2>
          <div className="mt-4">
            <Btn
              variant="outline"
              onClick={() => {
                signOut();
                toast("Até logo.");
              }}
            >
              Encerrar sessão
            </Btn>
          </div>
        </section>

        <Ornament />

        <section className="text-center">
          <p className="font-display text-lg italic">
            Notas<span className="text-[var(--accent)]">.</span>
          </p>
          <p className="mx-auto mt-2 max-w-sm text-[12.5px] leading-relaxed text-faint">
            Um diário pessoal de café e vinho. Sem rede social, sem ranking, sem pressa —
            apenas você e o que prova. Seus registros ficam guardados localmente neste navegador.
          </p>
        </section>
      </div>
    </div>
  );
}
