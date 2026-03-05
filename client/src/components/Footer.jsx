import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer style={{ background: 'var(--color-charcoal)', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
            {/* Top section */}
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
                {/* Brand */}
                <div className="md:col-span-1">
                    <div
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.1rem',
                            letterSpacing: '0.3em',
                            color: 'var(--color-gold)',
                            textTransform: 'uppercase',
                            marginBottom: '0.5rem',
                        }}
                    >
                        Spice of Life
                    </div>
                    <div
                        style={{
                            fontFamily: 'var(--font-elegant)',
                            fontSize: '0.8rem',
                            color: 'rgba(245,240,232,0.5)',
                            marginBottom: '1.5rem',
                            letterSpacing: '0.05em',
                        }}
                    >
                        Where Past Meets Present
                    </div>
                    <div className="ornament-line" style={{ margin: '0 0 1.5rem 0', width: '40px' }} />
                    <p style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.5)', lineHeight: '1.7', letterSpacing: '0.02em' }}>
                        A culinary journey through the aromatic spice routes, served at the heart of Singapore's historic district.
                    </p>
                </div>

                {/* Contact */}
                <div>
                    <div className="section-label mb-6" style={{ justifyContent: 'flex-start' }}>Contact</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li>
                            <a
                                href="tel:+6582230925"
                                style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.7)', textDecoration: 'none', transition: 'color 0.3s' }}
                                onMouseEnter={e => e.target.style.color = 'var(--color-gold)'}
                                onMouseLeave={e => e.target.style.color = 'rgba(245,240,232,0.7)'}
                            >
                                <span style={{ color: 'var(--color-gold)', fontSize: '0.7rem', letterSpacing: '0.1em', display: 'block', marginBottom: '2px', fontFamily: 'var(--font-display)' }}>PHONE</span>
                                +65 8223 0925
                            </a>
                        </li>
                        <li>
                            <p style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.7)' }}>
                                <span style={{ color: 'var(--color-gold)', fontSize: '0.7rem', letterSpacing: '0.1em', display: 'block', marginBottom: '2px', fontFamily: 'var(--font-display)' }}>LOCATION</span>
                                51 Circular Road<br />Singapore 049422
                            </p>
                        </li>
                        <li>
                            <a
                                href="mailto:hello@spiceoflife.sg"
                                style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.7)', textDecoration: 'none', transition: 'color 0.3s' }}
                                onMouseEnter={e => e.target.style.color = 'var(--color-gold)'}
                                onMouseLeave={e => e.target.style.color = 'rgba(245,240,232,0.7)'}
                            >
                                <span style={{ color: 'var(--color-gold)', fontSize: '0.7rem', letterSpacing: '0.1em', display: 'block', marginBottom: '2px', fontFamily: 'var(--font-display)' }}>EMAIL</span>
                                hello@spiceoflife.sg
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Hours */}
                <div>
                    <div className="section-label mb-6" style={{ justifyContent: 'flex-start' }}>Hours</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { day: 'Monday – Thursday', time: '11:30 – 22:30' },
                            { day: 'Friday – Saturday', time: '11:30 – 23:30' },
                            { day: 'Sunday', time: '12:00 – 22:00' },
                        ].map(({ day, time }) => (
                            <li key={day} style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.7)' }}>
                                <span style={{ display: 'block', color: 'rgba(245,240,232,0.45)', fontSize: '0.7rem', letterSpacing: '0.05em' }}>{day}</span>
                                {time}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <div className="section-label mb-6" style={{ justifyContent: 'flex-start' }}>Newsletter</div>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.55)', lineHeight: '1.7', marginBottom: '1.25rem' }}>
                        Receive exclusive invitations, seasonal menus, and curated experiences.
                    </p>
                    <form
                        onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!') }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                    >
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="form-input"
                            style={{ fontSize: '0.8rem' }}
                            required
                        />
                        <button type="submit" className="btn-gold" style={{ padding: '0.75rem 1.5rem', fontSize: '0.6rem', alignSelf: 'flex-start' }}>
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Map section */}
            <div style={{ height: '280px', width: '100%', overflow: 'hidden' }}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8194!2d103.8480!3d1.2866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19b0a5c5e64d%3A0x0!2s51+Circular+Rd%2C+Singapore+049422!5e0!3m2!1sen!2ssg!4v1700000000000!5m2!1sen!2ssg"
                    width="100%"
                    height="280"
                    style={{ border: 0, filter: 'grayscale(1) invert(1) sepia(0.3) brightness(0.8) contrast(0.9)' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Spice of Life Location"
                />
            </div>

            {/* Bottom bar */}
            <div
                style={{
                    borderTop: '1px solid rgba(201,168,76,0.1)',
                    padding: '1.5rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    maxWidth: '80rem',
                    margin: '0 auto',
                }}
            >
                <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.35)', letterSpacing: '0.05em' }}>
                    © {new Date().getFullYear()} Spice of Life. All rights reserved.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    {['Privacy Policy', 'Terms & Conditions', 'Careers'].map((item) => (
                        <a
                            key={item}
                            href="#"
                            style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.35)', textDecoration: 'none', letterSpacing: '0.05em', transition: 'color 0.3s' }}
                            onMouseEnter={e => e.target.style.color = 'var(--color-gold)'}
                            onMouseLeave={e => e.target.style.color = 'rgba(245,240,232,0.35)'}
                        >
                            {item}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}
