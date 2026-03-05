import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// =============================================
// AI Agent State Machine
// =============================================
const SPACES = [
    { id: 'outdoor', name: 'Outdoor View', capacity: '1–4', mood: 'Romantic, Sunset' },
    { id: 'main', name: 'Main Dining', capacity: '1–4', mood: 'Heritage, Contemporary' },
    { id: 'group', name: 'Group Dining', capacity: '5–10', mood: 'Communal, Festive' },
    { id: 'vip', name: 'Private VIP Room', capacity: 'Up to 15', mood: 'Corporate, Private' },
    { id: 'event', name: 'Event Space', capacity: 'Grand Parties', mood: 'Events, Birthdays' },
    { id: 'sofa', name: 'Sofa Booth', capacity: '2–4', mood: 'Intimate, Semi-Private' },
]

const AVAILABLE_SLOTS = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00']

const MENU_RECS = {
    romantic: ['Crispy Soft-Shell Crab', 'Spiced Black Cod', 'Pandan & Coconut Panna Cotta', 'The Silk Road'],
    corporate: ['Braised Short Rib', 'Rendang Lamb Rack', 'Golden Harvest', 'Chef\'s Tasting Journey'],
    group: ['Heritage Roti Jala', 'Truffle Nasi Ulam', 'Cinnamon Duck Confit', 'Sunday Brunch Ritual'],
    festive: ['Festive Tasting Menu (6 Courses)', 'Wagyu Tenderloin', 'Grand Bûche de Noël'],
}

