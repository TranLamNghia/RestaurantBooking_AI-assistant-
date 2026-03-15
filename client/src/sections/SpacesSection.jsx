import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigate } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

const spaces = [
    {
        id: 'outdoor',
        name: 'Outdoor View',
        tagline: 'Romantic Sunset Dining',
        desc: 'Breathe in the warm dusk breeze as Singapore\'s skyline fades into amber. Candlelit tables for two, wrapped in nature\'s theatre.',
        capacity: '1 – 4 Guests',
        mood: 'Romantic · Sunset · Alfresco',
        img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=80',
        flip: false,
    },
    {
        id: 'main',
        name: 'Main Dining',
        tagline: 'Modern Heritage Elegance',
        desc: 'Ornate Peranakan tiles meet contemporary furnishings in our signature space — where Singapore\'s storied heritage breathes life into every meal.',
        capacity: '1 – 4 Guests',
        mood: 'Heritage · Contemporary · Grand',
        img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
        flip: true,
    },
    {
        id: 'group',
        name: 'Group Dining',
        tagline: 'Communal Feasting',
        desc: 'Long, convivial tables invite celebration. Share dishes, stories, and laughter around our bespoke communal centrepieces.',
        capacity: '5 – 10 Guests',
        mood: 'Communal · Festive · Social',
        img: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=80',
        flip: false,
    },
    {
        id: 'vip',
        name: 'Private VIP Room',
        tagline: 'Exclusive Refinement',
        desc: 'The pinnacle of privacy. Velvet walls, curated art, and dedicated service — perfect for corporate gatherings or intimate celebrations of distinction.',
        capacity: 'Up to 15 Guests',
        mood: 'Corporate · Private · Luxe',
        img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80',
        flip: true,
    },
    {
        id: 'event',
        name: 'Event Space',
        tagline: 'Grand Celebrations',
        desc: 'From milestone birthdays to lavish product launches — our grand event hall transforms to suit every vision you hold.',
        capacity: 'Grand Parties',
        mood: 'Events · Gala · Birthdays',
        img: 'https://images.unsplash.com/photo-1759477274116-e3cb02d2b9d8?q=80&w=1631',
        flip: false,
    },
    {
        id: 'sofa',
        name: 'Sofa Booth',
        tagline: 'Semi-Private Intimacy',
        desc: 'Plush sofas, low lighting, and velvet curtains create a cocoon of privacy without isolation — ideal for quiet conversations and intimate gatherings.',
        capacity: '2 – 4 Guests',
        mood: 'Intimate · Cosy · Semi-Private',
        img: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=900&q=80',
        flip: true,
    },
]

