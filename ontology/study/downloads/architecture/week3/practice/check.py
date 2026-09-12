"""Run: python3 check.py model.json — bounded practice-model validation, not OWL/SHACL."""
import json,sys
from pathlib import Path

def check(m):
    errors=[]
    nodes={n['id']:n for n in m['nodes']}
    notes={n['id'] for n in m['notes']}
    if len(nodes)!=len(m['nodes']):errors.append('ID: duplicate node')
    for n in m['nodes']:
        if n['type'] not in m['classes'] or not n['label'].strip():errors.append('CLASS: '+n['id'])
        if n['noteId'] not in notes:errors.append('SOURCE: '+n['id'])
    seen=set()
    for e in m['edges']:
        key=(e['from'],e['rel'],e['to'])
        if key in seen:errors.append('DUPLICATE: '+str(key))
        seen.add(key)
        if e['source'] not in notes:errors.append('SOURCE: '+str(key))
        if e['from'] not in nodes or e['to'] not in nodes:
            errors.append('ENDPOINT: '+str(key));continue
        r=m['relations'].get(e['rel'])
        if not r or nodes[e['from']]['type'] not in r['from'] or nodes[e['to']]['type'] not in r['to']:errors.append('TYPE: '+str(key))
    done=set()
    def visit(n,active):
        if n in active:
            errors.append('CYCLE: '+' -> '.join(active+[n]));return
        if n in done:return
        for e in m['edges']:
            if e['from']==n and e['rel']=='requires' and e['to'] in nodes:visit(e['to'],active+[n])
        done.add(n)
    for n in nodes:visit(n,[])
    return errors

if __name__=='__main__':
    try:
        p=Path(sys.argv[1] if len(sys.argv)>1 else 'model.json')
        if p.stat().st_size>1_000_000:raise ValueError('model must be under 1MB')
        model=json.loads(p.read_text(encoding='utf-8'))
        if len(model['nodes'])>200 or len(model['edges'])>400:raise ValueError('model exceeds practice limit')
        errors=check(model)
        print(json.dumps({'engine':'practice-python-checker','errors':errors,'valid':not errors,'scope':'IDs, classes, endpoints, source existence, relation types, prerequisite cycles; not source truth or legal/learner assessment'},ensure_ascii=False,indent=2))
        sys.exit(1 if errors else 0)
    except (OSError,ValueError,KeyError,TypeError,RecursionError) as exc:
        print(json.dumps({'valid':False,'error':str(exc)},ensure_ascii=False));sys.exit(2)
