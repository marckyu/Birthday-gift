const letterHeader = `Happy Birthday Cherry! 🌷`;

const letterBody =
    `I hope you have a really good day today, And Sana makapagpahinga ka rin kahit saglit from all the things that keep you busy and tired. Deserve mong magkaroon ng day na less stress, less pagod, and more reasons to smile. 🤍`;

const letterTextEl = document.getElementById('letterText');
const card = document.getElementById('card');
const openBtn = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');
const blowBtn = document.getElementById('blowBtn');
const countdownOverlay = document.getElementById('countdown-overlay');
const countdownNumber = document.getElementById('countdown-number');
const cakeScreen = document.getElementById('cake-screen');
const giftScreen = document.getElementById('gift-screen');
const cardScreen = document.getElementById('card-screen');
const giftbox = document.getElementById('giftbox');
const giftLetters = document.getElementById('giftLetters');
const giftLightBurst = document.getElementById('giftLightBurst');
const giftSubtitle = document.getElementById('giftSubtitle');

const pages = Array.from(document.querySelectorAll('.page'));

const isMobile = window.matchMedia('(max-width: 768px)').matches ||
    ('ontouchstart' in window && window.innerWidth < 1024);
const isLowEnd = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || isMobile;

let isOpened = false;
let isBlown = false;
let isGiftOpened = false;
let balloonsCreated = false;
let currentPageIndex = 0;

const fullMessage = letterHeader + '\n\n' + letterBody;
const cleanMessage = fullMessage.split('\n').map(line => line.trim()).join('\n');

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderLetter() {
    letterTextEl.innerHTML = cleanMessage.split('\n').map(escapeHtml).join('<br>');
}

renderLetter();

function tapHandler(element, handler) {
    let touched = false;
    element.addEventListener('touchstart', function (e) {
        touched = true;
        handler(e);
    }, { passive: true });
    element.addEventListener('click', function (e) {
        if (touched) {
            touched = false;
            return;
        }
        handler(e);
    });
}

function goToNextPage() {
    if (currentPageIndex >= pages.length - 1) return;
    pages[currentPageIndex].classList.add('flipped');
    currentPageIndex++;
}

function goToPrevPage() {
    if (currentPageIndex <= 0) return;
    currentPageIndex--;
    pages[currentPageIndex].classList.remove('flipped');
}

function resetBook() {
    pages.forEach(p => p.classList.remove('flipped'));
    currentPageIndex = 0;
}

function resetCard() {
    card.classList.remove('opened');
    isOpened = false;
    resetBook();
    setTimeout(() => {
        openBtn.style.opacity = '1';
        openBtn.style.pointerEvents = 'auto';
    }, 1200);
}

tapHandler(openBtn, function (e) {
    e.stopPropagation();
    if (isOpened) return;
    isOpened = true;
    card.classList.add('opened');
    openBtn.style.opacity = '0';
    openBtn.style.pointerEvents = 'none';
});

tapHandler(closeBtn, function (e) {
    e.stopPropagation();
    resetCard();
});

document.querySelectorAll('[data-next]').forEach(btn => {
    tapHandler(btn, function (e) {
        e.stopPropagation();
        goToNextPage();
    });
});

document.querySelectorAll('[data-prev]').forEach(btn => {
    tapHandler(btn, function (e) {
        e.stopPropagation();
        goToPrevPage();
    });
});

function createPetals() {
    const container = document.getElementById('blossom-container');
    const petalCount = isLowEnd ? 8 : (window.innerWidth < 480 ? 12 : 20);
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        const size = Math.random() * 12 + 8;
        const isWide = Math.random() > 0.5;
        petal.style.width = isWide ? size + 'px' : (size * 0.7) + 'px';
        petal.style.height = isWide ? (size * 1.3) + 'px' : size + 'px';
        petal.style.left = (Math.random() * 100) + '%';
        petal.style.animationDuration = (Math.random() * 6 + 5) + 's';
        petal.style.animationDelay = (Math.random() * 10) + 's';
        petal.style.opacity = Math.random() * 0.3 + 0.2;
        fragment.appendChild(petal);
    }
    container.appendChild(fragment);
}

createPetals();

let audioCtx = null;
let isMusicPlaying = false;
let musicTimeout = null;

function getAudioCtx() {
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            return null;
        }
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => { });
    }
    return audioCtx;
}

