#!/usr/bin/env python3
"""Browser smoke test: every playable build must boot, render, and survive a few seconds of input
without a page error.

The kernel smoke tests (node smoke_test.mjs) never load index.html, so a frontend crash such as a
ReferenceError inside drawWorld passes them silently. This catches that class of bug.

usage:
  python tools/browser_smoke.py [ROOT] [--shots DIR] [--only SUBSTR] [--viewport WxH]

ROOT defaults to the repo root (or a built _site/ dir). Every */index.html one level down is a build.
Needs `pip install playwright` and `python -m playwright install chromium`; set CHROME_PATH to use
an existing Chromium binary instead.
"""
import argparse
import functools
import http.server
import os
import sys
import threading
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

CANVAS_PROBE = """() => {
  const c = [...document.querySelectorAll('canvas')].sort((a, b) => b.width * b.height - a.width * a.height)[0];
  if (!c || !c.width || !c.height) return {canvas: false};
  const o = document.createElement('canvas'); o.width = 48; o.height = 48;
  const g = o.getContext('2d'); g.drawImage(c, 0, 0, 48, 48);
  const d = g.getImageData(0, 0, 48, 48).data, seen = new Set();
  for (let i = 0; i < d.length; i += 4) seen.add((d[i] >> 3) << 10 | (d[i + 1] >> 3) << 5 | (d[i + 2] >> 3));
  return {canvas: true, id: c.id, colors: seen.size};
}"""


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    # Windows' registry-backed mimetype table commonly reports .mjs as text/plain. Browsers reject
    # module scripts with that type, so make the static test server match GitHub Pages explicitly.
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript",
        ".mjs": "text/javascript",
    }

    def log_message(self, *args):
        pass


def serve(root):
    handler = functools.partial(QuietHandler, directory=str(root))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def play(page, w, h, seconds):
    page.mouse.click(w // 2, h // 2)  # focus gate / start
    for btn in ("#begin", "#start", "button:has-text('Begin')"):
        el = page.query_selector(btn)
        if el and el.is_visible():
            el.click()
            break
    end = time.time() + seconds
    keys = ["s", "d", "f", "a", "w"]
    i = 0
    while time.time() < end:
        k = keys[i % len(keys)]
        page.keyboard.down(k)
        time.sleep(0.4)
        page.keyboard.up(k)
        i += 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("root", nargs="?", default=str(Path(__file__).resolve().parent.parent))
    ap.add_argument("--shots")
    ap.add_argument("--only")
    ap.add_argument("--viewport", default="1280x800")
    ap.add_argument("--seconds", type=float, default=4.0)
    a = ap.parse_args()
    root = Path(a.root).resolve()
    w, h = map(int, a.viewport.split("x"))
    builds = sorted(p.parent.name for p in root.glob("*/index.html"))
    if a.only:
        builds = [b for b in builds if a.only in b]
    if not builds:
        sys.exit(f"no */index.html builds under {root}")
    if a.shots:
        Path(a.shots).mkdir(parents=True, exist_ok=True)

    srv = serve(root)
    base = f"http://127.0.0.1:{srv.server_address[1]}"
    failures = []
    with sync_playwright() as p:
        kw = {"headless": True, "args": ["--no-sandbox"]}
        if os.environ.get("CHROME_PATH"):
            kw["executable_path"] = os.environ["CHROME_PATH"]
        browser = p.chromium.launch(**kw)
        for b in builds:
            page = browser.new_page(viewport={"width": w, "height": h})
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)[:200]))
            page.on(
                "console",
                lambda m: errors.append(f"console error: {m.text[:200]}")
                if m.type == "error" and not m.text.startswith("Failed to load resource:")
                else None,
            )
            page.on("requestfailed", lambda r: errors.append(f"request failed: {r.url}"))
            page.goto(f"{base}/{b}/", wait_until="load", timeout=60000)
            time.sleep(1.5)
            play(page, w, h, a.seconds)
            probe = page.evaluate(CANVAS_PROBE)
            if a.shots:
                page.screenshot(path=str(Path(a.shots) / f"{b}.png"))
            page.close()
            # Mostly-uniform canvas (only the background drew) means the render loop died.
            blank = probe.get("canvas") and probe["colors"] < 4
            ok = not errors and not blank
            status = "ok  " if ok else "FAIL"
            print(f"{status} {b:42s} canvas={probe.get('id', '-')} colors={probe.get('colors', '-')}")
            for e in errors[:3]:
                print(f"       {e}")
            if blank:
                print("       canvas is blank")
            if not ok:
                failures.append(b)
        browser.close()
    srv.shutdown()
    if failures:
        sys.exit(f"{len(failures)} build(s) failed: {', '.join(failures)}")
    print(f"BROWSER_SMOKE_OK {len(builds)} builds")


if __name__ == "__main__":
    main()
