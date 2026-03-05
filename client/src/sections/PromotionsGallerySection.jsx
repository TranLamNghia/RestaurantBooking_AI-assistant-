import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const promos = [
    {
        title: 'Chef\'s Tasting Journey',
        subtitle: 'Omakase Experience',
        desc: 'An 8-course exploration of the spice routes, with wine pairings selected by our sommelier.',
        price: 'From $188 / pax',
        tag: 'Limited Seating',
        icon: '✦',
    },
    {
        title: 'Sunday Brunch Ritual',
        subtitle: 'Weekly Indulgence',
        desc: 'Welcome the week\'s end with bottomless champagne, live music, and our celebrated brunch spread.',
        price: 'From $88 / pax',
        tag: 'Every Sunday',
        icon: '◆',
    },
    {
        title: 'Private Dining Package',
        subtitle: 'Exclusive Occasions',
        desc: 'Bespoke menus, floral arrangements, and dedicated concierge service for your most special gatherings.',
        price: 'From $1,200 / event',
        tag: 'Enquire Now',
        icon: '✧',
    },
]

const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', alt: 'Fine dining atmosphere', tall: true },
    { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', alt: 'Signature dish', tall: false },
    { src: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=600&q=80', alt: 'Aromatic spices', tall: false },
    { src: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&q=80', alt: 'Group dining table', tall: true },
    { src: 'https://images.unsplash.com/photo-1470338745628-171cf53de3a8?w=600&q=80', alt: 'Artisanal cocktails', tall: false },
    { src: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&q=80', alt: 'Sofa booth', tall: false },
    { src: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80', alt: 'Lunch spread', tall: true },
    { src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&q=80', alt: 'Festive celebration', tall: false },
    { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', alt: 'VIP dining room', tall: false },
]

export default function PromotionsGallerySection() {
    const sectionRef = useRef(null)
    const promoRef = useRef(null)
    const galleryRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Promo cards stagger
            gsap.from(promoRef.current?.children, {
                opacity: 0,
                y: 50,
                stagger: 0.18,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: promoRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            })

            // Gallery items stagger
            gsap.from(galleryRef.current?.querySelectorAll('.masonry-item'), {
                opacity: 0,
                y: 40,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: galleryRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <>
            {/* ===== PROMOTIONS SECTION ===== */}
            <section
                ref={sectionRef}
                id="promotions"
                style={{
                    scrollMarginTop: '80px',
                    background: '#0D0B08',
                    padding: 'clamp(5rem, 8vw, 8rem) 0',
                    minHeight: '100vh',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 4vw, 4rem)' }}>
                        <div className="section-label mb-4" style={{ justifyContent: 'center' }}>Promotions</div>
                        <h2
                            style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                                color: 'var(--color-cream)',
                                fontWeight: 400,
                            }}
                        >
                            Curated <em style={{ color: 'var(--color-gold)' }}>Experiences</em>
                        </h2>
                    </div>

                    <div ref={promoRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {promos.map((promo, i) => (
                            <div key={i} className="promo-card" style={{ padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
                                {/* Decorative corner */}
                                <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px' }}>
                                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', borderTop: '1px solid rgba(201,168,76,0.3)', borderRight: '1px solid rgba(201,168,76,0.3)', width: '2rem', height: '2rem' }} />
                                </div>

                                {/* Tag */}
                                <div
                                    style={{
                                        display: 'inline-block',
                                        background: 'rgba(201,168,76,0.1)',
                                        border: '1px solid rgba(201,168,76,0.3)',
                                        padding: '0.3rem 0.875rem',
                                        marginBottom: '1.5rem',
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '0.55rem',
                                        letterSpacing: '0.2em',
                                        color: 'var(--color-gold)',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {promo.tag}
                                </div>

                                <div style={{ fontSize: '1.5rem', color: 'var(--color-gold)', marginBottom: '1rem', opacity: 0.6 }}>
                                    {promo.icon}
                                </div>

                                <h3
                                    style={{
                                        fontFamily: 'var(--font-serif)',
                                        fontSize: '1.4rem',
                                        color: 'var(--color-cream)',
                                        fontWeight: 400,
                                        marginBottom: '0.5rem',
                                    }}
                                >
                                    {promo.title}
                                </h3>

                                <p
                                    style={{
                                        fontFamily: 'var(--font-elegant)',
                                        fontSize: '0.8rem',
                                        color: 'var(--color-gold)',
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        marginBottom: '1.25rem',
                                        fontStyle: 'italic',
                                    }}
                                >
                                    {promo.subtitle}
                                </p>

                                <p
                                    style={{
                                        fontFamily: 'var(--font-elegant)',
                                        fontSize: '0.95rem',
                                        color: 'rgba(245,240,232,0.6)',
                                        lineHeight: 1.8,
                                        marginBottom: '2rem',
                                    }}
                                >
                                    {promo.desc}
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div
                                        style={{
                                            fontFamily: 'var(--font-elegant)',
                                            fontSize: '1.2rem',
                                            color: 'var(--color-gold-light)',
                                            fontStyle: 'italic',
                                        }}
                                    >
                                        {promo.price}
                                    </div>
                                    <button
                                        className="btn-outline-gold"
                                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.55rem' }}
                                        onClick={() => window.location.href = '/reservations'}
                                    >
                                        Book
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== GALLERY SECTION ===== */}
            <section
                id="gallery-photos"
                style={{
                    scrollMarginTop: '80px',
                    background: 'linear-gradient(135deg, #1a140c 0%, #0d0b08 50%, #1c1508 100%)',
                    padding: 'clamp(5rem, 8vw, 8rem) 0',
                    position: 'relative',
                    overflow: 'hidden',
                    borderTop: '1px solid rgba(201,168,76,0.15)',
                }}
            >
                {/* Dot-grid texture */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.04) 1px, transparent 0)',
                    backgroundSize: '36px 36px',
                    pointerEvents: 'none',
                }} />
                {/* Gold radial glow top */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 4vw, 4rem)' }}>
                        <div className="section-label mb-4" style={{ justifyContent: 'center' }}>Gallery</div>
                        <h2
                            style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                                color: 'var(--color-cream)',
                                fontWeight: 400,
                            }}
                        >
                            Through the <em style={{ color: 'var(--color-gold)' }}>Lens</em>
                        </h2>
                    </div>

                    <div className="masonry-grid" ref={galleryRef}>
                        {galleryImages.map((img, i) => (
                            <div key={i} className="masonry-item" style={{ marginBottom: '0.75rem' }}>
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    style={{
                                        height: img.tall ? '420px' : '260px',
                                        objectFit: 'cover',
                                        width: '100%',
                                        display: 'block',
                                        filter: 'brightness(0.85) saturate(0.9)',
                                    }}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

