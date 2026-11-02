#!/usr/bin/env python3
"""CI page check: each playable page of the built Pages site must load clean and keep drawing.

Loads the site index, classic/, mecha-fish/ and immune/ from a built site dir (default _site), plays
for --seconds (default 10) with key input, and fails on any console error / page error / failed
request, or on a frozen canvas (the same pixels at every one-second sample).

usage: python tools/page_check.py [SITE_DIR] [--seconds N]
Needs `pip install playwright` + `python -m playwright install chromium` (or CHROME_PATH).
"""
import argparse
import os
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

from browser_smoke import serve

PAGES = ["", "classic/", "mecha-fish/", "immune/"]

# Cheap fingerprint of the largest canvas; None when the page has no canvas.
FINGERPRINT = """() => {
  const c = [...document.querySelectorAll('canvas')].sort((a, b) => b.width * b.height - a.width * a.height)[0];
  if (!c || !c.width || !c.height) return null;
  const o = document.createElement('canvas'); o.width = 64; o.height = 64;
  const g = o.getContext('2d'); g.drawImage(c, 0, 0, 64, 64);
  const d = g.getImageData(0, 0, 64, 64).data;
  let h = 2166136261;
  for (let i = 0; i < d.length; i++) h = Math.imul(h ^ d[i], 16777619);
  return h >>> 0;
}"""


def check(browser, base, path, seconds):
    errors = []
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    page.on("pageerror", lambda e: errors.append(f"page error: {str(e)[:200]}"))
    page.on("requestfailed", lambda r: errors.append(f"request failed: {r.url}"))
    page.on(
        "console",
        lambda m: errors.append(f"console error: {m.text[:200]}") if m.type == "error" else None,
    )
    page.on(
        "response",
        lambda r: errors.append(f"HTTP {r.status}: {r.url}") if r.status >= 400 else None,
    )
    page.goto(f"{base}/{path}", wait_until="load", timeout=60000)
    time.sleep(1.5)
    prints = []
    end = time.time() + seconds
    page.mouse.click(640, 400)
    for sel in ("#begin", "#start", "button:has-text('Begin')"):
        el = page.query_selector(sel)
        if el and el.is_visible():
            el.click()
            break
    keys = ["s", "d", "f", "a", "w"]
    i = 0
    while time.time() < end:
        page.keyboard.down(keys[i % len(keys)])
        time.sleep(0.5)
        page.keyboard.up(keys[i % len(keys)])
        prints.append(page.evaluate(FINGERPRINT))
        i += 1
    page.close()
    has_canvas = any(p is not None for p in prints)
    frozen = has_canvas and len(set(prints)) < 2
    return errors, has_canvas, frozen


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("site", nargs="?", default="_site")
    ap.add_argument("--seconds", type=float, default=10.0)
    a = ap.parse_args()
    root = Path(a.site).resolve()
    if not (root / "index.html").exists():
        sys.exit(f"{root} has no index.html; run `node tools/build_site.mjs` first")
    srv = serve(root)
    base = f"http://127.0.0.1:{srv.server_address[1]}"
    failed = []
    with sync_playwright() as p:
        kw = {"headless": True, "args": ["--no-sandbox"]}
        if os.environ.get("CHROME_PATH"):
            kw["executable_path"] = os.environ["CHROME_PATH"]
        browser = p.chromium.launch(**kw)
        for path in PAGES:
            errors, has_canvas, frozen = check(browser, base, path, a.seconds)
            ok = not errors and not frozen
            print(f"{'ok  ' if ok else 'FAIL'} /{path:13s} canvas={'yes' if has_canvas else 'no '} frozen={frozen}")
            for e in errors[:5]:
                print(f"       {e}")
            if frozen:
                print(f"       canvas unchanged for {a.seconds:g}s")
            if not ok:
                failed.append(path or "/")
        browser.close()
    srv.shutdown()
    if failed:
        sys.exit(f"page check failed: {', '.join(failed)}")
    print(f"PAGE_CHECK_OK {len(PAGES)} pages")


if __name__ == "__main__":
    main()
