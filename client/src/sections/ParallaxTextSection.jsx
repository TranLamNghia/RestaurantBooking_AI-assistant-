import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────────────────────
// 2 images only — large + small, clustered near the headline band
// ─────────────────────────────────────────────────────────────────────────────
const IMAGES = [
    {
        // LARGE — anchored left, slightly overlapping line 1
        src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85',
        alt: 'Heritage plated dish',
        style: {
            top: '15%',
            left: '5%',
            width: 'clamp(140px, 16vw, 240px)',
            aspectRatio: '3 / 4',
            transform: 'rotate(-3deg)',
        },
        scrub: 1.0,   // fastest — leads the parallax
        yTravel: -180,
    },
    {
        // SMALL — tight right, near line 2 text cluster
        src: 'https://images.unsplash.com/photo-1470338745628-171cf53de3a8?w=700&q=85',
        alt: 'Spiced cocktail',
        style: {
            top: '28%',
            right: '8%',
            width: 'clamp(85px, 10vw, 145px)',
            aspectRatio: '4 / 5',
            transform: 'rotate(3deg)',
        },
        scrub: 2.8,   // slowest — most dramatic lag, "lephase" feel
        yTravel: -240,
    },
]

// ─────────────────────────────────────────────────────────────────────────────
// Text styles — line-height 1.25 prevents Serif descender/ascender collisions
// letter-spacing 0.08em gives breathing room between characters
// ─────────────────────────────────────────────────────────────────────────────
const TEXT_SOLID = {                              // Line 1: PAST & PRESENT — solid fill
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(1.8rem, 4.6vw, 5.8rem)',     // ~25% smaller, centred
    fontWeight: 300,
    fontStyle: 'italic',
    lineHeight: 1.25,
    letterSpacing: '0.08em',
    whiteSpace: 'nowrap',
    color: 'inherit',
    textAlign: 'center',
}
const TEXT_OUTLINE = {                            // Line 2: FLAVOURS & SPICES — outline only
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(1.6rem, 4.0vw, 5.0rem)',     // ~25% smaller
    fontWeight: 300,
    fontStyle: 'italic',
    lineHeight: 1.25,
    letterSpacing: '0.08em',
    whiteSpace: 'nowrap',
    paddingLeft: 0,                               // remove left-indent — centred layout
    color: 'transparent',
    WebkitTextStroke: '1.2px rgba(240, 228, 196, 0.85)',
    textAlign: 'center',
}

