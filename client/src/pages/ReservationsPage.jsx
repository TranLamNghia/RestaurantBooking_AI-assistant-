import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/dark.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const LUNCH_SET = {
    label: 'Lunch Set',
    price: 24,
    steps: [
        {
            key: 'starter', label: 'Choose Your Starter',
            items: [
                { id: 'l-s1', name: 'Charred Watermelon', desc: 'Paneer Â· Romesco Â· Pistachio', surcharge: null },
                { id: 'l-s2', name: 'Brussels Sprouts', desc: 'Szechuan Sauce Â· Cashew Nuts', surcharge: null },
                { id: 'l-s3', name: 'Chicken Wings', desc: 'Korean or Soy Honey', surcharge: null },
                { id: 'l-s4', name: 'Crispy Eggplant', desc: 'Thai Chilli Â· Greek Yoghurt', surcharge: null },
                { id: 'l-s5', name: 'Prawn Dumplings', desc: 'Water Chestnut Â· Coconut Broth', surcharge: 2 },
                { id: 'l-s6', name: 'Soft Shell Crab', desc: 'Chilli Crab Sauce Â· Fried Mantou', surcharge: 6 },
            ],
        },
        {
            key: 'main', label: 'Choose Your Main',
            items: [
                { id: 'l-m1', name: 'Smoked Salmon Pita', desc: 'With Fries', surcharge: null },
                { id: 'l-m2', name: 'Baos (2 pcs)', desc: 'Pork / Fish / Tofu — Lotus Buns', surcharge: null },
                { id: 'l-m3', name: 'Truffle Salted Egg Pasta', desc: 'Mushrooms Â· Curry Leaves Â· Cream', surcharge: null },
                { id: 'l-m4', name: 'Squid Ink Vongole', desc: 'Clams Â· White Wine Â· Chilli', surcharge: null },
                { id: 'l-m5', name: 'Braised Beef Fettuccine', desc: '12-hour Five-spice Beef Â· Parmesan', surcharge: null },
                { id: 'l-m6', name: 'Rice Bowl', desc: 'Prawn / Pork / Satay Chicken / Tofu', surcharge: 3 },
                { id: 'l-m7', name: 'NZ Ribeye Rice Bowl', desc: '300g Â· Fragrant Rice', surcharge: 8 },
            ],
        },
        {
            key: 'dessert', label: 'Choose Your Dessert',
            items: [
                { id: 'l-d1', name: 'Churros', desc: 'Kaya Dipping Sauce', surcharge: null },
                { id: 'l-d2', name: 'Lemon Tart', desc: '', surcharge: 2 },
                { id: 'l-d3', name: 'Choc Lava Cake', desc: '', surcharge: 3 },
            ],
        },
    ],
}

