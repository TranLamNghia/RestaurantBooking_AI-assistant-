import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ReservationsSection() {
    const sectionRef = useRef(null)
    const formRef = useRef(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '',
        space: '',
        occasion: '',
        notes: '',
    })
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(formRef.current, {
                opacity: 0,
                y: 60,
                duration: 1.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: formRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 4000)
        setFormData({ name: '', email: '', phone: '', date: '', time: '', guests: '', space: '', occasion: '', notes: '' })
    }

    return (
        <section
            ref={sectionRef}
            id="reservations"
            style={{
                background: 'var(--color-charcoal)',
                padding: 'clamp(5rem, 8vw, 8rem) 0',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background decorative */}
            <div
                style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            <div className="max-w-5xl mx-auto px-6 relative">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 5vw, 5rem)' }}>
                    <div className="section-label mb-4" style={{ justifyContent: 'center' }}>Reservations</div>
                    <h2
                        style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                            color: 'var(--color-cream)',
                            fontWeight: 400,
                            marginBottom: '1rem',
                        }}
                    >
                        Secure Your <em style={{ color: 'var(--color-gold)' }}>Table</em>
                    </h2>
                    <p
                        style={{
                            fontFamily: 'var(--font-elegant)',
                            fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
                            color: 'rgba(245,240,232,0.55)',
                            maxWidth: '450px',
                            margin: '0 auto',
                            lineHeight: 1.8,
                        }}
                    >
                        Reserve directly for the fullest Spice of Life experience, or let our AI Concierge guide you.
                    </p>
                    <div style={{ marginTop: '1.5rem' }}>
                        <a href="/ai-booking" className="btn-gold" style={{ fontSize: '0.6rem' }}>
                            ✦ Try AI Concierge Booking
                        </a>
                    </div>
                </div>

                {/* Form */}
                <div ref={formRef}>
                    {submitted ? (
                        <div
                            style={{
                                textAlign: 'center',
                                padding: '4rem 2rem',
                                border: '1px solid rgba(201,168,76,0.3)',
                            }}
                        >
                            <div style={{ fontSize: '2rem', color: 'var(--color-gold)', marginBottom: '1rem' }}>✦</div>
                            <h3
                                style={{
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: '1.8rem',
                                    color: 'var(--color-cream)',
                                    fontWeight: 400,
                                    marginBottom: '0.75rem',
                                }}
                            >
                                Reservation Received
                            </h3>
                            <p
                                style={{
                                    fontFamily: 'var(--font-elegant)',
                                    color: 'rgba(245,240,232,0.6)',
                                    fontSize: '1rem',
                                    lineHeight: 1.7,
                                }}
                            >
                                Thank you for choosing Spice of Life. Our team will confirm your reservation within 2 hours.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '2rem 3rem',
                                    marginBottom: '2rem',
                                }}
                            >
                                {/* Name */}
                                <div>
                                    <label
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '0.55rem',
                                            letterSpacing: '0.25em',
                                            color: 'rgba(245,240,232,0.4)',
                                            textTransform: 'uppercase',
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '0.55rem',
                                            letterSpacing: '0.25em',
                                            color: 'rgba(245,240,232,0.4)',
                                            textTransform: 'uppercase',
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        className="form-input"
                                        required
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '0.55rem',
                                            letterSpacing: '0.25em',
                                            color: 'rgba(245,240,232,0.4)',
                                            textTransform: 'uppercase',
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+65 XXXX XXXX"
                                        className="form-input"
                                    />
                                </div>

                                {/* Guests */}
                                <div>
                                    <label
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '0.55rem',
                                            letterSpacing: '0.25em',
                                            color: 'rgba(245,240,232,0.4)',
                                            textTransform: 'uppercase',
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        Number of Guests *
                                    </label>
                                    <select name="guests" value={formData.guests} onChange={handleChange} className="form-select" required>
                                        <option value="">Select guests</option>
                                        {['1', '2', '3', '4', '5 – 6', '7 – 10', '11 – 15', '16+'].map(g => (
                                            <option key={g} value={g}>{g} Guest{g !== '1' ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date */}
                                <div>
                                    <label
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '0.55rem',
                                            letterSpacing: '0.25em',
                                            color: 'rgba(245,240,232,0.4)',
                                            textTransform: 'uppercase',
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        Preferred Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>

                                {/* Time */}
                                <div>
                                    <label
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '0.55rem',
                                            letterSpacing: '0.25em',
                                            color: 'rgba(245,240,232,0.4)',
                                            textTransform: 'uppercase',
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        Preferred Time *
                                    </label>
                                    <select name="time" value={formData.time} onChange={handleChange} className="form-select" required>
                                        <option value="">Select time</option>
                                        {['11:30', '12:00', '12:30', '13:00', '13:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Space */}
                                <div>
                                    <label
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '0.55rem',
                                            letterSpacing: '0.25em',
                                            color: 'rgba(245,240,232,0.4)',
                                            textTransform: 'uppercase',
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        Preferred Space
                                    </label>
                                    <select name="space" value={formData.space} onChange={handleChange} className="form-select">
                                        <option value="">No preference</option>
                                        <option value="outdoor">Outdoor View</option>
                                        <option value="main">Main Dining</option>
                                        <option value="group">Group Dining</option>
                                        <option value="vip">Private VIP Room</option>
                                        <option value="event">Event Space</option>
                                        <option value="sofa">Sofa Booth</option>
                                    </select>
                                </div>

                                {/* Occasion */}
                                <div>
                                    <label
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '0.55rem',
                                            letterSpacing: '0.25em',
                                            color: 'rgba(245,240,232,0.4)',
                                            textTransform: 'uppercase',
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        Occasion
                                    </label>
                                    <select name="occasion" value={formData.occasion} onChange={handleChange} className="form-select">
                                        <option value="">Select occasion</option>
                                        <option>Birthday</option>
                                        <option>Anniversary</option>
                                        <option>Business Dinner</option>
                                        <option>Proposal</option>
                                        <option>Family Gathering</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Special requests */}
                            <div style={{ marginBottom: '2.5rem' }}>
                                <label
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '0.55rem',
                                        letterSpacing: '0.25em',
                                        color: 'rgba(245,240,232,0.4)',
                                        textTransform: 'uppercase',
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                    }}
                                >
                                    Special Requests
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Dietary requirements, special setup, or anything we should know..."
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        background: 'transparent',
                                        border: '1px solid rgba(201,168,76,0.2)',
                                        color: 'var(--color-cream)',
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '0.85rem',
                                        padding: '1rem',
                                        outline: 'none',
                                        resize: 'vertical',
                                        transition: 'border-color 0.3s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.2)'}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button type="submit" className="btn-gold" style={{ padding: '1rem 3rem' }}>
                                    Confirm Reservation
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}