export default function SpacesSection() {
    const sectionRef = useRef(null)
    const rowRefs = useRef([])
    const navigate = useNavigate()

    const addRowRef = (el) => {
        if (el && !rowRefs.current.includes(el)) rowRefs.current.push(el)
    }

    useEffect(() => {
        const ctx = gsap.context(() => {
            rowRefs.current.forEach((row) => {
                const img = row.querySelector('.space-img')
                const text = row.querySelector('.space-text')
                const title = row.querySelector('.space-title')
                const isFlipped = row.dataset.flip === 'true'

                // Parallax reveal for image
                gsap.from(img, {
                    y: 60,
                    opacity: 0,
                    scale: 0.97,
                    duration: 1.3,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                })

                // Ken Burns continuous zoom
                gsap.to(img.querySelector('img'), {
                    scale: 1.08,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: row,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5,
                    },
                })

                // Text slide from opposite side
                gsap.from(text, {
                    x: isFlipped ? -50 : 50,
                    opacity: 0,
                    duration: 1.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse',
                    },
                })

                // Letter-spacing reveal for title
                gsap.fromTo(title,
                    { letterSpacing: '12px', opacity: 0 },
                    {
                        letterSpacing: '0.05em',
                        opacity: 1,
                        duration: 1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: title,
                            start: 'top 82%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                )
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="spaces"
            style={{
                background: 'var(--color-dark)',
                padding: 'clamp(5rem, 8vw, 8rem) 0',
            }}
        >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 5vw, 5rem)', padding: '0 1.5rem' }}>
                <div className="section-label mb-4" style={{ justifyContent: 'center' }}>Our Spaces</div>
                <h2
                    style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                        color: 'var(--color-cream)',
                        fontWeight: 400,
                    }}
                >
                    Six Worlds, <em style={{ color: 'var(--color-gold)' }}>One Destination</em>
                </h2>
                <p
                    style={{
                        fontFamily: 'var(--font-elegant)',
                        fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
                        color: 'rgba(245,240,232,0.55)',
                        maxWidth: '500px',
                        margin: '1rem auto 0',
                        lineHeight: 1.8,
                    }}
                >
                    Every corner of Spice of Life is an atmosphere crafted for connection.
                </p>
            </div>

            {/* Alternating rows — fixed equal height for all */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {spaces.map((space, i) => (
                    <div
                        key={space.id}
                        ref={addRowRef}
                        data-flip={space.flip}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            height: 'clamp(380px, 42vw, 520px)', /* fixed height — no expand */
                        }}
                        className="space-card"
                    >
                        {/* Image block */}
                        <div
                            className="space-img"
                            style={{
                                order: space.flip ? 2 : 1,
                                overflow: 'hidden',
                                position: 'relative',
                                height: '100%',
                            }}
                        >
                            <img
                                src={space.img}
                                alt={space.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    filter: 'brightness(0.8) saturate(0.9)',
                                }}
                            />
                            {/* Capacity badge */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '1.5rem',
                                    left: '1.5rem',
                                    background: 'rgba(13,11,8,0.75)',
                                    border: '1px solid rgba(201,168,76,0.3)',
                                    padding: '0.5rem 0.875rem',
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '0.55rem',
                                        letterSpacing: '0.2em',
                                        color: 'var(--color-gold)',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {space.capacity}
                                </span>
                            </div>
                        </div>

                        {/* Text block — overflow hidden so it never pushes height */}
                        <div
                            className="space-text"
                            style={{
                                order: space.flip ? 1 : 2,
                                background: space.flip ? 'var(--color-charcoal)' : 'var(--color-mocha)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                padding: 'clamp(1.75rem, 4vw, 4rem)',
                                position: 'relative',
                                overflow: 'hidden',
                                height: '100%',
                            }}
                        >
                            {/* Background number */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '-0.5rem',
                                    right: '1rem',
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: 'clamp(5rem, 10vw, 9rem)',
                                    color: 'rgba(201,168,76,0.04)',
                                    lineHeight: 1,
                                    userSelect: 'none',
                                    fontStyle: 'italic',
                                    pointerEvents: 'none',
                                }}
                            >
                                {String(i + 1).padStart(2, '0')}
                            </div>

                            <div className="section-label mb-3" style={{ justifyContent: 'flex-start' }}>
                                {space.mood}
                            </div>

                            <h3
                                className="space-title"
                                style={{
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: 'clamp(1.5rem, 2.5vw, 2.4rem)',
                                    color: 'var(--color-cream)',
                                    fontWeight: 400,
                                    marginBottom: '0.4rem',
                                    lineHeight: 1.1,
                                }}
                            >
                                {space.name}
                            </h3>

                            <p
                                style={{
                                    fontFamily: 'var(--font-elegant)',
                                    fontSize: '0.8rem',
                                    letterSpacing: '0.08em',
                                    color: 'var(--color-gold)',
                                    textTransform: 'uppercase',
                                    marginBottom: '1rem',
                                    fontStyle: 'italic',
                                }}
                            >
                                {space.tagline}
                            </p>

                            <p
                                style={{
                                    fontFamily: 'var(--font-elegant)',
                                    fontSize: 'clamp(0.875rem, 1.1vw, 0.95rem)',
                                    lineHeight: 1.8,
                                    color: 'rgba(245,240,232,0.65)',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                {space.desc}
                            </p>

                            <button
                                className="btn-outline-gold"
                                style={{ alignSelf: 'flex-start', padding: '0.65rem 1.25rem', fontSize: '0.58rem' }}
                                onClick={() => navigate(`/ai-booking?space=${space.id}`)}
                            >
                                Enquire This Space
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
