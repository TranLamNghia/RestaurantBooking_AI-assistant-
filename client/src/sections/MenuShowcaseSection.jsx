import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigate } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

// ─── Menu card data ────────────────────────────────────────────────────────────
const MENU_CARDS = [
    {
        id: 'food',
        title: 'Food',
        label: 'FOOD • FOOD • FOOD •',
        img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
        desc: 'Heritage recipes elevated with contemporary finesse',
        badge: null,
        group: 'alacarte',
    },
    {
        id: 'beverages',
        title: 'Beverages',
        label: 'BEVERAGES • BEVERAGES • BEVERAGES •',
        img: 'https://images.unsplash.com/photo-1470338745628-171cf53de3a8?w=800&q=80',
        desc: 'Artisanal cocktails infused with exotic spice notes',
        badge: null,
        group: 'alacarte',
    },
    {
        id: 'lunch',
        title: 'Lunch',
        label: 'LUNCH • LUNCH • LUNCH •',
        img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
        desc: 'Three-course set menus for the discerning afternoon diner',
        badge: '$24++',
        group: 'sets',
    },
    {
        id: 'dinner',
        title: 'Dinner',
        label: 'DINNER • DINNER • DINNER •',
        img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
        desc: 'A four-course heritage set crafted for the art of evening',
        badge: '$68++',
        group: 'sets',
    },
]

// ─── Circular SVG text ────────────────────────────────────────────────────────
function CircularText({ text }) {
    const id = `cp-${text.replace(/[^a-z]/gi, '').slice(0, 12)}`
    const radius = 125
    const GOLD = '#D4AF37'
    return (
        <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 5, pointerEvents: 'none',
        }}>
            <svg viewBox="0 0 300 300" style={{
                width: '78%', height: '78%',
                animation: 'rotateSlow 20s linear infinite',
                position: 'absolute',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.85))',
            }} overflow="visible">
                <defs>
                    <path id={id} d={`M 150,150 m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`} />
                </defs>
                <circle cx="150" cy="150" r={radius} fill="none" stroke={GOLD} strokeWidth="1.2" strokeDasharray="3 7" opacity="0.6" />
                <text style={{ fontSize: '30px', fontFamily: 'var(--font-display)', fill: GOLD, letterSpacing: '2px', fontWeight: 400 }}>
                    <textPath href={`#${id}`} textLength={2 * Math.PI * radius} lengthAdjust="spacing">{text}</textPath>
                </text>
            </svg>
            {/* Non-rotating + */}
            <div style={{
                position: 'relative', zIndex: 10,
                fontSize: '72px', lineHeight: 1,
                color: GOLD, fontWeight: 100,
                fontFamily: 'var(--font-display)',
                textShadow: '0 4px 20px rgba(0,0,0,0.9)',
                userSelect: 'none',
            }}>+</div>
        </div>
    )
}