const DINNER_SET = {
    label: 'Heritage Dinner Set',
    price: 68,
    steps: [
        {
            key: 'starter', label: 'Choose Your Starter',
            items: [
                { id: 'd-s1', name: 'Crispy Eggplant', desc: 'Thai Chilli Â· Greek Yoghurt', surcharge: null },
                { id: 'd-s2', name: 'Charred Watermelon', desc: 'Paneer Â· Romesco Â· Pistachio', surcharge: null },
                { id: 'd-s3', name: 'Brussels Sprouts', desc: 'Szechuan Sauce Â· Cashew Nuts', surcharge: null },
                { id: 'd-s4', name: 'Chicken Mid Wings', desc: 'Korean or Soy Honey', surcharge: null },
                { id: 'd-s5', name: 'Prawn Dumplings', desc: 'Water Chestnut Â· Coconut Broth', surcharge: 4 },
                { id: 'd-s6', name: 'Soft Shell Crab', desc: 'Chilli Crab Sauce Â· Fried Mantou', surcharge: 4 },
                { id: 'd-s7', name: 'Sticky Pork Ribs', desc: 'Hoisin Glaze Â· Sesame Â· Pickled Cabbage', surcharge: 4 },
            ],
        },
        {
            key: 'main', label: 'Choose Your Signature Piece',
            items: [
                { id: 'd-m1', name: 'Pan Seared Halibut', desc: 'Saffron Cream Â· Clams Â· Bok Choy', surcharge: null },
                { id: 'd-m2', name: 'Squid Ink Vongole', desc: 'Clams Â· White Wine Â· Chilli Â· Parsley', surcharge: null },
                { id: 'd-m3', name: 'Chicken Rice', desc: 'Poached Chicken Â· Fragrant Rice Â· Chilli Sauce', surcharge: null },
                { id: 'd-m4', name: 'Chicken Satay', desc: 'Turmeric Chicken Â· Peanut Sauce Â· Polenta', surcharge: null },
                { id: 'd-m5', name: 'Miso Risotto', desc: 'Edamame Â· Shiitake Â· Sous-vide Egg', surcharge: null },
                { id: 'd-m6', name: 'Truffle Salted Egg Pasta', desc: 'Mushrooms Â· Curry Leaves Â· Cream', surcharge: null },
                { id: 'd-m7', name: 'Char Kway Teow', desc: 'Crayfish Â· Clams Â· Noodles Â· Shallots', surcharge: 6 },
                { id: 'd-m8', name: 'Braised Beef Fettuccine', desc: '12-hour Five-spice Beef Â· Parmesan', surcharge: 6 },
                { id: 'd-m9', name: 'NZ Ribeye 300g', desc: 'Baby Potatoes Â· Pickled Cabbage', surcharge: 12 },
            ],
        },
        {
            key: 'side', label: 'Choose Your Side',
            items: [
                { id: 'd-si1', name: 'Rosemary Baby Potatoes', desc: 'Served with Aioli', surcharge: null },
                { id: 'd-si2', name: 'Polenta Fries', desc: '', surcharge: null },
                { id: 'd-si3', name: 'Truffle Fries', desc: 'Truffle Oil Â· Parmesan', surcharge: 2 },
                { id: 'd-si4', name: 'Mentaiko Fries', desc: 'Mentaiko Mayo Â· Bonito Flakes', surcharge: 2 },
            ],
        },
        {
            key: 'dessert', label: 'Choose Your Sweet Ending',
            items: [
                { id: 'd-d1', name: 'Coconut Panna Cotta', desc: '', surcharge: null },
                { id: 'd-d2', name: 'Lemon Passionfruit Tart', desc: '', surcharge: null },
                { id: 'd-d3', name: 'Churros', desc: 'Kaya Dipping Sauce', surcharge: null },
                { id: 'd-d4', name: 'Chocolate Lava Cake', desc: '', surcharge: 4 },
                { id: 'd-d5', name: 'Gelato', desc: 'Brownie Â· Hazelnut Â· Caramel', surcharge: 2 },
            ],
        },
    ],
}

// ─── À La Carte data for pre-order ──────────────────────────────────────────────
const ALACARTE_FOOD = [
    { id: 'f-s1', name: 'Crispy Eggplant', desc: '', price: '$14', cat: 'Starters' },
    { id: 'f-s2', name: 'Brussels Sprouts', desc: '', price: '$14', cat: 'Starters' },
    { id: 'f-s3', name: 'Charred Watermelon', desc: '', price: '$12', cat: 'Starters' },
    { id: 'f-s4', name: 'Chicken Mid Wings', desc: '', price: '$16', cat: 'Starters' },
    { id: 'f-s5', name: 'Prawn Dumplings', desc: '', price: '$18', cat: 'Starters' },
    { id: 'f-s6', name: 'Soft Shell Crab', desc: '', price: '$18', cat: 'Starters' },
    { id: 'f-m1', name: 'NZ Ribeye 300g', desc: '', price: '$46', cat: 'Centrepiece' },
    { id: 'f-m2', name: 'Chicken Rice', desc: '', price: '$22', cat: 'Centrepiece' },
    { id: 'f-m3', name: 'Pan Seared Halibut', desc: '', price: '$28', cat: 'Centrepiece' },
    { id: 'f-m4', name: 'Char Kway Teow', desc: '', price: '$24', cat: 'Centrepiece' },
    { id: 'f-m5', name: 'Chicken Satay', desc: '', price: '$20', cat: 'Centrepiece' },
    { id: 'f-p1', name: 'Truffle Salted Egg Pasta', desc: '', price: '$20', cat: 'Pasta' },
    { id: 'f-p2', name: 'Miso Risotto', desc: '', price: '$20', cat: 'Pasta' },
    { id: 'f-p3', name: 'Braised Beef Fettuccine', desc: '', price: '$26', cat: 'Pasta' },
    { id: 'f-p4', name: 'Squid Ink Vongole', desc: '', price: '$26', cat: 'Pasta' },
    { id: 'f-d1', name: 'Chocolate Lava Cake', desc: '', price: '$16', cat: 'Desserts' },
    { id: 'f-d2', name: 'Lemon Passionfruit Tart', desc: '', price: '$12', cat: 'Desserts' },
    { id: 'f-d3', name: 'Coconut Panna Cotta', desc: '', price: '$12', cat: 'Desserts' },
    { id: 'f-d4', name: 'Churros', desc: '', price: '$12', cat: 'Desserts' },
    { id: 'f-d5', name: 'Gelato', desc: '', price: '$9', cat: 'Desserts' },
]

