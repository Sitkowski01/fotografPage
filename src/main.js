import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const isFinePointer = window.matchMedia('(pointer: fine)').matches;

// --- Services: obsługa tapnięcia na mobilce ---
if (!isFinePointer) {
    const serviceGroups = document.querySelectorAll('#services .group');

    serviceGroups.forEach(group => {
        group.addEventListener('click', () => {
            const isActive = group.classList.contains('is-active');
            serviceGroups.forEach(g => g.classList.remove('is-active'));
            if (!isActive) group.classList.add('is-active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#services .group')) {
            serviceGroups.forEach(g => g.classList.remove('is-active'));
        }
    });
}

// --- Mobile Menu ---
const menuBtn = document.getElementById('menu-btn');
const menuClose = document.getElementById('menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu-link');

function openMenu() {
    mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
    mobileMenu.classList.add('opacity-100');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    mobileMenu.classList.add('opacity-0', 'pointer-events-none');
    mobileMenu.classList.remove('opacity-100');
    document.body.style.overflow = '';
}

menuBtn.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// --- Custom Cursor Logic (tylko na urządzeniach z myszą) ---
if (isFinePointer) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const interactives = document.querySelectorAll('.interactive, a, button');

    gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });
    gsap.set(cursorOutline, { xPercent: -50, yPercent: -50 });

    const xToDot = gsap.quickTo(cursorDot, "x", {duration: 0.1, ease: "power3"});
    const yToDot = gsap.quickTo(cursorDot, "y", {duration: 0.1, ease: "power3"});
    const xToOutline = gsap.quickTo(cursorOutline, "x", {duration: 0.3, ease: "power3"});
    const yToOutline = gsap.quickTo(cursorOutline, "y", {duration: 0.3, ease: "power3"});

    window.addEventListener('mousemove', (e) => {
        xToDot(e.clientX);
        yToDot(e.clientY);
        xToOutline(e.clientX);
        yToOutline(e.clientY);

        const xOffset = (e.clientX / window.innerWidth - 0.5) * 40;
        const yOffset = (e.clientY / window.innerHeight - 0.5) * 40;
        document.getElementById('lensFlare').style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });

    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

// --- 3D Hover Effect for Frames ---
const frames = document.querySelectorAll('.frame-3d');
frames.forEach(frame => {
    const content = frame.querySelector('.frame-content');

    frame.addEventListener('mousemove', (e) => {
        const rect = frame.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        gsap.to(content, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1000,
            ease: "power1.out",
            duration: 0.5
        });
    });

    frame.addEventListener('mouseleave', () => {
        gsap.to(content, {
            rotateX: 0,
            rotateY: 0,
            ease: "power3.out",
            duration: 1
        });
    });
});

// --- Camera Shutter Sound (Web Audio API) ---
function playShutterSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Part 1: Mechanical thunk — mirror slap (low-mid noise burst)
    const thunkSize = Math.floor(ctx.sampleRate * 0.12);
    const thunkBuf = ctx.createBuffer(1, thunkSize, ctx.sampleRate);
    const thunkData = thunkBuf.getChannelData(0);
    for (let i = 0; i < thunkSize; i++) {
        thunkData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / thunkSize, 2.5);
    }

    const thunkSrc = ctx.createBufferSource();
    thunkSrc.buffer = thunkBuf;

    const thunkFilter = ctx.createBiquadFilter();
    thunkFilter.type = 'bandpass';
    thunkFilter.frequency.value = 800;
    thunkFilter.Q.value = 0.6;

    const thunkGain = ctx.createGain();
    thunkGain.gain.setValueAtTime(1.2, ctx.currentTime);
    thunkGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    thunkSrc.connect(thunkFilter);
    thunkFilter.connect(thunkGain);
    thunkGain.connect(ctx.destination);
    thunkSrc.start(ctx.currentTime);

    // Part 2: Shutter click — sharp high-freq snap (delayed by ~80ms)
    const clickSize = Math.floor(ctx.sampleRate * 0.06);
    const clickBuf = ctx.createBuffer(1, clickSize, ctx.sampleRate);
    const clickData = clickBuf.getChannelData(0);
    for (let i = 0; i < clickSize; i++) {
        clickData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / clickSize, 4);
    }

    const clickSrc = ctx.createBufferSource();
    clickSrc.buffer = clickBuf;

    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = 'highpass';
    clickFilter.frequency.value = 3500;

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.7, ctx.currentTime + 0.08);
    clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    clickSrc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickSrc.start(ctx.currentTime + 0.08);

    // Part 3: Shutter return — soft low thud (curtain reopens)
    const returnSize = Math.floor(ctx.sampleRate * 0.08);
    const returnBuf = ctx.createBuffer(1, returnSize, ctx.sampleRate);
    const returnData = returnBuf.getChannelData(0);
    for (let i = 0; i < returnSize; i++) {
        returnData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / returnSize, 3);
    }

    const returnSrc = ctx.createBufferSource();
    returnSrc.buffer = returnBuf;

    const returnFilter = ctx.createBiquadFilter();
    returnFilter.type = 'lowpass';
    returnFilter.frequency.value = 600;

    const returnGain = ctx.createGain();
    returnGain.gain.setValueAtTime(0.5, ctx.currentTime + 0.3);
    returnGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

    returnSrc.connect(returnFilter);
    returnFilter.connect(returnGain);
    returnGain.connect(ctx.destination);
    returnSrc.start(ctx.currentTime + 0.3);
}

