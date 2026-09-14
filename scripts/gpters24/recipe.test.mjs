import test from 'node:test';
import assert from 'node:assert/strict';
import {domains} from './data.mjs';
import {validate,query,filesForWeek,parseWorkspace} from './core.mjs';
import {recipeScenario} from './recipe.mjs';
test('small recipe fixture has four notes, eight entities and two relation kinds',()=>{
 const m=domains.recipe;assert.equal(m.notes.length,4);assert.equal(m.nodes.length,8);assert.equal(m.edges.length,12);assert.equal(Object.keys(m.classes).length,3);assert.equal(Object.keys(m.relations).length,2);assert.deepEqual(validate(m),[]);
});
test('baseline ingredients satisfy one recipe; missing butter is traceable',()=>{
 const q=query(domains.recipe,0);assert.equal(q.status,'SUPPORTED');assert.deepEqual(q.matches,['D1']);assert.ok(q.evidence.includes('R04'));
 assert.deepEqual(query(domains.recipe,1).missing,['BUTTER']);
});
test('adding butter changes current query to three recipes without changing fixture',()=>{
 const after=recipeScenario(domains.recipe,{butter:true});assert.deepEqual(query(after,0).matches,['D1','D2','D3']);assert.deepEqual(query(after,1).missing,[]);assert.deepEqual(query(domains.recipe,0).matches,['D1']);
 assert.deepEqual(query(domains.recipe,2).matches,['D1','D2','D3']);
});
test('unrecorded inventory is unknown, not a confirmed missing ingredient',()=>{
 const m=recipeScenario(domains.recipe,{complete:false});assert.equal(query(m,1).status,'UNKNOWN');assert.deepEqual(query(m,1).missing,[]);assert.deepEqual(query(m,1).unconfirmed,['BUTTER']);
});
test('recipe import and weekly packages match the four-note scope',()=>{
 assert.equal(parseWorkspace(JSON.stringify(domains.recipe)).id,'recipe');
 for(let w=1;w<=4;w++){const f=filesForWeek(domains.recipe,w);if(w===1)assert.equal(Object.keys(f).filter(k=>k.startsWith('00-inbox/')).length,4);assert.match(f['practice/agent-prompt.md'],/재료|메뉴/);}
});
