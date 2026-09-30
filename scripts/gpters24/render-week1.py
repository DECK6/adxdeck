"""Build the static week-one reader from the same reviewed content used by ZIPs.
Run with: uv run --with markdown==3.9 python scripts/gpters24/render-week1.py
"""
from pathlib import Path
import json,re,html
import markdown
root=Path(__file__).resolve().parents[2]
content=json.loads((root/'scripts/gpters24/week1-content.json').read_text())
content['documents'].update(json.loads((root/'scripts/gpters24/week1-instructor.json').read_text()))
out=root/'ontology/study'
downloads=out/'downloads/jev-week1'
downloads.mkdir(parents=True,exist_ok=True)
for name,text in content['documents'].items():
    (downloads/name).write_text(text)
sections=[('overview','README.md','수업 안내'),('case','01-case-study.md','사례글'),('workshop','02-workshop.md','실습'),('runner','03-runner.md','선택 실행 코드'),('research','05-research.md','GitHub 조사·AKM 적용'),('card','definition-card.md','정의 수정 카드')]
links={name:'week1.html#'+key for key,name,_ in sections}
links['04-instructor.md']='instructor.html'
def render(name):
    body=markdown.markdown(content['documents'][name],extensions=['tables','fenced_code','sane_lists'])
    for file,href in links.items():
        body=body.replace('href="'+file+'"','href="'+href+'"')
    body=body.replace('href="https://dexa.art/ontology/study/instructor.html"','href="instructor.html"')
    body=body.replace('href="https://dexa.art/ontology/study/"','href="./"').replace('href="https://dexa.art/ontology/study/my-topic.html"','href="my-topic.html"')
    body=body.replace('<table>','<div class="table-scroll"><table class="lab-table">').replace('</table>','</table></div>')
    return body
styles='''
.lesson-shell{max-width:1080px;margin:auto;padding:24px clamp(18px,4vw,52px) 80px}.lesson-nav{display:flex;gap:8px;flex-wrap:wrap;margin:24px 0}.lesson-header h1{font-size:clamp(30px,5vw,52px);line-height:1.2;letter-spacing:-.04em}.lesson-header .lead{max-width:760px}.week1-article{margin-top:44px;padding-top:24px;border-top:1px solid var(--line,#ddd);scroll-margin-top:20px;line-height:1.85;overflow-wrap:anywhere}.week1-article h1{font-size:clamp(24px,3.2vw,34px);line-height:1.4}.week1-article h2{margin-top:32px;font-size:24px}.week1-article h3{margin-top:26px;font-size:20px}.week1-article p{margin:14px 0}.week1-article ul,.week1-article ol{padding-left:24px;list-style:revert}.week1-article li{margin:7px 0}.week1-article pre{background:#17201c;color:#eef4ee;padding:20px;border-radius:12px;white-space:pre;overflow:auto;max-width:100%;font-size:13px;line-height:1.7}.week1-article code{font-size:.9em}.week1-article blockquote{border-left:3px solid #668577;padding:8px 18px;background:#edf1ed;margin:20px 0}.week1-article .lab-table{min-width:540px}.week1-article details{margin:20px 0}.week1-article summary{font-size:24px;font-weight:700;cursor:pointer}.lesson-copy{display:block;margin:8px 0}.lesson-header{padding:25px 0}.lesson-revision{color:#52645a}.lesson-note{padding:18px;background:#eef3ee;border-radius:12px}.lesson-downloads{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}@media(max-width:600px){.lesson-shell{padding:18px 16px 60px}.lesson-nav a{font-size:13px}.week1-article{margin-top:30px}.week1-article pre{padding:14px}.lesson-downloads .button{width:100%;text-align:center}}
'''
script='''document.querySelectorAll('.week1-article pre').forEach(pre=>{const b=document.createElement('button');b.type='button';b.className='button lesson-copy';b.textContent='이 코드·요청문 복사';b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(pre.textContent);b.textContent='복사했습니다';}catch{const r=document.createRange();r.selectNodeContents(pre);const s=window.getSelection();s.removeAllRanges();s.addRange(r);b.textContent='내용을 선택했습니다. 복사 단축키를 누르세요';}});pre.after(b);});'''
def page(title,body):
    return f'''<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="GPTers 24기 1주차: kb-jev와 Ontology + Jev 사례, AKM 적용, 15분 정의 검토 실습과 120분 수업 교안."><title>{html.escape(title)} · GPTers 24기</title><link rel="stylesheet" href="assets/style.css"><style>{styles}</style></head><body><a class="skip" href="#lesson">본문으로 이동</a><main id="lesson" class="lesson-shell">{body}<footer class="footer"><p>DECK · DEXA / GPTers 24기 · 2026-09-30 개정</p><a href="./">4주 웹 실습실로 돌아가기 ↗</a></footer></main><script>{script}</script></body></html>\n'''
