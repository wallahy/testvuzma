#!/usr/bin/env python3
"""
Vyron site protection build.

Bundles the site markup + CSS + JS into an encrypted payload and emits a
heavily obfuscated loader page into dist/. Upload dist/ to your host
(Netlify, Vercel, Cloudflare Pages, cPanel, ...) instead of the raw site.

Re-run after editing the site:

    python tools/protect.py

Requires node/npx for the JS obfuscator (first run downloads it).
"""

import base64
import json
import os
import random
import re
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "dist")
WORK = os.path.join(ROOT, "tools", ".work")

# Cloudflare Turnstile sitekey. Paste YOUR sitekey (dash.cloudflare.com ->
# Turnstile -> Add widget) into tools/sitekey.txt, or edit this string.
# Default = Cloudflare's public always-pass TEST key (dev/preview only!).
SITEKEY = "1x00000000000000000000AA"
_skfile = os.path.join(ROOT, "tools", "sitekey.txt")
if os.path.isfile(_skfile):
    SITEKEY = open(_skfile).read().strip() or SITEKEY

# ---------------------------------------------------------------- cipher


def xs32_stream(seed):
    """xorshift32 byte keystream - mirrored by the JS loader."""
    s = (seed & 0xFFFFFFFF) or 0x9E3779B9
    while True:
        s ^= (s << 13) & 0xFFFFFFFF
        s ^= s >> 17
        s ^= (s << 5) & 0xFFFFFFFF
        s &= 0xFFFFFFFF
        yield s


def crypt(data: bytes, key: bytes) -> bytes:
    seed = int.from_bytes(key[:4], "little")
    g = xs32_stream(seed)
    return bytes(b ^ (next(g) & 0xFF) ^ key[i % len(key)]
                 for i, b in enumerate(data))


# ---------------------------------------------------------------- helpers


def minify_css(css: str) -> str:
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    css = re.sub(r"\s+", " ", css)
    # calc()/min()/max()/clamp() bodies need their spaces: CSS requires
    # whitespace around binary + and - operators inside these functions.
    holds = []

    def stash(m):
        holds.append(m.group(0))
        return "\x00%d\x00" % (len(holds) - 1)

    css = re.sub(r"(?:calc|min|max|clamp)\((?:[^()]|\([^()]*\))*\)", stash, css)
    css = re.sub(r"\s*([{};,>])\s*", r"\1", css)
    css = re.sub("\x00(\\d+)\x00", lambda m: holds[int(m.group(1))], css)
    return css.strip()


def read(p):
    with open(os.path.join(ROOT, p), "r", encoding="utf-8") as f:
        return f.read()


def obfuscate(js_path_in, js_path_out):
    cfg = os.path.join(ROOT, "tools", "obf.json")
    cmd = ["npx", "-y", "javascript-obfuscator", js_path_in,
           "--output", js_path_out, "--config", cfg]
    r = subprocess.run(cmd, capture_output=True, text=True, shell=True)
    if r.returncode != 0:
        sys.exit("javascript-obfuscator failed:\n" + r.stdout + r.stderr)


# ---------------------------------------------------------------- build


