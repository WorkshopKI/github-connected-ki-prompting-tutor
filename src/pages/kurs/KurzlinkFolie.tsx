import { Navigate, useParams } from "react-router-dom";
import { linkFuerFolie } from "@/data/kurs/fahrplan";
import { FOLIEN_ANZAHL } from "@/data/kurs/folien";
import { ROUTES } from "@/lib/constants";

/**
 * Kurzlink /f/:nr aus den QR-Codes der Folien: führt zur passenden Seite in der App.
 * Ändert sich eine Route, bleibt der gedruckte QR-Code gültig; nur fahrplan.json anpassen.
 */
export default function KurzlinkFolie() {
  const { nr } = useParams();
  const n = Number(nr);
  if (!Number.isInteger(n) || n < 1 || n > FOLIEN_ANZAHL) return <Navigate to={ROUTES.KURS_FOLIEN} replace />;
  return <Navigate to={linkFuerFolie(n)} replace />;
}