export default function ParallaxTextSection() {
    const sectionRef = useRef(null)
    const wrapperRef = useRef(null)   // the element that gets mask-image
    const bgTextRef = useRef(null)   // z:3 below images
    const fgTextRef = useRef(null)   // z:7 above images
    const imageRefs = useRef([])
    const descRef = useRef(null)
    const subtitleRef = useRef(null)
    const line1Refs = useRef([])
    const line2Refs = useRef([])

    const addImgRef = (el) => {
        if (el && !imageRefs.current.includes(el)) imageRefs.current.push(el)
    }

    useEffect(() => {
        const ctx = gsap.context(() => {

            // ── Text: 0.4× scroll speed, scrub:2 ────────────────────────────
            gsap.to([bgTextRef.current, fgTextRef.current], {
                y: -80,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2,
                },
            })

            // ── Letter-spacing entrance ───────────────────────────────────
            const allLines = [
                ...line1Refs.current.filter(Boolean),
                ...line2Refs.current.filter(Boolean),
            ]
            gsap.fromTo(
                allLines,
                { letterSpacing: '0.30em' },
                {
                    letterSpacing: '0.06em',
                    ease: 'power4.out',
                    duration: 1.6,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse',
                    },
                }
            )

            // ── Images: each has unique scrub = fully lephase with text ───
            imageRefs.current.forEach((wrapper, i) => {
                const img = IMAGES[i]
                const inner = wrapper.querySelector('img')

                // Reveal
                gsap.from(wrapper, {
                    opacity: 0,
                    y: 50,
                    duration: 1.1,
                    delay: i * 0.22,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 82%',
                        toggleActions: 'play none none reverse',
                    },
                })

                // Ken-burns inner
                if (inner) {
                    gsap.fromTo(
                        inner,
                        { scale: 1.2, y: 22 },
                        {
                            scale: 1.0,
                            y: -22,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: sectionRef.current,
                                start: 'top bottom',
                                end: 'bottom top',
                                scrub: img.scrub,
                            },
                        }
                    )
                }

                // Main y-travel — lephase scrub creates the "floating past" sensation
                gsap.to(wrapper, {
                    y: img.yTravel,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: img.scrub,
                    },
                })
            })

            // ── Subtitle ─────────────────────────────────────────────────
            gsap.from(subtitleRef.current, {
                opacity: 0,
                y: 18,
                duration: 1.2,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 78%',
                    toggleActions: 'play none none reverse',
                },
            })

            // ── Description block ─────────────────────────────────────────
            gsap.from(descRef.current, {
                opacity: 0,
                y: 40,
                duration: 1,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: descRef.current,
                    start: 'top 82%',
                    toggleActions: 'play none none reverse',
                },
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            style={{
                position: 'relative',
                overflow: 'hidden',
                padding: 'clamp(6rem, 10vw, 12rem) 0',
                minHeight: 'clamp(520px, 75vw, 900px)',
                background: 'var(--color-dark)',
            }}
        >
            {/* ── z:0 Background image ────────────────────────────────────── */}
            <div
                ref={wrapperRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1920&q=85)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0,
                    // ── mask-image: dissolves top & bottom into the page's dark BG ──
                    // Replaces the div-based gradients — GPU-composited, cleaner edge
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
                }}
            />

            {/* ── z:1 Dark colour-grade overlay ───────────────────────────── */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'linear-gradient(135deg, rgba(13,11,8,0.72) 0%, rgba(43,25,10,0.48) 50%, rgba(13,11,8,0.75) 100%)',
                    zIndex: 1,
                    // Same mask so the fade is consistent
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
                }}
            />

            {/* ══════════════════════════════════════════════════════════════════
          z:3 — BG TEXT LAYER (solid fill line 1, outline line 2)
          Champagne colour, opacity 0.4, soft-light blend
          ══════════════════════════════════════════════════════════════════ */}
            <div
                ref={bgTextRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 4vw',
                    zIndex: 3,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    opacity: 0.65,
                    mixBlendMode: 'soft-light',
                    color: 'rgba(240,228,196,1)',
                }}
            >
                {/* Line 1 — SOLID fill */}
                <div
                    ref={(el) => { line1Refs.current[0] = el }}
                    style={TEXT_SOLID}
                >
                    PAST &amp; PRESENT
                </div>
                {/* Line 2 — OUTLINE only (colour is transparent, stroke = wrapper colour) */}
                <div
                    ref={(el) => { line2Refs.current[0] = el }}
                    style={TEXT_OUTLINE}
                >
                    FLAVOURS &amp; SPICES
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
          z:5 — FOOD IMAGES — 2 only, clustered, no border/shadow
          ══════════════════════════════════════════════════════════════════ */}
            {IMAGES.map((img, i) => (
                <div
                    key={i}
                    ref={addImgRef}
                    style={{
                        ...img.style,
                        position: 'absolute',
                        overflow: 'hidden',
                        zIndex: 5,
                    }}
                >
                    <img
                        src={img.src}
                        alt={img.alt}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                        }}
                    />
                </div>
            ))}

            {/* ══════════════════════════════════════════════════════════════════
          z:7 — FG TEXT LAYER (above images, same solid/outline split)
          ══════════════════════════════════════════════════════════════════ */}
            <div
                ref={fgTextRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 4vw',
                    zIndex: 7,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    opacity: 0.65,
                    mixBlendMode: 'soft-light',
                    color: 'rgba(255,248,220,1)',
                }}
            >
                <div
                    ref={(el) => { line1Refs.current[1] = el }}
                    style={TEXT_SOLID}
                >
                    PAST &amp; PRESENT
                </div>
                <div
                    ref={(el) => { line2Refs.current[1] = el }}
                    style={TEXT_OUTLINE}
                >
                    FLAVOURS &amp; SPICES
                </div>
            </div>


            {/* ══════════════════════════════════════════════════════════════════
          z:9 — DESCRIPTION BLOCK
          ══════════════════════════════════════════════════════════════════ */}
            <div
                ref={descRef}
                style={{
                    position: 'relative',
                    zIndex: 9,
                    maxWidth: '460px',
                    margin: '0 auto',
                    textAlign: 'center',
                    marginTop: 'clamp(8rem, 18vw, 22rem)',
                    padding: '0 2rem',
                }}
            >
                {/* ── Our Heritage label — prominent, larger, gold ── */}
                <div
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.72rem',
                        letterSpacing: '0.45em',
                        textTransform: 'uppercase',
                        color: 'var(--color-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1.2rem',
                        marginBottom: '1.75rem',
                    }}
                >
                    <span style={{ width: '40px', height: '1px', background: 'var(--color-gold)', opacity: 0.5 }} />
                    Our Heritage
                    <span style={{ width: '40px', height: '1px', background: 'var(--color-gold)', opacity: 0.5 }} />
                </div>

                <p
                    style={{
                        fontFamily: 'var(--font-elegant)',
                        fontSize: 'clamp(0.92rem, 1.15vw, 1rem)',
                        color: 'rgba(245,240,232,0.62)',
                        lineHeight: 1.9,
                        marginBottom: '1.25rem',
                    }}
                >
                    Quay House is deeply rooted in Boat Quay, one of Singapore's most storied
                    waterfronts — once a thriving hub of spice merchants and traders from across
                    the Indian Ocean. We honour that legacy through flavours that bridge centuries:
                    age-old spice routes reinvented for the contemporary palate.
                </p>

                <div
                    style={{
                        width: '36px',
                        height: '1px',
                        background:
                            'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
                        margin: '0 auto',
                    }}
                />
            </div>
        </section>
    )
}
