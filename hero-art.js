// Hero generative art — circuit-trace signal paths (p5.js, hero panel only)
(function () {
    const host = document.getElementById('hero-art');
    if (!host || typeof p5 === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    new p5((s) => {
        const CYAN = [94, 231, 243];
        const ORANGE = [255, 90, 31];
        const GRID = 12;
        const TAIL = 56;
        const SPAWN_MS = 180;
        const MOUSE_MAX = 24;
        let traces = [];
        let mouseTraces = [];
        let lastSpawn = 0;
        let mouseSeen = false;

        function spawn(fromLeft) {
            const orange = s.random() < 0.08;
            return {
                x: fromLeft ? -10 : s.random(s.width),
                y: Math.round(s.random(GRID, s.height - GRID) / GRID) * GRID,
                speed: s.random(0.8, 1.9),
                col: orange ? ORANGE : CYAN,
                alpha: s.random(70, 130),
                jog: 0,
                dir: 1,
                pts: [],
                vias: [],
            };
        }

        function move(t) {
            if (t.jog > 0) {
                t.y += t.dir * 2;
                t.jog -= 2;
            } else {
                t.x += t.speed;
                if (s.random() < 0.008) {
                    t.jog = GRID * Math.floor(s.random(1, 3));
                    t.dir = s.random() < 0.5 ? -1 : 1;
                    t.vias.push({ x: t.x, y: t.y, age: 0 });
                }
            }
            t.pts.push({ x: t.x, y: t.y });
            if (t.pts.length > TAIL) t.pts.shift();
            t.vias.forEach((v) => v.age++);
            t.vias = t.vias.filter((v) => v.age < 90);
            if (t.x > s.width + 10) {
                if (t.fromMouse) t.dead = true;
                else Object.assign(t, spawn(true), { pts: [], vias: [] });
            }
        }

        function render() {
            s.clear();
            s.strokeWeight(1);
            traces.concat(mouseTraces).forEach((t) => {
                const n = t.pts.length;
                for (let i = 1; i < n; i++) {
                    const a = t.alpha * (i / n);
                    s.stroke(t.col[0], t.col[1], t.col[2], a);
                    s.line(t.pts[i - 1].x, t.pts[i - 1].y, t.pts[i].x, t.pts[i].y);
                }
                s.noStroke();
                t.vias.forEach((v) => {
                    s.fill(t.col[0], t.col[1], t.col[2], t.alpha * (1 - v.age / 90));
                    s.circle(v.x, v.y, 3);
                });
                if (n > 0) {
                    s.fill(t.col[0], t.col[1], t.col[2], Math.min(255, t.alpha * 1.6));
                    s.circle(t.pts[n - 1].x, t.pts[n - 1].y, 2.5);
                }
            });
        }

        function spawnAtMouse() {
            if (reduced || !mouseSeen) return;
            if (s.mouseX < 0 || s.mouseX > s.width || s.mouseY < 0 || s.mouseY > s.height) return;
            const now = s.millis();
            if (now - lastSpawn < SPAWN_MS) return;
            lastSpawn = now;
            const t = spawn(false);
            t.x = s.mouseX;
            t.y = Math.round(s.mouseY / GRID) * GRID;
            t.alpha = s.random(90, 150);
            t.speed = s.random(1.2, 2.4);
            t.fromMouse = true;
            mouseTraces.push(t);
            if (mouseTraces.length > MOUSE_MAX) mouseTraces.shift();
        }

        function step() {
            spawnAtMouse();
            traces.forEach(move);
            mouseTraces.forEach(move);
            mouseTraces = mouseTraces.filter((t) => !t.dead);
            render();
        }

        s.setup = () => {
            s.createCanvas(host.offsetWidth, host.offsetHeight).parent(host);
            s.frameRate(30);
            traces = Array.from({ length: Math.max(14, Math.floor(s.width / 70)) }, () => spawn(false));
            for (let i = 0; i < TAIL; i++) traces.forEach(move);
            render();
            if (reduced) s.noLoop();
        };

        s.draw = step;

        s.mouseMoved = () => { mouseSeen = true; };

        s.windowResized = () => {
            s.resizeCanvas(host.offsetWidth, host.offsetHeight);
        };

        if (!reduced && 'IntersectionObserver' in window) {
            new IntersectionObserver(
                (entries) => (entries[0].isIntersecting ? s.loop() : s.noLoop()),
                { threshold: 0 }
            ).observe(host);
        }
    });
})();
