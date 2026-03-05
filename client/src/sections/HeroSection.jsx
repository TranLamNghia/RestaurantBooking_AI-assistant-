import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Marquee content ──────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
    '✦ Michelin Recognised 2024',
    '✦ Top 10 Restaurant — Singapore Tatler',
    '✦ Best Heritage Cuisine — Time Out Singapore',
    '✦ Rooted in Boat Quay Since 1998',
    '✦ Michelin Recognised 2024',
    '✦ Top 10 Restaurant — Singapore Tatler',
    '✦ Best Heritage Cuisine — Time Out Singapore',
    '✦ Rooted in Boat Quay Since 1998',
]

// Line 1 of headline
const HEADLINE_L1 = 'Origins & Inspirations'
// Line 2 of headline
const HEADLINE_L2 = 'Reinventing the Silk Route, one plate at a time.'

export default function HeroSection() {
    const heroRef = useRef(null)
    const overlayRef = useRef(null)
    const topLabelRef = useRef(null)
    const dividerRef = useRef(null)
    const subtitleRef = useRef(null)
    const ctaRef = useRef(null)
    const scrollIndicatorRef = useRef(null)
    const marqueeRef = useRef(null)
    // Each character span is stored here during render
    const charSpans = useRef([])

    useEffect(() => {
        const chars = charSpans.current.filter(Boolean)

        const tl = gsap.timeline({ delay: 0.5 })

        // 1. Dark overlay / vignette
        tl.from(overlayRef.current, {
            opacity: 0,
            duration: 1.8,
            ease: 'power4.out',
        })

        // 2. Location badge
        tl.from(topLabelRef.current, {
            opacity: 0,
            y: 14,
            duration: 0.9,
            ease: 'power4.out',
        }, '-=1.3')

        // 3. Headline — letter-by-letter stagger (3D flip from above)
        tl.fromTo(
            chars,
            {
                opacity: 0,
                y: 32,
                rotateX: -70,
                transformOrigin: 'center top',
            },
            {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.65,
                ease: 'power4.out',
                stagger: { each: 0.042, from: 'start' },
            },
            '-=0.6'
        )

        // 4. Ornamental divider
        tl.from(dividerRef.current, {
            scaleX: 0,
            opacity: 0,
            duration: 0.8,
            ease: 'power4.out',
        }, '-=0.25')

        // 5. Subtitle italic
        tl.from(subtitleRef.current, {
            opacity: 0,
            y: 14,
            letterSpacing: '0.55em',
            duration: 1.1,
            ease: 'power4.out',
        }, '-=0.55')

        // 6. CTA buttons
        tl.from(ctaRef.current, {
            opacity: 0,
            y: 14,
            duration: 0.8,
            ease: 'power4.out',
        }, '-=0.7')

        // 7. Scroll indicator
        tl.from(scrollIndicatorRef.current, {
            opacity: 0,
            y: 8,
            duration: 0.6,
            ease: 'power4.out',
        }, '-=0.4')

        // 8. Marquee bar
        tl.from(marqueeRef.current, {
            opacity: 0,
            y: 12,
            duration: 0.6,
            ease: 'power4.out',
        }, '-=0.5')

        // 9. Video parallax on scroll
        const videoBg = heroRef.current?.querySelector('.hero-video-wrap')
        if (videoBg) {
            gsap.to(videoBg, {
                yPercent: 28,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            })
        }

        return () => {
            tl.kill()
            ScrollTrigger.getAll().forEach(t => t.kill())
        }
    }, [])

    return (
        <section
            ref={heroRef}
            id="hero"
            style={{
                position: 'relative',
                height: '100vh',
                minHeight: '700px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* ── Video background ─────────────────────────────────────────── */}
            <div
                className="hero-video-wrap"
                style={{
                    position: 'absolute',
                    inset: '-20%',
                    zIndex: 0,
                    overflow: 'hidden',
                }}
            >
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'brightness(0.36) saturate(0.8)',
                    }}
                >
                    <source
                        src="/src/assets/videos/hero-bg-2.mp4"
                        type="video/mp4"
                    />
                    <source
                        src="/src/assets/videos/hero-bg.mp4"
                        type="video/mp4"
                    />
                    {/* Fallback static poster image is shown automatically */}
                </video>
                {/* Warm amber colour tint blended onto the video */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(8, 4, 2, 0.32)',
                        mixBlendMode: 'multiply',
                    }}
                />
            </div>

            {/* ── Radial vignette overlay ──────────────────────────────────── */}
            <div
                ref={overlayRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    background:
                        'radial-gradient(ellipse at center, rgba(13,11,8,0.1) 0%, rgba(13,11,8,0.72) 100%)',
                }}
            />

            {/* ── Gold corner accents (z:2) ────────────────────────────────── */}
            {[
                { top: '2rem', left: '2rem', borderTop: '1px solid', borderLeft: '1px solid' },
                { top: '2rem', right: '2rem', borderTop: '1px solid', borderRight: '1px solid' },
                { bottom: '4.5rem', left: '2rem', borderBottom: '1px solid', borderLeft: '1px solid' },
                { bottom: '4.5rem', right: '2rem', borderBottom: '1px solid', borderRight: '1px solid' },
            ].map((s, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: '3rem',
                        height: '3rem',
                        borderColor: 'rgba(201,168,76,0.45)',
                        zIndex: 2,
                        ...s,
                    }}
                />
            ))}

            {/* ── Hero centre content (z:10) ───────────────────────────────── */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 10,
                    textAlign: 'center',
                    padding: '0 1.5rem',
                    perspective: '900px',   // needed for rotateX letter animation
                }}
            >
                {/* Location label */}
                <div
                    ref={topLabelRef}
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.6rem',
                        letterSpacing: '0.4em',
                        color: 'var(--color-gold)',
                        textTransform: 'uppercase',
                        marginBottom: '1.5rem',
                        opacity: 0.9,
                    }}
                >
                    – 51 Circular Road, Singapore –
                </div>

                {/* ── Headline line 1: "Asian Tapas" — large elegant serif, matches reference image */}
                <h1
                    style={{
                        fontFamily: 'var(--font-elegant)',   // Cormorant Garamond — matches the refined image
                        fontSize: 'clamp(3rem, 9vw, 8rem)',
                        letterSpacing: '0.04em',
                        color: 'rgba(240, 232, 214, 0.95)', // warm cream — same as image
                        textTransform: 'none',              // NOT uppercase — matches image exactly
                        fontWeight: 400,
                        fontStyle: 'normal',
                        lineHeight: 1.1,
                        marginBottom: '0.1em',
                    }}
                >
                    {HEADLINE_L1.split('').map((char, i) => (
                        <span
                            key={i}
                            ref={(el) => { charSpans.current[i] = el }}
                            style={{
                                display: 'inline-block',
                                opacity: 0,
                            }}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </h1>

                {/* ── Headline line 2: "Food Tales from the Maritime Silk Route." — same serif, smaller */}
                <p
                    style={{
                        fontFamily: 'var(--font-elegant)',
                        fontSize: 'clamp(1.25rem, 3.2vw, 2.8rem)',
                        letterSpacing: '0.02em',
                        color: 'rgba(235, 226, 205, 0.88)',
                        textTransform: 'none',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        lineHeight: 1.2,
                        marginBottom: '0',
                    }}
                >
                    {HEADLINE_L2}
                </p>

                {/* Ornamental divider */}
                <div
                    ref={dividerRef}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        margin: '1.25rem 0',
                    }}
                >
                    <span style={{ width: '60px', height: '1px', background: 'var(--color-gold)', opacity: 0.6 }} />
                    <span style={{ color: 'var(--color-gold)', fontSize: '0.9rem' }}>✦</span>
                    <span style={{ width: '60px', height: '1px', background: 'var(--color-gold)', opacity: 0.6 }} />
                </div>

                {/* Subtitle */}
                <p
                    ref={subtitleRef}
                    style={{
                        fontFamily: 'var(--font-elegant)',
                        fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
                        letterSpacing: '0.25em',
                        color: 'rgba(245,240,232,0.75)',
                        textTransform: 'uppercase',
                        marginBottom: '2.5rem',
                        fontStyle: 'italic',
                    }}
                >
                    Where Ancient Flavours Meet Modern Elegance
                </p>

                {/* CTA buttons */}
                <div ref={ctaRef} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => {
                            const resSec = document.getElementById('reservations')
                            if (resSec) {
                                resSec.scrollIntoView({ behavior: 'smooth' })
                                // Briefly highlight the AI chat button in reservations section if needed,
                                // or we can just scroll them there.
                            }
                        }}
                        className="btn-gold"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '1rem 2rem',
                        }}
                    >
                        <div style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            background: 'var(--color-dark)',
                            animation: 'aiGlowDot 2s ease-in-out infinite',
                        }} />
                        AI Concierge
                    </button>
                    <a
                        href="#concept"
                        className="btn-outline-gold"
                        onClick={(e) => {
                            e.preventDefault()
                            document.getElementById('concept')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                    >
                        Discover Our Story
                    </a>
                </div>
            </div>

            {/* ── Scroll indicator (z:10) ──────────────────────────────────── */}
            <div
                ref={scrollIndicatorRef}
                style={{
                    position: 'absolute',
                    bottom: '5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: 0.6,
                    zIndex: 10,
                }}
            >
                <span
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.55rem',
                        letterSpacing: '0.3em',
                        color: 'var(--color-cream)',
                        textTransform: 'uppercase',
                    }}
                >
                    Scroll
                </span>
                <div
                    style={{
                        width: '1px',
                        height: '40px',
                        background: 'linear-gradient(to bottom, var(--color-gold), transparent)',
                        animation: 'scrollLine 2s ease-in-out infinite',
                    }}
                />
            </div>

            {/* ── Marquee brand awards bar (z:10, fixed to bottom) ─────────── */}
            <div
                ref={marqueeRef}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    overflow: 'hidden',
                    background: 'rgba(13,11,8,0.65)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    borderTop: '1px solid rgba(201,168,76,0.18)',
                    padding: '0.55rem 0',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        whiteSpace: 'nowrap',
                        animation: 'marqueeScroll 30s linear infinite',
                        gap: '4rem',
                    }}
                >
                    {MARQUEE_ITEMS.map((item, i) => (
                        <span
                            key={i}
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.57rem',
                                letterSpacing: '0.28em',
                                color: 'rgba(201,168,76,0.82)',
                                textTransform: 'uppercase',
                                flexShrink: 0,
                            }}
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes scrollLine {
                    0%   { opacity: 0; transform: scaleY(0); transform-origin: top; }
                    50%  { opacity: 1; transform: scaleY(1); transform-origin: top; }
                    100% { opacity: 0; transform: scaleY(0); transform-origin: bottom; }
                }
                @keyframes marqueeScroll {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    )
}
