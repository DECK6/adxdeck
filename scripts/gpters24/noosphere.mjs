import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {noosphere} from '../../ontology/study/assets/noosphere-data.mjs';
import {validate,toMarkdown,sourceRegister} from '../../ontology/study/assets/noosphere-core.mjs';
import {zipFiles} from './personal.mjs';

export async function writeNoosphere(root){
 const errors=validate(noosphere);if(errors.length)throw Error(errors.join('\n'));
 const prompt='ontology.json과 ontology.md, sources.md를 읽고 누스피어 세계관을 설명해줘. 작품 하나를 고르면 참고 이론·개념·역학까지 연결을 따라가되 각 관계의 실제 방향·뜻·근거를 보여줘. 정본의 해석과 새로운 해석 제안, 서사 설정을 구별해. 회복은 다섯 번째 역학이 아니라 잔향에서 다음 감응으로 넘어가는 조건으로 다뤄. 원전 쪽수나 명시되지 않은 영향 관계, 작품의 제작·전시 완료를 만들어내지 마. 답할 근거가 부족하면 필요한 다음 질문을 남겨줘.\n';
 const files={
  'README.md':'# 누스피어 세계관 온톨로지\n\n육대근 · DECK / 2026-10-06\n\n이론·문헌 → 개념 → 역학·조건 → 작품의 관계를 따라가는 독립 예제입니다. 개인 커리어 인터뷰 예제와 별도 형식입니다.\n\n1. 온라인: https://dexa.art/ontology/study/noosphere.html\n2. 오프라인: 압축을 푼 폴더에서 `python3 -m http.server 8000`을 실행하고 http://localhost:8000/ 를 엽니다.\n3. 문서만 읽으려면 ontology.md와 sources.md를 엽니다.\n4. AI에 질문하려면 JSON·Markdown·sources.md와 agent-prompt.txt를 함께 제공합니다.\n\n정본에 기록은 작가 문서의 연결을 뜻합니다. 해석 제안과 서사 설정은 별도로 표시합니다. 회복은 4역학과 구별되는 조건이며, 기획과 작품 완료를 구별합니다. 원전 인용과 쪽수는 추가 대조가 필요합니다.\n',
  'ontology.json':JSON.stringify(noosphere,null,2)+'\n',
  'ontology.md':toMarkdown(noosphere),
  'sources.md':sourceRegister(noosphere),
  'agent-prompt.txt':prompt
 };
 const folder=new URL('downloads/noosphere/',root);await mkdir(folder,{recursive:true});
 for(const [name,text] of Object.entries(files))await writeFile(new URL(name,folder),text);
 const page=(await readFile(new URL('noosphere.html',root),'utf8'))
  .replaceAll('href="week2.html"','href="https://dexa.art/ontology/study/week2.html"')
  .replaceAll('href="./"','href="https://dexa.art/ontology/study/"')
  .replaceAll('href="downloads/noosphere/','href="')
  .replaceAll('href="downloads/noosphere-ontology.zip"','href="https://dexa.art/ontology/study/downloads/noosphere-ontology.zip"');
 const bundled={...files,'index.html':page};
 for(const file of ['noosphere.css','noosphere-data.mjs','noosphere-core.mjs','noosphere-app.mjs'])bundled['assets/'+file]=await readFile(new URL('assets/'+file,root),'utf8');
 await writeFile(new URL('downloads/noosphere-ontology.zip',root),zipFiles(bundled));
 return {nodes:noosphere.nodes.length,relations:noosphere.relations.length,files:Object.keys(bundled)};
}