function playHappyBirthday() {
    if (isMusicPlaying) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    isMusicPlaying = true;

    try {
        const notes = [
            { freq: 261.63, dur: 0.3 }, { freq: 261.63, dur: 0.3 },
            { freq: 293.66, dur: 0.5 }, { freq: 261.63, dur: 0.5 },
            { freq: 349.23, dur: 0.5 }, { freq: 329.63, dur: 0.8 },
            { freq: 261.63, dur: 0.3 }, { freq: 261.63, dur: 0.3 },
            { freq: 293.66, dur: 0.5 }, { freq: 261.63, dur: 0.5 },
            { freq: 392.00, dur: 0.5 }, { freq: 349.23, dur: 0.8 },
            { freq: 261.63, dur: 0.3 }, { freq: 261.63, dur: 0.3 },
            { freq: 523.25, dur: 0.5 }, { freq: 440.00, dur: 0.5 },
            { freq: 349.23, dur: 0.5 }, { freq: 329.63, dur: 0.5 },
            { freq: 293.66, dur: 0.8 }, { freq: 466.16, dur: 0.3 },
            { freq: 466.16, dur: 0.3 }, { freq: 440.00, dur: 0.5 },
            { freq: 349.23, dur: 0.5 }, { freq: 392.00, dur: 0.5 },
            { freq: 349.23, dur: 0.8 },
        ];

        let time = ctx.currentTime + 0.1;
        const attack = 0.02;

        notes.forEach(note => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.freq, time);
            gain.gain.setValueAtTime(0.0001, time);
            gain.gain.exponentialRampToValueAtTime(0.18, time + attack);
            gain.gain.exponentialRampToValueAtTime(0.001, time + note.dur);
            osc.start(time);
            osc.stop(time + note.dur);
            time += note.dur + 0.05;
        });

        const totalDuration = notes.reduce((sum, n) => sum + n.dur + 0.05, 0) + 0.5;
        musicTimeout = setTimeout(() => {
            isMusicPlaying = false;
        }, totalDuration * 1000 + 500);
    } catch (e) {
        isMusicPlaying = false;
    }
}

function fireConfetti(count) {
    count = count || (isLowEnd ? 30 : 60);
    const colors = ['#ff6b8a', '#ff9eb5', '#ffb3c6', '#f5a0be', '#e86a92', '#d45a82', '#ff85a1', '#ffd700', '#ff1493', '#ff00ff', '#00ff88', '#ff6b35', '#ffb6c1', '#ff69b4'];
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        const size = Math.random() * 10 + 4;
        const isCircle = Math.random() > 0.5;
        piece.style.width = size + 'px';
        piece.style.height = isCircle ? size + 'px' : (size * 0.6) + 'px';
        piece.style.borderRadius = isCircle ? '50%' : '2px';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = (Math.random() * 100) + 'vw';
        piece.style.top = '-20px';
        piece.style.animationDuration = (Math.random() * 2.5 + 2) + 's';
        piece.style.animationDelay = (Math.random() * 0.8) + 's';
        fragment.appendChild(piece);
        setTimeout(() => { if (piece.parentNode) piece.remove(); }, 4000);
    }
    document.body.appendChild(fragment);
}

setTimeout(function () { blowBtn.classList.add('ready'); }, 6600);
giftbox.classList.add('pre-entrance');

const balloonColors = ['c-pink-1', 'c-pink-2', 'c-pink-3', 'c-pink-4', 'c-pink-5'];

function createBalloons() {
    if (balloonsCreated) return;
    balloonsCreated = true;
    let container = document.getElementById('balloon-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'balloon-container';
        giftScreen.insertBefore(container, giftScreen.firstChild);
    }
    container.innerHTML = '';
    const count = isLowEnd ? 6 : (window.innerWidth < 480 ? 8 : 12);
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon ' + balloonColors[i % balloonColors.length];
        balloon.style.left = (Math.random() * 90 + 5) + '%';
        balloon.style.animationDuration = (Math.random() * 6 + 12) + 's';
        balloon.style.animationDelay = (Math.random() * 8) + 's';
        balloon.style.setProperty('--sway', (Math.random() * 80 - 40).toFixed(0) + 'px');
        balloon.style.setProperty('--spin', (Math.random() * 12 - 6).toFixed(1) + 'deg');
        fragment.appendChild(balloon);
    }
    container.appendChild(fragment);
}

