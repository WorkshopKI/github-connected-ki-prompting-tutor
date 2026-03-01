

## Plan: OTP-Eingabe auf der Profilseite fuer Gast-Upgrade

Der OTP-Code ist 8-stellig (wie auf der Login-Seite). Nach Klick auf "Verknuepfen" fehlt ein Eingabefeld fuer den Code.

### Aenderungen in `src/pages/Profile.tsx`

1. **Neuen State** `upgradeStep`: `"email"` oder `"otp"` (default: `"email"`)
2. **Nach erfolgreichem E-Mail-Versand**: `upgradeStep` auf `"otp"` setzen
3. **OTP-Schritt rendern** (wenn `upgradeStep === "otp"`):
   - Hinweistext: "Code wurde an {email} gesendet"
   - `InputOTP` mit `maxLength={8}` und 8 Slots (gleiche Komponente wie Login-Seite)
   - "Bestaetigen"-Button → ruft `verifyOTP(upgradeEmail, code)` auf
   - Bei Erfolg: Toast, `refreshProfile()`, Banner verschwindet automatisch
   - "Neuen Code senden"-Link + "Andere E-Mail"-Link zum Zuruecksetzen
4. **Import** `InputOTP, InputOTPGroup, InputOTPSlot` aus `@/components/ui/input-otp` und `verifyOTP` aus AuthContext

Keine Datenbank-Aenderungen noetig.

