

## Problem

In der `PromptBrowser`-Sidebar (Playground) wechselt der Abteilungsfilter-Dropdown zwar den Scope korrekt, aber der aktive Tab ("Alle" / "Abteilung X" / "Skills") wird nicht automatisch auf den Abteilungs-Tab umgeschaltet. Der User muss manuell den Tab wechseln.

## Lösung

Den bestehenden `useEffect` in `PromptBrowser.tsx` erweitern: Wenn ein Department-Scope ausgewählt wird (`isDepartment === true`), soll automatisch der `"dept"`-Tab aktiv werden. Wird auf "Privatgebrauch" oder "Gesamte Organisation" gewechselt, bleibt `"all"` aktiv.

## Technische Änderung

**`src/components/playground/PromptBrowser.tsx`** (Zeilen 43-46):

Den bestehenden `useEffect` erweitern:

```typescript
useEffect(() => {
  if (isDepartment) {
    setActiveTab("dept");
  } else if (activeTab === "dept") {
    setActiveTab("all");
  }
}, [scope, isDepartment]);
```

Damit wird bei jeder Scope-Änderung geprüft: Ist es eine Abteilung → zeige den Abteilungs-Tab. Ist es keine Abteilung und der dept-Tab war aktiv → wechsle auf "Alle".

Eine einzelne Datei, eine minimale Änderung.