def main():
    html = read("index.html")
    css = minify_css(read(os.path.join("css", "style.css")))
    scripts = [read(os.path.join("js", n))
               for n in ("config.js", "main.js", "background.js")]

    # body markup = everything inside <body> minus the trailing <script> tags
    body = re.search(r"<body>(.*?)</body>", html, re.S).group(1)
    body = re.sub(r"<script[^>]*></script>", "", body).strip()

    # served head keeps crawler-visible meta (og/description/favicon/fonts)
    head = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
    head = re.sub(r'<link rel="stylesheet"[^>]*>', "", head)
    robots = ('<meta name="robots" content="noindex,nofollow,noarchive,'
              'nosnippet,noimageindex,nocache">\n'
              '<meta name="googlebot" content="noarchive,nosnippet">')
    head = head.rstrip() + "\n" + robots

    payload = json.dumps({
        "g": {"h": GATE_HTML, "c": minify_css(GATE_CSS)},
        "s": {"h": body, "c": css, "s": scripts},
        "k": SITEKEY},
        ensure_ascii=False, separators=(",", ":"))

    key = bytes(random.randrange(1, 256) for _ in range(32))
    blob = base64.b64encode(crypt(payload.encode("utf-8"), key)).decode()

    loader = (LOADER_JS
              .replace("__KEY__", "[" + ",".join(map(str, key)) + "]")
              .replace("__BLOB__", blob))

    os.makedirs(WORK, exist_ok=True)
    src_js = os.path.join(WORK, "loader.src.js")
    obf_js = os.path.join(WORK, "loader.obf.js")
    with open(src_js, "w", encoding="utf-8") as f:
        f.write(loader)
    obfuscate(src_js, obf_js)
    with open(obf_js, "r", encoding="utf-8") as f:
        loader_obf = f.read()

    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)
    shutil.copytree(os.path.join(ROOT, "assets"), os.path.join(OUT, "assets"))

    gate = (INDEX_HTML
            .replace("__HEAD__", head)
            .replace("__BOOT__", json.dumps(loader_obf)))
    with open(os.path.join(OUT, "index.html"), "w", encoding="utf-8") as f:
        f.write(gate)

    with open(os.path.join(OUT, "_headers"), "w") as f:
        f.write("/*\n  Cache-Control: no-store\n"
                "  X-Content-Type-Options: nosniff\n"
                "  X-Robots-Tag: noarchive, nosnippet\n"
                "  Referrer-Policy: no-referrer\n")
    with open(os.path.join(OUT, "robots.txt"), "w") as f:
        f.write("User-agent: *\nDisallow: /\n")

    size = os.path.getsize(os.path.join(OUT, "index.html"))
    print(f"dist/ built  (index.html {size/1024:.0f} KB, "
          f"payload {len(blob)/1024:.0f} KB encrypted)")
    if SITEKEY == "1x00000000000000000000AA":
        print("!! Turnstile is using the ALWAYS-PASS test key.\n"
              "!! Put your real sitekey in tools/sitekey.txt before deploying.")


# ---------------------------------------------------------------- loader