const ALACARTE_BEVERAGES = [
    { id: 'b-c1', name: 'Old Fashioned', desc: '', price: '$18', cat: 'Classics' },
    { id: 'b-c2', name: 'Aperol Spritz', desc: '', price: '$18', cat: 'Classics' },
    { id: 'b-c3', name: 'Moscow Mule', desc: '', price: '$18', cat: 'Classics' },
    { id: 'b-c4', name: 'Mojito', desc: '', price: '$18', cat: 'Classics' },
    { id: 'b-c5', name: 'Espresso Martini', desc: '', price: '$20', cat: 'Classics' },
    { id: 'b-c6', name: 'Negroni', desc: '', price: '$20', cat: 'Classics' },
    { id: 'b-s1', name: 'Golden Glow', desc: '', price: '$20', cat: 'Signatures' },
    { id: 'b-s2', name: 'Turkish Mojito', desc: '', price: '$20', cat: 'Signatures' },
    { id: 'b-s3', name: 'Seoulful Spritz', desc: '', price: '$22', cat: 'Signatures' },
    { id: 'b-s4', name: 'Mango Margs', desc: '', price: '$22', cat: 'Signatures' },
    { id: 'b-s5', name: 'Chilli Cha-Cha-Cha!', desc: '', price: '$24', cat: 'Signatures' },
    { id: 'b-w1', name: 'House Red Wine', desc: '', price: '$12', cat: 'Wine & Beer' },
    { id: 'b-w2', name: 'House White Wine', desc: '', price: '$12', cat: 'Wine & Beer' },
    { id: 'b-w3', name: 'Tiger Beer', desc: '', price: '$10', cat: 'Wine & Beer' },
    { id: 'b-w4', name: 'Heineken', desc: '', price: '$10', cat: 'Wine & Beer' },
]

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
        response: () => `Noted. And your preferred dining time? We offer lunch (11:30–13:30) and dinner (18:00–21:00).`,
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
        const [prixFixeSelections, setPrixFixeSelections] = useState({})
    const [preOrderStep, setPreOrderStep] = useState(0)
        const [preOrderMode, setPreOrderMode] = useState(null)        // null = not chosen yet
    const [alacarteTab, setAlacarteTab] = useState('food')        // 'food' | 'beverages'
    const [alacarteSelected, setAlacarteSelected] = useState(new Set())  // item ids
    const preOrderPanelRef = useRef(null)

    // Derive which set to show from the selected time
    const isLunchTime = formData.time && parseInt(formData.time) < 15
    const activeSet = formData.time ? (isLunchTime ? LUNCH_SET : DINNER_SET) : null

    // Prix fixe total
    const totalSurcharge = activeSet
        ? activeSet.steps.reduce((sum, step) => {
            const sel = prixFixeSelections[step.key]
            return sum + (sel?.surcharge ?? 0)
        }, 0)
        : 0
    const totalBase = activeSet ? activeSet.price : 0

    // À la carte total
    const alacarteItems = [...alacarteSelected].map(id =>
        [...ALACARTE_FOOD, ...ALACARTE_BEVERAGES].find(i => i.id === id)
    ).filter(Boolean)
    const alacarteTotal = alacarteItems.reduce((sum, i) => sum + parseInt(i.price.replace(/\D/g, '') || '0'), 0)

    const toggleAlacarteItem = (id) => {
        setAlacarteSelected(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const switchPreOrderMode = (modeVal) => {
        const el = preOrderPanelRef.current
        // If clicking the same mode again, turn off (hide menu)
        if (preOrderMode === modeVal) {
            if (el) {
                gsap.to(el, { opacity: 0, y: 10, duration: 0.2, ease: 'power2.in', onComplete: () => setPreOrderMode(null) })
            } else {
                setPreOrderMode(null)
            }
            return
        }

        if (!el) { setPreOrderMode(modeVal); return }

        gsap.to(el, {
            opacity: 0, y: 10, duration: 0.2, ease: 'power2.in',
            onComplete: () => {
                setPreOrderMode(modeVal)
                gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' })
            },
        })
    }

        const [messages, setMessages] = useState([])
    const [aiInput, setAiInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [aiStep, setAiStep] = useState(0)         // index into AI_FLOW
    const [aiStarted, setAiStarted] = useState(false)

        const chatPanelRef = useRef(null)
    const formPanelRef = useRef(null)
    const menuDrawerRef = useRef(null)
    const messagesEndRef = useRef(null)
    const aiInputRef = useRef(null)

    // Auto-scroll chat messages — only after AI chat has started
    useEffect(() => {
        if (messages.length > 0 || isTyping) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isTyping])

        useEffect(() => {
        if (mode === 'ai') {
            // Chat slides in from left
            gsap.fromTo(chatPanelRef.current,
                { x: '-100%', opacity: 0 },
                { x: '0%', opacity: 1, duration: 0.55, ease: 'power4.out' }
            )
            gsap.to(formPanelRef.current, {
                opacity: 0.35,
                duration: 0.4,
                ease: 'power3.out',
            })
        } else {
            // Chat slides back left, form gets full width + unlocked
            if (chatPanelRef.current) {
                gsap.to(chatPanelRef.current, {
                    x: '-100%', opacity: 0,
                    duration: 0.45, ease: 'power4.in',
                })
            }
            if (formPanelRef.current) {
                gsap.to(formPanelRef.current, {
                    opacity: 1, duration: 0.4, ease: 'power3.out',
                })
            }
        }
    }, [mode])

        const startAI = useCallback(() => {
        setMode('ai')
        if (!aiStarted) {
            setAiStarted(true)
            setIsTyping(true)
            setTimeout(() => {
                setIsTyping(false)
                setMessages([{ role: 'ai', text: AI_FLOW[0].response }])
                setAiStep(1)
            }, 900)
        }
        setTimeout(() => aiInputRef.current?.focus({ preventScroll: true }), 600)
    }, [aiStarted])

        const sendAI = useCallback((text) => {
        if (!text.trim()) return
        const userMsg = { role: 'user', text: text.trim() }
        setMessages(prev => [...prev, userMsg])
        setAiInput('')
        setIsTyping(true)

        const currentStep = AI_FLOW[aiStep]
        if (!currentStep) return

        // Fill the form field for this step
        const newForm = { ...formData }
        if (currentStep.field) newForm[currentStep.field] = text.trim()
        setFormData(newForm)

        const nextStep = Math.min(aiStep + 1, AI_FLOW.length - 1)
        const responseText = typeof currentStep.response === 'function'
            ? currentStep.response(text.trim(), newForm)
            : currentStep.response

        setTimeout(() => {
            setIsTyping(false)
            setMessages(prev => [...prev, { role: 'ai', text: responseText }])
            if (!currentStep.done) setAiStep(nextStep)
        }, 700 + Math.random() * 500)
    }, [aiStep, formData])

        const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (name === 'time') {
            setPrixFixeSelections({})
            setPreOrderStep(0)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        setTimeout(() => {
            setSubmitted(false)
            setFormData({ name: '', email: '', phone: '', date: '', time: '', guests: '', space: '', occasion: '', notes: '' })
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
                <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
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
                    gap: '2rem',
                    minHeight: '700px',
                }}
            >
                
                <div
                    ref={chatPanelRef}
                    style={{
                        position: mode === 'ai' ? 'relative' : 'absolute',
                        left: mode === 'ai' ? 'auto' : 0,
                        width: '60%',
                        flexShrink: 0,
                        transform: mode === 'ai' ? 'translateX(0)' : 'translateX(-110%)',
                        opacity: mode === 'ai' ? 1 : 0,
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
                                    style={{ whiteSpace: 'pre-line', maxWidth: '85%' }}
                                >
                                    {msg.text}
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
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input bar */}
                    <div
                        style={{
                            padding: '1rem 1.5rem',
                            borderTop: '1px solid rgba(201,168,76,0.12)',
                            display: 'flex', gap: '0.6rem', flexShrink: 0,
                        }}
                    >
                        <input
                            ref={aiInputRef}
                            className="chat-input-bar"
                            type="text"
                            placeholder="Type your answer…"
                            value={aiInput}
                            onChange={e => setAiInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAI(aiInput) } }}
                            style={{ flex: 1 }}
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
                        width: mode === 'form' ? '100%' : '40%',
                        margin: mode === 'form' ? '0 auto' : '0',
                        transition: 'max-width 0.5s ease, opacity 0.4s ease',
                        pointerEvents: isFormLocked ? 'none' : 'all',
                        position: 'relative',
                    }}
                >
                    {/* Locked overlay message */}
                    {isFormLocked && (
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                zIndex: 20,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                paddingTop: '2rem',
                                gap: '0.5rem',
                            }}
                        >
                            <div style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.6rem',
                                letterSpacing: '0.3em',
                                textTransform: 'uppercase',
                                color: 'var(--color-gold)',
                                opacity: 0.8,
                            }}>
                                AI is completing your form
                            </div>
                            <div style={{ color: 'rgba(201,168,76,0.4)', fontSize: '0.75rem', fontStyle: 'italic', fontFamily: 'var(--font-elegant)' }}>
                                Fields update live as you chat →
                            </div>
                        </div>
                    )}

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
                                gridTemplateColumns: mode === 'form' ? '1fr 1fr' : '1fr',
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
                                <Field label="Phone Number">
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                        placeholder="+65 XXXX XXXX" disabled={isFormLocked}
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
                                <Field label="Preferred Seating">
                                    <select name="space" value={formData.space} onChange={handleChange}
                                        disabled={isFormLocked}
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
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                                    <div>
                                        <div style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(201,168,76,0.85)" }}>
                                            ✦ Pre-order (Optional)
                                        </div>
                                        <div style={{ fontFamily: "var(--font-elegant)", fontSize: "1rem", color: "var(--color-cream)", fontStyle: "italic", marginTop: "0.2rem" }}>
                                            Let the kitchen prepare your selections in advance
                                        </div>
                                    </div>
                                    {(alacarteSelected.size > 0 || Object.keys(prixFixeSelections).length > 0) && (
                                        <button type="button"
                                            onClick={() => { setPrixFixeSelections({}); setPreOrderStep(0); setAlacarteSelected(new Set()) }}
                                            style={{ fontFamily: "var(--font-display)", fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", background: "transparent", border: "1px solid rgba(245,240,232,0.15)", padding: "0.4rem 0.85rem", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}
                                            onMouseEnter={e => { e.target.style.color = "rgba(245,240,232,0.7)"; e.target.style.borderColor = "rgba(245,240,232,0.35)" }}
                                            onMouseLeave={e => { e.target.style.color = "rgba(245,240,232,0.35)"; e.target.style.borderColor = "rgba(245,240,232,0.15)" }}
                                        >✕ Clear All</button>
                                    )}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.2rem' }}>
                                    {[
                                        { id: 'set', label: 'Set Experience', sub: activeSet ? `${activeSet.label} · $${activeSet.price}++` : 'Select time first' },
                                        { id: 'alacarte', label: 'Browse Alacarte', sub: 'Order freely from full menu' },
                                    ].map(opt => {
                                        const isActive = preOrderMode === opt.id
                                        return (
                                            <button key={opt.id} type="button"
                                                disabled={isFormLocked || (opt.id === 'set' && !formData.time)}
                                                onClick={() => switchPreOrderMode(opt.id)}
                                                style={{ padding: '0.85rem 1rem', textAlign: 'left', background: isActive ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.02)', border: isActive ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', transition: 'all 0.22s ease', cursor: (isFormLocked || (opt.id === 'set' && !formData.time)) ? 'not-allowed' : 'pointer', opacity: (opt.id === 'set' && !formData.time) ? 0.4 : 1 }}
                                            >
                                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: isActive ? 'var(--color-gold)' : 'rgba(245,240,232,0.5)', marginBottom: '0.3rem' }}>
                                                    {isActive && '✓ '}{opt.label}
                                                </div>
                                                <div style={{ fontFamily: 'var(--font-elegant)', fontSize: '0.9rem', color: 'var(--color-cream)', fontStyle: 'italic' }}>{opt.sub}</div>
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Suggestion banner */}
                                {!preOrderMode && formData.time && (
                                    <div style={{ padding: '0.7rem 1rem', marginBottom: '1rem', background: 'rgba(201,168,76,0.06)', border: '1px dashed rgba(201,168,76,0.25)', borderRadius: '3px', fontFamily: 'var(--font-elegant)', fontSize: '0.82rem', color: 'rgba(245,240,232,0.5)', fontStyle: 'italic' }}>
                                        ✦ We suggest the <strong style={{ color: 'var(--color-gold)', fontStyle: 'normal' }}>{activeSet?.label}</strong> for your {isLunchTime ? 'midday' : 'evening'} visit.
                                    </div>
                                )}

                                {/* No time selected — gate for set mode */}
                                {!formData.time && !preOrderMode && (
                                    <div style={{ padding: '1.5rem', border: '1px dashed rgba(201,168,76,0.18)', textAlign: 'center', borderRadius: '3px' }}>
                                        <div style={{ fontFamily: 'var(--font-elegant)', fontSize: '0.85rem', color: 'rgba(245,240,232,0.3)', fontStyle: 'italic' }}>
                                            Select a dining time above to unlock set menu pre-ordering
                                        </div>
                                    </div>
                                )}

                                {/* Mode panels */}
                                <div ref={preOrderPanelRef}>

                                    {/* SET EXPERIENCE MODE */}
                                    {preOrderMode === 'set' && activeSet && (
                                        <>
                                            {/* Step progress */}
                                            <div style={{ display: 'flex', gap: '0', marginBottom: '1.25rem' }}>
                                                {activeSet.steps.map((step, idx) => {
                                                    const done = !!prixFixeSelections[step.key]
                                                    const active = idx === preOrderStep
                                                    return (
                                                        <button key={step.key} type="button" onClick={() => setPreOrderStep(idx)}
                                                            style={{ flex: 1, padding: '0.5rem 0.25rem', background: done ? 'rgba(201,168,76,0.15)' : active ? 'rgba(201,168,76,0.07)' : 'transparent', border: 'none', borderBottom: done ? '2px solid var(--color-gold)' : active ? '2px solid rgba(201,168,76,0.5)' : '2px solid rgba(201,168,76,0.15)', cursor: 'pointer', transition: 'all 0.25s' }}
                                                        >
                                                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.45rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: done ? 'var(--color-gold)' : active ? 'rgba(201,168,76,0.7)' : 'rgba(245,240,232,0.25)' }}>
                                                                {done ? '✓ ' : `${idx + 1}. `}{step.label.replace('Choose Your ', '').replace('Choose ', '')}
                                                            </div>
                                                        </button>
                                                    )
                                                })}
                                            </div>

                                            {/* Step label */}
                                            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--color-cream)', fontStyle: 'italic', marginBottom: '0.85rem' }}>
                                                {activeSet.steps[preOrderStep]?.label}
                                            </div>

                                            {/* Selection cards */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
                                                {activeSet.steps[preOrderStep]?.items.map(item => {
                                                    const isSelected = prixFixeSelections[activeSet.steps[preOrderStep].key]?.id === item.id
                                                    return (
                                                        <button key={item.id} type="button" disabled={isFormLocked}
                                                            onClick={() => {
                                                                const stepKey = activeSet.steps[preOrderStep].key
                                                                setPrixFixeSelections(prev => ({ ...prev, [stepKey]: item }))
                                                                if (preOrderStep < activeSet.steps.length - 1) setTimeout(() => setPreOrderStep(s => s + 1), 220)
                                                            }}
                                                            style={{ position: 'relative', textAlign: 'left', padding: '0.85rem 0.9rem', background: isSelected ? 'rgba(201,168,76,0.14)' : 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)', border: isSelected ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', transition: 'all 0.22s ease', cursor: isFormLocked ? 'default' : 'pointer', opacity: isFormLocked ? 0.6 : 1 }}
                                                            onMouseEnter={e => { if (!isSelected && !isFormLocked) e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)' }}
                                                            onMouseLeave={e => { if (!isSelected && !isFormLocked) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                                                        >
                                                            {isSelected && (
                                                                <div style={{ position: 'absolute', top: '0.5rem', right: '0.6rem', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: '#0d0b08' }}>✓</div>
                                                            )}
                                                            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: isSelected ? 'var(--color-gold)' : 'var(--color-cream)', paddingRight: '1.25rem', lineHeight: 1.3, marginBottom: item.desc ? '0.3rem' : 0 }}>{item.name}</div>
                                                            {item.desc && <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'rgba(245,240,232,0.38)', lineHeight: 1.4 }}>{item.desc}</div>}
                                                            {item.surcharge && <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.6rem', fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'var(--color-gold)' }}>+${item.surcharge}</div>}
                                                        </button>
                                                    )
                                                })}
                                            </div>

                                            {/* Prev / Next */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <button type="button" onClick={() => setPreOrderStep(s => Math.max(0, s - 1))} disabled={preOrderStep === 0}
                                                    style={{ fontFamily: 'var(--font-display)', fontSize: '0.48rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: preOrderStep === 0 ? 'rgba(245,240,232,0.15)' : 'rgba(245,240,232,0.45)', background: 'transparent', border: 'none', cursor: preOrderStep === 0 ? 'default' : 'pointer' }}
                                                >← Previous</button>
                                                <button type="button" onClick={() => setPreOrderStep(s => Math.min(activeSet.steps.length - 1, s + 1))} disabled={preOrderStep === activeSet.steps.length - 1}
                                                    style={{ fontFamily: 'var(--font-display)', fontSize: '0.48rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: preOrderStep === activeSet.steps.length - 1 ? 'rgba(245,240,232,0.15)' : 'var(--color-gold)', background: 'transparent', border: 'none', cursor: preOrderStep === activeSet.steps.length - 1 ? 'default' : 'pointer' }}
                                                >Next →</button>
                                            </div>
                                        </>
                                    )}

                                    {/* À LA CARTE MODE */}
                                    {preOrderMode === 'alacarte' && (
                                        <>
                                            {/* Food / Beverages tab */}
                                            <div style={{ display: 'flex', gap: '0', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '2px', overflow: 'hidden', marginBottom: '1.25rem', width: 'fit-content' }}>
                                                {['food', 'beverages'].map(t => (
                                                    <button key={t} type="button" onClick={() => setAlacarteTab(t)}
                                                        style={{ padding: '0.75rem 1.6rem', fontFamily: 'var(--font-display)', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: alacarteTab === t ? 'var(--color-gold)' : 'rgba(245,240,232,0.35)', background: alacarteTab === t ? 'rgba(201,168,76,0.1)' : 'transparent', border: 'none', borderRight: '1px solid rgba(201,168,76,0.15)', cursor: 'pointer', transition: 'all 0.2s' }}
                                                    >{t === 'food' ? '🍽 Food' : '🍷 Beverages'}</button>
                                                ))}
                                            </div>

                                            {/* Items by category */}
                                            {(() => {
                                                const allItems = alacarteTab === 'food' ? ALACARTE_FOOD : ALACARTE_BEVERAGES
                                                const cats = [...new Set(allItems.map(i => i.cat))]
                                                return cats.map(cat => (
                                                    <div key={cat} style={{ marginBottom: '1.4rem' }}>
                                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '0.75rem', paddingBottom: '0.4rem', borderBottom: '1px solid rgba(201,168,76,0.3)' }}>{cat}</div>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.1rem 1rem' }}>
                                                            {allItems.filter(i => i.cat === cat).map(item => {
                                                                const isSel = alacarteSelected.has(item.id)
                                                                return (
                                                                    <button key={item.id} type="button" disabled={isFormLocked}
                                                                        onClick={() => !isFormLocked && toggleAlacarteItem(item.id)}
                                                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.75rem', padding: '0.55rem 0', background: 'transparent', border: 'none', borderBottom: isSel ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(255,255,255,0.05)', cursor: isFormLocked ? 'default' : 'pointer', opacity: isFormLocked ? 0.5 : 1, textAlign: 'left', transition: 'all 0.18s' }}
                                                                    >
                                                                        <div>
                                                                            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: isSel ? 'var(--color-gold)' : 'rgba(245,240,232,0.75)', textDecoration: isSel ? 'underline' : 'none', textDecorationColor: 'rgba(201,168,76,0.45)', textUnderlineOffset: '4px', lineHeight: 1.3, transition: 'color 0.18s' }}>
                                                                                {isSel && '✦ '}{item.name}
                                                                            </div>
                                                                            {item.desc && <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)', marginTop: '0.1rem' }}>{item.desc}</div>}
                                                                        </div>
                                                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: isSel ? 'var(--color-gold)' : 'rgba(245,240,232,0.3)', flexShrink: 0, transition: 'color 0.18s' }}>{item.price}</div>
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                ))
                                            })()}
                                        </>
                                    )}
                                </div>

                                {/* SUMMARY BAR */}
                                {(() => {
                                    const setItems = preOrderMode === 'set' && activeSet
                                        ? activeSet.steps.map(s => prixFixeSelections[s.key]).filter(Boolean)
                                        : []
                                    const acItems = preOrderMode === 'alacarte' ? alacarteItems : []
                                    const allSelected = [...setItems, ...acItems]
                                    if (!allSelected.length) return null
                                    const grandTotal = preOrderMode === 'set' ? `$${totalBase + totalSurcharge}++` : `$${alacarteTotal}`
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
                                            {allSelected.map((item) => (
                                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', padding: '0.4rem 0', borderBottom: '1px dashed rgba(201,168,76,0.1)' }}>
                                                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-cream)' }}>{item.name}</span>
                                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--color-gold)', flexShrink: 0 }}>
                                                        {item.surcharge ? `+$${item.surcharge}` : (item.price || '')}
                                                    </span>
                                                </div>
                                            ))}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '1rem' }}>
                                                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.6)' }}>Estimated Total</span>
                                                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-gold)', fontStyle: 'italic' }}>{grandTotal}</span>
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

            
            <div
                style={{
                    maxWidth: '1280px', margin: '0 auto 0',
                    padding: '0 2rem 5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.25rem',
                    flexWrap: 'wrap',
                }}
            >
                {mode === 'form' && (
                    <button
                        onClick={startAI}
                        className="btn-gold"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            animation: 'aiGlow 2.8s ease-in-out infinite',
                        }}
                    >
                        <span style={{ fontSize: '0.9rem' }}>✦</span>
                        Use AI to Reserve
                    </button>
                )}

                <button
                    onClick={() => {
                        setMenuOpen(o => !o)
                        if (!menuOpen) {
                            setTimeout(() => {
                                menuDrawerRef.current && gsap.fromTo(menuDrawerRef.current,
                                    { opacity: 0, y: 20 },
                                    { opacity: 1, y: 0, duration: 0.45, ease: 'power4.out' }
                                )
                            }, 10)
                        }
                    }}
                    className="btn-outline-gold"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {menuOpen ? 'Hide Menu' : 'View Tonight\'s Menu'}
                </button>

                <button
                    onClick={() => navigate('/')}
                    style={{
                        fontFamily: 'var(--font-display)', fontSize: '0.55rem',
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: 'rgba(245,240,232,0.35)',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => { e.target.style.color = 'rgba(245,240,232,0.7)' }}
                    onMouseLeave={e => { e.target.style.color = 'rgba(245,240,232,0.35)' }}
                >
                    Back to Homepage
                </button>
            </div>

            {menuOpen && (
                <div
                    ref={menuDrawerRef}
                    style={{
                        maxWidth: '1280px', margin: '0 auto',
                        padding: '0 2rem 5rem',
                        opacity: 0,
                    }}
                >
                    <div style={{
                        border: '1px solid rgba(201,168,76,0.15)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            padding: '1rem 1.5rem',
                            background: 'rgba(201,168,76,0.04)',
                            borderBottom: '1px solid rgba(201,168,76,0.1)',
                        }}>
                            <div style={{
                                fontFamily: 'var(--font-display)', fontSize: '0.62rem',
                                letterSpacing: '0.3em', textTransform: 'uppercase',
                                color: 'var(--color-gold)',
                            }}>
                                ✦ Tonight's Menu — À La Carte
                            </div>
                        </div>
                        <div style={{
                            padding: '1.5rem',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                            gap: '0',
                        }}>
                            {DINNER_SET.steps.map(step => (
                                <div key={step.key} style={{ padding: '0.5rem 1rem 1rem' }}>
                                    <div style={{
                                        fontFamily: 'var(--font-display)', fontSize: '0.55rem',
                                        letterSpacing: '0.3em', textTransform: 'uppercase',
                                        color: 'rgba(201,168,76,0.6)', marginBottom: '0.75rem',
                                        paddingBottom: '0.5rem',
                                        borderBottom: '1px solid rgba(201,168,76,0.1)',
                                    }}>{step.label.replace('Choose Your ', '')}</div>
                                    {step.items.map(item => (
                                        <div key={item.id} style={{
                                            display: 'flex', justifyContent: 'space-between',
                                            alignItems: 'baseline', gap: '1rem',
                                            padding: '0.5rem 0',
                                            borderBottom: '1px dashed rgba(201,168,76,0.07)',
                                        }}>
                                            <span style={{
                                                fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                                                color: 'rgba(245,240,232,0.75)',
                                            }}>{item.name}</span>
                                            <span style={{
                                                fontFamily: 'var(--font-elegant)', fontSize: '0.88rem',
                                                color: 'var(--color-gold)', fontStyle: 'italic', flexShrink: 0,
                                            }}>{item.surcharge ? `+$${item.surcharge}` : ''}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div style={{
                            padding: '1rem 1.5rem',
                            borderTop: '1px solid rgba(201,168,76,0.1)',
                            textAlign: 'center',
                        }}>
                            <button
                                onClick={() => navigate('/menu')}
                                className="btn-outline-gold"
                                style={{ fontSize: '0.55rem' }}
                            >
                                View Full Menu →
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
