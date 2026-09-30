"""Export reviewed local sources as portable study packs; inputs are explicit.

The ordinary web build uses the published ZIPs and does not need these source roots.
"""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
import argparse
import copy
import hashlib
import json
import os
import re
import shutil

REVISION = '2026-09-30'
MACHINE = re.compile(r'/(?:Volumes|Users)/[^\s`<>\)\]"\'\\]+')
INTERNAL = re.compile(r'(?:10-sources|20-knowledge|30-context|50-procedures|60-actions|70-evaluation)/[^\s`<>\)\]"\'\\]+')


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def normalize_links(folder):
    """Make included notes normal Markdown links; label unavailable internal records."""
    for path in folder.rglob('*.md'):
        text = path.read_text()
        def wiki(match):
            target, _, label = match.group(1).partition('|')
            base = target.split('#')[0]
            candidates = [p for p in folder.rglob(Path(base).name + '.md')]
            return f'[{label or Path(base).name}]({os.path.relpath(candidates[0], path.parent)})' if len(candidates) == 1 else (label or Path(base).name) + ' (배포에 포함하지 않은 내부 기록)'
        text = re.sub(r'\[\[([^\]]+)\]\]', wiki, text)
        def link(match):
            label, target = match.groups()
            if target.startswith(('http:', 'https:', '#', 'mailto:')):
                return match.group(0)
            candidate = path.parent / target.split('#')[0]
            if candidate.is_file():
                return match.group(0)
            return label + ' (별도 원문 참조)'
        text = re.sub(r'\[([^\]]*)\]\(([^)\n]+)\)', link, text)
        text = MACHINE.sub('별도-로컬-기록', text)
        path.write_text(text)


