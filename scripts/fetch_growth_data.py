#!/usr/bin/env python3
"""Generate lib/data/growth.ts from WHO Child Growth Standards z-score tables.

Downloads the WHO LMS (z-score) tables published by the World Health
Organization (https://www.who.int/tools/child-growth-standards) and emits a
compact TypeScript data module used by the anthropometry engine.

The WHO Child Growth Standards are published by WHO for free use; this script
reproduces only the LMS parameter values (facts) from the official tables.

Usage:
    python3 scripts/fetch_growth_data.py [outfile]
"""
from __future__ import annotations

import re
import sys
import urllib.request
import zipfile
from pathlib import Path

BASE = "https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators"

FILES = [
    # (remote path, local name, indicator, sex, unit, range label)
    ("weight-for-age/wfa_boys_0-to-5-years_zscores.xlsx", "wfa_boys_0-5.xlsx", "weight-for-age", "male", "month", "0-60 months"),
    ("weight-for-age/wfa_girls_0-to-5-years_zscores.xlsx", "wfa_girls_0-5.xlsx", "weight-for-age", "female", "month", "0-60 months"),
    ("length-height-for-age/lhfa_boys_0-to-2-years_zscores.xlsx", "lhfa_boys_0-2.xlsx", "length-for-age", "male", "month", "0-24 months"),
    ("length-height-for-age/lhfa_boys_2-to-5-years_zscores.xlsx", "lhfa_boys_2-5.xlsx", "height-for-age", "male", "month", "24-60 months"),
    ("length-height-for-age/lhfa_girls_0-to-2-years_zscores.xlsx", "lhfa_girls_0-2.xlsx", "length-for-age", "female", "month", "0-24 months"),
    ("length-height-for-age/lhfa_girls_2-to-5-years_zscores.xlsx", "lhfa_girls_2-5.xlsx", "height-for-age", "female", "month", "24-60 months"),
    ("body-mass-index-for-age/bmi_boys_0-to-2-years_zcores.xlsx", "bmi_boys_0-2.xlsx", "bmi-for-age", "male", "month", "0-24 months"),
    ("body-mass-index-for-age/bmi_boys_2-to-5-years_zscores.xlsx", "bmi_boys_2-5.xlsx", "bmi-for-age", "male", "month", "24-60 months"),
    ("body-mass-index-for-age/bmi_girls_0-to-2-years_zscores.xlsx", "bmi_girls_0-2.xlsx", "bmi-for-age", "female", "month", "0-24 months"),
    ("body-mass-index-for-age/bmi_girls_2-to-5-years_zscores.xlsx", "bmi_girls_2-5.xlsx", "bmi-for-age", "female", "month", "24-60 months"),
    ("weight-for-length-height/wfl_boys_0-to-2-years_zscores.xlsx", "wfl_boys.xlsx", "weight-for-length", "male", "cm", "45-110 cm"),
    ("weight-for-length-height/wfl_girls_0-to-2-years_zscores.xlsx", "wfl_girls.xlsx", "weight-for-length", "female", "cm", "45-110 cm"),
    ("weight-for-length-height/wfh_boys_2-to-5-years_zscores.xlsx", "wfh_boys.xlsx", "weight-for-height", "male", "cm", "65-120 cm"),
    ("weight-for-length-height/wfh_girls_2-to-5-years_zscores.xlsx", "wfh_girls.xlsx", "weight-for-height", "female", "cm", "65-120 cm"),
    ("head-circumference-for-age/hcfa-boys-0-5-zscores.xlsx", "hcfa_boys_0-5.xlsx", "head-circumference-for-age", "male", "month", "0-60 months"),
    ("head-circumference-for-age/hcfa-girls-0-5-zscores.xlsx", "hcfa_girls_0-5.xlsx", "head-circumference-for-age", "female", "month", "0-60 months"),
]