function buildGiftLetters(text) {
    giftLetters.innerHTML = '';
    const fragment = document.createDocumentFragment();
    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        if (char === ' ') {
            span.classList.add('space');
            span.innerHTML = '&nbsp;';
        } else {
            span.textContent = char;
            span.style.setProperty('--rot', (Math.random() * 60 - 30).toFixed(1) + 'deg');
            span.style.setProperty('--float-delay', (Math.random() * 1.5).toFixed(2) + 's');
        }
        span.style.transitionDelay = (i * 0.07) + 's';
        fragment.appendChild(span);
    });
    giftLetters.appendChild(fragment);
}

function getGiftReveal() { return document.querySelector('.gift-reveal'); }

function createGiftBeam() {
    const reveal = getGiftReveal();
    if (!reveal || document.getElementById('giftBeam')) return;
    const beam = document.createElement('div');
    beam.id = 'giftBeam';
    beam.className = 'gift-beam';
    reveal.insertBefore(beam, reveal.firstChild);
    setTimeout(() => { if (beam.parentNode) beam.remove(); }, 2600);
}

function createGiftRays() {
    const reveal = getGiftReveal();
    if (!reveal) return;
    let container = document.getElementById('giftRays');
    if (!container) {
        container = document.createElement('div');
        container.id = 'giftRays';
        container.className = 'gift-rays';
        reveal.insertBefore(container, reveal.firstChild);
    }
    container.innerHTML = '';
    const rayCount = isLowEnd ? 6 : 10;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < rayCount; i++) {
        const ray = document.createElement('div');
        ray.className = 'gift-ray';
        ray.style.setProperty('--angle', (i / rayCount * 360) + 'deg');
        ray.style.animationDelay = (i * 0.04) + 's';
        fragment.appendChild(ray);
    }
    container.appendChild(fragment);
    setTimeout(() => { if (container.parentNode) container.innerHTML = ''; }, 2600);
}

function createGiftGlow() {
    const reveal = getGiftReveal();
    if (!reveal || document.getElementById('giftGlow')) return;
    const glow = document.createElement('div');
    glow.id = 'giftGlow';
    glow.className = 'gift-glow';
    reveal.insertBefore(glow, reveal.firstChild);
}

function createGiftParticles() {
    const reveal = getGiftReveal();
    if (!reveal) return;
    let container = document.getElementById('giftParticles');
    if (!container) {
        container = document.createElement('div');
        container.id = 'giftParticles';
        container.className = 'gift-particles';
        reveal.insertBefore(container, reveal.firstChild);
    }
    container.innerHTML = '';
    const colors = ['#ffd700', '#ff69b4', '#fff8c4', '#ff9ebb', '#ffffff'];
    const count = isLowEnd ? 8 : 15;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'gift-particle';
        p.style.left = (30 + Math.random() * 40) + '%';
        p.style.bottom = '25%';
        const color = colors[Math.floor(Math.random() * colors.length)];
        p.style.background = color;
        p.style.color = color;
        const size = Math.random() * 4 + 3;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.animationDelay = (Math.random() * 1.2) + 's';
        p.style.animationDuration = (Math.random() * 1.5 + 2) + 's';
        p.style.setProperty('--drift', ((Math.random() * 80) - 40).toFixed(0) + 'px');
        fragment.appendChild(p);
    }
    container.appendChild(fragment);
    setTimeout(() => { if (container.parentNode) container.innerHTML = ''; }, 4500);
}

function createGiftSparkles() {
    const reveal = getGiftReveal();
    if (!reveal) return;
    let container = document.getElementById('giftSparkles');
    if (!container) {
        container = document.createElement('div');
        container.id = 'giftSparkles';
        container.className = 'gift-sparkles';
        reveal.insertBefore(container, reveal.firstChild);
    }
    container.innerHTML = '';
    const chars = ['\u2726', '\u2727', '\u273F', '\u274B'];
    const colors = ['#fff8c4', '#ffd700', '#ff9ebb', '#ffffff', '#ff69b4'];
    const count = isLowEnd ? 8 : 14;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const s = document.createElement('span');
        s.className = 'gift-sparkle';
        s.textContent = chars[Math.floor(Math.random() * chars.length)];
        s.style.left = (Math.random() * 100) + '%';
        s.style.top = (20 + Math.random() * 60) + '%';
        s.style.fontSize = (Math.random() * 8 + 10) + 'px';
        s.style.color = colors[Math.floor(Math.random() * colors.length)];
        s.style.animationDelay = (Math.random() * 3) + 's';
        s.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
        fragment.appendChild(s);
    }
    container.appendChild(fragment);
}

