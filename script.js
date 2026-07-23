// Contact form handling with Web3Forms
async function submitContactForm(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    // Hide previous messages
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');

    // Show loading state
    submitBtn.disabled = true;
    submitText.textContent = '전송 중...';
    loadingSpinner.classList.remove('hidden');

    try {
        const formData = new FormData(form);

        // Web3Forms API 호출
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            // 성공 메시지 표시
            successMessage.classList.remove('hidden');
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // 폼 초기화
            form.reset();

            // Google Analytics 이벤트 (선택사항)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'Contact',
                    event_label: 'Contact Form Submission'
                });
            }
        } else {
            throw new Error(result.message || '전송에 실패했습니다.');
        }
    } catch (error) {
        console.error('Contact form error:', error);
        errorMessage.classList.remove('hidden');
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitText.textContent = '메시지 전송';
        loadingSpinner.classList.add('hidden');
    }

    return false;
}

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\-\s\(\)\+]+$/;
    return phone === '' || re.test(phone);
}

// 모바일 메뉴 토글
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBtn = document.getElementById('mobile-menu-btn');

    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.setAttribute('aria-label', 'Close navigation menu');
        menuBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M6 18L18 6M6 6l12 12" />
            </svg>
        `;
    } else {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open navigation menu');
        menuBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        `;
    }
}

// 페이지 로드 후 애니메이션 시작
document.addEventListener('DOMContentLoaded', function () {
    // 모바일 메뉴 버튼 이벤트 리스너
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Contact form validation
    const form = document.getElementById('contact-form');
    if (form) {
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const successMessage = document.getElementById('success-message');
        const errorMessage = document.getElementById('error-message');

        // Email validation
        emailInput?.addEventListener('blur', function () {
            const email = this.value.trim();
            this.classList.toggle('is-error', !!email && !validateEmail(email));
        });

        // Phone validation
        phoneInput?.addEventListener('blur', function () {
            const phone = this.value.trim();
            this.classList.toggle('is-error', !validatePhone(phone));
        });

        // Auto-hide messages after 10 seconds
        if (successMessage && !successMessage.classList.contains('hidden')) {
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 10000);
        }

        if (errorMessage && !errorMessage.classList.contains('hidden')) {
            setTimeout(() => {
                errorMessage.classList.add('hidden');
            }, 10000);
        }
    }

    // 스킬 바 애니메이션
    setTimeout(() => {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const width = bar.dataset.width;
            if (width) {
                bar.style.width = width;
            }
        });
    }, 1000);

    // 텍스트 변경 애니메이션
    const titleElement = document.getElementById('changing-title');
    if (titleElement) {
        const originalText = "AI Media Art & Video Content Agency";
        const keywords = [
            "Interactive Art",
            "Spatial Experience",
            "Neural Cinema",
            "Generative Facade"
        ];

        let index = 0;

        setInterval(() => {
            titleElement.textContent = keywords[index];
            titleElement.classList.add('fade-in-up'); // Re-trigger animation if possible, or just text update

            index = (index + 1) % keywords.length;
        }, 2500);
    }
});

// Advanced Interactive Art: Neural Network Simulation
(function () {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let connections = [];

    // Configuration
    const config = {
        particleCount: 100,
        connectionDistance: 150,
        mouseRadius: 200,
        baseSpeed: 0.5,
        color: '255, 255, 255' // White for monochrome
    };

    // Resize handling
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    window.addEventListener('resize', resize);

    // Mouse interaction
    let mouse = { x: null, y: null };

    window.addEventListener('mousemove', e => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * config.baseSpeed;
            this.vy = (Math.random() - 0.5) * config.baseSpeed;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            // Move
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse interaction (Repel/Attract)
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.mouseRadius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (config.mouseRadius - distance) / config.mouseRadius;
                    const directionX = forceDirectionX * force * this.size;
                    const directionY = forceDirectionY * force * this.size;

                    this.x -= directionX; // Repel
                    this.y -= directionY;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${config.color}, 0.5)`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        config.particleCount = (canvas.width * canvas.height) / 15000; // Responsive count
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance) {
                    let opacity = 1 - (distance / config.connectionDistance);
                    ctx.strokeStyle = `rgba(${config.color}, ${opacity * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawConnections();
        requestAnimationFrame(animate);
    }

    // Initialize
    resize();
    animate();
})();

// 스크롤 기반 애니메이션 (메인 페이지에서만)
document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('nav a[href^="#"]'); // 앵커 링크만 선택

    // 요소가 뷰포트에 있는지 확인하는 함수
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) / 2 &&
            rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) / 2
        );
    }

    // 스크롤 이벤트
    function onScroll() {
        sections.forEach(section => {
            if (isInViewport(section)) {
                const id = section.getAttribute('id');

                // 네비게이션 링크 활성화
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }

    window.addEventListener('scroll', onScroll);

    // 네비게이션 부드러운 스크롤 (앵커 링크만)
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 헤더 높이 고려
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Add fade-in-up class to elements we want to animate
    document.querySelectorAll('.work-card, .panel-card, h2').forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });
});

