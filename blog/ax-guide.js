'use strict';

// Editorial curation, not a third top-level track or a tool ranking.
// Keep links tied to existing articles and fail the build on missing slugs.
const AX_TOPICS = Object.freeze([
    {
        id: 'work-design', label: '업무 설계와 도입 성과',
        question: 'AI를 어디에 도입하고, 무엇을 성과로 볼까요?',
        description: '반복 업무 하나를 고르고 입력·산출물·완료 기준부터 정합니다. 초안 생성 속도뿐 아니라 사람이 검토하고 다시 작업하는 시간까지 함께 살펴봅니다.',
        action: '첫 실험: 같은 종류의 업무를 기존 방식과 AI 보조 방식으로 수행하고, 품질 기준을 통과하기까지의 시간을 비교하세요.',
        slugs: ['choosing-a-safe-first-ax-experiment', 'ai-productivity-is-time-to-validated-outcome']
    },
    {
        id: 'knowledge', label: '지식 관리와 RAG',
        question: 'AI가 우리 자료를 맥락에 맞게 쓰게 하려면?',
        description: '문서를 많이 저장하는 것과 필요한 근거를 제때 전달하는 것은 다릅니다. 지식 구조, 문맥을 보존하는 검색, 출처와 유효 기간을 함께 다룹니다.',
        action: '첫 실험: 자주 묻는 질문 몇 개에 답할 자료를 정하고, 답변에서 원문과 최신성을 확인할 수 있는지 검사하세요.',
        slugs: ['managing-document-lifecycles-before-rag-retrieval', 'agent-experience-becomes-knowledge-when-it-transfers', 'agent-knowledge-management', 'retrieval-chunks-should-keep-document-context', 'knowledge-graphs-need-an-evidence-contract', 'missing-data-is-not-false-shacl-validation-boundaries']
    },
    {
        id: 'automation', label: '워크플로와 에이전트 자동화',
        question: '한 번의 성공을 반복 가능한 업무로 바꾸려면?',
        description: '실행 단계와 상태, 사람의 승인 지점, 실패 뒤 복구 경로를 설계합니다. 도구가 바뀌어도 필요한 재시도·중복 방지·결과 인수 원칙부터 읽습니다.',
        action: '첫 실험: 외부 전송이나 결제 없는 작은 작업으로 시작하고, 중간 실패와 재실행 때 결과가 중복되지 않는지 확인하세요.',
        slugs: ['drawing-approval-boundaries-before-agent-automation', 'when-agent-loops-need-control-graphs', 'agent-retries-need-idempotency-and-receipts', 'designing-reliable-multi-agent-fan-in']
    },
    {
        id: 'evaluation', label: '평가와 거버넌스',
        question: '그럴듯한 답과 실제로 쓸 수 있는 결과를 어떻게 구분할까요?',
        description: '출력 형식, 사실 근거, 실행 권한은 서로 다른 검사 대상입니다. 자동 검증과 사람의 판단을 나누고, 실패가 다음 운영 기준을 바꾸게 합니다.',
        action: '첫 실험: 통과·실패 사례와 승인 책임자를 먼저 정하고, 답변과 실제 근거를 분리해서 검토하세요.',
        slugs: ['building-a-small-evaluation-set-before-ai-deployment', 'agent-completion-must-be-judged-by-changed-world-state', 'designing-abstention-rules-for-ai-systems', 'self-verification-needs-an-evidence-gate', 'format-compliance-is-not-verification', 'evaluating-evidence-beyond-fluent-reports']
    },
    {
        id: 'practice', label: 'AI 활용 학습과 제작',
        question: '개인의 실험을 팀이 이어 쓸 수 있는 방법으로 만들려면?',
        description: '프롬프트 묘기보다 목표, 작업 맥락, 도구 권한, 검증 가능한 결과를 먼저 배웁니다. 실습에서 남긴 판단 기준과 시행착오를 다음 사람에게 전달합니다.',
        action: '첫 실험: 작은 제작 과제 하나를 골라 목표·입력 자료·실행 단계·검증 결과를 남기고, 다른 사람이 재현할 수 있는지 확인하세요.',
        slugs: ['turning-personal-ai-practice-into-reproducible-team-learning', 'vibe-coding-in-2026', 'task-specific-context-budgets']
    }
]);