function startAutoReveal() {
    giftLightBurst.classList.add('burst');
    buildGiftLetters('Happy Birthday');
    createGiftBeam();
    createGiftRays();
    createGiftGlow();
    createGiftParticles();
    createGiftSparkles();
    setTimeout(() => {
        giftLetters.querySelectorAll('span:not(.space)').forEach(s => s.classList.add('show'));
    }, 200);
    setTimeout(() => {
        giftLetters.querySelectorAll('span:not(.space)').forEach(s => s.classList.add('float'));
    }, 1800);
    startFireworks();
    setTimeout(() => { giftSubtitle.classList.add('show'); }, 1400);
}

let csPetalsInterval = null;

function startCsPetals() {
    if (csPetalsInterval) return;
    const interval = isLowEnd ? 350 : 200;
    csPetalsInterval = setInterval(() => {
        const petal = document.createElement('div');
        petal.classList.add('cs-petal');
        petal.style.left = Math.random() * window.innerWidth + 'px';
        petal.style.animationDuration = (Math.random() * 3 + 3) + 's';
        petal.style.setProperty('--sway-x', ((Math.random() * 120) - 60).toFixed(0) + 'px');
        cardScreen.appendChild(petal);
        setTimeout(() => { if (petal.parentNode) petal.remove(); }, 6000);
    }, interval);
}

tapHandler(giftbox, function () {
    if (isGiftOpened) return;
    if (!giftbox.classList.contains('entered')) return;
    isGiftOpened = true;
    giftLightBurst.classList.add('burst');
    giftbox.classList.remove('entered');
    giftbox.classList.add('opening');
    setTimeout(() => {
        giftbox.style.display = 'none';
        setTimeout(() => {
            giftScreen.classList.add('fading-out');
            setTimeout(() => {
                giftScreen.classList.remove('active', 'fading-out');
                cardScreen.classList.add('active');
                startCsPetals();
                setTimeout(() => {
                    cardScreen.classList.add('card-visible');
                }, 200);
            }, 1000);
        }, 400);
    }, 500);
});

tapHandler(blowBtn, function () {
    if (isBlown) return;
    isBlown = true;
    blowBtn.disabled = true;
    blowBtn.textContent = 'Blown out...';
    document.querySelectorAll('.velas').forEach(v => v.classList.add('extinguished'));
    setTimeout(() => {
        countdownOverlay.classList.add('active');
        let count = 3;
        function updateCountdown() {
            countdownNumber.textContent = count;
            countdownNumber.style.animation = 'none';
            void countdownNumber.offsetHeight;
            countdownNumber.style.animation = 'countPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            if (count > 0) {
                count--;
                setTimeout(updateCountdown, 1000);
            } else {
                countdownNumber.textContent = '';
                setTimeout(() => {
                    countdownOverlay.classList.remove('active');
                    cakeScreen.classList.add('hidden');
                    giftScreen.classList.add('active');
                    createBalloons();
                    setTimeout(() => {
                        playHappyBirthday();
                        startAutoReveal();
                    }, 500);
                    setTimeout(() => {
                        giftbox.classList.remove('pre-entrance');
                        giftbox.classList.add('entering');
                        setTimeout(() => {
                            giftbox.classList.remove('entering');
                            giftbox.classList.add('entered');
                        }, 1200);
                    }, 14000);
                }, 500);
            }
        }
        updateCountdown();
    }, 800);
});

let fwCanvas = null, fwCtx = null, fwFireworks = [], fwParticles = [], fwHue = 120, fwTimerTick = 0, fwRunning = false, fwRAF = null;
let fwTargetFPS = isLowEnd ? 30 : 60;
let fwFrameInterval = 1000 / fwTargetFPS;
let fwLastFrame = 0;

function fwRandom(min, max) { return Math.random() * (max - min) + min; }
function fwDistance(p1x, p1y, p2x, p2y) {
    const xD = p1x - p2x, yD = p1y - p2y;
    return Math.sqrt(xD * xD + yD * yD);
}

function FwFirework(sx, sy, tx, ty) {
    this.x = sx; this.y = sy; this.sx = sx; this.sy = sy;
    this.tx = tx; this.ty = ty;
    this.distanceToTarget = fwDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = isLowEnd ? 2 : 3;
    while (this.coordinateCount--) this.coordinates.push([this.x, this.y]);
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = fwRandom(50, 70);
    this.targetRadius = 1;
}

