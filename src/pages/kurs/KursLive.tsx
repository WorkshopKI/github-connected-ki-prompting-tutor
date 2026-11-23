import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Radio } from "lucide-react";
import { KursLayout } from "@/components/kurs/KursLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/constants";
import { beitreten, normiereCode, useKursLive, verlassen } from "@/lib/kursLive";

/** /live und /live/:code — einer Live-Sitzung beitreten (Code steht am Beamer). */
export default function KursLive() {
  const { code: ausLink } = useParams();
  const navigate = useNavigate();
  const live = useKursLive();
  const [code, setCode] = useState(ausLink ?? "");

  const los = (c: string) => {
    if (!normiereCode(c)) return;
    beitreten(c, "teilnehmer");
    navigate(ROUTES.KURS_FOLIEN);
  };

  useEffect(() => {
    if (ausLink) los(ausLink);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ausLink]);

  const absenden = (e: FormEvent) => {
    e.preventDefault();
    los(code);
  };

  return (
    <KursLayout>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Live im Kurs"
          title="Der Kursleitung folgen"
          description="Gib den Code vom Beamer ein. Dann siehst du immer, welche Folie gerade dran ist und was als Nächstes kommt. Übungen öffnen sich auf Wunsch von selbst."
        />
        <form onSubmit={absenden} className="card-section flex max-w-md flex-wrap items-end gap-3">
          <label className="grid flex-1 gap-1.5 text-sm font-semibold">
            Code
            <Input
              value={code}
              onChange={(e) => setCode(normiereCode(e.target.value))}
              placeholder="z. B. VHS2026"
              autoCapitalize="characters"
              autoComplete="off"
              inputMode="text"
              className="h-12 font-mono text-2xl tracking-[0.3em]"
              aria-describedby="code-hilfe"
            />
          </label>
          <Button type="submit" size="lg" disabled={!code}>
            <Radio className="mr-2 h-4 w-4" strokeWidth={1.75} /> Beitreten
          </Button>
          <p id="code-hilfe" className="w-full text-sm text-muted-foreground">
            Ohne Anmeldung. Es werden keine Namen übertragen.
          </p>
        </form>
        {live.code && live.rolle === "teilnehmer" && (
          <p className="text-sm text-muted-foreground">
            Du bist mit <span className="font-mono font-semibold text-foreground">{live.code}</span> verbunden.{" "}
            <button className="font-semibold text-brand-ink hover:underline" onClick={verlassen}>
              Verlassen
            </button>
          </p>
        )}
      </div>
    </KursLayout>
  );
}