body='''<header class="lesson-header"><a href="./">← 4주 웹 실습실</a><p class="eyebrow">GPTers 24 · WEEK 01</p><h1>내 자료를 AI가<br>근거로 쓰게 만들기</h1><p class="lead">AKM으로 출처와 맥락을 정리하고, Jev로 후보를 고르며, 온톨로지의 정의를 검토합니다.</p><p class="lesson-revision">기존 웹 실습실 개정 2026-09-14 · Jev 교안 최초 2026-09-26 · 최신 개정 2026-09-30<br>1주차 수업 9월 30일 · 권장 120분 · API 실행 선택</p><div class="lesson-downloads"><a class="button primary" href="downloads/jev-week1-student.zip" download>1주차 교안 전체 ZIP ↓</a><a class="button" href="my-topic.html">내 자료로 실습하기 ↗</a><a class="button" href="downloads/jev-week1/definition-card.md" download>정의 수정 카드 ↓</a></div></header>'''
body+='<nav class="lesson-nav" aria-label="1주차 교안 목차">'+''.join(f'<a class="button" href="#{key}">{title}</a>' for key,_,title in sections)+'</nav>'
body+='''<p class="lesson-note">이 교안의 N01–N05는 Jev 판단용 5개 메모입니다. 기존 웹 관계망의 R01–R04와는 별도 예제이며, 1주차 본 실습은 N 자료로 진행합니다. 실제로 호출하지 않은 모델의 확률·비용·개선률은 기록하지 않습니다.</p>'''
for key,name,title in sections:
    article=render(name)
    if key in ('runner','research'):
        article=f'<details><summary>{title} 펼쳐 읽기</summary>{article}</details>'
    body+=f'<section class="week1-article" id="{key}">{article}<a class="button" href="downloads/jev-week1/{name}" download>{title} Markdown ↓</a></section>'
body+='''<p class="lesson-note">스터디장용 <a href="instructor.html">120분 운영안과 확인 자료</a>는 별도 화면입니다. 정의 v2를 고정하기 전 분류 담당 에이전트에 스터디장 답안을 제공하지 마세요.</p>'''
(out/'week1.html').write_text(page('1주차 사례와 실습',body))
teacher='''<header class="lesson-header"><a href="week1.html">← 스터디멤버 교안</a><p class="eyebrow">STUDY LEADER · WEEK 01</p><h1>1주차 스터디장 노트</h1><p class="lesson-revision">최신 개정 2026-09-30 · 권장 120분</p><p class="lesson-note">확인 자료와 사람 기준이 포함되어 있습니다. 분류 정의 v2를 고정하기 전에는 분류 담당 에이전트에 이 페이지를 읽히지 마세요. 이미 읽었다면 새 확인 자료를 만들거나 개발용 연습으로 기록하세요.</p></header>'''
teacher+='<article class="week1-article">'+render('04-instructor.md')+'</article><a class="button" href="downloads/jev-week1/04-instructor.md" download>스터디장 Markdown ↓</a>'
(out/'instructor.html').write_text(page('1주차 스터디장 노트',teacher))
print('Rendered student reader, instructor reader and 7 Markdown downloads.')
