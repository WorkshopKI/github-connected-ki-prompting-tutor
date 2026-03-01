

## Problem

Das UserMenu zeigt den Link zur Profilseite (`/profil`) nur fuer Gast-Nutzer an (Zeile 63-68: `{isGuest && ...}`). Fuer angemeldete E-Mail-Nutzer fehlt der Menue-Eintrag komplett.

## Loesung

In `src/components/UserMenu.tsx` einen "Mein Profil"-Eintrag hinzufuegen, der fuer **alle** angemeldeten Nutzer sichtbar ist (nicht nur Gaeste). Der bestehende Gast-spezifische "E-Mail hinterlegen"-Eintrag kann entfernt werden, da die Profilseite diese Funktion bereits enthaelt.

**Aenderung in `src/components/UserMenu.tsx`:**
- Nach dem Credits-Eintrag einen neuen Menue-Eintrag "Mein Profil" mit User-Icon einfuegen, der zu `/profil` navigiert
- Den Gast-exklusiven "E-Mail hinterlegen"-Eintrag entfernen (redundant, da auf der Profilseite vorhanden)