function buildAIResponse(state, userMsg) {
    const msg = userMsg.toLowerCase()

    // Step 0 → 1: Greeting / intent
    if (state.step === 0) {
        if (msg.includes('book') || msg.includes('reserv') || msg.includes('table') || msg.includes('hi') || msg.includes('hello') || msg.includes('help')) {
            return {
                text: `Welcome to Spice of Life's AI Concierge! 🌟\n\nI'm here to curate the perfect dining experience for you. To get started — **how many guests** will be joining us?`,
                nextStep: 1,
                quickReplies: ['Just myself', '2 of us', 'Party of 4', '6–10 guests', '10+ guests'],
            }
        }
        return {
            text: `Hello! I'm your personal dining concierge at **Spice of Life**. How may I assist you today? I can help you book a table, recommend spaces based on your occasion, or suggest the perfect menu pairings.`,
            quickReplies: ['Book a table', 'Tell me about your spaces', 'Menu recommendations', 'Private dining enquiry'],
            nextStep: 0,
        }
    }

    // Step 1 → 2: Party size gathered, ask about occasion
    if (state.step === 1) {
        let guests = 'your party'
        if (msg.match(/\d+/)) guests = msg.match(/\d+/)[0] + ' guests'
        else if (msg.includes('myself') || msg.includes('solo')) guests = '1 guest'
        else if (msg.includes('two') || msg.includes('2 of us') || msg.includes('couple')) guests = '2 guests'

        return {
            text: `Perfect — a table for **${guests}**. Now, what's the **occasion** for your visit? This helps me find the most fitting space and menu for you.`,
            nextStep: 2,
            quickReplies: ['Romantic evening', 'Birthday celebration', 'Business dinner', 'Family gathering', 'Just dining out'],
            data: { guests },
        }
    }

    // Step 2 → 3: Occasion captured, recommend space
    if (state.step === 2) {
        let spaceRec, moodKey
        if (msg.includes('romantic') || msg.includes('anniversary') || msg.includes('proposal') || msg.includes('date')) {
            spaceRec = SPACES.find(s => s.id === 'outdoor')
            moodKey = 'romantic'
        } else if (msg.includes('business') || msg.includes('corporate') || msg.includes('work')) {
            spaceRec = SPACES.find(s => s.id === 'vip')
            moodKey = 'corporate'
        } else if (msg.includes('birthday') || msg.includes('celebrat') || msg.includes('party') || msg.includes('grand')) {
            spaceRec = SPACES.find(s => s.id === 'event')
            moodKey = 'festive'
        } else if (msg.includes('family') || msg.includes('group')) {
            spaceRec = SPACES.find(s => s.id === 'group')
            moodKey = 'group'
        } else {
            spaceRec = SPACES.find(s => s.id === 'main')
            moodKey = 'group'
        }

        const recs = MENU_RECS[moodKey].slice(0, 3)
        return {
            text: `Wonderful choice! 🌿\n\nFor your occasion, I'd recommend our **${spaceRec.name}** — ${spaceRec.mood.toLowerCase()} atmosphere, capacity for ${spaceRec.capacity} guests.\n\nAnd for the menu, you might love:\n• ${recs.join('\n• ')}\n\nShall I check **available time slots** for your preferred date?`,
            nextStep: 3,
            quickReplies: ['Yes, check availability', 'Tell me more about the space', 'I\'d like a different space'],
            data: { space: spaceRec, moodKey },
        }
    }

    // Step 3 → 4: Show time slots
    if (state.step === 3) {
        if (msg.includes('different') || msg.includes('other') || msg.includes('another')) {
            const spaceList = SPACES.map(s => `• **${s.name}** — ${s.capacity} guests, ${s.mood}`).join('\n')
            return {
                text: `Of course! Here are all our available spaces:\n\n${spaceList}\n\nWhich space would you prefer?`,
                nextStep: 3,
                quickReplies: SPACES.map(s => s.name),
                data: {},
            }
        }
        return {
            text: `Here are tonight's available time slots for your chosen space:\n\n${AVAILABLE_SLOTS.map(s => `🕐 **${s}**`).join('\n')}\n\nWhich time suits you best?`,
            nextStep: 4,
            quickReplies: AVAILABLE_SLOTS,
        }
    }

    // Step 4 → 5: Time chosen, ask for contact
    if (state.step === 4) {
        const timeMatch = msg.match(/\d{1,2}:\d{2}/) || msg.match(/\d{1,2}(am|pm)/i)
        const chosenTime = timeMatch ? timeMatch[0] : userMsg.trim()
        return {
            text: `Excellent! I've reserved **${chosenTime}** tentatively for you. 🎉\n\nTo confirm your booking, could you share your **name** and **contact number or email**? Our team will send a confirmation within the hour.`,
            nextStep: 5,
            data: { time: chosenTime },
        }
    }

    // Step 5 → 6: Wrap up
    if (state.step === 5) {
        return {
            text: `Thank you! Your reservation enquiry has been received. 🌟\n\nHere's a summary:\n• **Date:** Your preferred date\n• **Time:** As selected\n• **Contact:** ${userMsg.trim()}\n\nOur concierge team at **+65 8223 0925** will reach out within the hour to confirm. We look forward to welcoming you to Spice of Life.\n\nIs there anything else I can assist with?`,
            nextStep: 6,
            quickReplies: ['Menu recommendations', 'Parking information', 'Dress code', 'No, thank you!'],
        }
    }

    // Step 6+: General Q&A
    if (msg.includes('park')) {
        return { text: `We offer **valet parking** at $15 for the evening. Alternatively, there are several public car parks within walking distance on Circular Road.\n\nAnything else I can help with?`, nextStep: 6, quickReplies: ['Dress code', 'Cancellation policy', 'Go back to booking'] }
    }
    if (msg.includes('dress') || msg.includes('code') || msg.includes('attire')) {
        return { text: `Our dress code is **Smart Casual** for the main dining areas, and **Formal / Business Casual** for the Private VIP Room and Event Space.\n\nWe ask that guests refrain from sportswear or flip-flops. ✨`, nextStep: 6, quickReplies: ['Parking info', 'Cancellation policy', 'Menu recommendations'] }
    }
    if (msg.includes('cancel') || msg.includes('policy')) {
        return { text: `Reservations may be cancelled or modified up to **24 hours** before your booking without any charge. For cancellations within 24 hours, a no-show fee of $30/pax applies.\n\nFor private dining or event bookings, a 48-hour notice is required.`, nextStep: 6, quickReplies: ['Book a new table', 'Menu recommendations'] }
    }
    if (msg.includes('menu') || msg.includes('recommend') || msg.includes('food') || msg.includes('dish')) {
        return { text: `Our most celebrated dishes include:\n\n🌿 **Braised Short Rib** — 72-hour wagyu, star anise jus\n🐟 **Spiced Black Cod** — miso-turmeric, dashi broth\n🍋 **Pandan Panna Cotta** — palm sugar caramel, coconut\n🍸 **Spice Route Cocktail** — aged rum, cardamom, star anise\n\nWould you like the full menu?`, nextStep: 6, quickReplies: ['View full menu', 'Book a table', 'No, thank you!'] }
    }
    if (msg.includes('thank') || msg === 'no, thank you!' || msg.includes('bye')) {
        return { text: `It was our pleasure! We look forward to welcoming you to **Spice of Life**. Until then — bon appétit! 🌟`, nextStep: 0, quickReplies: ['Start over'] }
    }

    return {
        text: `I'd be happy to help with that! Could you clarify what you're looking for? I can assist with reservations, space recommendations, menu queries, or general information about Spice of Life.`,
        nextStep: state.step,
        quickReplies: ['Book a table', 'Menu recommendations', 'Spaces & capacity', 'Contact information'],
    }
}