def parse_xlsx(path: Path):
    """Return list of rows (list of str) from the first worksheet."""
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
        sheet = next(n for n in names if re.match(r"xl/worksheets/sheet\d+\.xml$", n))
        xml = z.read(sheet).decode("utf-8", "ignore")
        shared = []
        if "xl/sharedStrings.xml" in names:
            ss = z.read("xl/sharedStrings.xml").decode("utf-8", "ignore")
            shared = re.findall(r"<t[^>]*>(.*?)</t>", ss)
        # map shared string indices
        def unescape(s: str) -> str:
            return s.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")

        rows_out = []
        for row in re.findall(r"<row[^>]*>(.*?)</row>", xml):
            cells = []
            for c in re.findall(r"<c\b[^>]*>.*?</c>|<c\b[^>]*/>", row):
                attrs = c[: c.find(">")]
                body = c[c.find(">") + 1 :]
                typ = re.search(r't="(\w+)"', attrs)
                vm = re.search(r"<v>(.*?)</v>", body)
                val = vm.group(1) if vm else None
                if val is None:
                    cells.append("")
                elif typ and typ.group(1) == "s":
                    cells.append(unescape(shared[int(val)]))
                else:
                    cells.append(val)
            rows_out.append(cells)
        return rows_out


def main() -> int:
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent.parent / "lib/data/growth.ts"
    out.parent.mkdir(parents=True, exist_ok=True)
    tmpdir = Path(__file__).parent / ".who-cache"
    tmpdir.mkdir(exist_ok=True)

    tables = []
    for remote, local, indicator, sex, unit, rng in FILES:
        fp = tmpdir / local
        if not fp.exists():
            print(f"downloading {remote}")
            req = urllib.request.Request(
                f"{BASE}/{remote}",
                headers={"User-Agent": "Mozilla/5.0 (growth-data-fetcher; clinical reference app)"},
            )
            with urllib.request.urlopen(req, timeout=120) as resp, open(fp, "wb") as fh:
                fh.write(resp.read())
        rows = parse_xlsx(fp)
        if not rows:
            raise SystemExit(f"no rows in {local}")
        # All WHO z-score tables share the layout: col 0 = month/length/height,
        # col 1 = L, col 2 = M, col 3 = S. A leading header row (strings) is skipped.
        data = []
        for r in rows:
            if len(r) < 4:
                continue
            try:
                x = float(r[0])
                l = float(r[1])
                m = float(r[2])
                s = float(r[3])
            except ValueError:
                continue
            data.append((round(x, 3), round(l, 8), round(m, 8), round(s, 8)))
        if not data:
            raise SystemExit(f"no numeric data in {local}")
        tables.append({"indicator": indicator, "sex": sex, "unit": unit, "range": rng, "data": data})
        print(f"{local}: {len(data)} rows")

    lines = [
        "// Generated by scripts/fetch_growth_data.py — do not edit by hand.",
        "// Source: WHO Child Growth Standards, z-score (LMS) tables.",
        "// https://www.who.int/tools/child-growth-standards",
        "// LMS = Box-Cox power (L), median (M), coefficient of variation (S).",
        "export interface GrowthTable {",
        "  indicator: string;",
        '  sex: "male" | "female";',
        '  unit: "month" | "cm";',
        "  range: string;",
        "  /** [x, L, M, S]; x = age in months or length/height in cm */",
        "  data: [number, number, number, number][];",
        "}",
        "",
        "export const WHO_GROWTH_TABLES: GrowthTable[] = [",
    ]
    for t in tables:
        lines.append("  {")
        lines.append(f'    indicator: "{t["indicator"]}",')
        lines.append(f'    sex: "{t["sex"]}",')
        lines.append(f'    unit: "{t["unit"]}",')
        lines.append(f'    range: "{t["range"]}",')
        rows = ", ".join(f"[{x},{l},{m},{s}]" for x, l, m, s in t["data"])
        lines.append(f"    data: [{rows}],")
        lines.append("  },")
    lines.append("];")
    out.write_text("\n".join(lines) + "\n")
    print(f"wrote {out} ({len(tables)} tables)")
    return 0


if __name__ == "__main__":
    sys.exit(main())