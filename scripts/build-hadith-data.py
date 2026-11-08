#!/usr/bin/env python3
"""
Build src/data/hadith.json from the official HadeethEnc.com Arabic data.

Source: HadeethEnc.com (موسوعة الأحاديث النبوية) — official Excel export plus the
official API dump, as kept unchanged in https://github.com/Younes12345698/hadeethenc-mirror

Rules (do not loosen without a scholar's review):
  * grade must be exactly "صحيح"
  * attribution must be "متفق عليه" / "رواه البخاري" / "رواه مسلم"
  * the hadith's reference list must actually cite صحيح البخاري / صحيح مسلم to match
  * text fields are copied exactly (HadeethEnc terms: no editing, adding or deleting)

Usage:
  python3 scripts/build-hadith-data.py <path-to-hadeethenc-mirror>
"""
import json
import sys
from pathlib import Path

import openpyxl  # pip install openpyxl

PER_CATEGORY = 40

# Chip name -> HadeethEnc category id. Order = priority when a hadith fits several.
CATEGORIES = [
    ("الأذكار والأدعية", "268"),
    ("الصلاة", "134"),
    ("القرآن", "12"),
    ("الإيمان", "59"),
    ("الأخلاق", "266"),
    ("الآداب", "267"),
    ("الرقائق", "269"),
    ("الفضائل", "265"),
]

# Well-known hadiths we always want (matched inside the hadith text), if they pass the rules.
MUST_INCLUDE = [
    "إنما الأعمال بالنيات",
    "فليقل خيرا أو ليصمت",
    "المؤمن القوي خير",
    "الدين النصيحة",
    "لا يؤمن أحدكم حتى يحب لأخيه",
    "عجبا لأمر المؤمن",
    "البر حسن الخلق",
    "كلمتان خفيفتان على اللسان",
    "من سلك طريقا يلتمس فيه علما",
    "إن الله جميل يحب الجمال",
]

# Famous hadiths filed under categories we don't show: id -> chip (still must pass the rules).
FORCE_IDS = {"5493": "الإيمان", "4309": "الأخلاق", "4717": "الإيمان"}

SAHIHAIN = {"متفق عليه", "رواه البخاري", "رواه مسلم"}


def strip_marks(s: str) -> str:
    return "".join(ch for ch in s if not ("ً" <= ch <= "ٟ" or ch == "ٰ"))


def main(mirror: Path) -> None:
    xlsx = next((mirror / "source" / "excel").glob("HadeethEnc.com_ar-v*.xlsx"))
    wb = openpyxl.load_workbook(xlsx, read_only=True)
    rows = list(wb.active.iter_rows(values_only=True))
    version_block = rows[0][0]
    version = xlsx.stem.split("-v")[-1]
    excel = {str(r[0]): r for r in rows[2:]}

    api = json.loads((mirror / "source" / "api" / "hadeeths-ar.json").read_text("utf-8"))
    cats = {c["id"]: c for c in json.loads((mirror / "source" / "api" / "categories" / "ar.json").read_text("utf-8"))}

    def ancestors(cid):
        out = []
        while cid:
            out.append(cid)
            cid = cats[cid]["parent_id"]
        return out

    def chip_for(h):
        if h["id"] in FORCE_IDS:
            return FORCE_IDS[h["id"]]
        anc = {a for cid in h["categories"] for a in ancestors(cid)}
        for name, cid in CATEGORIES:
            if cid in anc:
                return name
        return None

    def passes(h):
        if h["grade"] != "صحيح" or h["attribution"] not in SAHIHAIN:
            return False
        ref = h.get("reference") or ""
        need = {"متفق عليه": ["صحيح البخاري", "صحيح مسلم"], "رواه البخاري": ["صحيح البخاري"], "رواه مسلم": ["صحيح مسلم"]}
        if not all(n in ref for n in need[h["attribution"]]):
            return False
        # Text must be identical to the official Excel row.
        r = excel.get(h["id"])
        return bool(r) and (r[2] or "").strip() == (h["hadeeth"] or "").strip()

    pool = {}
    for h in api:
        if not passes(h):
            continue
        chip = chip_for(h)
        if chip:
            pool.setdefault(chip, []).append(h)

    chosen = {}
    used_titles = set()
    for name, _ in CATEGORIES:
        items = pool.get(name, [])
        forced = [h for h in items if h["id"] in FORCE_IDS or any(m in strip_marks(h["hadeeth"]) for m in MUST_INCLUDE)]

        def rank(h):
            ref = h.get("reference") or ""
            # Prefer hadiths an-Nawawi chose for الأربعون النووية / رياض الصالحين, then shorter ones.
            arbain = "الأربعون النووية" in ref or "الأربعين النووية" in ref
            return (not arbain, "رياض الصالحين" not in ref, len(h["hadeeth"]))

        rest = sorted((h for h in items if h not in forced), key=rank)
        picked = []
        for h in forced + rest:
            key = strip_marks(h["title"])[:40]
            if key in used_titles:
                continue  # the encyclopedia sometimes lists one hadith twice
            used_titles.add(key)
            picked.append(h)
            if len(picked) == PER_CATEGORY:
                break
        chosen[name] = picked

    out = []
    seen = set()
    for name, _ in CATEGORIES:
        for h in chosen[name]:
            if h["id"] in seen:
                continue
            seen.add(h["id"])
            out.append({
                "id": h["id"],
                "category": name,
                "title": h["title"],
                "text": h["hadeeth"],
                "attribution": h["attribution"],
                "grade": h["grade"],
                "explanation": h.get("explanation") or "",
                "benefits": [b for b in (h.get("hints") or []) if b and b.strip(". ")],
                "words": [w for w in (h.get("words_meanings") or []) if (w.get("word") or "").strip() and (w.get("meaning") or "").strip(". ")],
                "link": f"https://hadeethenc.com/ar/browse/hadith/{h['id']}",
            })

    data = {
        "source": {
            "name": "موسوعة الأحاديث النبوية",
            "site": "HadeethEnc.com",
            "url": "https://hadeethenc.com/ar",
            "version": version,
            "versionBlock": version_block,
        },
        "categories": [name for name, _ in CATEGORIES],
        "hadiths": out,
    }
    dest = Path(__file__).resolve().parent.parent / "src" / "data" / "hadith.json"
    dest.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), "utf-8")
    print(f"{len(out)} hadiths -> {dest}")
    for name, _ in CATEGORIES:
        print(f"  {name}: {sum(1 for h in out if h['category'] == name)}")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
