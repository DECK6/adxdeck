"""Verify the actual downloadable archives, including relocation and evidence links."""
from pathlib import Path
from zipfile import ZipFile
import hashlib
import json
import os
import re
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
DOWNLOADS = ROOT / 'ontology/study/downloads'


class ResourcePacks(unittest.TestCase):
    def test_archives_have_exact_manifest_and_no_machine_paths(self):
        manifest = json.loads((DOWNLOADS / 'resource-packs.json').read_text())
        self.assertEqual({p['id'] for p in manifest['packs']}, {'korean-construction', 'motion-rhythm'})
        for pack in manifest['packs']:
            archive = DOWNLOADS / pack['file']
            self.assertEqual(hashlib.sha256(archive.read_bytes()).hexdigest(), pack['sha256'])
            with ZipFile(archive) as z:
                self.assertIsNone(z.testzip())
                self.assertEqual(len(z.namelist()), pack['fileCount'])
                for name in z.namelist():
                    self.assertFalse(Path(name).is_absolute() or '..' in Path(name).parts)
                    self.assertNotIn('__pycache__', name)
                    try:
                        text = z.read(name).decode('utf-8')
                    except UnicodeDecodeError:
                        continue
                    self.assertIsNone(re.search(r'/Volumes/|/Users/|KakaoTalk_Video|file://', text), name)

    def test_motion_queries_resolve_images_after_relocation(self):
        # Leave this inspection workspace in the OS temp area for diagnosis.
        folder = Path(tempfile.mkdtemp(prefix='gpters-portable-'))
        with ZipFile(DOWNLOADS / 'motion-rhythm-skill-ontology.zip') as z:
            z.extractall(folder)
        skill = (folder / 'motion-rhythm').resolve()
        def query(*args):
            result = subprocess.run(['python3', str(skill / 'scripts/ontology.py'), *args],
                                    cwd=folder, text=True, capture_output=True, check=True)
            return json.loads(result.stdout)
        self.assertTrue(query('validate')['valid'])
        data = json.loads((skill / 'ontology/motion-ontology.json').read_text())
        images = [n for n in data['nodes'] if n['type'] == 'image']
        self.assertEqual(len(images), 31)
        for query_args in [('search', '--concept', 'MR-TENSION'), ('search', '--concept', 'Rhythm'),
                           ('search', '--concept', 'MR-READING')]:
            result = query(*query_args)
            self.assertGreater(len(result['cases']), 0)
            self.assertLessEqual(len(result['cases']), 3)
            for case in result['cases']:
                self.assertTrue(case['evidence_limits'])
                for image in case['images']:
                    resolved = Path(image['absolute_path'])
                    self.assertTrue(resolved.is_file())
                    self.assertTrue(resolved.is_relative_to(skill))
        catalog = subprocess.run(['python3', str(skill / 'scripts/catalog.py'), '--stats'],
                                 cwd=folder, capture_output=True, text=True, check=True)
        self.assertEqual(json.loads(catalog.stdout)['total'], 860)
        provenance = json.loads((skill / 'assets/jizura/provenance.json').read_text())
        for name, digest in provenance['files'].items():
            self.assertEqual(hashlib.sha256((skill / 'assets/jizura' / name).read_bytes()).hexdigest(), digest)
        credits = json.loads((skill / 'ontology/image-credits.json').read_text())
        self.assertTrue(all(c['source_url'] for c in credits))

    def test_architecture_has_full_contracts_and_examples(self):
        with ZipFile(DOWNLOADS / 'korean-construction-ontology.zip') as z:
            prefix = 'korean-construction-ontology/'
            for file in ['README.md', '00-index.md', 'ontology.ttl', 'shapes.ttl',
                         'schemas/residential-model.schema.json', 'vocabulary.json',
                         'tools/validate_model.py', 'tools/check_package.py',
                         'examples/apartment.json', 'examples/villa.json', 'examples/detached.json']:
                self.assertIn(prefix + file, z.namelist())
            vocab = json.loads(z.read(prefix + 'vocabulary.json'))
            self.assertEqual(len(vocab['classes']), 116)
            self.assertEqual(sum(p['kind'] == 'object' for p in vocab['properties'].values()), 106)
            rules = json.loads(z.read(prefix + 'rule-contracts.json'))
            self.assertTrue(all(r['automationStatus'] == 'reference_only' for r in rules['rules']))

    def test_markdown_local_links_in_both_packs_exist(self):
        for archive in ['korean-construction-ontology.zip', 'motion-rhythm-skill-ontology.zip']:
            with ZipFile(DOWNLOADS / archive) as z:
                names = set(z.namelist())
                for name in names:
                    if not name.endswith('.md'):
                        continue
                    text = z.read(name).decode('utf-8')
                    for target in re.findall(r'\]\(([^)\n]+)\)', text):
                        if target.startswith(('http:', 'https:', '#', 'mailto:')):
                            continue
                        target = target.split('#')[0]
                        if not target:
                            continue
                        resolved = os.path.normpath(str(Path(name).parent / target))
                        self.assertIn(resolved, names, (name, target))


if __name__ == '__main__':
    unittest.main()