// --- Viewfinder Loader & Shutter Animation ---
document.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline();

    // Simulate changing ISO and Aperture
    const isoEl = document.getElementById('vf-iso');
    const apertureEl = document.getElementById('vf-aperture');

    const isoInterval = setInterval(() => {
        isoEl.innerText = [100, 200, 400, 800, 1600][Math.floor(Math.random()*5)];
    }, 150);

    const apInterval = setInterval(() => {
        apertureEl.innerText = [1.2, 1.4, 1.8, 2.8, 4.0][Math.floor(Math.random()*5)];
    }, 250);

    // Progress Bar Animation
    tl.to({val: 0}, {
        val: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: function() {
            document.getElementById('loading-percent').innerText = Math.round(this.targets()[0].val) + '%';
        },
        onComplete: () => {
            clearInterval(isoInterval);
            clearInterval(apInterval);
            isoEl.innerText = '100';
            apertureEl.innerText = '1.4';
        }
    })

    // "Focus Lock" effect - box turns green
    .to('#focus-square', {
        borderColor: '#10B981',
        scale: 1.1,
        duration: 0.15,
        repeat: 1,
        yoyo: true
    }, "-=0.2")

    // SHUTTER ANIMATION
    .to('#shutter-top', { y: 0, duration: 0.15, ease: "power3.in", onStart: playShutterSound })
    .to('#shutter-bottom', { y: 0, duration: 0.15, ease: "power3.in" }, "<")

    .set('#loader', { display: 'none' })
    .set('#shutter-flash', { opacity: 1 })

    .to('#shutter-top', { yPercent: -100, duration: 0.4, ease: "power4.out" }, "+=0.1")
    .to('#shutter-bottom', { yPercent: 100, duration: 0.4, ease: "power4.out" }, "<")

    .to('#shutter-flash', { opacity: 0, duration: 1.5, ease: "power2.out" }, "<")

    .fromTo('#hero-img',
        { scale: 1.15 },
        { scale: 1.05, duration: 3, ease: "power3.out" }, "<"
    )
    .to('.hero-title', { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }, "-=1.2")
    .to('.hero-sub', { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=1.0")
    .to('.hero-cta', { opacity: 1, duration: 1 }, "-=0.8")

    .to('#hero-img', { scale: 1.1, duration: 25, ease: "none", repeat: -1, yoyo: true }, "-=1.5");
});

// --- Scroll Animations ---

// Hero Image Parallax
gsap.to('#hero-img', {
    yPercent: 30,
    ease: "none",
    scrollTrigger: {
        trigger: "section.relative",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// Image Parallax Effect
gsap.utils.toArray('.img-wrapper').forEach(wrapper => {
    const img = wrapper.querySelector('img.parallax-img');
    if(img) {
        gsap.to(img, {
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
                trigger: wrapper,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }
});

// Reveal Titles on Scroll
gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: title,
            start: "top 85%",
        }
    });
});

// Gallery Items Smooth Fade In
gsap.set(".gallery-item", { opacity: 0, y: 80 });

gsap.utils.toArray(".gallery-item").forEach((item) => {
    gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: item,
            start: "top 85%",
        }
    });
});