// ─── Main Section ─────────────────────────────────────────────────────────────
export default function MenuShowcaseSection() {
    const sectionRef = useRef(null)
    const headingRef = useRef(null)
    const cardsRef = useRef([])
    const navigate = useNavigate()

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headingRef.current, {
                opacity: 0, y: 40, duration: 1, ease: 'power3.out',
                immediateRender: false,
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
            })
            cardsRef.current.forEach((card, i) => {
                if (!card) return
                gsap.from(card, {
                    opacity: 0, y: 50, duration: 0.9,
                    ease: 'power3.out', delay: i * 0.1,
                    immediateRender: false,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 88%',
                        toggleActions: 'play none none reverse',
                    },
                })
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="menu"
            style={{
                background: 'var(--color-charcoal)',
                padding: 'clamp(5rem, 8vw, 8rem) 0',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Dot pattern BG */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.04) 1px, transparent 0)',
                backgroundSize: '40px 40px',
            }} />

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 3 }}>

                {/* ── Section title ── */}
                <div ref={headingRef} style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 4vw, 4rem)' }}>
                    <div className="section-label mb-4" style={{ justifyContent: 'center' }}>Menu Showcase</div>
                    <h2 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                        color: 'var(--color-cream)',
                        fontWeight: 400,
                        marginBottom: '1rem',
                    }}>
                        A Table of <em style={{ color: 'var(--color-gold)', fontStyle: 'italic' }}>Curated Pleasures</em>
                    </h2>
                    <p style={{
                        fontFamily: 'var(--font-elegant)',
                        fontSize: '1.05rem',
                        color: 'rgba(245,240,232,0.45)',
                        fontStyle: 'italic',
                        maxWidth: '520px',
                        margin: '0 auto',
                    }}>
                        From fragrant spiced starters to decadent festive feasts — each offering is a chapter in our culinary story.
                    </p>
                </div>

                {/* ── Cards row with vertical labels and divider ── */}
                <div style={{ position: 'relative' }}>

                    {/* ── Top Labels (Centered over each group) ── */}
                    <div style={{
                        display: 'flex',
                        paddingLeft: '2.8rem',
                        paddingRight: '2.8rem',
                        marginBottom: '1rem',
                        alignItems: 'center',
                    }}>
                        {/* Alacarte Label spanning 50% (Food + Beverages + gap) */}
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <span style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.65rem',
                                letterSpacing: '0.35em',
                                textTransform: 'uppercase',
                                color: 'rgba(201,168,76,0.55)',
                                userSelect: 'none',
                            }}>ALACARTE</span>
                        </div>
                        {/* The center gap: 37px spacer to align perfectly with the divider */}
                        <div style={{ width: '37px', flexShrink: 0 }} />
                        {/* Experience Sets Label spanning 50% (Lunch + Dinner + gap) */}
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <span style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.65rem',
                                letterSpacing: '0.35em',
                                textTransform: 'uppercase',
                                color: 'rgba(201,168,76,0.55)',
                                userSelect: 'none',
                            }}>EXPERIENCE SETS</span>
                        </div>
                    </div>

                    {/* Cards flex row — a=18px gap, centre gap = 2a+1px */}
                    <div style={{
                        display: 'flex',
                        paddingLeft: '2.8rem',
                        paddingRight: '2.8rem',
                    }}>
                        {MENU_CARDS.map((cat, i) => (
                            <React.Fragment key={cat.id}>
                                {/* Spacers: a=18px before Beverages and Dinner, 2a+1px divider before Lunch */}
                                {i === 1 && (
                                    <div style={{ width: '18px', flexShrink: 0 }} />
                                )}
                                {i === 2 && (
                                    /* Before Lunch: a + 1px white line + a */
                                    <div style={{ display: 'flex', alignItems: 'stretch', flexShrink: 0, width: '37px' }}>
                                        <div style={{ flex: 1 }} />
                                        <div style={{ width: '1px', background: 'linear-gradient(to bottom, transparent 5%, rgba(255,255,255,0.18) 25%, rgba(255,255,255,0.18) 75%, transparent 95%)' }} />
                                        <div style={{ flex: 1 }} />
                                    </div>
                                )}
                                {i === 3 && (
                                    <div style={{ width: '18px', flexShrink: 0 }} />
                                )}

                                {/* Card */}
                                <div
                                    key={cat.id}
                                    ref={el => cardsRef.current[i] = el}
                                    onClick={() => navigate('/menu', { state: { tab: cat.id } })}
                                    style={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        flex: 1,
                                        height: 'clamp(380px, 40vw, 540px)',
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={e => {
                                        const img = e.currentTarget.querySelector('img')
                                        if (img) gsap.to(img, { scale: 1.06, duration: 0.7, ease: 'power2.out' })
                                    }}
                                    onMouseLeave={e => {
                                        const img = e.currentTarget.querySelector('img')
                                        if (img) gsap.to(img, { scale: 1, duration: 0.6, ease: 'power2.out' })
                                    }}
                                >
                                    {/* Image */}
                                    <img
                                        src={cat.img}
                                        alt={cat.title}
                                        style={{
                                            position: 'absolute', inset: 0,
                                            width: '100%', height: '100%',
                                            objectFit: 'cover',
                                            transformOrigin: 'center',
                                        }}
                                    />

                                    {/* Dark overlays */}
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'linear-gradient(to bottom, rgba(13,11,8,0.25) 0%, rgba(13,11,8,0.72) 100%)',
                                        zIndex: 2,
                                    }} />
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
                                        zIndex: 3,
                                    }} />

                                    <CircularText text={cat.label} />

                                    {/* Card content */}
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                        padding: '1.75rem 1.5rem',
                                        zIndex: 10,
                                    }}>
                                        <h3 style={{
                                            fontFamily: 'var(--font-serif)',
                                            fontSize: 'clamp(1.3rem, 2vw, 1.75rem)',
                                            color: 'var(--color-cream)',
                                            fontWeight: 400,
                                            marginBottom: '0.5rem',
                                        }}>
                                            {cat.title}
                                        </h3>
                                        <p style={{
                                            fontFamily: 'var(--font-elegant)',
                                            fontSize: '0.85rem',
                                            color: 'rgba(245,240,232,0.52)',
                                            fontStyle: 'italic',
                                            marginBottom: '1rem',
                                            lineHeight: 1.5,
                                        }}>
                                            {cat.desc}
                                        </p>
                                        <div style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '0.48rem',
                                            letterSpacing: '0.3em',
                                            textTransform: 'uppercase',
                                            color: 'rgba(201,168,76,0.7)',
                                            display: 'flex', alignItems: 'center', gap: '0.6rem',
                                        }}>
                                            View Menu
                                            <span style={{
                                                display: 'inline-block',
                                                width: '24px', height: '1px',
                                                background: 'rgba(201,168,76,0.5)',
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