// Modal functions
function openMiceModal() {
    const modal = document.getElementById('miceModal');
    modal.classList.remove('hidden');

    // Prevent background scrolling on mobile
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    // Smooth fade-in animation
    requestAnimationFrame(() => {
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease';
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
    });
}

function closeMiceModal() {
    const modal = document.getElementById('miceModal');

    // Smooth fade-out animation
    modal.style.opacity = '0';

    setTimeout(() => {
        modal.classList.add('hidden');

        // Restore scrolling
        document.body.style.overflow = 'auto';
        document.body.style.position = 'static';
        document.body.style.width = 'auto';
    }, 300);
}

// Close modal when clicking outside or pressing Escape
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('miceModal');
    if (modal) {
        // Close modal when clicking outside
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeMiceModal();
            }
        });

        // Prevent modal content clicks from closing modal
        const modalContent = modal.querySelector('.bg-slate-800');
        if (modalContent) {
            modalContent.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeMiceModal();
        }
    });

    // Touch event handling for better mobile experience
    let touchStartY = 0;
    let touchStartX = 0;

    if (modal) {
        modal.addEventListener('touchstart', function (e) {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        modal.addEventListener('touchend', function (e) {
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            const deltaY = Math.abs(touchEndY - touchStartY);
            const deltaX = Math.abs(touchEndX - touchStartX);

            // If it's a tap (not a scroll), and target is the modal background
            if (deltaY < 10 && deltaX < 10 && e.target === modal) {
                closeMiceModal();
            }
        }, { passive: true });
    }
});

