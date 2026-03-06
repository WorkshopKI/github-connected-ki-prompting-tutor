import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useSyncContext } from "@/contexts/SyncContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { User, BookOpen, Trophy, Mail, Save, Bot, Wallet, Key, ExternalLink, Plus, X, Cloud } from "lucide-react";
import { saveUserKey } from "@/services/llmService";
import { STANDARD_MODELS, PREMIUM_MODELS, OPEN_SOURCE_MODELS } from "@/data/models";
import { useCustomModels } from "@/hooks/useCustomModels";

const Profile = () => {
  const { user, profile, isLoggedIn, isLoading, authMethod, upgradeGuestToEmail, verifyOTP, refreshProfile } = useAuthContext();
  const { exercises, completedLessons, challengeCards, syncStatus } = useSyncContext();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [saving, setSaving] = useState(false);
  const [upgradeEmail, setUpgradeEmail] = useState("");
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeStep, setUpgradeStep] = useState<"email" | "otp">("email");
  const [otpCode, setOtpCode] = useState("");
  const [selectedModel, setSelectedModel] = useState(profile?.preferred_model ?? "google/gemini-3-flash-preview");
  const [savingModel, setSavingModel] = useState(false);
  const [budget, setBudget] = useState<{ provisioned_key_budget: number; custom_key_active: boolean; active_key_source: string } | null>(null);
  const [customApiKey, setCustomApiKey] = useState("");
  const [savingKey, setSavingKey] = useState(false);
  const { customModels, addCustomModel, removeCustomModel } = useCustomModels();
  const [newModelId, setNewModelId] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("user_api_keys").select("provisioned_key_budget, custom_key_active, active_key_source").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) setBudget(data);
    });
  }, [user]);

  useEffect(() => {
    if (profile?.preferred_model) setSelectedModel(profile.preferred_model);
  }, [profile?.preferred_model]);

  const handleSaveModel = async () => {
    if (!user) return;
    setSavingModel(true);
    const { error } = await supabase.from("user_profiles").update({ preferred_model: selectedModel, updated_at: new Date().toISOString() }).eq("id", user.id);
    setSavingModel(false);
    if (error) { toast.error("Fehler beim Speichern"); } else { toast.success("Modell gespeichert!"); await refreshProfile(); }
  };

  const handleSaveApiKey = async () => {
    if (!customApiKey.trim()) return;
    setSavingKey(true);
    const result = await saveUserKey(customApiKey.trim());
    setSavingKey(false);
    if (result.error) { toast.error(result.error); } else {
      toast.success("API-Key gespeichert!");
      setCustomApiKey("");
      // reload budget
      if (user) {
        const { data } = await supabase.from("user_api_keys").select("provisioned_key_budget, custom_key_active, active_key_source").eq("user_id", user.id).maybeSingle();
        if (data) setBudget(data);
      }
    }
  };

  const handleAddCustomModel = () => {
    const id = newModelId.trim();
    if (!id) return;
    if (!id.includes("/")) {
      toast.error("Bitte im Format 'provider/model-name' eingeben (z.B. 'meta-llama/llama-3-70b')");
      return;
    }
    const added = addCustomModel(id);
    if (added) {
      toast.success("Modell hinzugefügt!");
      setNewModelId("");
    } else {
      toast.error("Dieses Modell existiert bereits in der Liste.");
    }
  };

  if (isLoading) return null;
  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const handleSaveName = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("user_profiles")
      .update({ display_name: displayName, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (error) {
      toast.error("Fehler beim Speichern");
    } else {
      toast.success("Name gespeichert!");
      await refreshProfile();
    }
    setSaving(false);
  };

  const handleUpgrade = async () => {
    if (!upgradeEmail.trim()) return;
    setUpgrading(true);
    const result = await upgradeGuestToEmail(upgradeEmail.trim());
    setUpgrading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Code wurde gesendet! Prüfe dein Postfach.");
      setUpgradeStep("otp");
    }
  };

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 8) return;
    setUpgrading(true);
    const result = await verifyOTP(upgradeEmail.trim(), otpCode);
    setUpgrading(false);
    if (result.error) {
      toast.error(result.error);
      setOtpCode("");
    } else {
      toast.success("E-Mail erfolgreich verknüpft!");
      await refreshProfile();
    }
  };

  const handleResendCode = async () => {
    setOtpCode("");
    setUpgrading(true);
    const result = await upgradeGuestToEmail(upgradeEmail.trim());
    setUpgrading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Neuer Code wurde gesendet!");
    }
  };

  const bestScores = exercises.reduce((acc, e) => {
    acc[e.exercise_id] = Math.max(acc[e.exercise_id] ?? 0, e.score);
    return acc;
  }, {} as Record<number, number>);
  const avgScore = Object.values(bestScores).length > 0
    ? Math.round(Object.values(bestScores).reduce((a, b) => a + b, 0) / Object.values(bestScores).length)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mein Profil</h1>
        <p className="text-muted-foreground text-sm mt-1">Kontoinformationen, KI-Einstellungen und Fortschritt</p>
      </div>
      <div className="max-w-2xl">

        {/* Guest upgrade banner */}
        {authMethod === "guest" && (
          <Card className="mb-6 border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-primary">
                <Mail className="h-4 w-4" /> E-Mail hinterlegen
              </CardTitle>
              <CardDescription>
                {upgradeStep === "email"
                  ? "Sichere deinen Fortschritt dauerhaft, indem du dein Gast-Konto mit einer E-Mail verknüpfst."
                  : `Code wurde an ${upgradeEmail} gesendet. Gib den 8-stelligen Code ein.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upgradeStep === "email" ? (
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="deine@email.de"
                    value={upgradeEmail}
                    onChange={(e) => setUpgradeEmail(e.target.value)}
                  />
                  <Button onClick={handleUpgrade} disabled={upgrading || !upgradeEmail.trim()}>
                    {upgrading ? "Senden…" : "Verknüpfen"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <InputOTP maxLength={8} value={otpCode} onChange={setOtpCode}>
                      <InputOTPGroup>
                        {Array.from({ length: 8 }, (_, i) => (
                          <InputOTPSlot key={i} index={i} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={upgrading || otpCode.length !== 8}
                    className="w-full"
                  >
                    {upgrading ? "Prüfen…" : "Bestätigen"}
                  </Button>
                  <div className="flex justify-between text-sm">
                    <button
                      onClick={handleResendCode}
                      disabled={upgrading}
                      className="text-primary hover:underline disabled:opacity-50"
                    >
                      Neuen Code senden
                    </button>
                    <button
                      onClick={() => { setUpgradeStep("email"); setOtpCode(""); }}
                      className="text-muted-foreground hover:underline"
                    >
                      Andere E-Mail
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Profile info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" /> Kontoinformationen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Anzeigename</label>
              <div className="flex gap-2">
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                <Button variant="outline" onClick={handleSaveName} disabled={saving}>
                  <Save className="h-4 w-4 mr-1" /> {saving ? "…" : "Speichern"}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Anmeldeart:</span>
                <div className="mt-1">
                  <Badge variant={authMethod === "guest" ? "secondary" : "default"}>
                    {authMethod === "guest" ? "Gast" : "E-Mail"}
                  </Badge>
                </div>
              </div>
              {profile?.course_id && (
                <div>
                  <span className="text-muted-foreground">Kurs:</span>
                  <div className="mt-1 font-medium">{profile.course_id}</div>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Sync-Status:</span>
                <div className="mt-1 capitalize">{syncStatus}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KI-Einstellungen */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" /> KI-Einstellungen
            </CardTitle>
            <CardDescription>Wähle das Modell für die Prompt-Bewertung.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Bevorzugtes Modell</label>
              <div className="flex gap-2">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Standard-Modelle</SelectLabel>
                      {STANDARD_MODELS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Premium-Modelle</SelectLabel>
                      {PREMIUM_MODELS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Open Source Modelle</SelectLabel>
                      {OPEN_SOURCE_MODELS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectGroup>
                    {customModels.length > 0 && (
                      <>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel>Eigene Modelle</SelectLabel>
                          {customModels.map((m) => (
                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                          ))}
                        </SelectGroup>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleSaveModel} disabled={savingModel || selectedModel === profile?.preferred_model}>
                  <Save className="h-4 w-4 mr-1" /> {savingModel ? "…" : "Speichern"}
                </Button>
              </div>
            </div>

            {/* Custom model management */}
            <div className="border-t border-border pt-4">
              <label className="text-sm font-medium text-muted-foreground mb-1 block">
                Eigenes OpenRouter-Modell hinzufügen
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="z.B. meta-llama/llama-3-70b"
                  value={newModelId}
                  onChange={(e) => setNewModelId(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomModel();
                    }
                  }}
                />
                <Button variant="outline" onClick={handleAddCustomModel} disabled={!newModelId.trim()}>
                  <Plus className="h-4 w-4 mr-1" /> Hinzufügen
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Modell-IDs findest du auf{" "}
                <a href="https://openrouter.ai/models" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-0.5">
                  openrouter.ai/models <ExternalLink className="h-3 w-3" />
                </a>
              </p>
              {customModels.length > 0 && (
                <div className="mt-3 space-y-1">
                  {customModels.map((m) => (
                    <div key={m.value} className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-1.5 text-sm">
                      <span className="truncate mr-2" title={m.value}>
                        {m.label} <span className="text-muted-foreground text-xs">({m.value})</span>
                      </span>
                      <button
                        onClick={() => removeCustomModel(m.value)}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        title="Entfernen"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* KI-Budget */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" /> KI-Budget
            </CardTitle>
            <CardDescription>Dein verbleibendes Kontingent für KI-Bewertungen.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {budget ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Verbleibend</span>
                  <span className="font-semibold">${budget.provisioned_key_budget.toFixed(2)} / $5.00</span>
                </div>
                <Progress value={(budget.provisioned_key_budget / 5) * 100} className="h-2" />
                <div className="flex items-center gap-2">
                  {budget.active_key_source === "custom" ? (
                    <Badge variant="default" className="gap-1"><Key className="h-3 w-3" /> OpenRouter (eigener Key)</Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1"><Cloud className="h-3 w-3" /> Cloud AI (Standard)</Badge>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Budget-Daten werden geladen…</p>
            )}

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="apikey">
                <AccordionTrigger className="text-sm">
                  <span className="flex items-center gap-2"><Key className="h-4 w-4" /> Eigenen API-Key hinterlegen</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Erstelle ein Konto bei{" "}
                      <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1">OpenRouter <ExternalLink className="h-3 w-3" /></a>
                    </li>
                    <li>Lade Guthaben auf (ab $5)</li>
                    <li>Erstelle einen API-Key unter „Keys"</li>
                    <li>Füge den Key hier ein:</li>
                  </ol>
                  <div className="flex gap-2">
                    <Input type="password" placeholder="sk-or-..." value={customApiKey} onChange={(e) => setCustomApiKey(e.target.value)} className="flex-1" />
                    <Button onClick={handleSaveApiKey} disabled={savingKey || !customApiKey.trim()}>
                      {savingKey ? "Speichern…" : "Speichern"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Dein Key wird verschlüsselt gespeichert und nur serverseitig für KI-Anfragen verwendet.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Progress overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" /> Fortschritt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{Object.keys(bestScores).length}</div>
                <div className="text-xs text-muted-foreground">Übungen</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{completedLessons.length}</div>
                <div className="text-xs text-muted-foreground">Lektionen</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{challengeCards.length}</div>
                <div className="text-xs text-muted-foreground">Challenges</div>
              </div>
            </div>
            {avgScore > 0 && (
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Durchschnittliche Bewertung:</span>
                  <span className="font-bold text-primary">{avgScore}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
