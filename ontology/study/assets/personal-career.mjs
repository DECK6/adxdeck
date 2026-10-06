import {CAREER_RECORDS} from './personal-career-data.mjs';

export function extendCareer(d){
 const nodes=new Map(d.nodes.map(n=>[n.id,n]));
 const add=n=>{if(!nodes.has(n.id)){nodes.set(n.id,n);d.nodes.push(n);}return nodes.get(n.id);};
 const relation=(from,predicate,to,source,status='confirmed',scope='')=>{
  const found=d.relations.find(e=>e.from===from&&e.predicate===predicate&&e.to===to&&e.scope===scope);
  if(found){if(!found.source.includes(source))found.source+=' / '+source;return;}
  d.relations.push({id:`career-edge-${d.relations.length+1}`,from,predicate,to,source,status,scope,validFrom:'',validTo:''});
 };
 const topicIds=new Map(d.nodes.filter(n=>n.type==='concept').map(n=>[n.label,n.id]));
 const orgIds=new Map(d.nodes.filter(n=>n.type==='organization').map(n=>[n.label,n.id]));
 const roleIds=new Map(d.nodes.filter(n=>n.type==='role').map(n=>[n.label,n.id]));
 for(const r of CAREER_RECORDS){
  const n=add({id:r.id,label:r.label,type:r.type,note:r.note,group:r.group,period:r.period,evidence:r.evidence,sourceCodes:[],topics:[]});
  n.group ||=r.group;n.period ||=r.period;n.evidence ||=r.evidence;n.sourceCodes||=[];n.topics||=[];
  if(!n.sourceCodes.includes(r.sourceCode))n.sourceCodes.push(r.sourceCode);
  for(const topic of r.topics)if(!n.topics.includes(topic))n.topics.push(topic);
  if(!n.note.includes(r.evidence))n.note+=` · ${r.evidence}`;
  // Existing small-demo work records keep their original descriptions and IDs.
  if(r.id==='project3'){n.label=r.label;n.note=r.note+' · '+r.evidence;}
  const source=`${r.sourceCode} ${r.sourceCode.startsWith('K')?'커리어 DB':'AKM 프로젝트'} 발췌 · ${r.label} · ${r.period} · ${r.evidence}. ${r.note}`;
  const selfPredicate={project:'participates',artwork:'documentsWork',experience:'hasExperience'}[n.type];
  relation('self',selfPredicate,n.id,source,r.certainty);
  for(const label of r.organizations){
   if(!orgIds.has(label)){const id=`career-org-${orgIds.size+1}`;orgIds.set(label,id);add({id,label,type:'organization',note:'커리어 DB에서 일관된 별칭으로 가린 기관. 연결만으로 발주·고용·승인 권한을 추정하지 않는다.'});}
   relation(orgIds.get(label),{project:'associatedOrg',artwork:'artOrg',experience:'experienceOrg'}[n.type],n.id,source,r.certainty);
  }
  for(const label of r.topics){
   if(!topicIds.has(label)){const id=`career-topic-${topicIds.size+1}`;topicIds.set(label,id);add({id,label,type:'concept',note:'기록의 주제·분류 태그. 숙련도나 실제 구현 완료를 뜻하지 않는다.'});}
   relation(n.id,{project:'projectTopic',artwork:'artworkTopic',experience:'experienceTopic'}[n.type],topicIds.get(label),source+` / 원문 분류: ${label}`,r.certainty);
  }
  if(r.role){
   if(!roleIds.has(r.role)){const id=`career-role-${roleIds.size+1}`;roleIds.set(r.role,id);add({id,label:r.role,type:'role',note:'이 역할을 기록한 활동 범위 안에서만 읽는다. 과거 역할은 현재의 권한을 뜻하지 않는다.'});}
   relation('self','hasRole',roleIds.get(r.role),source,r.certainty,n.id);
  }
 }
 for(const [i,label] of ['AX 전문가','AI 교육자','미디어 아티스트','문화기획자'].entries()){
  const id=`career-occupation-${i+1}`;add({id,label,type:'occupation',note:'커리어 DB의 프로필·경력에 기록된 활동 정체성. 개별 작업 권한과 구별한다.'});
  relation('self','hasOccupation',id,'K 프로필 원자·경력 DB: AX·AI 교육·미디어아트·문화기획 활동 기록.');
 }
 relation('extended-02','produces','career-021','X02 상상유랑 프로젝트 기록: 작품과 파일럿·확장 제작 활동을 구별한다.');
 relation('career-004','experienceProject','extended-01','K004 / X01 PRECTXE의 경력 기록과 페스티벌 프로젝트 기록을 연결한다.');
 relation('career-005','experienceProject','career-027','K005 / K027 같은 문화공간에서의 경력과 운영 프로젝트를 연결한다.');
 relation('career-008','experienceProject','career-026','K008 / K026 / K063 이머시브 모듈의 경력과 교육·멘토링 프로젝트를 연결한다.');
 relation('extended-14','produces','work5','X14 / S10 Noosphere Layer 세계관의 Threshold #01 구상. 제작·전시 완료를 주장하지 않는다.');
 d.title='육대근의 커리어·작품·프로젝트 온톨로지';
 d.question='내 커리어에서 AX·미디어아트·교육 경험은 어떤 프로젝트와 개념으로 연결되나요? 근거와 확인이 필요한 부분도 알려주세요.';
 return d;
}
