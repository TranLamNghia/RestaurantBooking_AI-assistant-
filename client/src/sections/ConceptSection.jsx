import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Hand-drawn SVG spice sketches inline
const StarAniseSVG = () => (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <circle cx="100" cy="100" r="12" stroke="#c9a84c" strokeWidth="1.5" fill="none" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180
            const x1 = 100 + 12 * Math.cos(rad)
            const y1 = 100 + 12 * Math.sin(rad)
            const x2 = 100 + 65 * Math.cos(rad)
            const y2 = 100 + 65 * Math.sin(rad)
            const cpx = 100 + 38 * Math.cos(rad + 0.3)
            const cpy = 100 + 38 * Math.sin(rad + 0.3)
            return (
                <g key={i}>
                    <path d={`M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`} stroke="#c9a84c" strokeWidth="1" fill="none" opacity="0.7" />
                    <ellipse cx={x2} cy={y2} rx="10" ry="6" transform={`rotate(${angle}, ${x2}, ${y2})`} stroke="#c9a84c" strokeWidth="0.8" fill="none" opacity="0.6" />
                </g>
            )
        })}
    </svg>
)

const CinnamonSVG = () => (
    <svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <path
                key={i}
                d={`M ${15 + i * 2} ${10 + i * 26} Q ${38 - i * 3} ${10 + i * 26 + 13} ${15 + i * 2} ${10 + i * 26 + 26}`}
                stroke="#c9a84c"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                opacity={0.6 - i * 0.05}
            />
        ))}
    </svg>
)

export default function ConceptSection() {
    const sectionRef = useRef(null)
    const textRefs = useRef([])
    const imageRef = useRef(null)
    const sketch1Ref = useRef(null)
    const sketch2Ref = useRef(null)

    const addToRefs = (el) => {
        if (el && !textRefs.current.includes(el)) textRefs.current.push(el)
    }

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Slide-up fade-in for text elements
            textRefs.current.forEach((el, i) => {
                gsap.from(el, {
                    opacity: 0,
                    y: 50,
                    duration: 1,
                    delay: i * 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                })
            })

            // Image reveal
            if (imageRef.current) {
                gsap.from(imageRef.current, {
                    opacity: 0,
                    y: 60,
                    scale: 0.95,
                    duration: 1.4,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: imageRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                })
            }

            // Sketch animations
            if (sketch1Ref.current) {
                gsap.from(sketch1Ref.current, {
                    opacity: 0,
                    rotation: -15,
                    scale: 0.8,
                    duration: 2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                    },
                })
            }
            if (sketch2Ref.current) {
                gsap.from(sketch2Ref.current, {
                    opacity: 0,
                    rotation: 10,
                    scale: 0.8,
                    duration: 2,
                    delay: 0.3,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                    },
                })
            }
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="concept"
            style={{
                position: 'relative',
                padding: 'clamp(5rem, 10vw, 10rem) 0',
                background: 'var(--color-dark)',
                overflow: 'hidden',
            }}
        >
            {/* Hand-drawn sketches background */}
            <div
                ref={sketch1Ref}
                className="spice-sketch"
                style={{
                    position: 'absolute',
                    top: '5%',
                    right: '-2%',
                    width: 'clamp(150px, 20vw, 280px)',
                    opacity: 0.07,
                    transform: 'rotate(15deg)',
                }}
            >
                <StarAniseSVG />
            </div>
            <div
                ref={sketch2Ref}
                className="spice-sketch"
                style={{
                    position: 'absolute',
                    bottom: '5%',
                    left: '-1%',
                    width: 'clamp(100px, 12vw, 180px)',
                    opacity: 0.06,
                    transform: 'rotate(-10deg)',
                }}
            >
                <CinnamonSVG />
            </div>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
                {/* Asymmetric grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                        gridTemplateRows: 'auto',
                        gap: '2rem',
                        alignItems: 'center',
                    }}
                >
                    {/* Left text block – cols 1-5 */}
                    <div
                        style={{
                            gridColumn: '1 / 6',
                            gridRow: '1',
                        }}
                    >
                        <div ref={addToRefs} className="section-label mb-6" style={{ justifyContent: 'flex-start' }}>
                            Our Philosophy
                        </div>
                        <h2
                            ref={addToRefs}
                            style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                                lineHeight: 1.15,
                                color: 'var(--color-cream)',
                                fontWeight: 400,
                                marginBottom: '1.5rem',
                            }}
                        >
                            A Story Told<br />
                            <em style={{ color: 'var(--color-gold)' }}>Through Spice</em>
                        </h2>
                        <p
                            ref={addToRefs}
                            style={{
                                fontFamily: 'var(--font-elegant)',
                                fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
                                lineHeight: 1.9,
                                color: 'rgba(245,240,232,0.65)',
                                marginBottom: '1.5rem',
                            }}
                        >
                            Born from the ancient spice routes that once passed through the streets of Singapore,
                            Spice of Life is a culinary tribute to the bold, aromatic flavours that shaped civilisations.
                            We honour time-honoured recipes, reimagined for the modern palate.
                        </p>
                        <p
                            ref={addToRefs}
                            style={{
                                fontFamily: 'var(--font-elegant)',
                                fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
                                lineHeight: 1.9,
                                color: 'rgba(245,240,232,0.5)',
                                marginBottom: '2.5rem',
                            }}
                        >
                            Every dish is a dialogue between past and present — the warmth of cinnamon,
                            the mystery of star anise, the vibrancy of turmeric — woven into contemporary gastronomic art.
                        </p>
                        <a ref={addToRefs} href="#spaces" className="btn-outline-gold" onClick={(e) => { e.preventDefault(); document.getElementById('spaces')?.scrollIntoView({ behavior: 'smooth' }) }}>
                            Explore Our Spaces
                        </a>
                    </div>

                    {/* Center image – cols 6-9 */}
                    <div
                        ref={imageRef}
                        style={{
                            gridColumn: '6 / 10',
                            gridRow: '1',
                            position: 'relative',
                            height: 'clamp(400px, 50vw, 620px)',
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=800&q=80"
                            alt="Aromatic spices"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'brightness(0.85) contrast(1.05)',
                            }}
                        />
                        {/* Gold frame */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                left: '1rem',
                                right: '-1rem',
                                bottom: '-1rem',
                                border: '1px solid rgba(201,168,76,0.3)',
                                zIndex: -1,
                            }}
                        />
                    </div>

                    {/* Right stats – cols 10-12 */}
                    <div
                        style={{
                            gridColumn: '10 / 13',
                            gridRow: '1',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2.5rem',
                        }}
                    >
                        {[
                            { num: '80+', label: 'Curated Dishes' },
                            { num: '6', label: 'Dining Spaces' },
                            { num: '15+', label: 'Spice Origins' },
                            { num: '2019', label: 'Est. on Circular Rd' },
                        ].map(({ num, label }, i) => (
                            <div key={i} ref={addToRefs}>
                                <div
                                    style={{
                                        fontFamily: 'var(--font-elegant)',
                                        fontSize: 'clamp(2rem, 3vw, 3rem)',
                                        color: 'var(--color-gold)',
                                        lineHeight: 1,
                                        marginBottom: '0.25rem',
                                        fontStyle: 'italic',
                                    }}
                                >
                                    {num}
                                </div>
                                <div
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '0.6rem',
                                        letterSpacing: '0.2em',
                                        color: 'rgba(245,240,232,0.5)',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {label}
                                </div>
                                <div className="gold-divider" style={{ marginTop: '0.75rem', opacity: 0.2 }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