function TypingIndicator() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.875rem 1.25rem', background: 'var(--color-charcoal)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '18px 18px 18px 4px', alignSelf: 'flex-start' }}>
            {[0, 1, 2].map(i => <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />)}
        </div>
    )
}

export default function AIBookingPage() {
    const [searchParams] = useSearchParams()
    const initialSpace = searchParams.get('space')

    const [messages, setMessages] = useState([
        {
            role: 'ai',
            text: `Welcome to **Spice of Life**'s AI Concierge. ✦\n\nI'm your personal dining assistant — here to help you discover our spaces, curate the perfect menu, and secure your ideal reservation.\n\nHow may I assist you today?`,
        },
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [agentState, setAgentState] = useState({ step: 0, data: {} })
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        window.scrollTo(0, 0)
        // If came from a space card, pre-populate
        if (initialSpace) {
            const space = SPACES.find(s => s.id === initialSpace)
            if (space) {
                setTimeout(() => {
                    setMessages(prev => [...prev, { role: 'ai', text: `Great choice! You're interested in our **${space.name}** — perfect for ${space.mood.toLowerCase()} with capacity for ${space.capacity} guests.\n\nShall I help you make a reservation for this space?` }])
                    setAgentState({ step: 1, data: { space } })
                }, 800)
            }
        }
    }, [initialSpace])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const sendMessage = (text) => {
        const userText = text || input.trim()
        if (!userText) return
        setInput('')

        // Add user message
        setMessages(prev => [...prev, { role: 'user', text: userText }])
        setIsTyping(true)

        // Simulate AI thinking delay
        const delay = 1200 // Fixed delay, previously used Math.random() which violates react-hooks/purity
        setTimeout(() => {
            const response = buildAIResponse(agentState, userText)
            setIsTyping(false)
            setMessages(prev => [
                ...prev,
                {
                    role: 'ai',
                    text: response.text,
                    quickReplies: response.quickReplies,
                },
            ])
            setAgentState(prev => ({
                step: response.nextStep,
                data: { ...prev.data, ...(response.data || {}) },
            }))
        }, delay)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    // Render AI message with markdown-like bold
    const renderText = (text) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/g)
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} style={{ color: 'var(--color-gold-light)' }}>{part.slice(2, -2)}</strong>
            }
            return <span key={i}>{part}</span>
        })
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-dark)', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            {/* Hero banner */}
            <div
                style={{
                    paddingTop: '90px',
                    background: 'var(--color-charcoal)',
                    borderBottom: '1px solid rgba(201,168,76,0.15)',
                    padding: '90px 1.5rem 2rem',
                    textAlign: 'center',
                }}
            >
                <div className="section-label mb-3" style={{ justifyContent: 'center' }}>AI Concierge</div>
                <h1
                    style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                        color: 'var(--color-cream)',
                        fontWeight: 400,
                        marginBottom: '0.5rem',
                    }}
                >
                    Your Personal <em style={{ color: 'var(--color-gold)' }}>Dining Agent</em>
                </h1>
                <p
                    style={{
                        fontFamily: 'var(--font-elegant)',
                        fontSize: '0.95rem',
                        color: 'rgba(245,240,232,0.5)',
                        maxWidth: '480px',
                        margin: '0 auto',
                        lineHeight: 1.8,
                    }}
                >
                    Powered by AI — but guided by the soul of Spice of Life.
                    Converse naturally to plan your perfect visit.
                </p>

                {/* Feature chips */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                    {['Space Recommendations', 'Menu Pairings', 'Instant Availability', 'Personalised Experience'].map(f => (
                        <span
                            key={f}
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.55rem',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                padding: '0.4rem 0.875rem',
                                border: '1px solid rgba(201,168,76,0.25)',
                                color: 'rgba(201,168,76,0.7)',
                            }}
                        >
                            {f}
                        </span>
                    ))}
                </div>
            </div>

            {/* Chat interface */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '2rem 1rem 6rem' }}>
                <div style={{ width: '100%', maxWidth: '760px', display: 'flex', flexDirection: 'column' }}>

                    {/* Messages */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                        }}
                    >
                        {messages.map((msg, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                {/* Avatar label */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                                    <div
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            background: msg.role === 'ai'
                                                ? 'linear-gradient(135deg, var(--color-brass), var(--color-gold))'
                                                : 'rgba(245,240,232,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.7rem',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {msg.role === 'ai' ? '✦' : '◉'}
                                    </div>
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '0.55rem',
                                            letterSpacing: '0.15em',
                                            color: 'rgba(245,240,232,0.35)',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        {msg.role === 'ai' ? 'Concierge' : 'You'}
                                    </span>
                                </div>

                                {/* Bubble */}
                                <div className={msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}>
                                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                                        {msg.role === 'ai' ? renderText(msg.text) : msg.text}
                                    </div>
                                </div>

                                {/* Quick replies */}
                                {msg.role === 'ai' && msg.quickReplies && i === messages.length - 1 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxWidth: '85%' }}>
                                        {msg.quickReplies.map((reply) => (
                                            <button
                                                key={reply}
                                                onClick={() => sendMessage(reply)}
                                                disabled={isTyping}
                                                style={{
                                                    fontFamily: 'var(--font-display)',
                                                    fontSize: '0.6rem',
                                                    letterSpacing: '0.1em',
                                                    padding: '0.5rem 0.875rem',
                                                    background: 'transparent',
                                                    border: '1px solid rgba(201,168,76,0.3)',
                                                    color: 'var(--color-gold)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.25s',
                                                    textTransform: 'uppercase',
                                                    borderRadius: '100px',
                                                }}
                                                onMouseEnter={e => { e.target.style.background = 'rgba(201,168,76,0.1)'; e.target.style.borderColor = 'rgba(201,168,76,0.6)' }}
                                                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(201,168,76,0.3)' }}
                                            >
                                                {reply}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-brass), var(--color-gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>✦</div>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'rgba(245,240,232,0.35)', textTransform: 'uppercase' }}>Concierge</span>
                                </div>
                                <TypingIndicator />
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input area — sticky at bottom */}
                    <div
                        style={{
                            position: 'sticky',
                            bottom: '1.5rem',
                            background: 'var(--color-charcoal)',
                            border: '1px solid rgba(201,168,76,0.2)',
                            padding: '0.875rem 1rem',
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'center',
                            boxShadow: '0 -20px 60px rgba(13,11,8,0.6)',
                        }}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message…"
                            className="chat-input-bar"
                            disabled={isTyping}
                            style={{ borderRadius: '0', border: 'none', background: 'transparent' }}
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={isTyping || !input.trim()}
                            style={{
                                width: '42px',
                                height: '42px',
                                flexShrink: 0,
                                background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-light))',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1rem',
                                color: 'var(--color-dark)',
                                transition: 'opacity 0.3s',
                                opacity: (!input.trim() || isTyping) ? 0.4 : 1,
                            }}
                        >
                            ↑
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
