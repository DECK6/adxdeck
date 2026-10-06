import {weekOneFiles} from './week1.mjs';
import {resourcePage} from './resources.mjs';
import {publicAkm,publicFile} from './akm-public.mjs';
import {existsSync} from 'node:fs';
import {mkdir,writeFile,readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {domains} from './data.mjs';
import {filesForWeek,validate,query} from './core.mjs';
import {createProject,personalFiles,zipFiles} from './personal.mjs';
import {sample as personalSample,toMarkdown as personalMarkdown,promptFor as personalPrompt} from '../../ontology/study/assets/personal-ontology-core.mjs';
import {writeNoosphere} from './noosphere.mjs';
const root=new URL('../../ontology/study/',import.meta.url),downloads=new URL('downloads/',root);
await mkdir(downloads,{recursive:true});
await writeNoosphere(root);
// The interview skill carries the exact web model without its personal demo data.
const modelSource=await readFile(new URL('assets/personal-ontology-core.mjs',root),'utf8');
const modelStart=modelSource.indexOf('export function sample('),modelEnd=modelSource.indexOf('const str=',modelStart);
if(modelStart<0||modelEnd<modelStart)throw Error('Cannot locate the personal demo boundary.');
const portableModel=(modelSource.slice(0,modelStart)+modelSource.slice(modelEnd)).replace("import {extendCareer} from './personal-career.mjs';\n",'');
const skillName='personal-ontology-interview',skillFiles={'scripts/model.mjs':portableModel};
async function collectSkill(folder,prefix=''){
 for(const entry of await readdir(folder,{withFileTypes:true})){
  const path=prefix+entry.name;
  if(entry.isDirectory())await collectSkill(new URL(entry.name+'/',folder),path+'/');
  else skillFiles[path]=await readFile(new URL(entry.name,folder),'utf8');
 }
}
await collectSkill(new URL('./skills/'+skillName+'/',import.meta.url));
for(const [name,text] of Object.entries(skillFiles)){const path=new URL(skillName+'/'+name,downloads);await mkdir(new URL('.',path),{recursive:true});await writeFile(path,text);}
await writeFile(new URL(skillName+'.zip',downloads),zipFiles(Object.fromEntries(Object.entries(skillFiles).map(([name,text])=>[skillName+'/'+name,text]))));
await writeFile(new URL(skillName+'.json',downloads),JSON.stringify({name:skillName,version:'2026-10-06',files:Object.entries(skillFiles).map(([path,text])=>({path,bytes:Buffer.byteLength(text),sha256:createHash('sha256').update(text).digest('hex')}))},null,2));
const personalExample=personalSample(4),personalWeek2={
 'README.md':'# GPTers 24기 2주차 · 나를 둘러싼 세계\n\n작성·개정: 2026-10-06 · 수업: 2026-10-07\n\n육대근의 실제 커리어·작품·프로젝트를 연결한 실습 예제입니다. 주변 인물·기관은 익명화했습니다. 커리어 DB 95개 기록과 후속 프로젝트 기록 14개를 연결하며 구상·증빙 보강·과거 시점을 보존합니다.\n\n1. https://dexa.art/ontology/study/week2.html 에서 4단계 커리어 전체를 펼칩니다.\n2. sample.json은 JSON 가져오기로 편집할 수 있습니다. ontology.md는 종류·관계·근거를 포함합니다.\n3. agent-prompt.txt를 자기 원문과 함께 에이전트에게 전달하고 실제 답변과 수정 사항을 기록합니다.\n4. 다른 사람의 사례를 자기 이력으로 사용하지 말고 자기 자료로 대상을 바꿉니다.\n\n웹 전체 오프라인 ZIP을 사용할 때는 압축을 푼 폴더에서 `python3 -m http.server 8000`을 실행하고 http://localhost:8000/week2.html 을 엽니다.\n',
 'sample.json':JSON.stringify(personalExample,null,2),
 'ontology.md':personalMarkdown(personalExample,'2026-10-07'),
 'agent-prompt.txt':personalPrompt(personalExample,'2026-10-07')
};
await mkdir(new URL('week2/',downloads),{recursive:true});
for(const [name,text] of Object.entries(personalWeek2))await writeFile(new URL('week2/'+name,downloads),text);
await writeFile(new URL('week2-personal-ontology.zip',downloads),zipFiles(personalWeek2));
await writeFile(new URL('resources.html',root),resourcePage());
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
const provenance=`# 실습 자료의 범위와 출처\n\n기존 웹 실습실 개정 2026-09-14 · 최신 개정 2026-09-30 · GPTers 24기 · DECK / DEXA\n\n## 이번 개정\nJev 교안 최초 작성 2026-09-26, 최신 개정 2026-09-30. week1.html에서 kb-jev·Ontology + Jev 사례, AKM 결합안과 15분 정의 검토 실습을 읽는다. R01–R04 그래프 예제와 N01–N05 Jev 예제는 서로 다른 합성 자료다. 스터디장 확인 답안은 instructor.html로 분리하고 스터디멤버 ZIP에는 넣지 않는다.\n\n## 최종 커리큘럼\nhttps://www.gpters.org/study/llm-ontology\n\n## 작은 공통 예제 · 요리와 재료\n${domains.recipe.provenance}\n${domains.recipe.scope}\n\n## 확장 사례 · 초등교육\n${domains.education.provenance}\n${domains.education.scope}\n\n## 확장 사례 · 한국 주거 건축\n${domains.architecture.provenance}\n${domains.architecture.scope}\n기존 기초 교안과 FAMILY-02 그림: https://dexa.art/ontology/\n\n## 도구 참고\n- AKM ${publicAkm.repo}\n- 확인 기준 ${publicAkm.commit} · AKM ${publicAkm.version} / schema ${publicAkm.schema}\n- 공개 규칙·템플릿: ${publicFile('99-system/SCHEMA.md')} / ${publicFile('99-system/ROUTER.md')}\n- 공개 어댑터: ${publicFile('adapters/claude-code/README.md')} / ${publicFile('adapters/codex/README.md')}\n- Obsidian Graph view https://help.obsidian.md/plugins/graph\n- Protégé https://protege.stanford.edu/\n- 공개 AKM은 Markdown·규칙·템플릿·검사 스크립트를 제공하며, 문서/온톨로지 그래프와 편집 화면은 이 교재의 별도 도구다. qmd·개인 Studio·고정 개인 메모 파일은 설치 요건이 아니다.\n\n## 내 주제 실습\nmy-topic.html에서 스터디멤버가 자료 3–5개로 판단 하나를 고르고, 자신의 대상·필요 자원·현재 상태·관계의 뜻·판단 규칙·보류 조건을 설계합니다. 질문별 예상 답과 근거, 실제 평가를 각각 기록하고 조건 하나를 바꿔 검증합니다. 문서 링크·대상·관계·속성을 직접 편집할 수 있습니다. 개인 자료는 브라우저에 저장하며 프로젝트 JSON과 주차별 ZIP으로 내보냅니다. my-topic-starter.zip은 빈 4주 양식입니다. idea-to-akm-prompt.md는 아이디어 메모를 원문·맥락·지식 노트와 작은 온톨로지로 정리하도록 코딩 에이전트에 전달하는 요청문입니다. 웹에서 메모를 입력해 개인화한 요청문을 복사할 수 있습니다.\n\n## AKM 적용\n공통 시나리오의 조건·상태는 30-context/projects에 분류하고, 원문은 sourcePath와 날짜를 포함한 별도 파일명으로 보존한다. practice/note-paths.json에서 문서 ID와 실제 경로를 연결한다. 개인 wiki-drafts는 분류 전 교재 양식이며 모든 초안을 20-knowledge로 자동 승격하지 않는다. 공개 AKM 검사기와 웹 관계 검사기를 구분한다.\n\n## 검증 범위\n웹 질의는 현재 모델로 계산하는 결정적 미리보기다. 실제 LLM 성능평가는 스터디멤버가 같은 질문으로 실행하고 기록한다. 새 실습 자료를 기존 교육/건축 온톨로지의 전체 검증 결과로 취급하지 않는다. OWL export는 표준 표현의 입문용 부분집합이며, 웹/Python 검사는 별도 경량 검사다.\n`;
await writeFile(new URL('PROVENANCE.md',downloads),provenance+'\n## 추가 자료실 · 2026-09-30\n\nresources.html에서 한국 주거 건축·건설 온톨로지 v0.3과 모션리듬 스킬+온톨로지 세트를 내려받는다. 건축은 2026-09-05 조사 스냅샷의 문서·OWL·SHACL·JSON Schema·합성 예제·검증 도구다. 모션리듬은 스킬 폴더에 개념·장면·31개 프레임 이미지와 조회 스크립트를 포함한다. 원본 영상은 출처 링크로 연결한다. 파일 목록·크기·SHA-256은 resource-packs.json에서 확인한다. 이 두 묶음은 기존 작은 공통 실습과 구별한 확장 자료다.\n');
await writeFile(new URL('manifest.json',downloads),JSON.stringify(manifests,null,2));
await writeFile(new URL('jev-week1-student.zip',downloads),zipFiles(weekOneFiles(1)));
execFileSync('uv',['run','--with','markdown==3.9','python',new URL('./render-week1.py',import.meta.url).pathname],{stdio:'inherit'});
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
   info=ZipInfo(name,(2026,9,30,0,0,0));info.compress_type=ZIP_DEFLATED;info.external_attr=0o644<<16
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
