import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// ─── Simulated AI response logic ─────────────────────────────────────────────
const FLOW = [
    {
        trigger: 'welcome',
        response: `Good evening. I'm your personal AI Concierge at Spice of Life. ✦\n\nI can help you reserve a table, curate a tasting menu, or recommend the perfect wine pairing. How may I assist you tonight?`,
        suggestions: ['Reserve a table', 'View tonight\'s menu', 'Wine pairing'],
    },
    {
        trigger: 'reserve',
        response: `Wonderful. I'll arrange that for you.\n\nMay I know your preferred date and time, and the number of guests?`,
        suggestions: ['This Friday, 7 PM · 2 guests', 'Saturday, 8 PM · 4 guests', 'Choose another date'],
    },
    {
        trigger: 'friday|saturday|date|guest|pm',
        response: `Excellent choice. We have a beautiful window table available — candlelit, overlooking the river.\n\nShall I also arrange a curated welcome amuse-bouche from Chef Arjun?`,
        suggestions: ['Yes, please', 'Skip the amuse-bouche', 'Tell me more about Chef Arjun'],
    },
    {
        trigger: 'yes|please|amuse|chef',
        response: `Splendid. Your reservation is being curated.\n\nI'll send a confirmation to your inbox shortly. Is there anything else — perhaps a wine pairing or a special occasion arrangement?`,
        suggestions: ['Wine pairing, please', 'It\'s our anniversary', 'That\'s all, thank you'],
    },
    {
        trigger: 'wine|pairing|sommelier',
        response: `Our sommelier recommends the 2018 Château Margaux as a luxurious complement to tonight's spice-aged duck, or the crisp Pouilly-Fumé for the seafood tasting flight.\n\nWould you like the full wine flight added to your reservation?`,
        suggestions: ['Yes, add the wine flight', 'Just the Margaux', 'Decide at dinner'],
    },
    {
        trigger: 'menu|tonight|cuisine',
        response: `Tonight's highlights from Chef Arjun's seasonal menu:\n\n✦ Laksa-Spiced Lobster Bisque\n✦ Kueh Pie Tee with Heritage Crab\n✦ Slow-Braised Wagyu with Sichuan Honey\n✦ Pandan Soufflé with Coconut Sorbet\n\nWould you like to pre-select a tasting course?`,
        suggestions: ['Reserve with this menu', 'Dietary requirements', 'Tell me more'],
    },
    {
        trigger: 'anniversary|birthday|special|occasion',
        response: `How romantic. 🌹 I'll arrange a private arrangement — a personalised dessert inscription and a complimentary glass of vintage Champagne upon arrival.\n\nYour evening will be one to remember.`,
        suggestions: ['Perfect, thank you', 'What else can I arrange?', 'Close'],
    },
    {
        trigger: 'thank|close|that',
        response: `It has been my pleasure. We look forward to welcoming you to Spice of Life.\n\nUntil then — have a wonderful evening. ✦`,
        suggestions: ['Close chat'],
    },
]