// A complete guide-card summary for a legacy article with an auto-cut excerpt.
const AX_EXCERPTS = Object.freeze({
    'vibe-coding-in-2026': '바이브코딩의 출발점을 목표·완료 기준, 작업 맥락, 도구 권한, 검증으로 나누고 작은 제작 과제를 재현 가능한 작업으로 만드는 방법을 살펴봅니다.'
});
const AX_TITLE = 'AX 실무 가이드: 업무 설계·지식 관리·AI 자동화 | DEXA';
const AX_DESCRIPTION = 'AX(AI 전환)를 업무 설계, 지식 관리와 RAG, 워크플로 자동화, 평가·거버넌스, AI 활용 학습으로 나누어 살펴봅니다. 특정 도구보다 실제 업무 문제에서 출발하는 DEXA의 읽기 가이드입니다.';
const esc = value => String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const postUrl = slug => `/blog/posts/${slug}/`;

function validateAxTopics(posts) {
    const bySlug = new Map(posts.map(post => [post.slug, post]));
    for (const topic of AX_TOPICS) {
        for (const slug of topic.slugs) {
            const post = bySlug.get(slug);
            if (!post || post.track !== 'ai-ax') throw new Error(`[AX guide] Missing AI · AX article: ${slug}`);
        }
    }
    return bySlug;
}

function axRelatedHtml(post) {
    if (post.track !== 'ai-ax') return '';
    return `<aside class="panel-card" style="padding:24px;margin-top:40px;" aria-label="AX 실무 읽기 안내">
                <span class="dx-kicker">AI · AX / NEXT STEP</span>
                <h2 style="font-size:22px;margin:12px 0;">도구에서 업무 전환으로</h2>
                <p style="color:var(--muted);line-height:1.7;">이 글의 주제를 업무 설계, 지식 관리, 자동화, 검증과 연결해 보세요. 특정 도구에 한정되지 않는 읽기 경로를 정리했습니다.</p>
                <a class="btn-ghost" href="/blog/ax/">AX 실무 가이드 보기 →</a>
            </aside>`;
}

function axGuideHtml(posts, shell) {
    const bySlug = validateAxTopics(posts);
    const canonical = 'https://dexa.art/blog/ax/';
    const selected = [...new Set(AX_TOPICS.flatMap(topic => topic.slugs))].map(slug => bySlug.get(slug));
    const schema = {
        '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': canonical,
        name: AX_TITLE, description: AX_DESCRIPTION, url: canonical, inLanguage: 'ko-KR',
        isPartOf: { '@type': 'Blog', '@id': 'https://dexa.art/blog/#blog' },
        mainEntity: { '@type': 'ItemList', itemListElement: selected.map((post, i) => ({
            '@type': 'ListItem', position: i + 1, name: post.title, url: `https://dexa.art${postUrl(post.slug)}`
        })) }
    };
    const sections = AX_TOPICS.map((topic, i) => `<section class="ax-topic" id="${topic.id}" aria-labelledby="${topic.id}-title">
        <div class="ax-topic-intro">
            <span class="dx-kicker">0${i + 1} / AX PRACTICE</span>
            <h2 id="${topic.id}-title">${esc(topic.label)}</h2>
            <h3>${esc(topic.question)}</h3>
            <p>${esc(topic.description)}</p>
            <p class="ax-action">${esc(topic.action)}</p>
        </div>
        <ul class="ax-reading-list">${topic.slugs.map(slug => {
            const post = bySlug.get(slug);
            return `<li><a href="${postUrl(slug)}"><span class="ax-article-title">${esc(post.title)}</span><span class="ax-article-desc">${esc(AX_EXCERPTS[slug] || post.description)}</span><span class="dx-more">글 읽기 →</span></a></li>`;
        }).join('\n')}</ul>
    </section>`).join('\n');
    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(AX_TITLE)}</title>
    <meta name="description" content="${esc(AX_DESCRIPTION)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(AX_TITLE)}" />
    <meta property="og:description" content="${esc(AX_DESCRIPTION)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="https://dexa.art/og-image.jpg" />
    <meta property="og:site_name" content="DEXA" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(AX_TITLE)}" />
    <meta name="twitter:description" content="${esc(AX_DESCRIPTION)}" />
    <meta name="twitter:image" content="https://dexa.art/og-image.jpg" />
    <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
    <link href="https://fonts.googleapis.com" rel="preconnect" />
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
    <link rel="stylesheet" href="/dexa-theme.css" />
    <style>
        .ax-guide{padding-top:128px;overflow-wrap:anywhere;}
        .ax-guide h1{font-size:clamp(36px,5vw,64px);line-height:1.15;letter-spacing:-.04em;margin:20px 0;max-width:950px;}
        .ax-guide h1 span{color:var(--orange);}
        .ax-summary{max-width:850px;font-size:18px;line-height:1.8;color:var(--muted);}
        .ax-route{display:flex;flex-wrap:wrap;gap:10px;margin:30px 0 44px;}
        .ax-route a{padding:10px 14px;}
        .ax-start{border-left:3px solid var(--orange);padding:4px 24px;margin:36px 0 60px;max-width:900px;}
        .ax-start h2{font-size:23px;margin:0 0 12px;}
        .ax-start p{color:var(--muted);line-height:1.8;}
        .ax-topic{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:48px;padding:44px 0;border-top:1px solid var(--line);scroll-margin-top:90px;}
        .ax-topic h2{font-size:clamp(25px,3vw,34px);margin:12px 0 22px;letter-spacing:-.03em;}
        .ax-topic h3{font-size:18px;line-height:1.6;}
        .ax-topic-intro p{color:var(--muted);line-height:1.8;font-size:15px;}
        .ax-action{border-left:2px solid var(--line);padding-left:16px;margin-top:24px;}
        .ax-reading-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;}
        .ax-reading-list a{display:flex;flex-direction:column;gap:12px;padding:24px;border:1px solid var(--line);background:var(--paper);height:100%;}
        .ax-reading-list a:hover{background:var(--panel);border-color:var(--orange);}
        .ax-article-title{font-weight:650;font-size:18px;line-height:1.5;}
        .ax-article-desc{color:var(--muted);font-size:14px;line-height:1.7;}
        .ax-next{margin-top:32px;padding:32px;border:1px solid var(--line);background:var(--panel);}
        .ax-next p{line-height:1.8;color:var(--muted);max-width:850px;}
        .ax-next-links{display:flex;flex-wrap:wrap;gap:12px;}
        .ax-guide a:focus-visible{outline:2px solid var(--orange);outline-offset:4px;}
        @media(max-width:768px){.ax-topic{grid-template-columns:1fr;gap:20px;}.ax-guide{padding-top:104px;}.ax-summary{font-size:16px;}.ax-next{padding:24px 20px;}}
    </style>
