"""Release checks for the Korean reading pages and unchanged Markdown downloads."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from zipfile import ZipFile
import unittest

ROOT = Path(__file__).resolve().parents[1]
STUDY = ROOT / 'ontology/study'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.text = []
        self.links = []
        self.charsets = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'meta' and 'charset' in attrs:
            self.charsets.append(attrs['charset'])
        if tag == 'a' and 'href' in attrs:
            self.links.append(attrs['href'])

    def handle_data(self, value):
        self.text.append(value)


class ReadersTest(unittest.TestCase):
    def test_interview_is_utf8_html_with_all_seven_rounds(self):
        page = Page((STUDY / 'week3-readings/korean-history/01-initial/interview.html').read_text(encoding='utf-8'))
        text = ''.join(page.text)
        self.assertIn('utf-8', page.charsets)
        self.assertIn('가상 인터뷰 — 한국사를 관계로 이해하고 싶은 독학자', text)
        self.assertIn('실제 마스터의 경험·선호·발언이 아니며', text)
        self.assertNotIn('\ufffd', text)
        for n in range(1, 8):
            self.assertIn(f'R{n} —', text)
        self.assertTrue(any(url.endswith('/01-initial/interview.md') for url in page.links))

    def test_every_markdown_has_a_reader_with_resolvable_local_links(self):
        sources = list((STUDY / 'downloads/week3').rglob('*.md'))
        self.assertGreater(len(sources), 10)
        for source in sources:
            reader = (STUDY / 'week3-readings' / source.relative_to(STUDY / 'downloads/week3')).with_suffix('.html')
            page = Page(reader.read_text(encoding='utf-8'))
            self.assertIn('utf-8', page.charsets)
            for link in page.links:
                url = urlsplit(link)
                if url.scheme or url.netloc or not url.path:
                    continue
                target = ROOT / unquote(url.path).lstrip('/') if url.path.startswith('/') else reader.parent / unquote(url.path)
                self.assertTrue(target.exists(), f'{reader}: {link}')

    def test_downloaded_snapshot_bytes_still_match_the_zip(self):
        with ZipFile(STUDY / 'downloads/week3-korean-history.zip') as bundle:
            for source in (STUDY / 'downloads/week3/korean-history').rglob('*'):
                if source.is_file():
                    name = 'korean-history/' + source.relative_to(STUDY / 'downloads/week3/korean-history').as_posix()
                    self.assertEqual(bundle.read(name), source.read_bytes(), name)


if __name__ == '__main__':
    unittest.main()
