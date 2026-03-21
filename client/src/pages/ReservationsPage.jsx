import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { marked } from 'marked'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/dark.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import { menuData } from './FoodMenuPage'

const ALACARTE_FOOD = menuData.food.sections.flatMap((s, sIdx) => s.items.map((i, iIdx) => ({ id: `f_${sIdx}_${iIdx}`, cat: s.heading, subCategory: s.subCategory, ...i })))
const ALACARTE_BEVERAGES = menuData.beverages.sections.flatMap((s, sIdx) => s.items.map((i, iIdx) => ({ id: `b_${sIdx}_${iIdx}`, cat: s.heading, subCategory: s.subCategory, ...i })))

const TumblerIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8l1 12c.1.9 1 1.5 2 1.5h8c1 0 1.9-.6 2-1.5l1-12"></path>
        <path d="M4 8h16"></path>
        <path d="M9 12h2v2H9z"></path>
        <path d="M13 14h2v2h-2z"></path>
        <path d="M12 9A3 3 0 009 6a3 3 0 013-3"></path>
    </svg>
)

const WineGlassIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15v6"></path>
        <path d="M9 21h6"></path>
        <path d="M5 7c0 4.4 3.6 8 7 8s7-3.6 7-8-3.1-5-7-5-7 .6-7 5z"></path>
        <path d="M5 7h14"></path>
        <path d="M7 11c1.5 1 3 1 5 0s3.5-1 5 0"></path>
    </svg>
)

const BottleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2v6l-2 4v10a2 2 0 002 2h4a2 2 0 002-2V12l-2-4V2"></path>
        <path d="M10 2h4"></path>
    </svg>
)

const getSubCategoryIcons = (sub) => {
    if (!sub) return null;
    const s = sub.toLowerCase();

    if (s === 'draught') {
        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '0.2rem', fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'rgba(201,168,76,0.5)', letterSpacing: '0.1em', fontWeight: 600 }}>300ML</div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '0.2rem', fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'rgba(201,168,76,0.5)', letterSpacing: '0.1em', fontWeight: 600 }}>500ML</div>
            </>
        )
    }

    let LeftIcon = null;
    let RightIcon = BottleIcon;

    if (['gin', 'vodka', 'rum', 'bourbon', 'tequila'].includes(s)) {
        LeftIcon = TumblerIcon;
    } else if (['whiskey', 'bubbles', 'whites', 'reds', 'red', 'white'].includes(s)) {
        LeftIcon = WineGlassIcon;
    }

    if (LeftIcon) {
        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '0.15rem', color: 'rgba(201,168,76,0.45)' }}><LeftIcon /></div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '0.15rem', color: 'rgba(201,168,76,0.45)' }}><RightIcon /></div>
            </>
        )
    }

    return null;
}

const AI_FLOW = [
    {
        trigger: '__welcome__',
        response: `Good evening. I'm your AI Concierge at Spice of Life. ✦\n\nI'll guide you through your reservation and fill in the form for you. Let's begin — what name should I put the booking under?`,
        field: null,
    },
    {
        trigger: '__name__',
        response: (v) => `Wonderful, ${v}. And your email address for the confirmation?`,
        field: 'name',
    },
    {
        trigger: '__email__',
        response: () => `Perfect. Your phone number, in case our team needs to reach you?`,
        field: 'email',
    },
    {
        trigger: '__phone__',
        response: () => `Thank you. What date would you prefer for your visit?`,
        field: 'phone',
    },
    {
        trigger: '__date__',
        response: () => `Noted. And your preferred dining time? We are open continuously from 11:30 to 21:00.`,
        field: 'date',
    },
    {
        trigger: '__time__',
        response: () => `Excellent. How many guests will be joining you?`,
        field: 'time',
    },
    {
        trigger: '__guests__',
        response: () => `Noted. Any preferred seating? We have Outdoor View, Main Dining, Group Dining, Private VIP Room, Event Space, or Sofa Booth.`,
        field: 'guests',
    },
    {
        trigger: '__space__',
        response: () => `Lovely choice. Is this for a special occasion? (Birthday, Anniversary, Business Dinner, Proposal — or none?)`,
        field: 'space',
    },
    {
        trigger: '__occasion__',
        response: () => `Wonderful. Any special requests or dietary requirements?`,
        field: 'occasion',
    },
    {
        trigger: '__notes__',
        response: (v, form) =>
            `Your reservation is all set ✦\n\n` +
            `Name: ${form.name}\nDate: ${form.date} at ${form.time}\nGuests: ${form.guests}\nOccasion: ${form.occasion || 'None'}\n\n` +
            `Shall I confirm this reservation?`,
        field: 'notes',
    },
    {
        trigger: '__confirm__',
        response: () => `Your reservation has been confirmed. Our team will send a confirmation to your email within the hour. We look forward to welcoming you. ✦`,
        field: null,
        done: true,
    },
]