</head>
<body>
    <!-- SHARED_NAV_START -->
${shell.nav}
    <!-- SHARED_NAV_END -->
    <main class="dx-section ax-guide">
        <a class="btn-ghost" href="/blog/">← DEXA Blog</a>
        <p class="dx-kicker" style="margin-top:32px;">AI TRANSFORMATION / PRACTICAL GUIDE</p>
        <h1>AX 실무 가이드<span>.</span><br>도구보다 업무에서 시작합니다</h1>
        <p class="ax-summary">AX(AI 전환)는 AI 도구를 추가하는 데서 끝나지 않습니다. 어떤 일을 바꾸고, 어떤 지식을 연결하며, 누가 결과를 확인할지 함께 설계해야 합니다. DEXA는 업무·지식·자동화·평가·학습의 다섯 관점으로 실제 적용을 살펴봅니다.</p>
        <nav class="ax-route" aria-label="AX 주제 바로가기">${AX_TOPICS.map(topic => `<a class="dx-tag-chip" href="#${topic.id}">${esc(topic.label)}</a>`).join('\n')}</nav>
        <section class="ax-start" aria-labelledby="ax-start-title">
            <h2 id="ax-start-title">처음이라면 이 순서로 읽으세요</h2>
            <p>바꿀 업무와 완료 기준을 정한 뒤, 필요한 자료를 정리하고, 작은 자동화를 시험하고, 결과를 검증하세요. 마지막으로 재현 가능한 방법을 팀의 학습과 운영에 연결합니다. 아래의 ‘첫 실험’은 이 순서를 작은 과제로 옮기는 제안입니다.</p>
        </section>
${sections}
        <section class="ax-next" aria-labelledby="ax-next-title">
            <span class="dx-kicker">FROM READING TO PRACTICE</span>
            <h2 id="ax-next-title">읽은 내용을 실제 업무와 제작에 연결하기</h2>
            <p>Hermes를 비롯한 개별 도구의 운영 글은 AI · AX 전체 글에서 계속 볼 수 있습니다. 이 가이드는 도구의 인기순이 아니라 업무 문제를 기준으로 읽는 출발점입니다. DEXA의 교육·자동화·미디어아트 제작 영역도 함께 살펴보세요.</p>
            <div class="ax-next-links"><a class="btn-ghost" href="/blog/?track=ai-ax">AI · AX 전체 글 →</a><a class="btn-ghost" href="/#solutions">교육·자동화·제작 영역 →</a><a class="btn-ghost" href="/#contact">프로젝트·교육 문의 →</a></div>
        </section>
    </main>
    <!-- SHARED_FOOTER_START -->
${shell.footer}
    <!-- SHARED_FOOTER_END -->
    <script src="/blog/blog.js"></script>
</body>
</html>
`;
}

module.exports = { AX_TOPICS, AX_TITLE, AX_DESCRIPTION, validateAxTopics, axRelatedHtml, axGuideHtml };
