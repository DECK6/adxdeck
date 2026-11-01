// Revenue plan adapter: parses the AKM revenue-plan note (Markdown tables and lists) into the
// structured `revenue` block of the encrypted dashboard payload. The evidence-path section
// (local paths, session ids) is never exported.
import fs from 'node:fs';
import path from 'node:path';

const RADAR_LINKS={B1:'lectures',C2:'open-calls',D1:'nara'};
const strip=v=>String(v??'').replace(/\*\*/g,'').replace(/`/g,'').trim();
const text=(v,max=4000)=>typeof v==='string'?v.slice(0,max):'';
const isDate=v=>typeof v==='string'&&/^\d{4}-\d\d-\d\d$/.test(v)&&Number.isFinite(Date.parse(v));

function frontmatter(raw){const m=raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);return {front:m?m[1]:'',body:raw.slice(m?m[0].length:0)};}
function sectionsOf(body){
 const out=[{n:null,heading:'',lines:[]}];
 for(const line of body.split(/\r?\n/)){const h=line.match(/^## (\d+)\.\s*(.*)$/);if(h){out.push({n:Number(h[1]),heading:h[2].trim(),lines:[]});continue;}out[out.length-1].lines.push(line);}
 return out;
}
function subsectionsOf(lines){
 const out=[{key:null,heading:'',lines:[]}];
 for(const line of lines){const h=line.match(/^### ([A-Z0-9-]+)\.\s*(.*)$/);if(h){out.push({key:h[1],heading:h[2].trim(),lines:[]});continue;}out[out.length-1].lines.push(line);}
 return out;
}
const cells=line=>line.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
function rowsOf(lines){
 const rows=[];
 for(let i=0;i<lines.length;i++){
  if(!lines[i].startsWith('|')||!/^\|?[\s:|\-]+\|?$/.test(lines[i+1]||''))continue;
  i+=2;while(i<lines.length&&lines[i].startsWith('|'))rows.push(cells(lines[i++]));i--;
 }
 return rows;
}
const ordered=lines=>lines.filter(l=>/^\d+\.\s+/.test(l)).map(l=>l.replace(/^\d+\.\s+/,''));
const bullets=lines=>lines.filter(l=>/^[-*]\s+/.test(l)).map(l=>l.replace(/^[-*]\s+/,''));
function tagOf(...parts){
 const s=parts.join(' ');
 if(/미회신/.test(s))return '미회신';
 if(/계약 전/.test(s))return '계약 전';
 if(/\[확정 대기\]/.test(s))return '확정 대기';
 const meeting=s.match(/(\d{1,2}\/\d{1,2})[^,.()]*미팅/);if(meeting)return meeting[1]+' 미팅';
 if(/보류/.test(s))return '보류';
 return '';
}

export function parseRevenuePlan(raw){
 const {front,body}=frontmatter(raw);
 const noteModified=(front.match(/^date modified:\s*(.+)$/m)||[])[1]?.trim().replace(/^["']|["']$/g,'')||'';
 const sections=sectionsOf(body),sec=n=>sections.find(s=>s.n===n)?.lines||[];
 const title=strip((sections[0].lines.find(l=>/^# /.test(l))||'').replace(/^# /,''));
 const baseDate=(body.match(/기준일\s*(\d{4}-\d\d-\d\d)/)||[])[1]||'';
 const s1=subsectionsOf(sec(1));
 const items=[],recoveries=[];
 for(const s of subsectionsOf(sec(2))){
  if(/^[A-E]$/.test(s.key||''))for(const r of rowsOf(s.lines))items.push({code:strip(r[0]),category:s.key,categoryLabel:strip(s.heading),name:strip(r[1]),status:strip(r[2]),short:strip(r[3]),h1:strip(r[4]),h2:strip(r[5]),longTerm:strip(r[6]),prep:strip(r[7]),tag:tagOf(r[2],r[3],r[4]),radar:RADAR_LINKS[strip(r[0])]||null});
  if(s.key==='F')for(const r of rowsOf(s.lines))recoveries.push({item:strip(r[0]),amount:strip(r[1]),status:strip(r[2]),action:strip(r[3])});
 }
 const actions=ordered(sec(5)).map((line,i)=>{const m=line.match(/^\*\*([^*]+)\*\*\s*[:：]?\s*(.*)$/);return m?{n:i+1,label:strip(m[1]),text:strip(m[2])}:{n:i+1,label:'',text:strip(line)};});
 // Section 8 (evidence paths, session ids) stays private; everything else is exported as-is.
 const markdown=sections.filter(s=>s.n!==8).map(s=>(s.n==null?'':`## ${s.n}. ${s.heading}\n`)+s.lines.join('\n')).join('\n').replace(/\n{3,}/g,'\n\n').trim();
 return {
  schemaVersion:'revenue-plan.v1',title,baseDate,noteModified,
  conclusions:ordered(sec(0)).map(strip),
  rates:rowsOf(s1.find(s=>s.key==='1-1')?.lines||[]).map(r=>({item:strip(r[0]),value:strip(r[1]),source:strip(r[2])})),
  audience:rowsOf(s1.find(s=>s.key==='1-2')?.lines||[]).map(r=>({channel:strip(r[0]),value:strip(r[1])})),
  items,recoveries,
  kpis:rowsOf(sec(3)).map(r=>({label:strip(r[0]),conservative:strip(r[1]),base:strip(r[2]),stretch:strip(r[3]),premise:strip(r[4])})),
  conflicts:rowsOf(sec(4)).map(r=>({n:Number(r[0])||0,title:strip(r[1]),text:strip(r[2]),resolution:strip(r[3])})),
  actions,
  preparations:rowsOf(sec(6)).map(r=>({category:strip(r[0]),item:strip(r[1]),status:strip(r[2])})),
  assumptions:bullets(sec(7)).map(strip),
  corrections:bullets(sec(9)).map(strip),
  milestones:rowsOf(sec(10)).filter(r=>isDate(r[0])).map(r=>({date:r[0],label:strip(r[1]),note:strip(r[2])})),
  markdown,
 };
}

