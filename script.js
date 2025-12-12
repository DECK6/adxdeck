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
        menuBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        `;
    } else {
        mobileMenu.classList.add('hidden');
        menuBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
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
            if (email && !validateEmail(email)) {
                this.classList.add('border-red-500');
                this.classList.remove('border-gray-700');
            } else {
                this.classList.remove('border-red-500');
                this.classList.add('border-gray-700');
            }
        });

        // Phone validation
        phoneInput?.addEventListener('blur', function () {
            const phone = this.value.trim();
            if (!validatePhone(phone)) {
                this.classList.add('border-red-500');
                this.classList.remove('border-gray-700');
            } else {
                this.classList.remove('border-red-500');
                this.classList.add('border-gray-700');
            }
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
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('text-blue-400');
                        link.classList.remove('text-gray-300');
                    } else {
                        link.classList.remove('text-blue-400');
                        link.classList.add('text-gray-300');
                    }
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
    document.querySelectorAll('.card, .project-card, h2, .content > p').forEach(el => {
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