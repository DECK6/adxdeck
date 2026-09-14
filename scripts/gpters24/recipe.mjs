const ingredient=(id,label,noteId)=>({id,label,type:'Ingredient',noteId,attrs:{}});
export const recipe={
 id:'recipe',name:'요리와 보유 재료',eyebrow:'START SMALL',accent:'#286f60',
 intro:'메뉴 3개 · 재료 4개 · 우리 집 보관함 1개로 시작합니다.',
 scope:'학습용으로 정한 필수 재료의 보유 여부만 확인합니다. 기본 시나리오는 보유 목록을 전부 확인한 상태이며, 목록이 미완료이면 미기록 재료는 보류합니다.',
 provenance:'2026-09-14 새로 작성한 가상 메뉴·재료 기록입니다. Schema.org Recipe의 요리·재료 표현을 참고하되 needsIngredient/hasIngredient와 보관함은 이 실습에서 정의했습니다. https://schema.org/Recipe',
 classes:{Recipe:'요리',Ingredient:'재료',Pantry:'보관함'},
 relations:{needsIngredient:{label:'필요로 한다',from:['Recipe'],to:['Ingredient']},hasIngredient:{label:'보유한다',from:['Pantry'],to:['Ingredient']}},
 notes:[
  {id:'R01',title:'간장달걀밥',body:'학습용 필수 재료는 밥, 달걀, 간장이다. D1은 이 메뉴의 ID다. R04의 보유 재료와 비교해 세 재료가 모두 확인되면 재료 충족으로 표시한다. 이 목록은 실습을 위해 단순화한 기록이다.',links:['R04']},
  {id:'R02',title:'버터간장밥',body:'학습용 필수 재료는 밥, 버터, 간장이다. D2는 이 메뉴의 ID다. 필요한 재료와 현재 보유한 재료는 서로 다른 관계다. 버터가 필요한 메뉴라는 사실만으로 버터를 보유했다고 읽지 않는다.',links:['R04']},
  {id:'R03',title:'버터달걀밥',body:'학습용 필수 재료는 밥, 버터, 달걀이다. D3는 이 메뉴의 ID다. R01·R02에 나온 밥·달걀·버터와 같은 재료 ID를 재사용한다. 같은 이름의 재료를 메뉴마다 중복 생성하지 않는다.',links:['R01','R02','R04']},
  {id:'R04',title:'우리 집 보관함과 판단 규칙',body:'기본 시나리오: 밥·달걀·간장은 있고 버터는 없다. 이번 실습의 재고 목록은 전부 확인했으며 inventoryComplete=true다. 규칙: 등록된 필수 재료가 모두 보유 관계로 연결되면 재료 충족이다. 조건 변경 실험은 버터를 추가해 세 메뉴를 다시 확인하는 것이다. 목록 확인을 미완료(inventoryComplete=false)로 바꾼 실험에서는 연결이 없는 재료를 없다고 단정하지 않고 미확인으로 남긴다. 시나리오 변경은 실습 가정이며 실제 냉장고 조사 결과가 아니다.',links:['R01','R02','R03']}
 ],
 nodes:[
  {id:'D1',label:'간장달걀밥',type:'Recipe',noteId:'R01',attrs:{}},
  {id:'D2',label:'버터간장밥',type:'Recipe',noteId:'R02',attrs:{}},
  {id:'D3',label:'버터달걀밥',type:'Recipe',noteId:'R03',attrs:{}},
  ingredient('RICE','밥','R01'),ingredient('EGG','달걀','R01'),ingredient('SOY','간장','R01'),ingredient('BUTTER','버터','R02'),
  {id:'PANTRY',label:'우리 집 보관함',type:'Pantry',noteId:'R04',attrs:{inventoryComplete:true}}
 ],
 edges:[...Object.entries({D1:['RICE','EGG','SOY'],D2:['RICE','BUTTER','SOY'],D3:['RICE','BUTTER','EGG']}).flatMap(([from,list])=>list.map(to=>({from,rel:'needsIngredient',to,source:'R0'+from.slice(1)}))),...['RICE','EGG','SOY'].map(to=>({from:'PANTRY',rel:'hasIngredient',to,source:'R04'}))],
 questions:['지금 보유 재료가 모두 충족되는 메뉴는 무엇인가요?','버터간장밥에 부족한 재료는 무엇인가요?','보관함에 버터를 추가하면 재료가 충족되는 메뉴는 어떻게 달라지나요?'],
 traps:['필요한 재료와 보유한 재료를 구분해서 읽습니다.','목록을 전부 확인한 경우에만 미기록 재료를 없다고 판단합니다.'],
 error:{from:'D1',rel:'hasIngredient',to:'BUTTER',source:'R04'},target:'PANTRY'
};
export function recipeScenario(model,{butter,complete}={}){
 const m=structuredClone(model),pantry=m.nodes.find(n=>n.id==='PANTRY');
 if(complete!==undefined&&pantry)pantry.attrs.inventoryComplete=complete;
 if(butter!==undefined){m.edges=m.edges.filter(e=>!(e.from==='PANTRY'&&e.rel==='hasIngredient'&&e.to==='BUTTER'));if(butter)m.edges.push({from:'PANTRY',rel:'hasIngredient',to:'BUTTER',source:'R04'});}
 return m;
}
export function recipeQuery(m,i){
 const by=Object.fromEntries(m.nodes.map(n=>[n.id,n])),pantry=by.PANTRY;
 const result=(status,answer,extra={})=>({status,answer,nodes:[],evidence:['R04'],...extra});
 if(!pantry)return result('UNKNOWN','보관함 기록이 없어 판단을 보류합니다.');
 const inventory=m.edges.filter(e=>e.from==='PANTRY'&&e.rel==='hasIngredient'),available=new Set(inventory.map(e=>e.to)),complete=pantry.attrs.inventoryComplete===true;
 if(i===2){if(!by.BUTTER)return result('UNKNOWN','버터 대상이 없어 조건 변경을 비교할 수 없습니다.');available.add('BUTTER');}
 const need=id=>m.edges.filter(e=>e.from===id&&e.rel==='needsIngredient');
 if(i===1){const required=need('D2');if(!by.D2||!required.length)return result('UNKNOWN','버터간장밥의 필수 재료 기록이 없습니다.');const absent=required.filter(e=>!available.has(e.to)).map(e=>e.to),label=absent.map(id=>by[id].label).join(', ');
  return result(absent.length&&!complete?'UNKNOWN':'SUPPORTED',absent.length?(complete?`부족한 재료는 ${label}입니다. 목록을 전부 확인한 현재 시나리오의 판단입니다.`:`${label}의 보유 여부가 미확인입니다. 목록 확인이 미완료이므로 없다고 단정하지 않습니다.`):'버터간장밥의 등록된 필수 재료가 모두 확인됩니다.',{nodes:['D2',...required.map(e=>e.to),'PANTRY'],missing:complete?absent:[],unconfirmed:complete?[]:absent,evidence:[...new Set([...required.map(e=>e.source),...inventory.map(e=>e.source),'R04'])]});
 }
 const recipes=m.nodes.filter(n=>n.type==='Recipe'),matches=recipes.filter(n=>need(n.id).length&&need(n.id).every(e=>available.has(e.to))).map(n=>n.id),unresolved=recipes.filter(n=>!need(n.id).length||(!complete&&!matches.includes(n.id)));
 const names=matches.map(id=>by[id].label).join(', ')||'없음',prefix=i===2?'버터를 추가한 가정에서':'현재 시나리오에서';
 return result(unresolved.length?'UNKNOWN':'SUPPORTED',`${prefix} 재료 충족 메뉴는 ${names}입니다.${unresolved.length?' 나머지는 재료 또는 보유 기록이 불완전해 판단을 보류합니다.':''}`,{matches,nodes:[...matches,...new Set(matches.flatMap(id=>need(id).map(e=>e.to))),'PANTRY'],evidence:[...new Set([...recipes.flatMap(n=>need(n.id).map(e=>e.source)),...inventory.map(e=>e.source),'R04'])]});
}
