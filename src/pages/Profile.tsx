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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { ArrowLeft, User, BookOpen, Trophy, Mail, Save, Bot, Wallet, Key, ExternalLink } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { saveUserKey } from "@/services/llmService";

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

  const MODEL_OPTIONS = [
    { value: "anthropic/claude-sonnet-4.6", label: "Claude Sonnet 4.6" },
    { value: "openai/gpt-5.2", label: "GPT-5.2" },
    { value: "google/gemini-3-flash-preview", label: "Gemini 3 Flash (Standard)" },
    { value: "anthropic/claude-opus-4.6", label: "Claude Opus 4.6" },
    { value: "google/gemini-3.1-pro-preview", label: "Gemini 3.1 Pro" },
  ];

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
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Mein Profil</h1>
        </div>

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
                    {MODEL_OPTIONS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleSaveModel} disabled={savingModel || selectedModel === profile?.preferred_model}>
                  <Save className="h-4 w-4 mr-1" /> {savingModel ? "…" : "Speichern"}
                </Button>
              </div>
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
                  {budget.custom_key_active && (
                    <Badge variant="default" className="gap-1"><Key className="h-3 w-3" /> Eigener Key aktiv</Badge>
                  )}
                  <Badge variant="secondary">{budget.active_key_source === "custom" ? "Custom" : "Standard"}</Badge>
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