const LABEL_STYLE = {
    fontFamily: 'var(--font-display)',
    fontSize: '0.54rem',
    letterSpacing: '0.25em',
    color: 'rgba(245,240,232,0.45)',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '0.45rem',
}
const INPUT_STYLE_BASE = {
    width: '100%',
    padding: '0.85rem 0',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    color: 'var(--color-cream)',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
}

// Additional styling specific to select fields to ensure dark dropdowns
const SELECT_STYLE_BASE = {
    ...INPUT_STYLE_BASE,
    colorScheme: 'dark', // Native dark mode hint
    backgroundColor: 'rgba(20, 16, 12, 0.95)', // Ensure dropdown options take this dark bg (some browsers need this on the select itself)
}

// Main
export default function ReservationsPage() {
    const navigate = useNavigate()

    // ─── Layout mode: 'form' | 'ai' ──────────────────────────────────────────
    const [mode, setMode] = useState('form')   // 'form' = manual, 'ai' = chat active
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleOpenAi = () => {
            setMode('ai')
            setTimeout(() => aiInputRef.current?.focus(), 100)
        }
        window.addEventListener('openAiConcierge', handleOpenAi)
        return () => window.removeEventListener('openAiConcierge', handleOpenAi)
    }, [])

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', date: '',
        time: '', guests: '', space: '', occasion: '', notes: '',
    })
    const [submitted, setSubmitted] = useState(false)
    const [alacarteTab, setAlacarteTab] = useState('food')        // 'food' | 'beverages'
    const [alacarteSelected, setAlacarteSelected] = useState({})  // { [`${itemId}__${priceIdx}`]: true }
    const [alacarteQuantities, setAlacarteQuantities] = useState({})  // { [`${itemId}__${priceIdx}`]: number }
    const [isPreorderOpen, setIsPreorderOpen] = useState(false)
    const [openCategories, setOpenCategories] = useState([])

    const toggleCategory = (catName) => {
        setOpenCategories(prev => prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName])
    }

    // Valid time options for the form select
    const VALID_TIMES = ['11:30', '12:00', '12:30', '13:00', '13:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00']

    const mapTimeToOption = (rawTime) => {
        if (!rawTime) return ''
        if (VALID_TIMES.includes(rawTime)) return rawTime
        const parts = rawTime.split(':')
        if (parts.length !== 2) return ''
        const inputMin = parseInt(parts[0]) * 60 + parseInt(parts[1])
        let closest = VALID_TIMES[0]
        let minDiff = Infinity
        for (const t of VALID_TIMES) {
            const tp = t.split(':')
            const tMin = parseInt(tp[0]) * 60 + parseInt(tp[1])
            const diff = Math.abs(tMin - inputMin)
            if (diff < minDiff) { minDiff = diff; closest = t }
        }
        return closest
    }

    // Match AI pre-order item name to actual menu items
    const findMenuItemByName = (name) => {
        const allItems = [...ALACARTE_FOOD, ...ALACARTE_BEVERAGES]
        const lower = name.toLowerCase().trim()
        let match = allItems.find(i => i.name.toLowerCase() === lower)
        if (match) return match
        match = allItems.find(i => i.name.toLowerCase().includes(lower) || lower.includes(i.name.toLowerCase()))
        return match || null
    }

    // À la carte total — parse composite keys
    const alacarteItems = Object.keys(alacarteSelected).map(compositeKey => {
        const [id, pIdxStr] = compositeKey.split('__')
        const priceIdx = parseInt(pIdxStr) || 0
        const item = [...ALACARTE_FOOD, ...ALACARTE_BEVERAGES].find(i => i.id === id)
        if (!item) return null
        const prices = item.price.split('/').map(p => p.trim())
        const selectedPrice = prices[priceIdx] || prices[0]
        const qty = alacarteQuantities[compositeKey] || 1
        return { ...item, _compositeKey: compositeKey, _selectedPriceStr: selectedPrice, _qty: qty, _priceIdx: priceIdx }
    }).filter(Boolean)

    const alacarteTotal = alacarteItems.reduce((sum, item) => {
        const price = parseInt(item._selectedPriceStr.replace(/\D/g, '') || '0')
        return sum + price * item._qty
    }, 0)

    const toggleAlacarteItem = (id, priceIndex = 0) => {
        const key = `${id}__${priceIndex}`
        setAlacarteSelected(prev => {
            const next = { ...prev }
            if (next[key]) {
                delete next[key]
                setAlacarteQuantities(qp => { const nq = { ...qp }; delete nq[key]; return nq })
            } else {
                next[key] = true
                setAlacarteQuantities(qp => ({ ...qp, [key]: qp[key] || 1 }))
            }
            return next
        })
    }

    const updateQuantity = (compositeKey, delta) => {
        setAlacarteQuantities(prev => {
            const current = prev[compositeKey] || 1
            const next = Math.max(1, current + delta)
            return { ...prev, [compositeKey]: next }
        })
    }



    const [messages, setMessages] = useState([])
    const [aiInput, setAiInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [aiStarted, setAiStarted] = useState(false)
    const [sessionId, setSessionId] = useState(null)

    const chatPanelRef = useRef(null)
    const formPanelRef = useRef(null)
    const chatScrollContainerRef = useRef(null)
    const aiInputRef = useRef(null)

    useEffect(() => {
        // Auto-scroll chat messages safely without causing window jump
        if (chatScrollContainerRef.current) {
            chatScrollContainerRef.current.scrollTo({
                top: chatScrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [messages, isTyping])

    const startAI = useCallback(() => {
        setMode('ai')
        if (!aiStarted) {
            setAiStarted(true)
            setIsTyping(true)
            setTimeout(() => {
                setIsTyping(false)
                setMessages([{ role: 'ai', text: "Hello! I am your AI assistant here to help you reserve your table. Feel free to ask about table availability, our menu, or your deposit status." }])
            }, 900)
        }

        // Ensure view is scrolled nicely to the interface
        setTimeout(() => {
            const rezSection = document.getElementById('reservations')
            if (rezSection) {
                const y = rezSection.getBoundingClientRect().top + window.scrollY - 100
                window.scrollTo({ top: y, behavior: 'smooth' })
            }
            aiInputRef.current?.focus({ preventScroll: true })
        }, 100)
    }, [aiStarted])

    const confirmReservation = async () => {
        // Call backend confirm endpoint (email sending is commented out on server)
        try {
            await fetch('http://127.0.0.1:5000/api/ai/chat/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'confirm' })
            })
        } catch (e) { console.error('Confirm error:', e) }
        setSubmitted(true)
    }

    const sendAI = async (text) => {
        if (!text.trim()) return
        const trimmed = text.trim()
        const userMsg = { role: 'user', text: trimmed }
        setMessages(prev => [...prev, userMsg])
        setAiInput('')
        setIsTyping(true)

        // Check if user is confirming
        const isConfirm = trimmed.toLowerCase().replace(/[^a-zàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ\s]/g, '').trim()
        if (isConfirm === 'xác nhận' || isConfirm === 'xac nhan' || isConfirm === 'confirm') {
            setIsTyping(false)
            setMessages(prev => [...prev, { role: 'ai', text: 'Your reservation has been confirmed! ✦ Our team will send a confirmation email with your Digital E-Ticket shortly. We look forward to welcoming you to Spice of Life.' }])
            await confirmReservation()
            return
        }

        try {
            // Parallel AI Form Extraction (Fire and Forget)
            fetch('http://127.0.0.1:5000/api/ai/chat/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmed })
            })
            .then(res => res.json())
            .then(data => {
                if (data && Object.keys(data).length > 0) {
                    // Separate preorder from form fields
                    const { preorder, time, ...formFields } = data
                    
                    // Map time to valid select option
                    if (time) {
                        formFields.time = mapTimeToOption(time)
                    }
                    
                    // Update form data (without preorder)
                    if (Object.keys(formFields).length > 0) {
                        setFormData(prev => ({ ...prev, ...formFields }))
                    }
                    
                    // Handle preorder items
                    if (preorder && Array.isArray(preorder) && preorder.length > 0) {
                        setIsPreorderOpen(true)
                        preorder.forEach(orderItem => {
                            const menuItem = findMenuItemByName(orderItem.name)
                            if (menuItem) {
                                const qty = orderItem.quantity || 1
                                // Find the right price index if price_label is specified
                                let priceIdx = 0
                                if (orderItem.price_label) {
                                    const prices = menuItem.price.split('/').map(p => p.trim())
                                    const matchIdx = prices.findIndex(p => p.includes(orderItem.price_label.replace('$', '')))
                                    if (matchIdx >= 0) priceIdx = matchIdx
                                }
                                setAlacarteSelected(prev => ({ ...prev, [`${menuItem.id}__${priceIdx}`]: true }))
                                setAlacarteQuantities(prev => ({ ...prev, [`${menuItem.id}__${priceIdx}`]: qty }))
                            }
                        })
                    }
                }
            })
            .catch(err => console.error("AI Extraction Error:", err));

            const res = await fetch('http://127.0.0.1:5000/api/ai/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmed, session_id: sessionId })
            });
            const data = await res.json();

            if (data.session_id && !sessionId) {
                setSessionId(data.session_id);
            }

            setIsTyping(false);
            setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
        } catch (error) {
            console.error("AI Chat Error:", error);
            setIsTyping(false);
            setMessages(prev => [...prev, { role: 'ai', text: "Tôi xin lỗi, hiện tại dịch vụ AI đang bị gián đoạn. Xin vui lòng điền form thủ công nhé!" }]);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        setTimeout(() => {
            setSubmitted(false)
            setFormData({ name: '', email: '', phone: '', date: '', time: '', guests: '', space: '', occasion: '', notes: '' })
            setAlacarteSelected({})
            setAlacarteQuantities({})
        }, 4000)
    }

    const isFormLocked = mode === 'ai'



    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-dark)', color: 'var(--color-cream)' }}>
            <Navbar />


            <div
                style={{
                    paddingTop: '120px',
                    paddingBottom: '3rem',
                    textAlign: 'center',
                    position: 'relative',
                }}
            >
                {/* Back to Homepage Button Top Left */}
                <div style={{ position: 'absolute', top: '100px', left: '2rem' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            fontFamily: 'var(--font-display)', fontSize: '0.55rem',
                            letterSpacing: '0.2em', textTransform: 'uppercase',
                            color: 'rgba(245,240,232,0.6)',
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => { e.target.style.color = 'var(--color-gold)' }}
                        onMouseLeave={e => { e.target.style.color = 'rgba(245,240,232,0.6)' }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Homepage
                    </button>
                </div>

                <div className="section-label" style={{ justifyContent: 'center', margin: '0 0 1rem 0' }}>
                    Reservations
                </div>
                <h1
                    style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        fontWeight: 400,
                        color: 'var(--color-cream)',
                        marginBottom: '0.5rem',
                    }}
                >
                    Secure Your <em style={{ color: 'var(--color-gold)' }}>Table</em>
                </h1>
                <p
                    style={{
                        fontFamily: 'var(--font-elegant)',
                        fontSize: '1rem',
                        color: 'rgba(245,240,232,0.5)',
                        fontStyle: 'italic',
                        maxWidth: '400px',
                        margin: '0 auto',
                    }}
                >
                    Fill the form yourself, or let our AI Concierge guide you.
                </p>

                {mode === 'form' && (
                    <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
                        <button
                            onClick={startAI}
                            className="btn-gold"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                animation: 'aiGlow 2.8s ease-in-out infinite',
                                padding: '0.8rem 2rem',
                            }}
                        >
                            <span style={{ fontSize: '0.9rem' }}>✦</span>
                            Use AI to Reserve
                        </button>
                    </div>
                )}
            </div>


            <div
                id="reservations"
                style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '0 2rem 4rem',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: mode === 'ai' ? '2rem' : '0',
                    minHeight: '700px',
                }}
            >

                <div
                    ref={chatPanelRef}
                    style={{
                        width: mode === 'ai' ? 'calc(50% - 1rem)' : '0px',
                        transform: mode === 'ai' ? 'translateX(0)' : 'translateX(-40px)',
                        opacity: mode === 'ai' ? 1 : 0,
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '700px',
                        background: 'rgba(18,14,10,0.92)',
                        border: '1px solid rgba(201,168,76,0.2)',
                        backdropFilter: 'blur(16px)',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        pointerEvents: mode === 'ai' ? 'all' : 'none',
                        flexShrink: 0,
                    }}
                >
                    {/* Chat header */}
                    <div
                        style={{
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid rgba(201,168,76,0.15)',
                            background: 'rgba(201,168,76,0.04)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexShrink: 0,
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div
                                style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: 'var(--color-gold)',
                                    animation: 'aiGlowDot 2s ease-in-out infinite',
                                }}
                            />
                            <div>
                                <div style={{
                                    fontFamily: 'var(--font-display)', fontSize: '0.65rem',
                                    letterSpacing: '0.28em', textTransform: 'uppercase',
                                    color: 'var(--color-gold)',
                                }}>
                                    AI Concierge
                                </div>
                                <div style={{
                                    fontFamily: 'var(--font-elegant)', fontSize: '0.75rem',
                                    color: 'rgba(245,240,232,0.4)', fontStyle: 'italic', marginTop: '2px',
                                }}>
                                    Filling your reservation in real time
                                </div>
                            </div>
                        </div>
                        {/* Switch to manual */}
                        <button
                            onClick={() => setMode('form')}
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.52rem',
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                color: 'rgba(201,168,76,0.7)',
                                background: 'transparent',
                                border: '1px solid rgba(201,168,76,0.25)',
                                padding: '0.4rem 0.9rem',
                                cursor: 'pointer',
                                borderRadius: '1px',
                                transition: 'all 0.25s',
                            }}
                            onMouseEnter={e => { e.target.style.background = 'rgba(201,168,76,0.1)'; e.target.style.borderColor = 'rgba(201,168,76,0.5)' }}
                            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(201,168,76,0.25)' }}
                        >
                            ← Fill Manually
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={chatScrollContainerRef}
                        data-lenis-prevent
                        style={{
                            flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem',
                            display: 'flex', flexDirection: 'column', gap: '0.85rem',
                            scrollbarWidth: 'thin', scrollbarColor: 'rgba(201,168,76,0.2) transparent',
                        }}
                    >
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            }}>
                                <div
                                    className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}
                                    dangerouslySetInnerHTML={msg.role === 'ai' ? { __html: marked.parse(msg.text) } : undefined}
                                    style={{ maxWidth: '85%' }}
                                >
                                    {msg.role === 'user' ? msg.text : null}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ display: 'flex' }}>
                                <div className="chat-bubble-ai" style={{ padding: '0.7rem 1rem' }}>
                                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                        {[0, 1, 2].map(i => (
                                            <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input bar */}
                    <div
                        style={{
                            padding: '1rem 1.5rem',
                            borderTop: '1px solid rgba(201,168,76,0.12)',
                            display: 'flex', gap: '0.6rem', flexShrink: 0,
                        }}
                    >
                        <textarea
                            ref={aiInputRef}
                            className="chat-input-bar"
                            data-lenis-prevent
                            placeholder="Type your answer…"
                            value={aiInput}
                            onChange={e => {
                                setAiInput(e.target.value);
                                e.target.style.height = 'auto'; // Reset to auto first to get accurate scrollHeight
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 110)}px`;
                            }}
                            onKeyDown={e => { 
                                if (e.key === 'Enter' && !e.shiftKey) { 
                                    e.preventDefault(); 
                                    if(aiInput.trim()) {
                                        sendAI(aiInput);
                                        e.target.style.height = 'auto'; // Reset back
                                    }
                                } 
                            }}
                            rows={1}
                            style={{ 
                                flex: 1, 
                                resize: 'none', 
                                overflowY: 'auto', 
                                maxHeight: '110px',
                                padding: '12px 16px',
                                lineHeight: '1.4',
                            }}
                        />
                        <button
                            onClick={() => sendAI(aiInput)}
                            style={{
                                width: '42px', height: '42px', flexShrink: 0,
                                background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-light))',
                                border: 'none', borderRadius: '2px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--color-dark)', fontSize: '0.85rem',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={e => { e.target.style.transform = 'scale(1.08)' }}
                            onMouseLeave={e => { e.target.style.transform = 'scale(1)' }}
                        >
                            ➤
                        </button>
                    </div>
                </div>


                <div
                    ref={formPanelRef}
                    style={{
                        flex: 1,
                        maxWidth: mode === 'form' ? '680px' : '100%',
                        margin: '0 auto',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        pointerEvents: isFormLocked ? 'none' : 'all',
                        position: 'relative',
                    }}
                >
                    {/* Locked overlay message (Removed per user request) */}

                    {submitted ? (
                        <div style={{
                            textAlign: 'center', padding: '5rem 2rem',
                            border: '1px solid rgba(201,168,76,0.25)',
                        }}>
                            <div style={{ fontSize: '2rem', color: 'var(--color-gold)', marginBottom: '1rem' }}>✦</div>
                            <h3 style={{
                                fontFamily: 'var(--font-serif)', fontSize: '1.75rem',
                                color: 'var(--color-cream)', fontWeight: 400, marginBottom: '0.75rem',
                            }}>Reservation Received</h3>
                            <p style={{ fontFamily: 'var(--font-elegant)', color: 'rgba(245,240,232,0.55)', lineHeight: 1.8 }}>
                                Thank you for choosing Spice of Life. Our team will confirm your reservation within 2 hours.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1.5rem 2rem',
                                marginBottom: '1.5rem',
                            }}>
                                {/* Name */}
                                <Field label="Full Name *">
                                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                                        placeholder="Your name" required disabled={isFormLocked}
                                        style={{ ...INPUT_STYLE_BASE, opacity: isFormLocked ? 0.7 : 1 }} />
                                </Field>
                                {/* Email */}
                                <Field label="Email Address *">
                                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                                        placeholder="your@email.com" required disabled={isFormLocked}
                                        style={{ ...INPUT_STYLE_BASE, opacity: isFormLocked ? 0.7 : 1 }} />
                                </Field>
                                {/* Phone */}
                                <Field label="Phone Number *">
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                        placeholder="+65 XXXX XXXX" required disabled={isFormLocked}
                                        style={{ ...INPUT_STYLE_BASE, opacity: isFormLocked ? 0.7 : 1 }} />
                                </Field>
                                {/* Guests */}
                                <Field label="Number of Guests *">
                                    <select name="guests" value={formData.guests} onChange={handleChange}
                                        required disabled={isFormLocked}
                                        style={{ ...SELECT_STYLE_BASE, opacity: isFormLocked ? 0.7 : 1 }}>
                                        <option value="" style={{ background: '#0d0b08' }}>Select guests</option>
                                        {['1', '2', '3', '4', '5 – 6', '7 – 10', '11 – 15', '16+'].map(g => (
                                            <option key={g} value={g} style={{ background: '#0d0b08' }}>{g} Guest{g !== '1' ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </Field>
                                {/* Date */}
                                <Field label="Preferred Date *">
                                    <Flatpickr
                                        value={formData.date}
                                        onChange={(date) => {
                                            // date is an array of Date objects
                                            if (date.length > 0) {
                                                const d = date[0]
                                                // Format to yyyy-mm-dd for consistency
                                                const formatted = d.toLocaleDateString('en-CA')
                                                handleChange({ target: { name: 'date', value: formatted } })
                                            } else {
                                                handleChange({ target: { name: 'date', value: '' } })
                                            }
                                        }}
                                        options={{
                                            minDate: 'today',
                                            dateFormat: 'Y-m-d',
                                            disableMobile: true, // Forces flatpickr UI on mobile instead of native
                                        }}
                                        placeholder="Select date"
                                        disabled={isFormLocked}
                                        style={{ ...INPUT_STYLE_BASE, opacity: isFormLocked ? 0.7 : 1 }}
                                    />
                                </Field>
                                {/* Time */}
                                <Field label="Preferred Time *">
                                    <select name="time" value={formData.time} onChange={handleChange}
                                        required disabled={isFormLocked}
                                        style={{ ...SELECT_STYLE_BASE, opacity: isFormLocked ? 0.7 : 1 }}>
                                        <option value="" style={{ background: '#0d0b08' }}>Select time</option>
                                        {['11:30', '12:00', '12:30', '13:00', '13:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(t => (
                                            <option key={t} value={t} style={{ background: '#0d0b08' }}>{t}</option>
                                        ))}
                                    </select>
                                </Field>
                                {/* Space */}
                                <Field label="Preferred Seating *">
                                    <select name="space" value={formData.space} onChange={handleChange}
                                        required disabled={isFormLocked}
                                        style={{ ...SELECT_STYLE_BASE, opacity: isFormLocked ? 0.7 : 1 }}>
                                        <option value="" style={{ background: '#0d0b08' }}>No preference</option>
                                        <option value="outdoor" style={{ background: '#0d0b08' }}>Outdoor View</option>
                                        <option value="main" style={{ background: '#0d0b08' }}>Main Dining</option>
                                        <option value="group" style={{ background: '#0d0b08' }}>Group Dining</option>
                                        <option value="vip" style={{ background: '#0d0b08' }}>Private VIP Room</option>
                                        <option value="event" style={{ background: '#0d0b08' }}>Event Space</option>
                                        <option value="sofa" style={{ background: '#0d0b08' }}>Sofa Booth</option>
                                    </select>
                                </Field>
                                {/* Occasion */}
                                <Field label="Occasion">
                                    <select name="occasion" value={formData.occasion} onChange={handleChange}
                                        disabled={isFormLocked}
                                        style={{ ...SELECT_STYLE_BASE, opacity: isFormLocked ? 0.7 : 1 }}>
                                        <option value="" style={{ background: '#0d0b08' }}>Select occasion</option>
                                        {['Birthday', 'Anniversary', 'Business Dinner', 'Proposal', 'Family Gathering', 'Other'].map(occ => (
                                            <option key={occ} value={occ} style={{ background: '#0d0b08' }}>{occ}</option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            {/* Special requests */}
                            <Field label="Special Requests" style={{ marginBottom: '2rem' }}>
                                <textarea
                                    name="notes" value={formData.notes} onChange={handleChange}
                                    disabled={isFormLocked}
                                    placeholder="Dietary requirements, special setup, or anything we should know"
                                    rows={3}
                                    style={{
                                        ...INPUT_STYLE_BASE,
                                        resize: 'vertical',
                                        opacity: isFormLocked ? 0.7 : 1,
                                    }}
                                    onFocus={e => !isFormLocked && (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                                    onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
                                />
                            </Field>


                            <div style={{ marginBottom: '2rem' }}>

                                {/* Header row */}
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                                    <div onClick={() => setIsPreorderOpen(!isPreorderOpen)} style={{ cursor: 'pointer', flex: 1, userSelect: 'none' }}>
                                        <div style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(201,168,76,0.85)", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            ✦ Pre-order (Optional)
                                            <span style={{ fontSize: '0.65rem', transition: 'transform 0.3s', transform: isPreorderOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                                        </div>
                                        <div style={{ fontFamily: "var(--font-elegant)", fontSize: "1rem", color: "var(--color-cream)", fontStyle: "italic", marginTop: "0.2rem" }}>
                                            Let the kitchen prepare your selections in advance
                                        </div>
                                    </div>
                                    {Object.keys(alacarteSelected).length > 0 && (
                                        <button type="button"
                                            onClick={() => { setAlacarteSelected({}); setAlacarteQuantities({}) }}
                                            style={{ fontFamily: "var(--font-display)", fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", background: "transparent", border: "1px solid rgba(245,240,232,0.15)", padding: "0.4rem 0.85rem", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}
                                            onMouseEnter={e => { e.target.style.color = "rgba(245,240,232,0.7)"; e.target.style.borderColor = "rgba(245,240,232,0.35)" }}
                                            onMouseLeave={e => { e.target.style.color = "rgba(245,240,232,0.35)"; e.target.style.borderColor = "rgba(245,240,232,0.15)" }}
                                        >✕ Clear All</button>
                                    )}
                                </div>

                                <div style={{ display: isPreorderOpen ? 'block' : 'none', marginTop: '1.25rem' }}>
                                    {/* Food / Beverages tab */}
                                    <div style={{ display: 'flex', gap: '0', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '2px', overflow: 'hidden', marginBottom: '1.25rem', width: 'fit-content' }}>
                                        {['food', 'beverages'].map(t => (
                                            <button key={t} type="button" onClick={() => setAlacarteTab(t)}
                                                style={{ padding: '0.75rem 1.6rem', fontFamily: 'var(--font-display)', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: alacarteTab === t ? 'var(--color-gold)' : 'rgba(245,240,232,0.35)', background: alacarteTab === t ? 'rgba(201,168,76,0.1)' : 'transparent', border: 'none', borderRight: '1px solid rgba(201,168,76,0.15)', cursor: 'pointer', transition: 'all 0.2s' }}
                                            >{t === 'food' ? '🍽 Food' : '🍷 Beverages'}</button>
                                        ))}
                                    </div>

                                    {(() => {
                                        const allItems = alacarteTab === 'food' ? ALACARTE_FOOD : ALACARTE_BEVERAGES
                                        const cats = [...new Set(allItems.map(i => i.cat))]
                                        return cats.map(cat => (
                                            <div key={cat} style={{ marginBottom: '0.5rem' }}>
                                                <div
                                                    onClick={() => toggleCategory(cat)}
                                                    style={{ cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '0.95rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#F1D592', paddingBottom: '0.6rem', borderBottom: '1px solid rgba(201,168,76,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s', padding: '0.5rem', margin: '-0.5rem -0.5rem 0.75rem -0.5rem', borderRadius: '4px', userSelect: 'none' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.05)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <span>{cat}</span>
                                                    <span style={{ fontSize: '0.7rem', opacity: 0.8, transition: 'transform 0.3s', transform: openCategories.includes(cat) ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                                                </div>
                                                {openCategories.includes(cat) && (() => {
                                                    const itemsInCat = allItems.filter(i => i.cat === cat);
                                                    const subCats = [...new Set(itemsInCat.map(i => i.subCategory || ''))];

                                                    return subCats.map((sub, sIdx) => {
                                                        const itemsInSub = itemsInCat.filter(i => (i.subCategory || '') === sub);
                                                        return (
                                                            <div key={sub || 'none'} style={{ marginBottom: '1rem' }}>
                                                                {sub && (
                                                                    <div style={{ position: 'relative', marginBottom: '0.5rem', marginTop: sIdx > 0 ? '1.5rem' : '0.5rem' }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                            <span style={{ flex: 1, height: '1px', background: 'rgba(176,122,80,0.15)' }} />
                                                                            <span style={{
                                                                                fontFamily: 'var(--font-display)', fontSize: '0.65rem',
                                                                                color: '#d3fbd8', opacity: 0.8,
                                                                                letterSpacing: '0.25em', whiteSpace: 'nowrap',
                                                                                textTransform: 'uppercase',
                                                                            }}>{sub}</span>
                                                                            <span style={{ flex: 1, height: '1px', background: 'rgba(176,122,80,0.15)' }} />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div style={{ display: 'grid', gridTemplateColumns: alacarteTab === 'beverages' ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.1rem 1rem' }}>
                                                                    {itemsInSub.map(item => {
                                                                        // Check if ANY price of this item is selected
                                                                        const isAnySel = Object.keys(alacarteSelected).some(k => k.startsWith(item.id + '__'))
                                                                        const prices = item.price.split('/').map(p => p.trim())

                                                                        let leftPriceIdx = null;
                                                                        let rightPriceIdx = null;
                                                                        if (alacarteTab === 'beverages' && prices.length > 1) {
                                                                            const p0 = parseInt(prices[0].replace(/\D/g, '')) || 0;
                                                                            const p1 = parseInt(prices[1].replace(/\D/g, '')) || 0;
                                                                            if (p0 < 50 && p1 >= 50) { leftPriceIdx = 0; rightPriceIdx = 1; }
                                                                            else if (p1 < 50 && p0 >= 50) { leftPriceIdx = 1; rightPriceIdx = 0; }
                                                                            else { leftPriceIdx = 0; rightPriceIdx = 1; }
                                                                        } else if (alacarteTab === 'beverages') {
                                                                            leftPriceIdx = null;
                                                                            rightPriceIdx = 0;
                                                                        }

                                                                        const renderPriceBtn = (pIdx) => {
                                                                            if (pIdx === null) return <div key={`empty_${pIdx}`} style={{ width: '4rem' }} />;
                                                                            const p = prices[pIdx];
                                                                            const compositeKey = `${item.id}__${pIdx}`
                                                                            const isPriceSel = !!alacarteSelected[compositeKey]
                                                                            return (
                                                                                <button key={pIdx} type="button" disabled={isFormLocked}
                                                                                    onClick={() => !isFormLocked && toggleAlacarteItem(item.id, pIdx)}
                                                                                    style={{
                                                                                        fontFamily: 'var(--font-display)', fontSize: '0.75rem',
                                                                                        color: isPriceSel ? 'var(--color-gold)' : 'rgba(245,240,232,0.3)',
                                                                                        background: isPriceSel ? 'rgba(201,168,76,0.1)' : 'transparent',
                                                                                        border: '1px solid ' + (isPriceSel ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)'),
                                                                                        borderRadius: '3px', cursor: isFormLocked ? 'default' : 'pointer',
                                                                                        padding: '0.35rem 0', width: '4rem', textAlign: 'center', transition: 'all 0.18s',
                                                                                    }}
                                                                                >
                                                                                    {p}
                                                                                </button>
                                                                            )
                                                                        }

                                                                        return (
                                                                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', minHeight: '44px' }}>
                                                                                <button type="button" disabled={isFormLocked}
                                                                                    onClick={() => !isFormLocked && toggleAlacarteItem(item.id, 0)}
                                                                                    style={{ flex: 1, background: 'transparent', border: 'none', cursor: isFormLocked ? 'default' : 'pointer', opacity: isFormLocked ? 0.5 : 1, textAlign: 'left', padding: 0 }}
                                                                                >
                                                                                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: isAnySel ? 'var(--color-gold)' : 'rgba(245,240,232,0.75)', textDecorationLine: isAnySel ? 'underline' : 'none', textDecorationColor: 'var(--color-gold)', textUnderlineOffset: '4px', lineHeight: 1.3, transition: 'color 0.18s' }}>
                                                                                        {isAnySel && '✦ '}{item.name}
                                                                                    </div>
                                                                                </button>

                                                                                {alacarteTab === 'beverages' ? (
                                                                                    <div style={{ display: 'grid', gridTemplateColumns: '4rem 4rem', gap: '0.2rem', flexShrink: 0, opacity: isFormLocked ? 0.5 : 1 }}>
                                                                                        {renderPriceBtn(leftPriceIdx)}
                                                                                        {renderPriceBtn(rightPriceIdx)}
                                                                                    </div>
                                                                                ) : (
                                                                                    <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0, opacity: isFormLocked ? 0.5 : 1 }}>
                                                                                        {prices.map((p, pIdx) => renderPriceBtn(pIdx))}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                })()}
                                            </div>
                                        ))
                                    })()}
                                </div>

                                {/* SUMMARY BAR */}
                                {(() => {
                                    if (!alacarteItems.length) return null
                                    return (
                                        <div style={{
                                            position: 'sticky',
                                            bottom: '20px',
                                            marginTop: '1.25rem',
                                            padding: '0.85rem 1rem',
                                            background: 'rgba(20, 16, 12, 0.95)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(201,168,76,0.3)',
                                            boxShadow: '0 -4px 30px rgba(0,0,0,0.5)',
                                            borderRadius: '6px',
                                            zIndex: 100,
                                        }}>
                                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.8)', marginBottom: '0.6rem' }}>Your Selection</div>
                                            {alacarteItems.map((item) => (
                                                <div key={item._compositeKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', padding: '0.4rem 0', borderBottom: '1px dashed rgba(201,168,76,0.1)' }}>
                                                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-cream)', flex: 1 }}>{item.name}</span>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                                                        <button type="button" onClick={() => updateQuantity(item._compositeKey, -1)} disabled={isFormLocked}
                                                            style={{ width: '24px', height: '24px', borderRadius: '3px', border: '1px solid rgba(201,168,76,0.3)', background: 'transparent', color: 'var(--color-gold)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                                                        >−</button>
                                                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'var(--color-cream)', minWidth: '18px', textAlign: 'center' }}>{item._qty}</span>
                                                        <button type="button" onClick={() => updateQuantity(item._compositeKey, 1)} disabled={isFormLocked}
                                                            style={{ width: '24px', height: '24px', borderRadius: '3px', border: '1px solid rgba(201,168,76,0.3)', background: 'transparent', color: 'var(--color-gold)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                                                        >+</button>
                                                    </div>
                                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--color-gold)', flexShrink: 0, minWidth: '3.5rem', textAlign: 'right' }}>
                                                        {item._qty > 1 ? `${item._qty}× ` : ''}{item._selectedPriceStr}
                                                    </span>
                                                </div>
                                            ))}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '1rem' }}>
                                                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.6)' }}>Estimated Total</span>
                                                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-gold)', fontStyle: 'italic' }}>${alacarteTotal}</span>
                                            </div>
                                        </div>
                                    )
                                })()}

                            </div>

                            {/* Submit */}
                            {!isFormLocked && (
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button type="submit" className="btn-gold" style={{ padding: '1rem 3rem' }}>
                                        Confirm Reservation
                                    </button>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>


            <Footer />
        </div>
    )
}

// Utility: label wrapper
function Field({ label, children, style }) {
    return (
        <div style={style}>
            <label style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.54rem',
                letterSpacing: '0.25em',
                color: 'rgba(245,240,232,0.45)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.45rem',
            }}>{label}</label>
            {children}
        </div>
    )
}
