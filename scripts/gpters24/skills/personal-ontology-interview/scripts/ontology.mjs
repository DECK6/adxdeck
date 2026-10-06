import {readFile,mkdir,writeFile,stat} from 'node:fs/promises';
import {resolve,join,dirname} from 'node:path';
import {TYPES,RELATIONS,STATUS,TASK_STATUS,validate,parseImport,toMarkdown,query,eligible} from './model.mjs';

const args=process.argv.slice(2),command=args.shift(),pos=[],opts={};
const print=x=>process.stdout.write(JSON.stringify(x,null,2)+'\n');
const exists=async p=>{try{await stat(p);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}};
try{
 for(let i=0;i<args.length;i++){
  if(args[i].startsWith('--')){const key=args[i].slice(2);if(!['dir','name','out','kind','task','topic','date'].includes(key)||!args[i+1]||args[i+1].startsWith('--'))throw Error('옵션을 확인하세요: '+args[i]);opts[key]=args[++i];}
  else pos.push(args[i]);
 }
 if(command==='schema'){print({types:TYPES,relations:RELATIONS,certainty:STATUS,taskStatus:TASK_STATUS});}
 else if(command==='init'){
  const dir=resolve(opts.dir||'personal-ontology'),name=(opts.name||'나').trim();
  const d={version:1,title:'나를 둘러싼 세계',question:'',nodes:[{id:'self',label:name,type:'person',note:''}],relations:[],actualAnswer:'',reflection:''};
  const errors=validate(d);if(errors.length)throw Error(errors.join('\n'));
  const files={
   'ontology.json':JSON.stringify(d,null,2),
   'interview-state.json':JSON.stringify({version:1,stage:'목표 질문부터 시작',goal:'',coveredTopics:[],openQuestions:[],nextQuestion:'이 온톨로지로 어떤 질문에 답하거나 어떤 일을 더 쉽게 하고 싶으신가요?',artifacts:['ontology.json','interview.md','questions.md']},null,2),
   'interview.md':'# 인터뷰 기록\n\n질문·답변의 필요한 발췌에 I001부터 출처 ID를 붙입니다. 아직 인터뷰 답변을 기록하지 않았습니다.\n',
   'questions.md':'# 질문으로 사용하기\n\n## 활용 질문\n아직 정하지 않음\n\n## 실제 에이전트 답변·근거 경로\n아직 실행하지 않음\n\n## 미확인 사항·수정 전후\n아직 기록하지 않음\n'
  };
  for(const name of [...Object.keys(files),'ontology.md'])if(await exists(join(dir,name)))throw Error('기존 파일이 있습니다. 새로 초기화하지 말고 읽고 이어가세요: '+name);
  await mkdir(dir,{recursive:true});
  for(const [name,text] of Object.entries(files))await writeFile(join(dir,name),text,{flag:'wx'});
  print({created:dir,files:Object.keys(files),next:'자료와 목표를 확인한 뒤 첫 인터뷰 질문을 시작하세요.'});
 }else if(['validate','export','query'].includes(command)){
  if(pos.length!==1)throw Error('ontology.json 경로 하나를 지정하세요.');
  const file=resolve(pos[0]);if((await stat(file)).size>1000000)throw Error('파일 크기는 1MB까지입니다.');
  const d=parseImport(await readFile(file,'utf8')),now=new Date();
  const day=opts.date||`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||Number.isNaN(Date.parse(day))||new Date(day).toISOString().slice(0,10)!==day)throw Error('기준일을 YYYY-MM-DD로 지정하세요.');
  if(command==='validate')print({valid:true,nodes:d.nodes.length,relations:d.relations.length,excludedRelations:d.relations.filter(e=>!eligible(e,day)).length,scope:'구조 검사이며 사실의 진위를 판정하지 않습니다.'});
  else if(command==='export'){
   const out=resolve(opts.out||join(dirname(file),'ontology.md'));if(out===file)throw Error('원본 JSON과 출력 파일 경로를 구별하세요.');
   await mkdir(dirname(out),{recursive:true});await writeFile(out,toMarkdown(d,day));print({written:out});
  }else{
   const kind=opts.kind||'work';if(!['work','people','reuse','artworks','career'].includes(kind))throw Error('지원하는 조회: work, people, reuse, artworks, career');
   const find=(value,type)=>{const matches=d.nodes.filter(n=>n.type===type&&(n.id===value||n.label===value));if(matches.length!==1)throw Error('대상을 유일하게 찾을 수 없습니다. 정확한 ID를 지정하세요: '+value);return matches[0].id;};
   let target='';
   if(['people','reuse'].includes(kind)){if(!opts.task)throw Error('--task에 작업 ID를 지정하세요.');target=find(opts.task,'task');}
   if(kind==='career'&&opts.topic)target=find(opts.topic,'concept');
   print(query(d,kind,target,day));
  }
 }else throw Error('사용법: ontology.mjs init | schema | validate FILE | export FILE [--out FILE] | query FILE --kind KIND');
}catch(e){process.stderr.write(e.message+'\n');process.exitCode=1;}
