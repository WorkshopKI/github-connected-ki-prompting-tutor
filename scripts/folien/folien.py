#!/usr/bin/env python3
"""Folien-Werkzeug für den Kurs „Mit KI arbeiten“.

Eine Quelle, zwei Ausgaben: Der Fahrplan (src/data/kurs/fahrplan.json) und der
schrittweise Aufbau (scripts/folien/aufbau.json) steuern sowohl die PPTX als auch
den Präsentationsmodus der App.

  bauen   PPTX → neue PPTX mit Fußzeile (Tag · Block · Als Nächstes), QR-Codes und
          Klick-Animationen für den schrittweisen Aufbau (Rückfallebene ohne App).
  export  PPTX → Folienbilder je Aufbauschritt (public/folien/*.webp), Folien-Daten
          (src/data/kurs/folien.json, Sprechernotizen in folien-notizen.json), optional PDF.

Voraussetzungen: Python 3.10+, `pip install python-pptx qrcode pillow`, LibreOffice
(`soffice`) und Poppler (`pdftoppm`) im PATH. Beispiel (im Repo-Ordner):

  python scripts/folien/folien.py bauen  --ein v26.pptx --aus v27.pptx
  python scripts/folien/folien.py export --pptx v27.pptx --pdf Kursfolien_v27.pdf

Spec: docs/specs/2026-11-22-kurs-fahrplan-live.md
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import io
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import qrcode
from lxml import etree
from PIL import Image
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import PP_PLACEHOLDER
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Emu, Inches, Pt

ROOT = Path(__file__).resolve().parents[2]
FAHRPLAN = ROOT / "src" / "data" / "kurs" / "fahrplan.json"
AUFBAU = ROOT / "scripts" / "folien" / "aufbau.json"
FOLIEN_JSON = ROOT / "src" / "data" / "kurs" / "folien.json"
NOTIZEN_JSON = ROOT / "src" / "data" / "kurs" / "folien-notizen.json"
BILDER = ROOT / "public" / "folien"

E = 914400  # EMU je Zoll
P = "http://schemas.openxmlformats.org/presentationml/2006/main"
A = "http://schemas.openxmlformats.org/drawingml/2006/main"
EIGEN = "FP "  # Namenspräfix der vom Skript angelegten Formen (bleiben immer sichtbar)
BREITE_PX = 1600


# ───────────── Hilfen ─────────────

def lade(pfad: Path) -> dict:
    return json.loads(pfad.read_text(encoding="utf-8"))


def titel_von(folie) -> str:
    for sh in folie.shapes:
        if sh.is_placeholder and sh.placeholder_format.type in (PP_PLACEHOLDER.TITLE, PP_PLACEHOLDER.CENTER_TITLE):
            return sh.text_frame.text.replace("\n", " ").replace("\x0b", " ").strip()
    return ""


def ist_statisch(sh) -> bool:
    """Formen, die nie Teil eines Aufbauschritts sind."""
    if sh.name.startswith(EIGEN):
        return True
    if sh.is_placeholder:
        typ = sh.placeholder_format.type
        if typ in (PP_PLACEHOLDER.SLIDE_NUMBER, PP_PLACEHOLDER.FOOTER, PP_PLACEHOLDER.DATE):
            return True
        if typ in (PP_PLACEHOLDER.TITLE, PP_PLACEHOLDER.CENTER_TITLE):
            return True
        if sh.top is not None and sh.top < 1.8 * E:  # Überzeile
            return True
    if sh.width is not None and sh.height is not None and (sh.width < 0.05 * E or sh.height < 0.05 * E):
        return True
    return False


def aufloesen(folie, schritte: list[list[str]]) -> list[dict]:
    """Selektoren → je Schritt {'ganz': {idx}, 'abs': {idx: {absatz}}}."""
    formen = list(folie.shapes)
    ergebnis = []
    vergeben: set[int] = set()
    for schritt in schritte:
        ganz: set[int] = set()
        absaetze: dict[int, set[int]] = {}
        for sel in schritt:
            art, _, rest = sel.partition(":")
            if art == "r":
                x0, y0, x1, y1 = (float(v) * E for v in rest.split(","))
                for i, sh in enumerate(formen):
                    if i in vergeben or ist_statisch(sh) or sh.left is None:
                        continue
                    mx, my = sh.left + sh.width / 2, sh.top + sh.height / 2
                    if x0 <= mx < x1 and y0 <= my < y1:
                        ganz.add(i)
            elif art == "i":
                ganz.update(int(v) for v in rest.split(","))
            elif art == "p":
                idx, _, bereich = rest.partition(":")
                von, _, bis = bereich.partition("-")
                absaetze.setdefault(int(idx), set()).update(range(int(von), int(bis or von) + 1))
            else:
                raise ValueError(f"Unbekannter Selektor {sel}")
        vergeben |= ganz
        ergebnis.append({"ganz": ganz, "abs": absaetze})
    return ergebnis


def aufbau_fuer(prs, aufbau: dict) -> dict[int, list[dict]]:
    """Foliennummer → aufgelöste Schritte; prüft den Titel."""
    out = {}
    for nr_s, eintrag in aufbau["folien"].items():
        nr = int(nr_s)
        folie = prs.slides[nr - 1]
        titel = titel_von(folie)
        if not titel.startswith(eintrag["titel"]):
            print(f"  Warnung: Folie {nr} heißt „{titel[:40]}“, erwartet „{eintrag['titel']}“", file=sys.stderr)
        out[nr] = aufloesen(folie, eintrag["schritte"])
    return out


def station_fuer(fp: dict, nr: int) -> dict:
    for st in fp["stationen"]:
        if st["folien"][0] <= nr <= st["folien"][1]:
            return st
    raise ValueError(f"Folie {nr} gehört zu keiner Station")


def block(fp: dict, bid: str) -> dict:
    return next(b for b in fp["bloecke"] if b["id"] == bid)


# ───────────── bauen ─────────────

def fusszeile_text(fp: dict, nr: int) -> str:
    st = station_fuer(fp, nr)
    b = block(fp, st["block"])
    je_tag = sum(1 for x in fp["bloecke"] if x["tag"] == b["tag"])
    text = f"Tag {b['tag']} · Block {b['nr']}/{je_tag} · {b['titel']}"
    reihen = fp["bloecke"]
    pos = reihen.index(b)
    if pos + 1 < len(reihen):
        n = reihen[pos + 1]
        vor = f"Tag {n['tag']}: " if n["tag"] != b["tag"] else ""
        text += f"   ›   Als Nächstes: {vor}{n['titel']}"
    return text


def ist_dunkel(folie) -> bool:
    name = folie.slide_layout.name
    return name.startswith("KW 1") or name.startswith("KW 2")


def textfeld(folie, name, x, y, w, h, text, groesse, farbe, rechts=False):
    tb = folie.shapes.add_textbox(Emu(int(x)), Emu(int(y)), Emu(int(w)), Emu(int(h)))
    tb.name = EIGEN + name
    tf = tb.text_frame
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.BOTTOM
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.RIGHT if rechts else PP_ALIGN.LEFT
    r = p.add_run()
    r.text = text
    r.font.size = Pt(groesse)
    r.font.color.rgb = farbe
    return tb


def qr_bild(url: str) -> io.BytesIO:
    q = qrcode.QRCode(border=1, box_size=10, error_correction=qrcode.constants.ERROR_CORRECT_M)
    q.add_data(url)
    q.make(fit=True)
    buf = io.BytesIO()
    q.make_image(fill_color="black", back_color="white").save(buf, format="PNG")
    buf.seek(0)
    return buf


def entferne_eigene(folie):
    for sh in list(folie.shapes):
        if sh.name.startswith(EIGEN):
            sh._element.getparent().remove(sh._element)


def animation_xml(folie, schritte: list[dict]) -> etree._Element | None:
    """Klick-Animationen (Einblenden) für Schritt 1 … n-1; Schritt 0 ist sofort sichtbar."""
    if len(schritte) < 2:
        return None
    formen = list(folie.shapes)
    ids = iter(range(3, 10_000))

    def q(tag):
        pre, _, name = tag.partition(":")
        return f"{{{P if pre == 'p' else A}}}{name}"

    def el(tag, parent=None, **attr):
        e = etree.SubElement(parent, q(tag)) if parent is not None else etree.Element(q(tag), nsmap={"p": P, "a": A})
        for k, v in attr.items():
            e.set(k, str(v))
        return e

    timing = el("p:timing")
    root = el("p:cTn", el("p:par", el("p:tnLst", timing)), id=1, dur="indefinite", restart="never", nodeType="tmRoot")
    seq = el("p:seq", el("p:childTnLst", root), concurrent=1, nextAc="seek")
    haupt = el("p:cTn", seq, id=2, dur="indefinite", nodeType="mainSeq")
    klicks = el("p:childTnLst", haupt)
    for liste, ev in (("p:prevCondLst", "onPrev"), ("p:nextCondLst", "onNext")):
        c = el("p:cond", el(liste, seq), evt=ev, delay=0)
        el("p:sldTgt", el("p:tgtEl", c))

    bld: dict[int, str] = {}
    for schritt in schritte[1:]:
        aussen = el("p:cTn", el("p:par", klicks), id=next(ids), fill="hold")
        el("p:cond", el("p:stCondLst", aussen), delay="indefinite")
        innen = el("p:cTn", el("p:par", el("p:childTnLst", aussen)), id=next(ids), fill="hold")
        el("p:cond", el("p:stCondLst", innen), delay=0)
        wirkungen = el("p:childTnLst", innen)
        ziele = [(i, None) for i in sorted(schritt["ganz"])]
        for i, abs_ in sorted(schritt["abs"].items()):
            for a in sorted(abs_):
                ziele.append((i, a))
        for n, (i, absatz) in enumerate(ziele):
            sh = formen[i]
            spid = sh.shape_id
            eff = el("p:cTn", el("p:par", wirkungen), id=next(ids), presetID=10, presetClass="entr", presetSubtype=0,
                     fill="hold", grpId=0, nodeType="clickEffect" if n == 0 else "withEffect")
            el("p:cond", el("p:stCondLst", eff), delay=0)
            kinder = el("p:childTnLst", eff)

            def ziel(parent):
                sp = el("p:spTgt", el("p:tgtEl", parent), spid=spid)
                if absatz is not None:
                    el("p:pRg", el("p:txEl", sp), st=absatz, end=absatz)

            setz = el("p:cBhvr", el("p:set", kinder))
            el("p:cond", el("p:stCondLst", el("p:cTn", setz, id=next(ids), dur=1, fill="hold")), delay=0)
            ziel(setz)
            el("p:attrName", el("p:attrNameLst", setz)).text = "style.visibility"
            el("p:strVal", el("p:to", setz.getparent()), val="visible")
            fade = el("p:cBhvr", el("p:animEffect", kinder, transition="in", filter="fade"))
            el("p:cTn", fade, id=next(ids), dur=300)
            ziel(fade)
            if sh.shape_type is not None and sh._element.tag == q("p:sp"):
                bld[spid] = "p" if absatz is not None else bld.get(spid, "ganz")
    if bld:
        liste = el("p:bldLst", timing)
        for spid, art in bld.items():
            if art == "p":
                el("p:bldP", liste, spid=spid, grpId=0, build="p")
            else:
                el("p:bldP", liste, spid=spid, grpId=0, animBg=1)
    return timing


def bauen(args):
    fp, aufbau = lade(FAHRPLAN), lade(AUFBAU)
    prs = Presentation(args.ein)
    schritte = aufbau_fuer(prs, aufbau)
    basis = args.basis_url.rstrip("/")
    host = basis.split("://", 1)[-1]
    for nr, folie in enumerate(prs.slides, 1):
        entferne_eigene(folie)
        alt = folie.element.find(f"{{{P}}}timing")
        if alt is not None:
            folie.element.remove(alt)
        dunkel = ist_dunkel(folie)
        grau = RGBColor(0xC9, 0xC2, 0xB8) if dunkel else RGBColor(0x76, 0x6E, 0x64)
        if nr > 1:
            textfeld(folie, "Fahrplan", 3.75 * E, 6.9 * E, 7.8 * E, 0.33 * E, fusszeile_text(fp, nr), 10, grau)
        if nr in fp["qr"]:
            pfad = fp["links"].get(str(nr))
            ziel = f"{basis}/live" if pfad == "/live" else f"{basis}/f/{nr}"
            bild = folie.shapes.add_picture(qr_bild(ziel), Emu(int(11.9 * E)), Emu(int(0.3 * E)), Emu(int(0.85 * E)), Emu(int(0.85 * E)))
            bild.name = EIGEN + "QR"
            anzeige = f"{host}/live" if pfad == "/live" else f"{host}/f/{nr}"
            textfeld(folie, "QR-Text", 10.25 * E, 1.2 * E, 2.5 * E, 0.25 * E, anzeige, 8, grau, rechts=True)
        if nr in schritte:
            t = animation_xml(folie, schritte[nr])
            if t is not None:
                ext = folie.element.find(f"{{{P}}}extLst")
                if ext is not None:
                    ext.addprevious(t)
                else:
                    folie.element.append(t)
    prs.save(args.aus)
    n = sum(len(s) - 1 for s in schritte.values())
    print(f"gebaut: {args.aus} · {len(prs.slides)} Folien · {len(schritte)} mit Aufbau · {n} Klicks")


# ───────────── export ─────────────

def verstecke(prs, schritte: dict[int, list[dict]], stufe: int):
    """Entfernt alles, was nach Schritt `stufe` kommt (für die Bilder)."""
    for nr, liste in schritte.items():
        folie = prs.slides[nr - 1]
        formen = list(folie.shapes)
        weg_formen, weg_abs = [], []
        for s in liste[stufe + 1:]:
            weg_formen += [formen[i]._element for i in s["ganz"]]
            for i, abs_ in s["abs"].items():
                ps = formen[i].text_frame.paragraphs
                weg_abs += [ps[a]._p for a in abs_]
        for e in weg_abs:
            e.getparent().remove(e)
        for e in weg_formen:
            if e.getparent() is not None:
                e.getparent().remove(e)
        t = folie.element.find(f"{{{P}}}timing")
        if t is not None:
            folie.element.remove(t)


def soffice_pdf(pptx: Path, ziel_dir: Path) -> Path:
    exe = shutil.which("soffice") or shutil.which("soffice.exe") or shutil.which("libreoffice")
    if not exe:
        sys.exit("LibreOffice (soffice) nicht gefunden.")
    subprocess.run([exe, "--headless", "--convert-to", "pdf", "--outdir", str(ziel_dir), str(pptx)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return ziel_dir / (pptx.stem + ".pdf")


def seiten_als_webp(pdf: Path, seiten: dict[int, str], tmp: Path):
    for nr, name in seiten.items():
        stamm = tmp / f"s{nr}"
        subprocess.run(["pdftoppm", "-f", str(nr), "-l", str(nr), "-singlefile", "-scale-to-x", str(BREITE_PX),
                        "-scale-to-y", "-1", "-png", str(pdf), str(stamm)], check=True)
        Image.open(f"{stamm}.png").convert("RGB").save(BILDER / name, "WEBP", quality=82, method=6)


def export(args):
    aufbau = lade(AUFBAU)
    pptx = Path(args.pptx).resolve()
    prs = Presentation(pptx)
    schritte = aufbau_fuer(prs, aufbau)
    anzahl = {nr: (len(schritte[nr]) if nr in schritte else 1) for nr in range(1, len(prs.slides) + 1)}
    BILDER.mkdir(parents=True, exist_ok=True)
    for alt in BILDER.glob("f*.webp"):
        alt.unlink()
    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        for stufe in range(max(anzahl.values())):
            kopie = Presentation(pptx)
            verstecke(kopie, aufbau_fuer(kopie, aufbau), stufe)
            datei = tmp / f"stufe{stufe}.pptx"
            kopie.save(datei)
            pdf = soffice_pdf(datei, tmp)
            seiten = {nr: f"f{nr:02d}-{stufe}.webp" for nr, n in anzahl.items() if stufe < n}
            seiten_als_webp(pdf, seiten, tmp)
            print(f"  Stufe {stufe}: {len(seiten)} Bilder")
        if args.pdf:
            ganz = soffice_pdf(pptx, tmp)
            shutil.copy(ganz, args.pdf)
            print(f"  PDF: {args.pdf}")

    folien, notizen = [], {}
    for nr, folie in enumerate(prs.slides, 1):
        ueber = ""
        for sh in folie.shapes:
            if sh.is_placeholder and sh.placeholder_format.type == PP_PLACEHOLDER.BODY and sh.top is not None \
                    and sh.top < 2.7 * E and sh.has_text_frame and sh.text_frame.text.isupper():
                ueber = sh.text_frame.text.strip()
                break
        titel = titel_von(folie)
        notiz = folie.notes_slide.notes_text_frame.text.strip() if folie.has_notes_slide else ""
        folien.append({"nr": nr, "ueberzeile": ueber, "titel": titel, "schritte": anzahl[nr]})
        notizen[str(nr)] = notiz
    version = hashlib.sha1(pptx.read_bytes()).hexdigest()[:8]
    daten = {"_hinweis": "Generiert von scripts/folien/folien.py export — nicht von Hand ändern.",
             "quelle": pptx.name, "version": version, "folien": folien}
    FOLIEN_JSON.write_text(json.dumps(daten, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    NOTIZEN_JSON.write_text(json.dumps({"_hinweis": daten["_hinweis"], "notizen": notizen}, ensure_ascii=False, indent=1) + "\n",
                            encoding="utf-8")
    print(f"export: {sum(anzahl.values())} Bilder in {BILDER.relative_to(ROOT)}, Daten in {FOLIEN_JSON.relative_to(ROOT)}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="befehl", required=True)
    b = sub.add_parser("bauen", help="Fußzeile, QR-Codes und Klick-Animationen in die PPTX schreiben")
    b.add_argument("--ein", required=True)
    b.add_argument("--aus", required=True)
    b.add_argument("--basis-url", default="https://prompting-studio.kilab.org", help="Adresse der Lern-App für die QR-Codes")
    b.set_defaults(f=bauen)
    x = sub.add_parser("export", help="Folienbilder je Aufbauschritt und folien.json erzeugen")
    x.add_argument("--pptx", required=True)
    x.add_argument("--pdf", help="zusätzlich das vollständige PDF hierhin schreiben")
    x.set_defaults(f=export)
    args = ap.parse_args()
    args.f(args)


if __name__ == "__main__":
    main()