function getResponse(userInput) {
    const lower = userInput.toLowerCase()
    const match = FLOW.find(f => {
        const triggers = f.trigger.split('|')
        return triggers.some(t => lower.includes(t))
    })
    return match || {
        response: `I understand. Allow me a moment to prepare the finest arrangement for you.\n\nIs there anything specific about your dining experience I should know — dietary requirements, preferred seating, or a special occasion?`,
        suggestions: ['Reserve a table', 'View the menu', 'Wine pairing'],
    }
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AIConcierge() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [inputVal, setInputVal] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [hasGreeted, setHasGreeted] = useState(false)
    const panelRef = useRef(null)
    const btnRef = useRef(null)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    // Open/close panel animation
    useEffect(() => {
        if (!panelRef.current) return
        if (isOpen) {
            gsap.fromTo(
                panelRef.current,
                { opacity: 0, y: 24, scale: 0.96 },
                { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power4.out' }
            )
            setTimeout(() => inputRef.current?.focus(), 500)
        } else {
            gsap.to(panelRef.current, {
                opacity: 0,
                y: 16,
                scale: 0.98,
                duration: 0.3,
                ease: 'power4.in',
            })
        }
    }, [isOpen])

    const handleToggleOpen = () => {
        setIsOpen(o => {
            const willOpen = !o
            if (willOpen && !hasGreeted) {
                setHasGreeted(true)
                setTimeout(() => {
                    const welcome = FLOW[0]
                    setIsTyping(true)
                    setTimeout(() => {
                        setIsTyping(false)
                        setMessages([{
                            role: 'ai',
                            text: welcome.response,
                            suggestions: welcome.suggestions,
                        }])
                    }, 1100)
                }, 300)
            }
            return willOpen
        })
    }

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const sendMessage = (text) => {
        if (!text.trim()) return
        const userMsg = { role: 'user', text: text.trim() }
        setMessages(prev => [...prev, userMsg])
        setInputVal('')
        setIsTyping(true)

        const aiReply = getResponse(text)
        const delay = 1200 // Fixed delay, previously used Math.random() which violates react-hooks/purity

        setTimeout(() => {
            setIsTyping(false)
            setMessages(prev => [...prev, {
                role: 'ai',
                text: aiReply.response,
                suggestions: aiReply.suggestions,
            }])
        }, delay)
    }

    const handleSuggestion = (s) => {
        if (s === 'Close chat' || s === 'Close') {
            setIsOpen(false)
            return
        }
        sendMessage(s)
    }

    return (
        <>
            {/* ══════════════════════════════════════════════════════════════════
            FLOATING BUTTON — fixed bottom-left, pulsing gold glow
            ══════════════════════════════════════════════════════════════════ */}
            <button
                ref={btnRef}
                onClick={handleToggleOpen}
                aria-label="Open AI Concierge"
                id="ai-concierge-btn"
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    left: '2rem',
                    zIndex: 1001,
                    width: '58px',
                    height: '58px',
                    borderRadius: '50%',
                    border: '1px solid rgba(201,168,76,0.6)',
                    background: 'linear-gradient(135deg, #1a1410 0%, #2c1f0e 100%)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                    animation: isOpen ? 'none' : 'aiGlow 2.8s ease-in-out infinite',
                    transition: 'transform 0.3s ease, background 0.3s ease',
                    transform: isOpen ? 'rotate(45deg) scale(1.05)' : 'rotate(0deg) scale(1)',
                    boxShadow: isOpen
                        ? '0 0 0 0 transparent'
                        : '0 4px 24px rgba(201,168,76,0.22)',
                }}
            >
                {isOpen ? (
                    <span style={{ color: 'rgba(201,168,76,0.9)', fontSize: '1.4rem', lineHeight: 1 }}>✕</span>
                ) : (
                    <>
                        <span style={{ color: 'var(--color-gold)', fontSize: '1rem', lineHeight: 1 }}>✦</span>
                        <span
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.38rem',
                                letterSpacing: '0.15em',
                                color: 'rgba(201,168,76,0.75)',
                                textTransform: 'uppercase',
                                lineHeight: 1,
                            }}
                        >
                            AI
                        </span>
                    </>
                )}
            </button>

            {/* ══════════════════════════════════════════════════════════════════
            CHAT PANEL — luxury slide-in, bottom-left
            ══════════════════════════════════════════════════════════════════ */}
            {isOpen && (
                <div
                    ref={panelRef}
                    data-lenis-prevent                       // stops Lenis from hijacking scroll inside chat
                    style={{
                        position: 'fixed',
                        bottom: '6.5rem',
                        left: '2rem',
                        zIndex: 1000,
                        width: 'clamp(300px, 88vw, 360px)',
                        maxHeight: '520px',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'rgba(18, 14, 10, 0.95)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(201,168,76,0.22)',
                        boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.06) inset',
                        borderRadius: '2px',
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            padding: '1rem 1.25rem 0.85rem',
                            borderBottom: '1px solid rgba(201,168,76,0.15)',
                            background: 'rgba(201,168,76,0.04)',
                            flexShrink: 0,
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div
                                style={{
                                    width: '7px',
                                    height: '7px',
                                    borderRadius: '50%',
                                    background: 'var(--color-gold)',
                                    animation: 'aiGlowDot 2s ease-in-out infinite',
                                    flexShrink: 0,
                                }}
                            />
                            <div>
                                <div
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '0.62rem',
                                        letterSpacing: '0.25em',
                                        color: 'var(--color-gold)',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    AI Concierge
                                </div>
                                <div
                                    style={{
                                        fontFamily: 'var(--font-elegant)',
                                        fontSize: '0.72rem',
                                        color: 'rgba(245,240,232,0.45)',
                                        fontStyle: 'italic',
                                        marginTop: '1px',
                                    }}
                                >
                                    Spice of Life · Your personal host
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '1rem 1rem 0.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(201,168,76,0.2) transparent',
                        }}
                    >
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    gap: '0.4rem',
                                }}
                            >
                                <div
                                    className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}
                                    style={{ whiteSpace: 'pre-line' }}
                                >
                                    {msg.text}
                                </div>
                                {/* Suggestion chips */}
                                {msg.role === 'ai' && msg.suggestions && i === messages.length - 1 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
                                        {msg.suggestions.map((s, si) => (
                                            <button
                                                key={si}
                                                onClick={() => handleSuggestion(s)}
                                                style={{
                                                    fontFamily: 'var(--font-display)',
                                                    fontSize: '0.52rem',
                                                    letterSpacing: '0.15em',
                                                    textTransform: 'uppercase',
                                                    color: 'var(--color-gold)',
                                                    background: 'transparent',
                                                    border: '1px solid rgba(201,168,76,0.3)',
                                                    padding: '0.35rem 0.75rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.25s ease',
                                                    borderRadius: '1px',
                                                    whiteSpace: 'nowrap',
                                                }}
                                                onMouseEnter={e => {
                                                    e.target.style.background = 'rgba(201,168,76,0.12)'
                                                    e.target.style.borderColor = 'rgba(201,168,76,0.6)'
                                                }}
                                                onMouseLeave={e => {
                                                    e.target.style.background = 'transparent'
                                                    e.target.style.borderColor = 'rgba(201,168,76,0.3)'
                                                }}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="chat-bubble-ai" style={{ paddingTop: '0.7rem', paddingBottom: '0.7rem' }}>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input bar */}
                    <div
                        style={{
                            padding: '0.75rem 1rem',
                            borderTop: '1px solid rgba(201,168,76,0.12)',
                            display: 'flex',
                            gap: '0.5rem',
                            flexShrink: 0,
                        }}
                    >
                        <input
                            ref={inputRef}
                            className="chat-input-bar"
                            type="text"
                            placeholder="Ask your Concierge…"
                            value={inputVal}
                            onChange={e => setInputVal(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    sendMessage(inputVal)
                                }
                            }}
                        />
                        <button
                            onClick={() => sendMessage(inputVal)}
                            style={{
                                width: '38px',
                                height: '38px',
                                flexShrink: 0,
                                background: 'linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-light) 100%)',
                                border: 'none',
                                borderRadius: '2px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-dark)',
                                fontSize: '0.8rem',
                                transition: 'transform 0.2s ease, opacity 0.2s ease',
                            }}
                            onMouseEnter={e => { e.target.style.transform = 'scale(1.08)' }}
                            onMouseLeave={e => { e.target.style.transform = 'scale(1)' }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
