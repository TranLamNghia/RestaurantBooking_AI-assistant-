import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const leftNav = [
    { label: 'Story', href: '#concept' },
    { label: 'Menu', href: '#menu' },
    { label: 'Spaces', href: '#spaces' },
]

const rightNav = [
    { label: 'Promotions', href: '#promotions' },
    { label: 'Gallery', href: '#gallery-photos' },
]

const allNav = [...leftNav, ...rightNav]

function NavLink({ item, onClick }) {
    if (item.href.startsWith('#')) {
        return (
            <a href={item.href} className="nav-link" onClick={(e) => onClick(e, item.href)}>
                {item.label}
            </a>
        )
    }
    return (
        <Link to={item.href} className="nav-link" onClick={() => onClick(null, item.href)}>
            {item.label}
        </Link>
    )
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()

    const goHome = (hash) => {
        setMenuOpen(false)
        navigate('/')
        setTimeout(() => {
            if (hash) {
                const el = document.querySelector(hash)
                if (el) el.scrollIntoView({ behavior: 'smooth' })
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        }, 80)
    }

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleNavClick = (e, href) => {
        if (href && href.startsWith('#')) {
            if (e) e.preventDefault()
            // Always navigate home first so the section exists, then scroll
            goHome(href)
        }
        setMenuOpen(false)
    }

    return (
        <>
            {/* ===== MAIN NAVBAR ===== */}
            <header
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    padding: scrolled ? '0.75rem 0' : '1.5rem 0',
                    background: scrolled ? 'rgba(13,11,8,0.92)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : 'none',
                    transition: 'all 0.5s ease',
                }}
            >
                {/* 3-column flex: [left nav] [center logo] [right nav] */}
                <div
                    style={{
                        maxWidth: '1280px',
                        margin: '0 auto',
                        padding: '0 2rem',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {/* LEFT NAV — flex: 1 keeps it balanced */}
                    <nav
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2rem',
                        }}
                    >
                        {leftNav.map((item) => (
                            <span key={item.label} className="hidden-mobile">
                                <NavLink item={item} onClick={handleNavClick} />
                            </span>
                        ))}
                    </nav>

                    {/* CENTER LOGO — fixed width so it's always truly centered */}
                    <div
                        onClick={() => goHome(null)}
                        style={{
                            flex: '0 0 auto',
                            textAlign: 'center',
                            textDecoration: 'none',
                            minWidth: '160px',
                            cursor: 'pointer',
                        }}
                    >
                        <div
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(0.75rem, 1.2vw, 1rem)',
                                letterSpacing: '0.3em',
                                color: 'var(--color-gold)',
                                textTransform: 'uppercase',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Spice of Life
                        </div>
                        <div
                            style={{
                                fontFamily: 'var(--font-elegant)',
                                fontSize: '0.55rem',
                                letterSpacing: '0.2em',
                                color: 'rgba(245,240,232,0.45)',
                                textTransform: 'uppercase',
                                marginTop: '2px',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Fine Dining · Est. 2019
                        </div>
                    </div>

                    {/* RIGHT NAV — flex: 1 + justify-content: flex-end */}
                    <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: '2rem',
                        }}
                    >
                        <nav
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2rem',
                            }}
                            className="hidden-mobile"
                        >
                            {rightNav.map((item) => (
                                <NavLink key={item.label} item={item} onClick={handleNavClick} />
                            ))}
                        </nav>

                        {/* Hamburger */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '6px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px',
                                position: 'relative',
                                zIndex: 1001,
                            }}
                        >
                            <span
                                style={{
                                    display: 'block',
                                    width: '24px',
                                    height: '1px',
                                    background: 'var(--color-cream)',
                                    transition: 'all 0.3s',
                                    transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
                                }}
                            />
                            <span
                                style={{
                                    display: 'block',
                                    width: '24px',
                                    height: '1px',
                                    background: 'var(--color-cream)',
                                    transition: 'all 0.3s',
                                    opacity: menuOpen ? 0 : 1,
                                }}
                            />
                            <span
                                style={{
                                    display: 'block',
                                    width: '24px',
                                    height: '1px',
                                    background: 'var(--color-cream)',
                                    transition: 'all 0.3s',
                                    transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
                                }}
                            />
                        </button>
                    </div>
                </div>

                {/* Mobile helper: hide nav links on small screens */}
                <style>{`
          @media (max-width: 900px) {
            .hidden-mobile { display: none !important; }
          }
        `}</style>
            </header>

            {/* ===== MOBILE MENU OVERLAY ===== */}
            <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`}>
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `radial-gradient(circle at 50% 50%, var(--color-gold), transparent 70%)`,
                        opacity: 0.04,
                    }}
                />

                {/* Close button — top right */}
                <button
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        background: 'none',
                        border: '1px solid rgba(201,168,76,0.3)',
                        color: 'var(--color-gold)',
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 20,
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.12)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                >
                    ✕
                </button>

                <div
                    style={{
                        position: 'relative',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <div
                        className="section-label"
                        style={{ color: 'var(--color-gold)', justifyContent: 'center', marginBottom: '2rem' }}
                    >
                        Navigation
                    </div>

                    {/* Home — always first */}
                    <button
                        onClick={() => goHome(null)}
                        className="nav-link"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        Home
                    </button>

                    {/* Story, Menu, Spaces, Gallery — section links that always go home first */}
                    {allNav.map((item) => (
                        <NavLink key={item.label} item={item} onClick={handleNavClick} />
                    ))}

                    {/* Reserve button — always to /reservations */}
                    <div style={{ marginTop: '2rem' }}>
                        <Link
                            to="/reservations"
                            className="btn-gold"
                            onClick={() => setMenuOpen(false)}
                        >
                            Reserve a Table
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
