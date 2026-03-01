

## Problem

Die App verwendet `supabase.auth.signInWithOtp({ email })`, was standardmässig einen **Magic Link** (Bestätigungslink) per E-Mail sendet -- keinen 6-stelligen Code. Das erklärt:
- Screenshot 1: E-Mail mit "Verify Email"-Button statt OTP-Code
- Screenshot 2: Klick auf den Button leitet zu Lovable's Login weiter (weil die Redirect-URL nicht zur App zeigt)

Die Login-Seite erwartet aber einen 6-stelligen Code (InputOTP-Komponente).

## Lösung

Eine einzige Änderung in `src/contexts/AuthContext.tsx`: Den `signInWithOtp`-Aufruf so konfigurieren, dass ein **6-stelliger OTP-Code** per E-Mail gesendet wird statt eines Magic Links.

### Technische Änderung

In `AuthContext.tsx`, Zeile wo `signInWithOtp` aufgerufen wird, die Option `shouldCreateUser: true` explizit setzen und -- entscheidend -- die E-Mail-Redirect deaktivieren, damit ein Code statt Link gesendet wird:

```typescript
// Vorher:
const { error } = await supabase.auth.signInWithOtp({ email });

// Nachher:
const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    shouldCreateUser: true,
  },
});
```

Allerdings: Ob ein OTP-Code oder ein Magic Link gesendet wird, hängt von der **Auth-Konfiguration** im Backend ab. Die Standard-E-Mail-Templates senden immer einen Link. Um einen 6-stelligen Code zu erhalten, muss das E-Mail-Template den `{{ .Token }}`-Platzhalter verwenden statt `{{ .ConfirmationURL }}`.

### Vollständiger Plan

1. **Auth-Konfiguration prüfen und anpassen** -- Das E-Mail-OTP-Template so konfigurieren, dass es den numerischen Token (`{{ .Token }}`) anzeigt statt eines Bestätigungslinks. Dies erfordert eine Anpassung der Auth-E-Mail-Templates über die Lovable Cloud Email-Einstellungen oder durch Scaffolding eigener E-Mail-Templates.

2. **`AuthContext.tsx` anpassen** -- Sicherstellen, dass `signInWithOtp` korrekt konfiguriert ist (kein `emailRedirectTo` setzen, da wir keinen Link wollen).

3. **Eigene E-Mail-Templates erstellen** -- Mit `scaffold_auth_email_templates` brandkonforme Templates erstellen, die den 6-stelligen Code anzeigen statt eines "Verify Email"-Buttons. Das Magic-Link-Template wird so angepasst, dass es den OTP-Code prominent darstellt.

