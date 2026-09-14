import {publicAkm,publicFile} from './akm-public.mjs';
import {existsSync} from 'node:fs';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {domains} from './data.mjs';
import {filesForWeek,validate,query} from './core.mjs';
import {createProject,personalFiles,zipFiles} from './personal.mjs';
const root=new URL('../../ontology/study/',import.meta.url),downloads=new URL('downloads/',root);
await mkdir(downloads,{recursive:true});
let previous=[];try{previous=JSON.parse(await readFile(new URL('manifest.json',downloads),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
const manifests=[];
for(const d of Object.values(domains)){
 if(validate(d).length)throw Error('Invalid fixture '+d.id);
 for(let w=1;w<=4;w++){
  const files=filesForWeek(d,w),base=new URL(`${d.id}/week${w}/`,downloads);
  for(const [name,content] of Object.entries(files)){const dest=new URL(name,base);await mkdir(new URL('.',dest),{recursive:true});await writeFile(dest,content);}
  manifests.push({domain:d.id,week:w,files:Object.entries(files).map(([path,text])=>({path,bytes:Buffer.byteLength(text),sha256:createHash('sha256').update(text).digest('hex')}))});
 }
}
// Only obsolete files owned by the previous generated manifest are moved to Trash.
const stale=[];
for(const old of previous){
 if(!Object.hasOwn(domains,old.domain)||![1,2,3,4].includes(old.week))throw Error('Invalid prior bundle');
 const current=manifests.find(m=>m.domain===old.domain&&m.week===old.week),keep=new Set(current.files.map(f=>f.path));
 for(const f of old.files){if(f.path.startsWith('/')||f.path.split('/').includes('..'))throw Error('Invalid prior generated path');if(!keep.has(f.path)){const path=new URL(`${old.domain}/week${old.week}/${f.path}`,downloads).pathname;if(existsSync(path))stale.push(path);}}
}
if(stale.length){execFileSync('trash',stale);console.log(`Moved ${stale.length} superseded generated files to Trash.`);}
const provenance=`# 실습 자료의 범위와 출처\n\n2026-09-14 · GPTers 24기 · DECK / DEXA\n\n## 최종 커리큘럼\nhttps://www.gpters.org/study/llm-ontology\n\n## 작은 공통 예제 · 요리와 재료\n${domains.recipe.provenance}\n${domains.recipe.scope}\n\n## 확장 사례 · 초등교육\n${domains.education.provenance}\n${domains.education.scope}\n\n## 확장 사례 · 한국 주거 건축\n${domains.architecture.provenance}\n${domains.architecture.scope}\n기존 기초 교안과 FAMILY-02 그림: https://dexa.art/ontology/\n\n## 도구 참고\n- AKM ${publicAkm.repo}\n- 확인 기준 ${publicAkm.commit} · AKM ${publicAkm.version} / schema ${publicAkm.schema}\n- 공개 규칙·템플릿: ${publicFile('99-system/SCHEMA.md')} / ${publicFile('99-system/ROUTER.md')}\n- 공개 어댑터: ${publicFile('adapters/claude-code/README.md')} / ${publicFile('adapters/codex/README.md')}\n- Obsidian Graph view https://help.obsidian.md/plugins/graph\n- Protégé https://protege.stanford.edu/\n- 공개 AKM은 Markdown·규칙·템플릿·검사 스크립트를 제공하며, 문서/온톨로지 그래프와 편집 화면은 이 교재의 별도 도구다. qmd·개인 Studio·고정 개인 메모 파일은 설치 요건이 아니다.\n\n## 내 주제 실습\nmy-topic.html에서 수강생이 자료 3–5개로 판단 하나를 고르고, 자신의 대상·필요 자원·현재 상태·관계의 뜻·판단 규칙·보류 조건을 설계합니다. 질문별 예상 답과 근거, 실제 평가를 각각 기록하고 조건 하나를 바꿔 검증합니다. 문서 링크·대상·관계·속성을 직접 편집할 수 있습니다. 개인 자료는 브라우저에 저장하며 프로젝트 JSON과 주차별 ZIP으로 내보냅니다. my-topic-starter.zip은 빈 4주 양식입니다. idea-to-akm-prompt.md는 아이디어 메모를 원문·맥락·지식 노트와 작은 온톨로지로 정리하도록 코딩 에이전트에 전달하는 요청문입니다. 웹에서 메모를 입력해 개인화한 요청문을 복사할 수 있습니다.\n\n## AKM 적용\n공통 시나리오의 조건·상태는 30-context/projects에 분류하고, 원문은 sourcePath와 날짜를 포함한 별도 파일명으로 보존한다. practice/note-paths.json에서 문서 ID와 실제 경로를 연결한다. 개인 wiki-drafts는 분류 전 교재 양식이며 모든 초안을 20-knowledge로 자동 승격하지 않는다. 공개 AKM 검사기와 웹 관계 검사기를 구분한다.\n\n## 검증 범위\n웹 질의는 현재 모델로 계산하는 결정적 미리보기다. 실제 LLM 성능평가는 참여자가 같은 질문으로 실행하고 기록한다. 새 실습 자료를 기존 교육/건축 온톨로지의 전체 검증 결과로 취급하지 않는다. OWL export는 표준 표현의 입문용 부분집합이며, 웹/Python 검사는 별도 경량 검사다.\n`;
await writeFile(new URL('PROVENANCE.md',downloads),provenance);
await writeFile(new URL('manifest.json',downloads),JSON.stringify(manifests,null,2));
const starter={};
for(let w=1;w<=4;w++)for(const [name,text] of Object.entries(personalFiles(createProject(),w)))starter[`week${w}/${name}`]=text;
await writeFile(new URL('my-topic-starter.zip',downloads),zipFiles(starter));
const result=await Bun.build({entrypoints:['app.mjs','personal-app.mjs'].map(name=>new URL('./'+name,import.meta.url).pathname),outdir:new URL('assets/',root).pathname,target:'browser',format:'iife',minify:true,naming:'[name].js'});
if(!result.success)throw Error(JSON.stringify(result.logs));
// ZIPs are generated from the same public file tree; timestamps are frozen.
execFileSync('python3',['-c',`
from pathlib import Path
from zipfile import ZipFile,ZipInfo,ZIP_DEFLATED
root=Path(${JSON.stringify(root.pathname)});d=root/'downloads'
def zip_entries(path, entries):
 with ZipFile(path,'w',compression=ZIP_DEFLATED) as z:
  for name,p in sorted(entries):
   info=ZipInfo(name,(2026,9,12,0,0,0));info.compress_type=ZIP_DEFLATED;info.external_attr=0o644<<16
   z.writestr(info,p.read_bytes())
for domain in ['recipe','education','architecture']:
 for week in range(1,5):
  folder=d/domain/f'week{week}'
  zip_entries(d/f'{domain}-week{week}.zip',[(p.relative_to(folder).as_posix(),p) for p in folder.rglob('*') if p.is_file()])
 folder=d/domain
 zip_entries(d/f'{domain}-all-weeks.zip',[(p.relative_to(folder).as_posix(),p) for p in folder.rglob('*') if p.is_file()])
zip_entries(d/'web-lab-offline.zip',[(p.relative_to(root).as_posix(),p) for p in root.rglob('*') if p.is_file() and p.name!='web-lab-offline.zip'])
print('Generated 4 primary recipe ZIPs, 8 extension ZIPs, 3 domain ZIPs, personal starter and offline web ZIP.')
`],{stdio:'inherit'});
console.log(JSON.stringify({domains:3,primaryNotes:4,primaryEntities:8,weeklyBundles:12,validation:Object.fromEntries(Object.values(domains).map(d=>[d.id,validate(d)])),queryStatus:Object.fromEntries(Object.values(domains).map(d=>[d.id,d.questions.map((q,i)=>query(d,i).status)]))},null,2));