FwFirework.prototype.update = function (index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    if (this.targetRadius < 8) this.targetRadius += 0.3;
    else this.targetRadius = 1;
    this.speed *= this.acceleration;
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = fwDistance(this.sx, this.sy, this.x + vx, this.y + vy);
    if (this.distanceTraveled >= this.distanceToTarget) {
        fwCreateParticles(this.tx, this.ty);
        fwFireworks.splice(index, 1);
    } else {
        this.x += vx;
        this.y += vy;
    }
};

FwFirework.prototype.draw = function () {
    fwCtx.beginPath();
    fwCtx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    fwCtx.lineTo(this.x, this.y);
    fwCtx.strokeStyle = 'hsl(' + fwHue + ', 100%, ' + this.brightness + '%)';
    fwCtx.stroke();
    fwCtx.beginPath();
    fwCtx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
    fwCtx.stroke();
};

function FwParticle(x, y) {
    this.x = x; this.y = y;
    this.coordinates = [];
    this.coordinateCount = isLowEnd ? 3 : 5;
    while (this.coordinateCount--) this.coordinates.push([this.x, this.y]);
    this.angle = fwRandom(0, Math.PI * 2);
    this.speed = fwRandom(1, 10);
    this.friction = 0.95;
    this.gravity = 1;
    this.hue = fwRandom(fwHue - 20, fwHue + 20);
    this.brightness = fwRandom(50, 80);
    this.alpha = 1;
    this.decay = fwRandom(0.015, 0.03);
}

FwParticle.prototype.update = function (index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;
    if (this.alpha <= this.decay) fwParticles.splice(index, 1);
};

FwParticle.prototype.draw = function () {
    fwCtx.beginPath();
    fwCtx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    fwCtx.lineTo(this.x, this.y);
    fwCtx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
    fwCtx.stroke();
};

function fwCreateParticles(x, y) {
    let count = isLowEnd ? 15 : 25;
    while (count--) fwParticles.push(new FwParticle(x, y));
}

function fwLoop(timestamp) {
    if (!fwRunning) return;
    fwRAF = requestAnimationFrame(fwLoop);

    if (timestamp - fwLastFrame < fwFrameInterval) return;
    fwLastFrame = timestamp;

    fwHue += 0.5;
    fwCtx.globalCompositeOperation = 'destination-out';
    fwCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);
    fwCtx.globalCompositeOperation = 'lighter';
    let i = fwFireworks.length;
    while (i--) { fwFireworks[i].draw(); fwFireworks[i].update(i); }
    i = fwParticles.length;
    while (i--) { fwParticles[i].draw(); fwParticles[i].update(i); }
    fwTimerTick++;
    const tickThreshold = isLowEnd ? 100 : 60;
    if (fwTimerTick >= tickThreshold) {
        fwFireworks.push(new FwFirework(fwCanvas.width / 2, fwCanvas.height, fwRandom(0, fwCanvas.width), fwRandom(0, fwCanvas.height / 2)));
        fwTimerTick = 0;
    }
}

function startFireworks() {
    if (fwRunning) return;
    fwCanvas = document.getElementById('fireworks-canvas');
    if (!fwCanvas) return;
    fwCtx = fwCanvas.getContext('2d', { alpha: true });
    const dpr = isLowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    fwCanvas.width = window.innerWidth * dpr;
    fwCanvas.height = window.innerHeight * dpr;
    fwCanvas.style.width = window.innerWidth + 'px';
    fwCanvas.style.height = window.innerHeight + 'px';
    fwCtx.scale(dpr, dpr);
    fwRunning = true;
    fwLoop(0);
}

let resizeTimeout = null;
window.addEventListener('resize', function () {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        if (fwCanvas) {
            const dpr = isLowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 2);
            fwCanvas.width = window.innerWidth * dpr;
            fwCanvas.height = window.innerHeight * dpr;
            fwCanvas.style.width = window.innerWidth + 'px';
            fwCanvas.style.height = window.innerHeight + 'px';
            fwCtx.setTransform(1, 0, 0, 1, 0, 0);
            fwCtx.scale(dpr, dpr);
        }
    }, 200);
}, { passive: true });

document.addEventListener('touchstart', function initAudio() {
    getAudioCtx();
}, { once: true, passive: true });

document.addEventListener('click', function initAudio() {
    getAudioCtx();
}, { once: true });

console.log('Happy Birthday, Cherry!!!');
