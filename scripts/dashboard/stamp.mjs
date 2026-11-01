// Stamp a content hash onto the dashboard's module and stylesheet URLs so a cached index.html
// never mixes old and new modules (GitHub Pages caches each file for 10 minutes independently).
//   node scripts/dashboard/stamp.mjs        # rewrites dash/index.html, app.mjs, state.mjs in place
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';
const dash=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../dash');
const read=f=>fs.readFileSync(path.join(dash,f),'utf8');
const strip=s=>s.replace(/(\.(?:mjs|css))\?v=[a-f0-9]{8}/g,'$1');
const files=['core.mjs','state.mjs','app.mjs','styles.css'];
const hash=createHash('sha256').update(files.map(f=>strip(read(f))).join('\n')).digest('hex').slice(0,8);
const stamp=(f,rules)=>{let s=strip(read(f));for(const [re,to] of rules)s=s.replace(re,to);fs.writeFileSync(path.join(dash,f),s);};
stamp('index.html',[[/\.\/styles\.css/g,`./styles.css?v=${hash}`],[/\.\/app\.mjs/g,`./app.mjs?v=${hash}`]]);
stamp('app.mjs',[[/from '\.\/core\.mjs'/g,`from './core.mjs?v=${hash}'`],[/from '\.\/state\.mjs'/g,`from './state.mjs?v=${hash}'`]]);
stamp('state.mjs',[[/from '\.\/core\.mjs'/g,`from './core.mjs?v=${hash}'`]]);
console.log(JSON.stringify({hash,stamped:['index.html','app.mjs','state.mjs']}));