LOADER_JS = r"""
(function () {
    'use strict';

    /* ---------- anti-inspect ---------- */
    var _w = function () { document.documentElement.innerHTML = ''; };
    document.addEventListener('keydown', function (e) {
        var k = e.keyCode;
        if (k === 123 || (e.ctrlKey && (k === 83 || k === 85 || k === 80 || k === 79))
            || (e.ctrlKey && e.shiftKey && (k === 73 || k === 74 || k === 67
                || k === 75 || k === 69 || k === 77))) {
            e.preventDefault(); e.stopPropagation(); return false;
        }
    }, true);
    ['contextmenu', 'selectstart', 'copy', 'dragstart'].forEach(function (t) {
        document.addEventListener(t, function (e) { e.preventDefault(); }, true);
    });
    window.addEventListener('beforeprint', function () { _w(); });
    setInterval(function () {
        if (outerWidth - innerWidth > 160 || outerHeight - innerHeight > 160) { _w(); }
    }, 1500);

    /* ---------- decrypt ---------- */
    function xs32(a) {
        return function () {
            a ^= a << 13; a ^= a >>> 17; a ^= a << 5; a >>>= 0; return a;
        };
    }
    function unb64(s) {
        var b = atob(s), n = b.length, o = new Uint8Array(n), i;
        for (i = 0; i < n; i++) { o[i] = b.charCodeAt(i); }
        return o;
    }
    function dec(b64, k) {
        var d = unb64(b64), n = d.length, i;
        var g = xs32(((k[0] | (k[1] << 8) | (k[2] << 16) | (k[3] << 24)) >>> 0)
            || 0x9e3779b9);
        for (i = 0; i < n; i++) { d[i] = (d[i] ^ (g() & 255) ^ k[i % k.length]) & 255; }
        return new TextDecoder().decode(d);
    }

    var K = __KEY__;
    var P = "__BLOB__";
    var Pg;
    try {
        Pg = JSON.parse(dec(P, K));
    } catch (e) { return; }

    /* ---------- phase 1: verification gate ---------- */
    var st = document.createElement('style');
    st.textContent = Pg.g.c;
    document.head.appendChild(st);
    document.body.innerHTML = Pg.g.h;

    var booted = false;
    function boot() {
        if (booted) { return; }
        booted = true;
        try {
            var g = document.getElementById('gate');
            if (g) {
                g.style.opacity = '0';
                setTimeout(function () { g.remove(); }, 380);
            }
            var st2 = document.createElement('style');
            st2.textContent = Pg.s.c
                + '@media print{html{display:none!important}}';
            document.head.appendChild(st2);
            document.body.innerHTML = Pg.s.h;
            Pg.s.s.forEach(function (code) {
                var el = document.createElement('script');
                el.textContent = code;
                document.body.appendChild(el);
            });
        } catch (e) {}
    }
    function verr() {
        var e = document.getElementById('gerr');
        if (e) { e.style.display = 'block'; }
    }
    function initTs() {
        if (window.__tsInit || typeof turnstile === 'undefined') { return; }
        window.__tsInit = 1;
        turnstile.render('#ts', {
            sitekey: Pg.k, theme: 'dark', callback: boot,
            'error-callback': verr, 'unsupported-callback': verr
        });
    }
    window.__tsReady = initTs;
    initTs();
    setTimeout(function () {
        if (!window.__tsInit && typeof turnstile === 'undefined') { verr(); }
    }, 9000);
})();
"""

GATE_HTML = """<div id="gate"><div class="g-card">
<div class="g-spin"></div>
<h1>Verifying you are human</h1>
<p>vyron.gg is checking your browser security before you continue.</p>
<div id="ts"></div>
<p class="g-err" id="gerr">Verification failed &mdash; reload the page or disable your blocker.</p>
<p class="g-foot">Protected by Cloudflare</p>
</div></div>"""

GATE_CSS = """html,body{margin:0;height:100%;background:#131315;color:#e8e8ea;
 font-family:Inter,system-ui,-apple-system,sans-serif}
#gate{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
 transition:opacity .35s}
.g-card{max-width:420px;width:min(92vw,420px);padding:34px 30px;text-align:center;
 background:#1a1a1e;border:1px solid #2a2a30;border-radius:14px;
 box-shadow:0 20px 60px rgba(0,0,0,.45)}
.g-spin{width:34px;height:34px;margin:0 auto 18px;border-radius:50%;
 border:3px solid #3a3a42;border-top-color:#8b5cf6;animation:gsp .8s linear infinite}
@keyframes gsp{to{transform:rotate(360deg)}}
.g-card h1{font-size:19px;margin:0 0 8px;font-weight:700}
.g-card p{font-size:13px;line-height:1.5;color:#9a9aa3;margin:0 0 18px}
#ts{display:flex;justify-content:center;min-height:65px}
.g-foot{margin-top:20px!important;font-size:11px!important;color:#55555e!important}
.g-err{color:#ff6b6b!important;display:none}"""

INDEX_HTML = """<!DOCTYPE html>
<html lang="en" style="background:#131315">
<head>
__HEAD__
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=__tsReady&render=explicit" async defer></script>
</head>
<body style="background:#131315;color:#e8e8ea;font-family:Inter,system-ui,-apple-system,sans-serif">
<noscript><div style="height:100vh;display:flex;align-items:center;justify-content:center">Vyron Client requires JavaScript.</div></noscript>
<script>window.__B = __BOOT__;
try { (0, eval)(window.__B); } catch (e) {}</script>
</body>
</html>
"""

if __name__ == "__main__":
    main()