// ==========================================
// Portfolio Data Fetching & Rendering
// ==========================================
const PORTFOLIO_DATA = [
    {"id": "project-01", "section": "work", "title": "상상유랑", "englishTitle": "le voyage dans l'imagenation", "category": "Immersive Exhibition", "description": "1채널 파일럿 전시, 458 갤러리 — 텍스트가 공간으로 확장되는 이머시브 전시", "tags": ["Media Art", "Interactive"], "icon": "view_in_ar", "color": "from-[#E50914]", "image": "sangsang.jpg", "size": "normal"},
    {"id": "project-02", "section": "work", "title": "PRECTXE", "englishTitle": "", "category": "Festival Production", "description": "Digital Media Art Festival General Production", "tags": ["Directing", "Production"], "icon": "festival", "color": "from-[#39FF14]", "image": "prectxe.png", "size": "large"},
    {"id": "project-04", "section": "work", "title": "손의 잔향", "englishTitle": "Afterimage of the Hand", "category": "Generative Data Visualization", "description": "회화적 선의 축적과 표면 — Rokkaku 작가의 핸드페인팅 감각을 전시 데이터 기반 520개 스트로크 시스템으로 복원. 토탈미술관 AI해커톤 선정작, 베를린 P61갤러리 전시", "tags": ["Data Visualization", "Canvas 2D", "Total Museum", "Berlin P61"], "icon": "gesture", "color": "from-[#BC13FE]", "image": "hand_afterimage.jpg", "size": "normal"},
    {"id": "project-05", "section": "work", "title": "혼돈의 호흡", "englishTitle": "Breath of Chaos", "category": "Generative Data Visualization", "description": "입자 군집의 구성과 순환 — 108점의 작품 색채, 서울 겨울 기후, 관람객 통계를 9,000개 큐브 입자로 재구성. 토탈미술관 AI해커톤 선정작, 베를린 P61갤러리 전시", "tags": ["Data Visualization", "Three.js", "Total Museum", "Berlin P61"], "icon": "blur_on", "color": "from-[#00F0FF]", "image": "breath_of_chaos.jpg", "size": "normal"},
    {"id": "project-06", "section": "work", "title": "소각장의 크리스마스", "englishTitle": "Christmas at the Incinerator", "category": "Interactive Exhibition", "description": "장소특정적 인터랙티브 체험 전시 — 부천아트벙커 B39", "tags": ["Site-Specific", "Interactive"], "icon": "celebration", "color": "from-[#E50914]", "image": "christmas_b39.jpg", "size": "normal"},
    {"id": "project-07", "section": "work", "title": "잔광", "englishTitle": "Afterglow", "category": "Permanent Installation", "description": "장소특정적 상설 인스톨레이션 — 부천아트벙커 B39", "tags": ["Site-Specific", "Installation"], "icon": "flare", "color": "from-[#39FF14]", "image": "afterglow_b39.jpg", "size": "normal"},
    {"id": "project-03", "section": "work", "title": "잔다리페스타", "englishTitle": "Zandari Festa", "category": "Creative Direction", "description": "Global Music Festival Creative Direction", "tags": ["Creative Direction", "Music Festival"], "icon": "equalizer", "color": "from-[#00F0FF]", "image": "zandari.jpg", "size": "normal"},
    {"id": "academy-01", "section": "academy", "title": "AX Camp", "subtitle": "Corporate / Executive", "description": "임원·실무진 대상 기업 AI 전환(AX) 캠프 — 생성형 AI 실무부터 조직 워크플로 재설계까지.", "courseId": "Course 01", "tags": ["AX", "Corporate"]},
    {"id": "academy-02", "section": "academy", "title": "AI Agent & Automation", "subtitle": "Agent Workflow", "description": "AI 에이전트·MCP 기반 업무 자동화 — 반복 업무를 에이전트 워크플로로 전환하는 실무 강의.", "courseId": "Course 02", "tags": ["Agent", "Automation"]},
    {"id": "academy-03", "section": "academy", "title": "Agent Knowledge Management", "subtitle": "Master Class", "description": "AI와 함께 일하는 지식 시스템 설계 — AKM 방법론 기반 에이전트 지식관리 마스터클래스.", "courseId": "Course 03", "tags": ["AKM", "PKM"]},
    {"id": "dev-01", "section": "dev", "title": "AKM", "category": "Markdown · Agent OS", "year": "2026", "description": "도구 불문 마크다운 지식 OS — 에이전트 지식관리(AKM) 레퍼런스 구현", "tags": ["Agent", "PKM"], "url": "https://github.com/DECK6/akm", "size": "large", "badge": "FEATURED"},
    {"id": "dev-02", "section": "dev", "title": "Anamorphic Sim", "category": "TypeScript · WebGL", "year": "2026", "description": "평면/ㄱ자 LED 아나모픽 콘텐츠 변환 엔진 — sweet spot 재투영, 곡면 세그먼트, 픽셀맵 출력, AI 원본 콘텐츠 가이드", "tags": ["LED", "Anamorphic"], "badge": "R&D", "size": "normal"},
    {"id": "dev-03", "section": "dev", "title": "Bentroom", "category": "C++ · openFrameworks", "year": "2026", "description": "휘어진 공간을 위한 범용 이머시브 미디어 엔진 — 곡면·다면 공간 투사와 상영을 하나의 도구로", "tags": ["Immersive", "Projection"], "badge": "R&D", "size": "normal"},
    {"id": "dev-04", "section": "dev", "title": "MICE Safety Agent", "category": "TypeScript · Ontology", "year": "2026", "description": "행사 유형, 예상 인파, 베뉴, 지자체 조건을 입력해 MICE·옥외행사 안전 적용성을 확인하는 오프라인 온톨로지 기반 웹 시뮬레이터.", "tags": ["MICE Safety", "Ontology"], "url": "/mice-safety/", "size": "normal"},
    {"id": "dev-05", "section": "dev", "title": "Elementary Learning Map", "category": "JavaScript · Ontology", "year": "2026", "description": "한국 2022 개정 초등 교육과정 학습 온톨로지 — 학습 주제 1,956개를 연결한 인터랙티브 학습 지도", "tags": ["Education", "Ontology"], "url": "https://dexa.art/learnmap/", "size": "normal"},
    {"id": "dev-06", "section": "dev", "title": "Secondary Learning Map", "category": "JavaScript · Ontology", "year": "2026", "description": "2022 개정 중학교·고등학교 교육과정 학습 온톨로지 — 초등 학습 지도의 중등 확장", "tags": ["Education", "Ontology"], "url": "https://github.com/DECK6/korean-secondary-learning-map", "size": "normal"},
    {"id": "dev-07", "section": "dev", "title": "Transition Gap Map", "category": "JavaScript · Ontology", "year": "2026", "description": "2022 개정 교육과정 학교급 전환 갭 온톨로지 — 전환기 길잡이 인터랙티브 맵", "tags": ["Education", "Ontology"], "url": "https://dexa.art/gapmap/", "size": "normal"},
    {"id": "dev-08", "section": "dev", "title": "Learning Path MCP", "category": "TypeScript · MCP", "year": "2026", "description": "한국 K-12 학습 경로·선수 개념을 검증하는 MCP 서버", "tags": ["MCP", "Education"], "url": "https://github.com/DECK6/learning-path-check-mcp", "size": "normal"},
    {"id": "dev-09", "section": "dev", "title": "ringsplat", "category": "Python · 3DGS", "year": "2026", "description": "360 파노라마 → 3D Gaussian Splat 변환 파이프라인, Apple Silicon 엔드투엔드", "tags": ["3DGS", "Apple Silicon"], "url": "https://github.com/DECK6/ringsplat", "size": "normal"},
    {"id": "dev-10", "section": "dev", "title": "Obsidian Galaxy Graph", "category": "TypeScript · Three.js", "year": "2026", "description": "옵시디언 볼트를 반투명 3D 은하 그래프로 렌더링하는 이머시브 그래프 플러그인", "tags": ["Obsidian", "3D"], "url": "https://github.com/DECK6/obsidian-galaxy-graph", "size": "normal"},
    {"id": "dev-11", "section": "dev", "title": "Nara Bid Finder", "category": "JavaScript · GovTech · LLM", "year": "2026", "description": "나라장터 입찰 탐색기 — 나라장터 용역 공고와 사전규격을 다중 조건으로 탐색하고, HWP·HWPX·DOCX·PDF·ZIP 첨부까지 분석해 지역·실적·면허 등 자격요건과 회사 적합도를 판정하는 로컬 입찰 워크스페이스. 관심 공고 저장, 마감·모니터링 알림, 공고별 AI 질의와 전체 첨부 기반 제안서 초안 생성을 한 흐름으로 연결한다.", "tags": ["Public Procurement", "Document AI"], "badge": "R&D", "size": "normal"},
    {"id": "dev-12", "section": "dev", "title": "Proposal MCP", "category": "TypeScript · MCP · RAG", "year": "2026", "description": "제안서 초안 생성기 — RFP와 회사 프로필을 바탕으로 제안서 아카이브에서 유사 사례와 전략·콘셉트·수행방법론·KPI 패턴을 검색해 PPT 장표별 구성안을 만드는 MCP 기반 초안 생성 시스템. HWP·HWPX·PDF를 구조화하고 사업 유형별 목차, 타깃 페르소나, 근거·검증 메모를 결합해 작성 에이전트가 재사용 가능한 제안 논리를 제공한다.", "tags": ["Proposal Automation", "Knowledge Base"], "badge": "R&D", "size": "normal"}
];