def archive(folder, target):
    entries = sorted(p for p in folder.rglob('*') if p.is_file())
    with ZipFile(target, 'w', compression=ZIP_DEFLATED, compresslevel=9) as z:
        for p in entries:
            info = ZipInfo(folder.name + '/' + p.relative_to(folder).as_posix(), (2026, 9, 30, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            z.writestr(info, p.read_bytes())
    return {'file': target.name, 'bytes': target.stat().st_size,
            'sha256': hashlib.sha256(target.read_bytes()).hexdigest(), 'fileCount': len(entries)}


def export_architecture(source, out):
    dest = out / 'korean-construction-ontology'
    for p in source.rglob('*'):
        if p.is_file() and '__pycache__' not in p.parts and p.suffix != '.pyc' and not p.name.startswith('.'):
            q = dest / p.relative_to(source)
            q.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(p, q)
            if q.suffix in {'.md', '.json', '.ttl', '.rq', '.py', '.txt'}:
                q.write_text(MACHINE.sub('별도-로컬-기록', q.read_text()))
    (dest / 'README.md').write_text('''# 한국 주거 건축·건설 온톨로지 · 실습 패키지

v0.3 · 원자료 조사 기준 2026-09-05 · 배포 정리 2026-09-30

단독·다가구·다세대·연립·아파트의 공간, 벽, 문, 창, 레이어, 치수, 근거를 연결한 온톨로지입니다. 116개 클래스, 106개 객체 관계, 108개 데이터 속성, 참고 규칙 69개를 담았습니다. 실습페이지의 FAMILY-02 작은 예제와 별개의 확장 패키지입니다.

## 읽고 실습하는 순서

1. [전체 안내](00-index.md)와 [개념·관계](13-ontology-schema.md)를 읽습니다.
2. [문·개구부](05-doors-and-openings.md)에서 문짝 폭과 통과유효폭을 구분하고 [예제](15-worked-examples.md)의 근거와 연결합니다.
3. [어휘 정본](vocabulary.json), [OWL](ontology.ttl), [SHACL](shapes.ttl), [JSON Schema](schemas/residential-model.schema.json)를 비교합니다.
4. [아파트](examples/apartment.json), [단독주택](examples/detached.json), [빌라](examples/villa.json) 중 하나의 사본으로 실습합니다.
5. [검증·이행 안내](23-validation-and-migration.md)를 따라 입력을 검사합니다.

## 실행

Python 3.11 이상에서 패키지 폴더를 작업 디렉터리로 사용합니다. 아래 명령은 모델·제약을 검사하며 외부 AI API를 호출하지 않습니다.

```sh
python3 -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows PowerShell에서는 .venv/Scripts/Activate.ps1
python -m pip install -r requirements.txt
python tools/validate_model.py examples/apartment.json --shacl
python tools/check_package.py --report verification-report.json
```

에이전트에게 이렇게 요청할 수 있습니다.

> 00-index.md와 13-ontology-schema.md를 읽고, apartment.json의 벽·개구부·문과 치수의 연결을 설명해줘. 값이 없는 치수는 추정하지 말고 근거와 UNKNOWN을 보존해줘. 원본을 유지하고 실습 사본에서 관계 하나를 바꾼 뒤 검증기의 결과와 이유를 비교해줘.

## 자료의 범위

2026-09-05의 조사·구현 스냅샷이며 이번 배포에서 법령의 현행성을 새로 조사하지 않았습니다. 규칙은 reference_only 상태입니다. 합성 예제의 구조 검증과 실제 건물의 안전·인허가·복원 정확도는 별개입니다. [출처대장](16-source-register.md), [적용 조건](25-residential-legal-conditions.md)에 판본과 확인 범위를 기록했습니다. 외부 법령·표준·제조사 문헌의 권리는 각 제공자에게 있습니다.
''')
    normalize_links(dest)
    return {'id': 'korean-construction', 'title': '한국 주거 건축·건설 온톨로지',
            'kind': '온톨로지 패키지', 'version': '0.3.0',
            'summary': '116개 클래스와 공간·부재·치수·근거의 연결. OWL·SHACL·JSON Schema, 주거 예제 3개, 검증 도구를 함께 제공합니다.',
            'start': 'README.md → 00-index.md → examples/apartment.json',
            'scope': '2026-09-05 조사 스냅샷. 실습용 데이터 계약이며 실제 건물의 안전·인허가 판정은 별도입니다.',
            **archive(dest, out / 'korean-construction-ontology.zip')}


def export_motion(skill, knowledge, akm, out):
    dest = out / 'motion-rhythm'
    ontology = dest / 'ontology'
    ontology.mkdir(parents=True, exist_ok=True)
    included = {}
    for root, target in [(skill, dest), (knowledge, ontology)]:
        for p in root.rglob('*'):
            if not p.is_file() or '__pycache__' in p.parts or p.suffix == '.pyc' or p.name.startswith('.'):
                continue
            if p.name == 'user-reference-20260929.md':
                continue
            q = target / p.relative_to(root)
            q.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(p, q)
            included[str(p)] = q
            if p.is_relative_to(akm):
                included[p.relative_to(akm).as_posix()] = q

    original = json.loads((knowledge / 'motion-ontology.json').read_text())
    data = copy.deepcopy(original)
    nodes = {n['id']: n for n in data['nodes']}
    def work_url(work):
        direct = work.get('project_url') or work.get('creator_url') or (work.get('award') or {}).get('official_source')
        if direct:
            return direct
        for sid in (work.get('summary') or {}).get('sources', []):
            url = (nodes.get(sid, {}).get('record') or {}).get('canonicalUrl')
            if url:
                return url
        return None
    image_credits = []
    for n in data['nodes']:
        if n['type'] != 'image':
            continue
        src = akm / n['path']
        q = ontology / 'images' / Path(n['path']).name
        q.parent.mkdir(parents=True, exist_ok=True)
        assert hashlib.sha256(src.read_bytes()).hexdigest() == n['sha256'], n['id']
        shutil.copy2(src, q)
        for alias in [str(src), n['path'], n.get('origin_path')]:
            if alias:
                included[alias] = q
                if not alias.startswith('/'):
                    included[str(akm / alias)] = q
        scene = nodes[n['scene_id']]
        work = nodes[scene['work_id']]
        image_credits.append({'image_id': n['id'], 'image': 'images/' + q.name,
                              'work': work.get('label'), 'creator': work.get('creator') or (work.get('summary') or {}).get('creator'),
                              'source_url': work_url(work),
                              'source_ids': scene.get('source_ids') or (work.get('summary') or {}).get('sources', []), 'sha256': n['sha256'],
                              'purpose': '장면 분석의 근거를 확인하는 프레임 표본; 원작 전체·제작용 소스 아님'})

    def public_string(text, base):
        if text in included:
            return os.path.relpath(included[text], base)
        for old in sorted(included, key=len, reverse=True):
            if old in text:
                text = text.replace(old, os.path.relpath(included[old], base))
        text = MACHINE.sub('별도-로컬-기록', text)
        return INTERNAL.sub('배포에-포함하지-않은-분석기록', text)

    def sanitize(value, base):
        if isinstance(value, str):
            return public_string(value, base)
        if isinstance(value, list):
            return [sanitize(v, base) for v in value]
        if isinstance(value, dict):
            # Embedded full reports duplicate the linked public documents and contain session context.
            return {k: sanitize(v, base) for k, v in value.items()
                    if k not in {'raw_content', 'original_source_mapping', 'origin_path', 'reviewer'}}
        return value

    for p in dest.rglob('*'):
        if not p.is_file() or p.suffix not in {'.md', '.json', '.yaml', '.py'}:
            continue
        if p.name in {'motion-ontology.json', 'ontology.py'}:
            continue
        if p == dest / 'assets/jizura/catalog.json':
            continue  # Keep the pinned third-party catalog byte-for-byte.
        if p.suffix == '.json':
            write_json(p, sanitize(json.loads(p.read_text()), p.parent))
        else:
            p.write_text(public_string(p.read_text(), p.parent))

    data = sanitize(data, ontology)
    data.pop('akm_root', None)
    data['scope']['asset_root'] = '.'
    data['distribution'] = {'revision': REVISION, 'source_sha256': hashlib.sha256((knowledge / 'motion-ontology.json').read_bytes()).hexdigest(),
                            'images_included': 31, 'original_videos_included': False,
                            'paths': 'relative to this ontology directory',
                            'unbundled_records': 'Some original review logs, full videos and PTS sidecars remain outside this public pack; source URLs and stated observation limits are preserved.'}
    for n in data['nodes']:
        if n['type'] == 'scene' and isinstance(n.get('media'), dict):
            n['media'].pop('path', None)
            n['media'].pop('provenance_directory', None)
            n['media']['included'] = False
            work = nodes[n['work_id']]
            n['media'].setdefault('source_url', work_url(work))
        # The original digest of a document no longer describes its portable edition.
        if n['type'] == 'source' and n.get('sha256'):
            n['original_document_sha256'] = n.pop('sha256')
    write_json(ontology / 'motion-ontology.json', data)
    write_json(ontology / 'image-credits.json', image_credits)

    script = (skill / 'scripts/ontology.py').read_text()
    script = re.sub(r'^DEFAULT_DATA = .*$', "DEFAULT_DATA = Path(__file__).resolve().parents[1] / 'ontology/motion-ontology.json'", script, flags=re.M)
    script = re.sub(r'^AKM_ROOT = .*$', 'AKM_ROOT = DEFAULT_DATA.parent', script, flags=re.M)
    script = script.replace('    return value\n\n\ndef node_index', "    value['_data_root'] = str(path.resolve().parent)\n    return value\n\n\ndef node_index")
    script = script.replace("return Path(root).expanduser().resolve() if isinstance(root, str) and root else AKM_ROOT.resolve()", "base = Path(data.get('_data_root', AKM_ROOT))\n    chosen = Path(root).expanduser() if isinstance(root, str) and root else Path('.')\n    return (chosen if chosen.is_absolute() else base / chosen).resolve()")
    (dest / 'scripts/ontology.py').write_text(script)

    p = dest / 'scripts/catalog.py'
    p.write_text(p.read_text().replace("archive = Path(provenance['archive'])", "archive = ROOT / 'assets/jizura'"))
    # Include the MIT source files used by catalog --source, with the existing license.
    upstream = akm / '10-sources/web/2026-09-29-revid-jizura/JIZURA/src'
    for p in upstream.glob('*.js'):
        q = dest / 'assets/jizura/src' / p.name
        q.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(p, q)
    provenance = json.loads((dest / 'assets/jizura/provenance.json').read_text())
    provenance['archive'] = '.'
    write_json(dest / 'assets/jizura/provenance.json', provenance)

    p = dest / 'SKILL.md'
    text = p.read_text().replace('마스터의 기본 선호는', '이 배포판의 기본 연출은')
    text = text.replace('마스터가 이를 “내가 생각하는 2D 타이포 모션의 완성”으로 직접 지정했다.', '이 배포판의 2D 타이포 비교 기준이다. 사용자가 다른 기준을 지정하면 그 선택을 우선한다.')
    text = re.sub(r'출발 시간 범위와 반려 기준은 프로파일에 있다\..*?모델 일반 성능 비교가 아니다\.', '출발 시간 범위와 반려 기준은 프로파일에 있다.', text)
    text = '\n'.join(line for line in text.splitlines() if 'user-reference-20260929.md' not in line) + '\n'
    text = text.replace('새 영상 제작의 현재 환경 진입점은 `hyperframes`다.', 'HyperFrames를 사용하는 환경에서는 `hyperframes`를 진입점으로 삼는다. 해당 도구가 없으면 사용자가 선택한 제작 도구를 따른다.')
    text = text.replace('## 제작에 적용하는 순서', '## 함께 제공되는 온톨로지\n\n[온톨로지 안내](ontology/motion-ontology.md)와 `ontology/motion-ontology.json`, 31개 근거 이미지가 이 스킬 폴더 안에 있다. 폴더 전체를 함께 이동한다. `python3 scripts/ontology.py validate`로 연결을 확인하고 `search --concept MR-TENSION --limit 3`처럼 소량 조회한다. 원본 영상은 출처 링크로 확인한다.\n\n## 제작에 적용하는 순서')
    p.write_text(text)
    p = dest / 'references/default-direction.md'
    text = p.read_text().replace('마스터가 요청한 모션그래픽의', '이 배포판 모션그래픽의')
    text = re.sub(r'2026-09-29 마스터가.*?우선 비교 기준으로 삼는다\.', '이 배포판에서는 Apple 「Don\'t Blink」를 2D 타이포의 비교 기준으로 삼는다. 실제 사용자의 브리프와 다른 지정이 우선한다.', text)
    p.write_text(text)
    (dest / 'references/sources.md').write_text('''# 출처와 배포 범위

- [모션 온톨로지](../ontology/motion-ontology.md), [기법 56개](../ontology/visual-technique-atlas.md), [기존 사례 30개](../ontology/finished-work-casebook.md), [출처대장](../ontology/source-ledger.json).
- [이미지별 작품·출처·해시](../ontology/image-credits.json). 이미지 표본은 분석 근거이며 원작의 전체 영상·음악·제작 소스를 포함하지 않는다. 권리는 각 제작자에게 있다.
- The Motion Awards의 2016–2025 조사 창에서 확인한 8개 공식 회차 목록 241항목과 대표 장면의 관찰 범위를 구분한다. 2018·2019 독립 목록은 미확보다. Apple은 별도 기준작이다.
- JIZURA v0.9.0: https://github.com/852wa/JIZURA/tree/8da975fb362d966b065217618aedafd5a35a39e0 — [MIT 라이선스](../assets/jizura/LICENSE), [제3자 고지](../assets/jizura/THIRD_PARTY_NOTICES.md). 실행본과 조회용 source를 포함한다.
- Revid: https://www.revid.ai/claude-motion-graphics — 공개 카드 정보와 분석 범위만 참조한다.

개인 제공 영상과 내부 세션 기록은 배포에 포함하지 않았다. 각 문서의 직접 관찰·측정·제작자 설명·해석 구분은 유지한다. 연속 재생·청취·새 제작물의 품질 검증은 별도다.
''')
    (dest / 'references/jev-review.md').write_text('''# Jev로 모호한 개념을 검토하기

먼저 이미지나 영상을 직접 확인하고 관찰문과 개념 정의를 준비한다. Jev 연결이 있는 환경에서는 관련성·동일 개체·관계의 모호한 후보만 검토한다. 관찰문·정의·반례와 선택지를 작은 요청으로 전달하고 결과·모델·시각·근거·보류를 기록한다. 개인 자료의 외부 전송은 해당 환경의 규칙을 따른다.

Jev는 이 세트의 다운로드·검색·검증에 필수가 아니다. 호출하지 않은 확신도나 성능을 만들어 기록하지 않는다. 같은 판단을 도구 선택과 지식 판단 연결에서 중복 호출하지 않는다. 제안은 원문과 대조하며 온톨로지를 자동 덮어쓰지 않는다.

- 원저자 사례: https://github.com/dagfinndybvig/Jev_Ontology
- 문서: https://docs.typesafe.ai/models
''')
    p = dest / 'references/decade-studies.md'
    t = p.read_text()
    t = re.sub(r'\[Jev AKM 정본 절차\]\([^)]+\)', '[Jev 검토 절차](jev-review.md)', t)
    p.write_text(t)
    (dest / 'README.md').write_text('''# Motion Rhythm · 스킬 + 온톨로지 세트

배포판 2026-09-30. 이 폴더 전체가 하나의 세트입니다. `SKILL.md`는 제작·검수 절차, `ontology/`는 개념·장면·이미지 근거, `scripts/`는 조회 도구입니다. 개인 AKM이나 Jev API 없이 읽고 조회할 수 있습니다.

## 시작

1. [SKILL.md](SKILL.md)를 사용하는 에이전트에게 읽힙니다. 스킬 폴더를 지원하는 에이전트에서는 자신의 설치 방식에 맞춰 **motion-rhythm 폴더 전체**를 등록합니다.
2. [온톨로지 안내](ontology/motion-ontology.md)를 읽고 필요한 개념을 조회합니다.
3. 결과의 이미지 파일을 실제로 연 뒤 장면과 시간 악보를 설계합니다.

Python 3.10 이상, 추가 Python 패키지 없이 세트 폴더에서 실행합니다. 다른 작업 폴더에서도 스크립트의 실제 경로를 지정하면 됩니다.

```sh
python3 scripts/ontology.py validate
python3 scripts/ontology.py search --concept MR-TENSION --limit 3
python3 scripts/ontology.py search --concept Rhythm --limit 3
python3 scripts/ontology.py search --concept MR-READING --limit 3
python3 scripts/catalog.py --stats
```

## 바로 해볼 요청

> SKILL.md를 읽고 온톨로지에서 ‘느리지만 긴장감 있는 장면’에 맞는 개념과 사례를 3개 이내로 찾아줘. 근거 이미지를 열어 무엇이 보이는지 설명하고, 속도·긴장·리듬을 구분한 12초 시간 악보를 작성해줘. 사용한 개념·장면 ID와 적용 구간을 기록해줘. 아직 실제 영상을 제작하거나 리듬 품질이 검증됐다고 보고하지는 마.

[세 요청의 적용 예시](ontology/motion-ontology-examples.md)와 [시간 악보](references/motion-score.md)를 이어서 사용합니다. JIZURA [한국어 실행본](assets/jizura/ko/index.html)은 브라우저로 열 수 있습니다. 웹 폰트는 네트워크가 필요할 수 있습니다.

## 포함 범위

56개 기존 기법, 7개 상위 개념, 기존 사례 30개, 31개 연결 장면·이미지, 2016–2025 조사 창의 수상 목록을 담았습니다. 241개 수상 항목을 모두 연속 시청한 자료는 아닙니다. 대표 15편·Apple 공개 발췌·이전 사례의 표본 관찰을 연결했습니다. 오디오와 연속 재생 미확인 범위를 유지합니다.

[출처와 권리](references/sources.md), [이미지 출처](ontology/image-credits.json)를 확인합니다. 프레임은 장면 분석 근거로 포함하며 원작의 전체 영상과 음악은 원문 링크에서 확인합니다. JIZURA의 MIT 라이선스와 제3자 고지는 자산에 포함했습니다.
''')
    # Regenerate the scene gallery with links that are all inside the set.
    lines = ['# 장면·이미지 색인', '', '각 접촉지는 선택 구간의 프레임 표본입니다. 전체 재생·청취 검증을 뜻하지 않습니다.', '']
    for n in data['nodes']:
        if n['type'] == 'scene':
            lines += ['## ' + n['label'], '', '`' + n['id'] + '` · ' + ', '.join(n.get('concept_ids', [])), '']
            for image_id in n.get('image_ids', []):
                im = next(i for i in data['nodes'] if i['id'] == image_id)
                lines += [f"![{im['label']}]({im['path']})", '']
    (ontology / 'motion-ontology-scenes.md').write_text('\n'.join(lines))
    normalize_links(dest)
    return {'id': 'motion-rhythm', 'title': '모션리듬 스킬 + 온톨로지',
            'kind': '스킬 + 온톨로지 세트', 'version': REVISION,
            'summary': '연출·검수 스킬, 56개 기법, 개념·장면·31개 근거 이미지, 조회 스크립트와 JIZURA를 한 폴더로 제공합니다.',
            'start': 'README.md → SKILL.md → scripts/ontology.py',
            'scope': '스킬과 ontology 폴더를 함께 이동하세요. 프레임 표본과 실제 재생·청취 검증을 구분합니다.',
            **archive(dest, out / 'motion-rhythm-skill-ontology.zip')}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ['architecture-root', 'motion-skill', 'motion-knowledge', 'akm-root', 'out']:
        parser.add_argument('--' + name, required=True, type=Path)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    if any((args.out / name).exists() for name in ['korean-construction-ontology', 'motion-rhythm']):
        parser.error('use a fresh output directory to avoid carrying stale files into a release')
    packs = [export_architecture(args.architecture_root, args.out),
             export_motion(args.motion_skill, args.motion_knowledge, args.akm_root, args.out)]
    write_json(args.out / 'resource-packs.json', {'revision': REVISION, 'packs': packs})
    print(json.dumps(packs, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
