

## Plan: User-Dropdown-Menü in der Navigation

Die aktuelle `UserMenu`-Komponente zeigt E-Mail und Abmelden-Link inline an. Stattdessen wird ein Dropdown-Menü unter dem User-Icon erstellt.

### Änderungen

**`src/components/UserMenu.tsx`** — Komplett umbauen:
- Radix `DropdownMenu` verwenden (bereits als `src/components/ui/dropdown-menu.tsx` vorhanden)
- Trigger: User-Icon (Avatar-Kreis mit Initialen oder generisches User-Icon)
- Menü-Inhalt:
  - Header: E-Mail / Gastname + Kurs-ID
  - Separator
  - Platzhalter für "Credits" (OpenRouter-Budget, vorerst als deaktivierter Eintrag mit Coins-Icon)
  - "E-Mail hinterlegen" (nur für Gäste)
  - "Teilnehmer" (nur für Admins)
  - Separator
  - "Abmelden"
- Nicht-eingeloggt: weiterhin "Anmelden →" Button

### Technische Details

- Import `DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel` aus `@/components/ui/dropdown-menu`
- Trigger-Button: runder Avatar-Style-Button mit `User`-Icon, passend zum bestehenden Design (orange primary)
- Keine weiteren Dateien betroffen — Navigation.tsx bleibt unverändert

