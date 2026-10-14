"""Render UTF-8 reading pages without changing the original Markdown downloads.
Run: uv run --with markdown==3.9 python scripts/gpters24/render-week3.py
"""
from pathlib import Path
from urllib.parse import urlsplit, unquote, quote, urlunsplit
import html
import os
import re
import markdown

ROOT = Path(__file__).resolve().parents[2]
STUDY = ROOT / 'ontology/study'
SOURCE = STUDY / 'downloads/week3'
OUTPUT = STUDY / 'week3-readings'


def relative_url(target, folder):
    return quote(os.path.relpath(target, folder).replace(os.sep, '/'), safe='/')


def build():
    sources = sorted(SOURCE.rglob('*.md'))
    readers = {p.resolve(): (OUTPUT / p.relative_to(SOURCE)).with_suffix('.html') for p in sources}
    for source, target in readers.items():
        text = source.read_text(encoding='utf-8')
        if '\ufffd' in text:
            raise ValueError(f'Unexpected replacement character in {source}')
        # Frontmatter remains available in the original download.
        body = re.sub(r'\A---\r?\n.*?\r?\n---\r?\n', '', text, count=1, flags=re.S)
        heading = re.search(r'^# (.+)$', body, flags=re.M)
        title = heading.group(1) if heading else source.stem
        rendered = markdown.markdown(body, extensions=['tables', 'fenced_code', 'sane_lists', 'toc'])

        def rebase(match):
            url = urlsplit(html.unescape(match.group(1)))
            if url.scheme or url.netloc or not url.path or url.path.startswith('/'):
                return match.group(0)
            original = (source.parent / unquote(url.path)).resolve()
            destination = readers.get(original, original)
            new_url = urlunsplit(('', '', relative_url(destination, target.parent), url.query, url.fragment))
            return f'href="{html.escape(new_url, quote=True)}"'

        rendered = re.sub(r'href="([^"]*)"', rebase, rendered)
        css = relative_url(STUDY / 'assets/week3-reader.css', target.parent)
        lesson = relative_url(STUDY / 'week3.html', target.parent)
        original = relative_url(source, target.parent)
        page = f'''<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(title)} · 한국사 사례</title>
  <link rel="stylesheet" href="{css}">
</head>
<body>
  <a class="skip" href="#document">본문으로 이동</a>
  <header><a href="{lesson}">← 3주차 교안</a><a href="{original}" download>Markdown 원문 다운로드 ↓</a></header>
  <main id="document"><p class="eyebrow">GPTers 24 · 한국사 사례 자료</p><article>{rendered}</article></main>
  <footer>이 화면은 배포된 Markdown 원문에서 생성했습니다. <a href="{lesson}">교안으로 돌아가기</a></footer>
</body>
</html>
'''
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(page, encoding='utf-8')
    print(f'Rendered {len(readers)} UTF-8 reading pages; original Markdown unchanged.')


if __name__ == '__main__':
    build()
