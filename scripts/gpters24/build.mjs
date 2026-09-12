import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {domains} from './data.mjs';
import {filesForWeek,validate,query} from './core.mjs';
import {createProject,personalFiles,zipFiles} from './personal.mjs';
const root=new URL('../../ontology/study/',import.meta.url),downloads=new URL('downloads/',root);
await mkdir(downloads,{recursive:true});
const manifests=[];
for(const d of Object.values(domains)){
 if(validate(d).length)throw Error('Invalid fixture '+d.id);
 for(let w=1;w<=4;w++){
  const files=filesForWeek(d,w),base=new URL(`${d.id}/week${w}/`,downloads);
  for(const [name,content] of Object.entries(files)){const dest=new URL(name,base);await mkdir(new URL('.',dest),{recursive:true});await writeFile(dest,content);}
  manifests.push({domain:d.id,week:w,files:Object.entries(files).map(([path,text])=>({path,bytes:Buffer.byteLength(text),sha256:createHash('sha256').update(text).digest('hex')}))});
 }
}
const provenance=`# 실습 자료의 범위와 출처\n\n2026-09-12 · GPTers 24기 · DECK / DEXA\n\n## 최종 커리큘럼\nhttps://www.gpters.org/study/llm-ontology\n\n## 초등교육\n${domains.education.provenance}\n${domains.education.scope}\n\n## 한국 주거 건축\n${domains.architecture.provenance}\n${domains.architecture.scope}\n기존 기초 교안과 FAMILY-02 그림: https://dexa.art/ontology/\n\n## 도구 참고\n- AKM https://github.com/DECK6/akm\n- Obsidian Graph view https://help.obsidian.md/plugins/graph\n- Protégé https://protege.stanford.edu/\n- 로컬 AKM Studio 0.1.0: 문서 목록·상세 보기·검토 흐름 참고. 그래프 기능을 기존 Studio에 있던 것으로 주장하지 않는다.\n\n## 내 주제 실습\nmy-topic.html에서 수강생이 자신의 범위·질문·원자료·문서 링크·대상·관계·속성·실제 평가를 기록합니다. 개인 자료는 브라우저에 저장하며 프로젝트 JSON과 주차별 ZIP으로 내보냅니다. my-topic-starter.zip은 빈 4주 양식입니다.\n\n## 검증 범위\n웹 질의는 현재 모델로 계산하는 결정적 미리보기다. 실제 LLM 성능평가는 참여자가 같은 질문으로 실행하고 기록한다. 새 실습 자료를 기존 교육/건축 온톨로지의 전체 검증 결과로 취급하지 않는다. OWL export는 표준 표현의 입문용 부분집합이며, 웹/Python 검사는 별도 경량 검사다.\n`;
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
for domain in ['education','architecture']:
 for week in range(1,5):
  folder=d/domain/f'week{week}'
  zip_entries(d/f'{domain}-week{week}.zip',[(p.relative_to(folder).as_posix(),p) for p in folder.rglob('*') if p.is_file()])
 folder=d/domain
 zip_entries(d/f'{domain}-all-weeks.zip',[(p.relative_to(folder).as_posix(),p) for p in folder.rglob('*') if p.is_file()])
zip_entries(d/'web-lab-offline.zip',[(p.relative_to(root).as_posix(),p) for p in root.rglob('*') if p.is_file() and p.name!='web-lab-offline.zip'])
print('Generated 8 weekly ZIPs, 2 full-domain ZIPs, and offline web ZIP.')
`],{stdio:'inherit'});
console.log(JSON.stringify({domains:2,notes:20,questions:6,weeklyBundles:8,validation:Object.fromEntries(Object.values(domains).map(d=>[d.id,validate(d)])),queryStatus:Object.fromEntries(Object.values(domains).map(d=>[d.id,d.questions.map((q,i)=>query(d,i).status)]))},null,2));
