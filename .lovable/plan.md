

## Plan: Admin-Rolle für UserKI-Eins@outlook.de zuweisen

### Problem
Der User hat keine Admin-Rolle in der `user_roles`-Tabelle. Dadurch wird `profile.is_admin` als `false` geladen und der "Teilnehmer"-Menüeintrag im Dropdown nicht angezeigt.

### Loesung
Eine Datenbank-Migration ausfuehren, die einen Eintrag in `user_roles` fuer die bekannte User-ID einfuegt:

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('27b38beb-b70c-42e8-af41-ac1557d3587d', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### Ergebnis
Nach der Migration und einem erneuten Login (oder Seiten-Refresh) wird:
- `profile.is_admin = true` geladen
- Der "Teilnehmer"-Link im User-Dropdown sichtbar
- Zugriff auf `/admin/teilnehmer` moeglich

Keine Code-Aenderungen noetig -- nur die Datenbank-Migration.

