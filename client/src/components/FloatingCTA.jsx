import { Link } from 'react-router-dom'

export default function FloatingCTA() {
    return (
        <div className="floating-cta">
            <Link
                to="/reservations"
                className="btn-gold"
                style={{
                    writingMode: 'vertical-lr',
                    transform: 'rotate(180deg)',
                    padding: '1.25rem 0.75rem',
                    fontSize: '0.55rem',
                    letterSpacing: '0.3em',
                    boxShadow: '0 4px 30px rgba(201, 168, 76, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                }}
            >
                ✦ Reserve Now ✦
            </Link>
        </div>
    )
}
