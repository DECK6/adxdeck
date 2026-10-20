"""Publish an allowlisted, API-free course export from the frozen experiment."""
import argparse, hashlib, json, re, shutil, zipfile
from pathlib import Path

SITE=Path(__file__).resolve().parents[2]/'ontology/study'
def sha(data):return hashlib.sha256(data).hexdigest()
def write(path,text):
    path.parent.mkdir(parents=True,exist_ok=True);path.write_text(text,encoding='utf-8')
def dump(path,value):write(path,json.dumps(value,ensure_ascii=False,indent=2)+'\n')

def main():
    ap=argparse.ArgumentParser();ap.add_argument('source',type=Path);args=ap.parse_args();source=args.source
    public=SITE/'week4-species';downloads=SITE/'downloads';kit=downloads/'week4'
    old_manifest=json.loads((kit/'manifest.json').read_text()) if (kit/'manifest.json').exists() else {}
    for rel in ['index.html','REPORT.md','summary.json','run-config.json','large-scale/index.html','large-scale/REPORT.md','large-scale/summary.json','large-scale/run-config.json','graph/index.html','graph/paths.html','graph/GRAPH.md','graph/data.json','graph/LICENSE-Galaxy-Graph.txt']:
        target=public/rel;target.parent.mkdir(parents=True,exist_ok=True)
        shutil.copyfile(source/'comparison'/rel,target)
        if rel=='graph/GRAPH.md':write(target,target.read_text().rstrip()+'\n')
    exports=[]
    for sub,letter in [('', 'c'),('large-scale','l')]:
        for path in sorted((source/'comparison'/sub/'runs').glob(f'[123]-{letter}??-*.json')):
            if not re.fullmatch(r'[123]-[cl]\d\d-(plain|ontology)\.json',path.name):continue
            run=json.loads(path.read_text())
            for key in ['invocation_command','thread_id','artifacts']:run.pop(key,None)
            out=public/sub/'runs'/path.name;dump(out,run)
            exports.append({'file':str(out.relative_to(public)),'source_sha256':sha(path.read_bytes()),'export_sha256':sha(out.read_bytes())})
        path=public/sub/'REPORT.md';text=path.read_text()
        text=text.replace('모델 응답 원문, 도구 조회, CLI 이벤트, 오류, 사용량은 runs/에 있습니다.','공개 runs/에는 답변·도구 조회·사용량·채점 기록이 있습니다. 실행 명령·세션 ID·CLI 이벤트는 로컬 원본에 보관하며 공개 사본에서 제외했습니다.')
        text+='\n\n공개 배포: [4주차 교안](https://dexa.art/ontology/study/week4.html). 공개 기록의 필드 차이와 원본·사본 해시는 [export-manifest.json]('+('../' if sub else '')+'export-manifest.json)에 있습니다.\n'
        write(path,text)
    dump(public/'export-manifest.json',{'note':'Frozen scores, answers and retrieval traces preserved. Machine invocation, thread IDs and CLI event/stderr logs omitted. Original evidence remains local.','runs':exports})
    for name in ['galaxy-full.png','galaxy-question.png']:
        shutil.copyfile(source/'evidence/graph'/name,public/'graph'/name)
    provenance='''# 출처와 배포 범위

- 원자료: 국립생물자원관·국가생물다양성센터, 2025년 국가생물종목록 v1.0 통합 시트, 62,604개 목록 항목(아종·변종 포함).
- 출처: https://www.kbr.go.kr/content/view.do?menuKey=799&contentKey=174
- 저작권 정책: https://www.kbr.go.kr/content/view.do?menuKey=512&contentKey=48
- 이 수업 자료는 원자료를 JSONL·SQLite로 변환하고 의미 모델과 조회 도구를 더한 가공본입니다. 기관의 공식 제품 또는 검증·추천을 뜻하지 않습니다.
- 원본 XLSX SHA-256: 737a455386b73ccb9056f9671774b3e7fa7650bb552405a42d89531481444cdc
- 동일 JSONL SHA-256: 1d06a860a0edadad615c18a03a75a05f6347df178dfc29960387e69b8f127de4
- 각 항목에 원본 행·KTSN·출처 이름을 유지합니다. 국명·학명은 원본 표기이며 생물학적 이명, 보호등급, 서식지, 최신 분류를 새로 추론하지 않습니다.
- 공개 비교는 GPT-6.1 Sol / xhigh / ChatGPT 구독으로 실행한 기본 48회와 대규모 36회만 다룹니다. 두 비교 실행에서 유료 API·Decisions를 사용하지 않았습니다.
- 의미 모델의 최초 설계에는 GPT-6 Luna 제안과 Decisions 판정이 사용되었습니다. 설계 이력과 이번 구독 비교 실행은 구별합니다. 이 패키지의 로컬 조회는 모델·API를 호출하지 않습니다.
- graph/가 포함된 경우 Galaxy Graph 3D의 MIT 라이선스와 DECK 저작권 표기를 함께 보존합니다.
'''
    write(kit/'PROVENANCE.md',provenance)
    questions=json.loads((source/'data/large-questions.json').read_text())['questions']
    dump(kit/'questions.json',[{'id':q['id'],'prompt':q['prompt']} for q in questions])
    manifest={'source_items':62604,'document_sha256':sha((source/'plain/records.jsonl').read_bytes()),'packages':{}}
    assert (source/'plain/records.jsonl').read_bytes()==(source/'ontology/records.jsonl').read_bytes()
    for variant in ['plain','ontology']:
        readme=f'''# 국가생물종목록 · {'플레인 / 온톨로지 미적용' if variant=='plain' else '온톨로지 적용'}

## 바로 시작
압축을 풀고 이 파일이 있는 species-{variant} 폴더를 에이전트에서 엽니다. 기존 자기 지식베이스와 별도 폴더로 사용하세요.

1. 에이전트에게 “START-HERE.md와 PROVENANCE.md를 읽고 이 지식베이스의 구조를 설명해줘”라고 요청합니다.
2. Python 3가 있다면 아래 읽기 전용 검색을 실행합니다. 추가 패키지·API 키가 필요하지 않습니다. Python의 SQLite 빌드에 FTS5가 필요합니다.

```sh
python3 query_local.py search 호랑이
python3 query_local.py read 120000212946
```

3. questions.json의 큰 범위 질문 하나를 에이전트에게 요청하고 답·근거·시간·모르는 부분을 기록합니다.
4. 실제 수업 비교: https://dexa.art/ontology/study/week4-species/{'large-scale/' if variant=='ontology' else ''}index.html

이 자유 실습은 에이전트가 파일과 코드에 접근할 수 있으므로, 조회 최대 8회로 제한했던 저장된 벤치마크와 조건이 다릅니다. 실습 시간이나 정답을 기존 실험 수치로 간주하지 않습니다.

## 내용
- {variant}/records.jsonl: 원본 62,604개 항목 전체, 두 버전 바이트 동일.
- {variant}/knowledge.sqlite: {'docs와 FTS5 검색. 모든 원본 분류 열을 문서에 보존.' if variant=='plain' else '같은 문서·검색에 nodes/labels/edges/membership 추가. 의미 모델 JSON과 최초 제안도 포함.'}
- tools/: 저장된 실험과 같은 읽기 전용 조회 코드. query_local.py는 수업용 CLI 래퍼.
- questions.json: 대규모 질문 6개. 정답을 모델에게 주지 않고 먼저 답하게 합니다.
- PROVENANCE.md: 출처, 변환, 설계 및 테스트 이력.

listedUnder는 원본에 기재된 가장 가까운 상위 분류군입니다. 결측 계급을 보충하지 않으며 생물학적 직접 부모로 단정하지 않습니다. 이 실험은 SQLite와 JSON 의미 모델을 사용하며 RDF/OWL 추론 실험이 아닙니다.
'''
        if variant=='ontology':readme+='\n온톨로지 집계 예제: `python3 query_local.py compose --request example-compose.json`\n'
        cli=f'''"""Read-only local teaching CLI. No LLM or API calls."""
import argparse,json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT/'tools'))
from complex_retrieve import ComplexRetriever
p=argparse.ArgumentParser();p.add_argument('action',choices=['search','read'{",'compose'" if variant=='ontology' else ''}]);p.add_argument('value',nargs='?');p.add_argument('--offset',type=int,default=0);p.add_argument('--request',type=Path);a=p.parse_args()
r=ComplexRetriever(ROOT/'{variant}/knowledge.sqlite',{variant=='ontology'})
try:
    if a.action=='search':
        if not a.value:p.error('search needs text')
        result=r.search(a.value,a.offset)
    elif a.action=='read':
        if not a.value:p.error('read needs a KTSN ID')
        result=r.read([a.value])
    else:
        if not a.request:p.error('compose needs --request JSON')
        result=r.compose(**json.loads(a.request.read_text(encoding='utf-8')))
    print(json.dumps(result,ensure_ascii=False,indent=2))
finally:r.close()
'''
        files={f'{variant}/'+p.name:p.read_bytes() for p in (source/variant).iterdir() if p.is_file() and p.name!='README.md'}
        files.update({'START-HERE.md':readme.encode(),'PROVENANCE.md':provenance.encode(),'query_local.py':cli.encode(),'questions.json':(kit/'questions.json').read_bytes()})
        files[f'{variant}/README.md']=readme.encode()
        for name in ['retrieve.py','complex_retrieve.py']:files['tools/'+name]=(source/'src'/name).read_bytes()
        if variant=='ontology':
            q=questions[1];proof=q['oracle_proof']
            req={'ids':[a['id'] for a in proof['anchors']],'scope_rank':proof['scope_rank_request'],'exclusions':proof['exclusions'],'group_rank':'family','min_count':100,'top_k':10}
            files['example-compose.json']=json.dumps(req,ensure_ascii=False,indent=2).encode()
        package_manifest={k:{'bytes':len(v),'sha256':sha(v)} for k,v in files.items()}
        files['MANIFEST.json']=json.dumps(package_manifest,ensure_ascii=False,indent=2).encode()
        out=downloads/f'species-{variant}-week4.zip'
        with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
            for name,body in sorted(files.items()):
                info=zipfile.ZipInfo(f'species-{variant}/{name}',date_time=(2026,10,20,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16
                z.writestr(info,body,compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
        manifest['packages'][variant]={'file':out.name,'bytes':out.stat().st_size,'sha256':sha(out.read_bytes()),'members':package_manifest}
        print(variant,out.stat().st_size,flush=True)
    for key,entry in manifest['packages'].items():
        old=old_manifest.get('packages',{}).get(key,{})
        if old.get('sha256')==entry['sha256'] and old.get('download_url'):entry['download_url']=old['download_url']
    for key in ['drive_folder_url','operating_kit','akm_skills']:
        if key in old_manifest:manifest[key]=old_manifest[key]
    dump(kit/'manifest.json',manifest)
    write(kit/'SHA256SUMS.txt',''.join(f"{v['sha256']}  {v['file']}\n" for v in manifest['packages'].values()))

if __name__=='__main__':main()