export function sanitizeRevenue(input){
 if(!input||typeof input!=='object')throw Error('Invalid revenue plan');
 const list=(v,name)=>{if(!Array.isArray(v))throw Error('Invalid revenue '+name);return v;};
 const strs=(o,keys,max)=>Object.fromEntries(keys.map(k=>[k,text(o?.[k],max)]));
 const items=list(input.items,'items').map(i=>{if(!i?.code||!i?.name)throw Error('Invalid revenue item');return {...strs(i,['code','category','categoryLabel','name','status','short','h1','h2','longTerm','prep','tag'],1000),radar:['lectures','open-calls','nara'].includes(i.radar)?i.radar:null};});
 return {
  schemaVersion:'revenue-plan.v1',title:text(input.title,200),baseDate:isDate(input.baseDate)?input.baseDate:'',noteModified:text(input.noteModified,40),
  conclusions:list(input.conclusions,'conclusions').map(c=>text(c,2000)),
  rates:list(input.rates,'rates').map(r=>strs(r,['item','value','source'],500)),
  audience:list(input.audience,'audience').map(r=>strs(r,['channel','value'],500)),
  items,
  recoveries:list(input.recoveries,'recoveries').map(r=>strs(r,['item','amount','status','action'],500)),
  kpis:list(input.kpis,'kpis').map(r=>strs(r,['label','conservative','base','stretch','premise'],500)),
  conflicts:list(input.conflicts,'conflicts').map(r=>({n:Number.isSafeInteger(r?.n)?r.n:0,...strs(r,['title','text','resolution'],2000)})),
  actions:list(input.actions,'actions').map(r=>({n:Number.isSafeInteger(r?.n)?r.n:0,...strs(r,['label','text'],1000)})),
  preparations:list(input.preparations,'preparations').map(r=>strs(r,['category','item','status'],500)),
  assumptions:list(input.assumptions,'assumptions').map(c=>text(c,2000)),
  corrections:list(input.corrections,'corrections').map(c=>text(c,2000)),
  milestones:list(input.milestones,'milestones').filter(m=>isDate(m?.date)).map(m=>({date:m.date,...strs(m,['label','note'],500)})),
  markdown:text(input.markdown,300000),
 };
}

// The note may move from 00-inbox to its canonical context folder; the newest `date modified` wins.
export function latestRevenuePlan(vault){
 const dirs=['00-inbox','30-context/projects','30-context/projects/revenue-plan','80-outputs/revenue'].map(d=>path.join(vault,d)).filter(d=>fs.existsSync(d)&&fs.statSync(d).isDirectory());
 const found=[];
 for(const dir of dirs)for(const name of fs.readdirSync(dir)){
  if(!/revenue-plan.*\.md$/i.test(name))continue;
  const file=path.join(dir,name),data=parseRevenuePlan(fs.readFileSync(file,'utf8'));
  found.push({path:file,data,at:Date.parse(data.noteModified)||fs.statSync(file).mtimeMs});
 }
 found.sort((a,b)=>b.at-a.at);
 return found.length?{path:found[0].path,data:found[0].data}:null;
}