document.addEventListener('DOMContentLoaded', async function () {
    await loadProjects();
});

async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        if (!response.ok) throw new Error('Fetch failed');
        const projects = await response.json();
        renderProjects(projects);
    } catch (e) {
        console.warn('Using fallback data:', e);
        renderProjects(PORTFOLIO_DATA);
    }
}

function renderProjects(projects) {
    const workGrid = document.getElementById('project-grid');
    const academyGrid = document.getElementById('academy-grid');

    // reset grids
    if (workGrid) workGrid.innerHTML = '';
    if (academyGrid) academyGrid.innerHTML = '';

    const workProjects = projects.filter(p => !p.section || p.section === 'work');
    const academyProjects = projects.filter(p => p.section === 'academy');
    const devProjects = projects.filter(p => p.section === 'dev');


    const devGrid = document.getElementById('dev-grid');
    if (devGrid) devGrid.innerHTML = '';

    // --- Render Work Projects ---
    if (workGrid) {
        workProjects.forEach((project) => {
            const spanClass = project.size === 'large' ? ' wide' : '';

            // Image handling
            const mediaContent = project.image
                ? `<img src="${project.image}" alt="${project.title}" loading="lazy">`
                : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--ink-text-dim);font-family:var(--font-mono);font-size:11px;letter-spacing:0.06em;text-align:center;padding:0 16px;">${project.category || ''}</div>`;

            const badge = project.url ? 'OPEN' : (project.size === 'large' ? 'FEATURED' : '');
            const spec2 = (project.tags && project.tags[0]) || project.englishTitle || '';

            const clickAction = project.url ? `window.location.href='${project.url}'` : `openVideoModal('${project.id}')`;
            const cardHTML = `
            <div class="work-card${spanClass}" onclick="${clickAction}">
                <div class="frame">${mediaContent}</div>
                <div class="caption">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                        <span class="title">${project.title}</span>
                        ${badge ? `<span class="dx-badge-dark">${badge}</span>` : ''}
                    </div>
                    <span class="spec"><span>${project.category || ''}</span><span>${spec2}</span></span>
                    <p class="desc">${project.description}</p>
                </div>
            </div>`;
            workGrid.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Add View More to Work Grid
        /*
        const viewMoreHTML = `
            <div class="work-card" style="display:flex;align-items:center;justify-content:center;min-height:300px;">
                <a href="#" class="btn-outline-dark">View More Projects</a>
            </div>`;
        workGrid.insertAdjacentHTML('beforeend', viewMoreHTML);
        */
    }



    // --- Render Academy Projects ---
    if (academyGrid) {
        academyProjects.forEach((project) => {
            const cardHTML = `
            <div class="panel-card" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})" style="cursor:pointer;">
                <span class="dx-meta">
                    <span class="dx-badge">${project.courseId || 'Course'}</span>
                    ${project.subtitle ? `<span class="dx-date">${project.subtitle}</span>` : ''}
                </span>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <span class="dx-more">INQUIRE →</span>
            </div>`;
            academyGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // --- Render Dev Lab Projects ---
    if (devGrid) {
        devProjects.forEach((project) => {
            const action = project.url ? ` onclick="window.open('${project.url}','_blank','noopener')"` : ' style="cursor:default;"';
            const cardHTML = `
            <div class="dev-card${project.size === 'large' ? ' wide' : ''}"${action}>
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
                    <h3>${project.title}</h3>
                    <span class="dx-badge-dark">${project.badge || 'OPEN'}</span>
                </div>
                <span class="spec"><span>${(project.category || '').toUpperCase()}</span><span>${project.year || ''}</span></span>
                <p class="desc">${project.description}</p>
            </div>`;
            devGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // Store projects globally for modal access
    window.portfolioData = projects;
}

// ==========================================
// Video Modal Logic
// ==========================================
let currentVideo = null;

function openVideoModal(projectId) {
    // If portfolioData isn't loaded yet, try to find it or return
    if (!window.portfolioData) return;

    const project = window.portfolioData.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('video-modal');
    const container = document.getElementById('modal-video-container');
    const title = document.getElementById('modal-title');
    const subtitle = document.getElementById('modal-subtitle');
    const desc = document.getElementById('modal-description');
    const category = document.getElementById('modal-category');
    const tags = document.getElementById('modal-tags');
    const currentTimeEl = document.getElementById('video-current-time');
    const durationEl = document.getElementById('video-duration');

    // Populate Content
    title.textContent = project.title;
    subtitle.textContent = project.englishTitle || '';
    desc.textContent = project.description;
    category.textContent = project.category || 'Project';

    if (tags) {
        tags.innerHTML = (project.tags || []).map(tag =>
            `<span class="dx-badge-dark">${tag}</span>`
        ).join('');
    }

    // Setup Content (Video or Image)
    container.innerHTML = '';

    // Hide or show play button based on content type
    const playBtn = document.getElementById('modal-play-btn');

    if (project.video) {
        // Handle Video
        const video = document.createElement('video');
        video.src = project.video;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';
        video.controls = false;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;

        video.onerror = function () {
            container.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--ink-text-dim);">
                    <p class="mono" style="margin:0;font-size:13px;">Video preview unavailable</p>
                </div>
            `;
        };

        container.appendChild(video);
        currentVideo = video;

        // Show play button for video
        if (playBtn) playBtn.style.display = 'flex';

        // Update time displays
        video.addEventListener('timeupdate', () => {
            if (!isNaN(video.duration)) {
                const curMins = Math.floor(video.currentTime / 60);
                const curSecs = Math.floor(video.currentTime % 60);
                const durMins = Math.floor(video.duration / 60);
                const durSecs = Math.floor(video.duration % 60);

                if (currentTimeEl) currentTimeEl.textContent = `${curMins}:${curSecs < 10 ? '0' : ''}${curSecs}`;
                if (durationEl) durationEl.textContent = `${durMins}:${durSecs < 10 ? '0' : ''}${durSecs}`;
            }
        });

        // Video specific play control
        if (playBtn) {
            playBtn.onclick = () => {
                if (video.paused) {
                    video.play();
                    playBtn.textContent = '❙❙';
                } else {
                    video.pause();
                    playBtn.textContent = '▶';
                }
            };
        }

    } else if (project.image) {
        // Handle Image
        const img = document.createElement('img');
        img.src = project.image;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.alt = project.title;

        container.appendChild(img);
        currentVideo = null; // No video to control

        // Hide play button and time for image
        if (playBtn) playBtn.style.display = 'none';
        if (currentTimeEl) currentTimeEl.textContent = '';
        if (durationEl) durationEl.textContent = '';
    }

    // Show Modal
    modal.classList.remove('hidden');
    // Force reflow
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');

    document.body.style.overflow = 'hidden'; // Prevent scroll
}

window.closeVideoModal = function () {
    const modal = document.getElementById('video-modal');
    if (!modal) return;

    modal.classList.add('opacity-0');

    if (currentVideo) {
        currentVideo.pause();
        currentVideo = null;
    }

    setTimeout(() => {
        modal.classList.add('hidden');
        const container = document.getElementById('modal-video-container');
        if (container) container.innerHTML = '';
        document.body.style.overflow = '';
    }, 500);
}

// Close on outside click is handled in HTML or general listener, adding specific here just in case
document.addEventListener('DOMContentLoaded', function () {
    const videoModal = document.getElementById('video-modal');
    if (videoModal) {
        videoModal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeVideoModal();
            }
        });
    }
});

// ==========================================
// Blog Preview on Main Page
// ==========================================
const BLOG_TRACK_LABELS = Object.freeze({
    'media-art': 'Media Art',
    'ai-ax': 'AI · AX'
});

function escapeBlogHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function blogPreviewImageSrc(value) {
    const url = String(value || '');
    if (/^(https?:|\/)/i.test(url)) return url;
    return `/blog/${url.replace(/^\.?\//, '').replace(/^blog\//, '')}`;
}

async function loadBlogPosts() {
    try {
        const res = await fetch('blog/posts.json');
        if (!res.ok) throw new Error('Fetch failed');
        return await res.json();
    } catch (e) {
        console.warn('Blog posts.json load failed:', e);
        return [];
    }
}

function renderBlogPreview(posts) {
    const grid = document.getElementById('blog-preview-grid');
    if (!grid) return;

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    const latest = posts.slice(0, 3);

    grid.innerHTML = '';

    latest.forEach((post) => {
        const date = post.date.replace(/-/g, '.');
        const trackLabel = post.trackLabel || BLOG_TRACK_LABELS[post.track] || post.track;

        const card = document.createElement('a');
        card.href = `/blog/posts/${encodeURIComponent(post.slug)}/`;
        card.className = 'post-card panel-card';
        card.dataset.track = post.track;
        card.dataset.category = post.category;
        card.setAttribute('aria-label', `Read ${post.title}`);

        const frame = post.thumbnail
            ? `<div class="card-frame"><img src="${escapeBlogHtml(blogPreviewImageSrc(post.thumbnail))}" alt="${escapeBlogHtml(post.title)}" loading="lazy"></div>`
            : '';

        card.innerHTML = `
            ${frame}
            <span class="dx-meta"><span class="dx-badge">${escapeBlogHtml(trackLabel)}</span><span class="dx-date">${escapeBlogHtml(post.category)} · <time datetime="${escapeBlogHtml(post.date)}">${date}</time></span></span>
            <h3>${escapeBlogHtml(post.title)}</h3>
            <p>${escapeBlogHtml(post.description)}</p>
            <span class="dx-more">READ MORE →</span>`;

        grid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    const grid = document.getElementById('blog-preview-grid');
    if (!grid) return;
    const posts = await loadBlogPosts();
    if (posts.length) {
        renderBlogPreview(posts);
    } else {
        grid.innerHTML = '';
    }
});
