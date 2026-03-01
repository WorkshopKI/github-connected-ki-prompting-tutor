

## Problem

Die Navigation-Links (Home, Stufen, ACTA etc.) nutzen `scrollToSection`, das nur `document.getElementById` + `scrollTo` macht. Auf der Profilseite existieren diese Elemente nicht — es passiert nichts.

## Loesung

In `scrollToSection` in `Navigation.tsx` pruefen, ob wir auf `/` sind. Falls nicht, zuerst per `navigate` zur Startseite navigieren und den Hash als Parameter uebergeben, damit nach dem Laden gescrollt wird.

### Aenderungen

**`src/components/Navigation.tsx`**:
- `useNavigate` und `useLocation` aus `react-router-dom` importieren
- In `scrollToSection`: Wenn `location.pathname !== "/"`, per `navigate("/#" + id)` weiterleiten
- Sonst wie bisher scrollen

**`src/pages/Index.tsx`**:
- Beim Mount pruefen ob `location.hash` gesetzt ist (z.B. `#acta`)
- Falls ja, nach kurzem Timeout zum entsprechenden Element scrollen

