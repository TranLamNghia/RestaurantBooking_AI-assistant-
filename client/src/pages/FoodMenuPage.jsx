import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const menuData = {
    food: {
        label: 'Food',
        sections: [
            {
                heading: 'Something to Start',
                subCategory: null,
                items: [
                    { name: 'Crispy Eggplant', desc: 'Sweet Thai Chilli Sauce | Greek Yoghurt | Paprika | Fried Shallots', price: '$14' },
                    { name: 'Brussels Sprouts', desc: 'Szechuan Sauce | Cashew Nuts', price: '$14' },
                    { name: 'Charred Watermelon', desc: 'Homemade Paneer | Romesco Sauce | Crushed Pistachio | Balsamic Pearls', price: '$12' },
                    { name: 'Chicken Mid Wings', desc: 'Choice of Korean or Soy Honey', price: '$16' },
                    { name: 'Prawn Dumplings', desc: 'Homemade Prawn Dumplings | Water Chestnut | Coriander | Spicy Coconut Broth', price: '$18' },
                    { name: 'Soft Shell Crab', desc: 'Singapore Chilli Crab Sauce | Fried Mantou', price: '$18' },
                    { name: 'Sticky Pork Ribs', desc: 'Hoisin Glaze | Sesame Seeds | Pickled Cabbage', price: '$18' },
                ],
            },
            {
                heading: 'Centrepiece',
                subCategory: null,
                items: [
                    { name: 'NZ Ribeye 300g', desc: 'Vine-ripe Tomatoes | Baby Potatoes | Pickled Cabbage | Jeow Som Dressing', price: '$46' },
                    { name: 'Chicken Rice', desc: 'Poached Chicken Breast | Bok Choy | Fragrant Rice | Homemade Chilli & Ginger Shallot Sauce · Add on: Crispy Pork Belly +$5', price: '$22' },
                    { name: 'Pan Seared Halibut', desc: 'White Clams | Saffron Cream Sauce | Charred Bok Choy | Cherry Tomatoes', price: '$28' },
                    { name: 'Char Kway Teow', desc: 'Crayfish | Clams | Noodles | Garlic | Eggs | Beansprouts | Garlic Chives | Fried Shallots', price: '$24' },
                    { name: 'Chicken Satay', desc: 'Turmeric Spiced Chicken | Homemade Peanut Sauce | Polenta Chips', price: '$20 / $30' },
                ],
            },
            {
                heading: 'Pasta Selections',
                subCategory: null,
                items: [
                    { name: 'Truffle Salted Egg Pasta', desc: 'Mixed Mushrooms | Chilli | Curry Leaves | Cream | Truffle Oil | Parmesan | Fried Shallots', price: '$20' },
                    { name: 'Miso Risotto', desc: 'Edamame | Broccoli | Shiitake Mushrooms | Spring Onion | Sous-vide Egg', price: '$20' },
                    { name: 'Braised Beef Fettuccine', desc: '12-hour Braised Five-spice Beef | Parmesan Cheese | Fried Shallots', price: '$26' },
                    { name: 'Squid Ink Vongole', desc: 'Clams | White Wine | Chilli | Parsley', price: '$26' },
                ],
            },
            {
                heading: 'Baos — Served in Lotus Leaf Buns',
                subCategory: null,
                items: [
                    { name: 'Fish Bao', desc: 'Breaded Fish Fillet | Spicy Mayo | Carrot | Pickled Cabbage | Jalapeño', price: '$8 / $14' },
                    { name: 'Pork Bao', desc: 'Twice-cooked Pork Belly | Hoisin Mayo', price: '$8 / $14' },
                    { name: 'Tofu Bao', desc: 'Breaded Tofu | Lao Gan Ma Mayo | Carrot | Cucumber | Pickled Cabbage', price: '$8 / $14' },
                ],
            },
            {
                heading: 'Sidepiece',
                subCategory: null,
                items: [
                    { name: 'Truffle Fries', desc: 'Truffle Oil | Parmesan Cheese', price: '$12' },
                    { name: 'Mentaiko Fries', desc: 'Mentaiko Mayo | Bonito Flakes', price: '$12' },
                    { name: 'Polenta Fries', desc: '', price: '$10' },
                    { name: 'Rosemary Baby Potatoes', desc: 'Served with Aioli', price: '$10' },
                    { name: 'Fried Mantou', desc: '3 pieces', price: '$3' },
                    { name: 'Steamed Jasmine Rice', desc: '', price: '$2' },
                    { name: 'Fragrant Rice', desc: '', price: '$5' },
                ],
            },
            {
                heading: 'Something Sweet',
                subCategory: null,
                items: [
                    { name: 'Chocolate Lava Cake', desc: '', price: '$16' },
                    { name: 'Lemon Passionfruit Tart', desc: '', price: '$12' },
                    { name: 'Coconut Panna Cotta', desc: '', price: '$12' },
                    { name: 'Gelato', desc: 'Choc Brownie | Hazelnut | Sweet Smurfs | Caramel Latte', price: '$9' },
                    { name: 'Churros', desc: 'Kaya Dipping Sauce', price: '$12' },
                ],
            },
        ],
    },
    beverages: {
        label: 'Beverages',
        sections: [
            {
                heading: 'Cocktails',
                subCategory: 'Classics',
                items: [
                    { name: 'Old Fashioned', desc: 'Bourbon | Sugar | Angostura Bitters', price: '$18' },
                    { name: 'Aperol Spritz', desc: 'Aperol | Prosecco | Soda', price: '$18' },
                    { name: 'Moscow Mule', desc: 'Vodka | Ginger Beer | Lime', price: '$18' },
                    { name: 'Mojito', desc: 'Rum | Mint Leaves | Sugar | Soda | Lime', price: '$18' },
                    { name: 'Espresso Martini', desc: 'Vodka | Kahlua | Espresso', price: '$20' },
                    { name: 'Negroni', desc: 'Gin | Campari | Sweet Vermouth', price: '$20' },
                    { name: 'Margarita', desc: 'Tequila | Triple Sec | Lime | Sugar', price: '$20' },
                    { name: 'Cosmopolitan', desc: 'Vodka | Triple Sec | Cranberry', price: '$20' },
                    { name: 'Manhattan', desc: 'Bourbon | Vermouth | Angostura Bitters', price: '$20' },
                    { name: 'Gin / Vodka Martini', desc: 'Gin / Vodka | Dry Vermouth', price: '$20' },
                    { name: 'Long Island Iced Tea', desc: 'Gin | Vodka | Rum | Tequila | Triple Sec | Lime | Sugar | Cola', price: '$22' },
                    { name: 'Whisky Sour', desc: 'Bourbon | Egg White | Lemon | Sugar | Bitters', price: '$22' },
                ],
            },
            {
                heading: 'Cocktails',
                subCategory: 'Signatures',
                items: [
                    { name: 'Golden Glow', desc: 'Vodka | Elderflower Liqueur | Chrysanthemum Tea | Fresh Lime', price: '$20' },
                    { name: 'Turkish Mojito', desc: 'Rum | Mint | Pomegranate Syrup | Fresh Lime', price: '$20' },
                    { name: 'Seoulful Spritz', desc: 'Aperol | Prosecco | Yuzu Soju | Soda', price: '$22' },
                    { name: 'Mango Margs', desc: 'Tequila | Mango Juice | Togarashi Syrup | Lime', price: '$22' },
                    { name: 'Bandung-Me-Up!', desc: 'Bandung Soju | Frangelico | Rose Syrup | Condensed Milk | Cream', price: '$24' },
                    { name: 'Chilli Cha-Cha-Cha!', desc: 'Gin | Orange Juice | Chilli Padi | Passionfruit', price: '$24' },
                    { name: 'Iced Tea', desc: 'Gin | Vodka | Tequila | Triple Sec | Malibu | Coke | Lime', price: '$24' },
                ],
            },
            {
                heading: 'Liquor',
                subCategory: 'Gin',
                items: [
                    { name: 'Gordon\'s Gin', desc: '', price: '$12 / $98' },
                    { name: 'Hendrick\'s Gin', desc: '', price: '$16 / $108' },
                ],
            },
            {
                heading: 'Liquor',
                subCategory: 'Vodka',
                items: [
                    { name: 'Smirnoff Vodka', desc: '', price: '$12 / $98' },
                    { name: 'Belvedere Vodka', desc: '', price: '$16 / $108' },
                ],
            },
            {
                heading: 'Liquor',
                subCategory: 'Rum',
                items: [
                    { name: 'Bacardi Rum', desc: '', price: '$12 / $98' },
                    { name: 'Capt. Morgan Spiced Rum', desc: '', price: '$16 / $108' },
                ],
            },
            {
                heading: 'Liquor',
                subCategory: 'Bourbon',
                items: [
                    { name: 'Jim Beam White', desc: '', price: '$12 / $98' },
                    { name: 'Eagle Rare 10 Years', desc: '', price: '$16' },
                    { name: 'Sazerac Rye', desc: '', price: '$18' },
                ],
            },
            {
                heading: 'Liquor',
                subCategory: 'Tequila',
                items: [
                    { name: 'Jose Cuervo Especial Gold', desc: '', price: '$12 / $108' },
                ],
            },
            {
                heading: 'Liquor',
                subCategory: 'Whiskey',
                items: [
                    { name: 'Johnnie Walker Black Label', desc: '', price: '$12 / $98' },
                    { name: 'Jameson', desc: '', price: '$14' },
                    { name: 'Glenfiddich 12 Years', desc: '', price: '$18' },
                    { name: 'Glenlivet 15 Years', desc: '', price: '$20' },
                    { name: 'Johnnie Walker Gold Label', desc: '', price: '$22' },
                ],
            },
            {
                heading: 'Liquor',
                subCategory: 'Aperities',
                items: [
                    { name: 'Aperol', desc: '', price: '$12' },
                    { name: 'Campari', desc: '', price: '$12' },
                    { name: 'Bailey\'s', desc: '', price: '$12' },
                    { name: 'Frangelico', desc: '', price: '$12' },

                ],
            },
            {
                heading: 'Beer',
                subCategory: 'Draught',
                items: [
                    { name: 'Asahi Draught', desc: '', price: '$11 / $15' },
                ],
            },
            {
                heading: 'Beer',
                subCategory: 'Bottled',
                items: [
                    { name: 'Heineken', desc: '', price: '$12' },
                    { name: 'Corona', desc: '', price: '$12' },
                ],
            },
            {
                heading: 'Wine',
                subCategory: 'Bubbles',
                items: [
                    { name: 'Piccini 1882 Spumante N.V.', desc: 'Citrus & tropical fruit | Glera · Venezia, Italy', price: '$19 / $98' },
                    { name: 'Remi Couvreur', desc: 'Almond, yeasts, green apple | Pinot Noir, Chardonnay · Champagne, France', price: '$128' },
                    { name: 'Solessence Rosé Extra Brut NV', desc: 'Pomegranate, grapefruit, brioche | Chardonnay, Pinot Noir · Champagne, France', price: '$138' },
                ],
            },
            {
                heading: 'Wine',
                subCategory: 'Whites',
                items: [
                    { name: 'Santa Helena Sauvignon Blanc', desc: 'Tomato leaf, fresh tropical fruits · Central Valley, Chile', price: '$19 / $75' },
                    { name: 'Fantini Pinot Grigio', desc: 'Peach, grapefruit, lemon-lime | Abruzzo, Italy 2023', price: '$19 / $90' },
                    { name: 'Adler Schnabel Pinot Bianco', desc: 'Floral, green apples, mineral finish | Trentino, Italy 2021', price: '$108' },
                    { name: 'Roberto Sarotto Gavi di Gavi', desc: 'White peach, stone fruit, honeydew | Piedmont, Italy 2022', price: '$118' },
                    { name: 'Chateau Lestignac Blanc NiX', desc: 'Citrus & earth, floral sweetness, hint of cocoa | Perigord, France 2019', price: '$118' },
                ],
            },
            {
                heading: 'Wine',
                subCategory: 'Reds',
                items: [
                    { name: 'Santa Helena Varietal Merlot', desc: 'Plum, light spice, chocolate | Central Valley, Chile 2023', price: '$19 / $75' },
                    { name: 'Vigna Madre Kriya Bio', desc: 'Organic · Blackcurrant, cedar, well balanced | Abruzzo, Italy 2021', price: '$19 / $90' },
                    { name: 'Lake Breeze Bull Ant', desc: 'Red cherry, floral, earthy minerality | Shiraz · Langhorne Creek, Australia 2022', price: '$98' },
                    { name: 'Michel Lynch Merlot-Cabernet', desc: 'Black cherry, blackcurrant, black pepper | Bordeaux, France 2020', price: '$108' },
                    { name: 'Tenuta Sant\'Anna Amarone della Valpolicella', desc: 'Full-bodied, intense | Corvina, Molinara · Veneto, Italy 2020', price: '$138' },
                ],
            },
            {
                heading: 'Coffee/Tea',
                subCategory: 'Classic Coffee',
                items: [
                    { name: 'Espresso', desc: '', price: '$4' },
                    { name: 'Double Espresso', desc: '', price: '$5' },
                    { name: 'Americano', desc: '', price: '$5' },
                    { name: 'Flat White', desc: '', price: '$5' },
                    { name: 'Latte', desc: '', price: '$5' },
                    { name: 'Cappuccino', desc: '', price: '$5' },
                    { name: 'Mocha', desc: '', price: '$5' },
                    { name: 'Macchiato', desc: '', price: '$5' },
                    { name: 'Double Macchiato', desc: '', price: '$6' },
                ],
            },
            {
                heading: 'Coffee/Tea',
                subCategory: 'Specialty Coffee',
                items: [
                    { name: 'Hazelnut Kopi', desc: 'Nanyang Black Coffee | Hazelnut | Steamed Milk', price: '$8' },
                    { name: 'Dolce Latte (Hot / Cold)', desc: 'Dolce Syrup | Espresso | Fresh Milk', price: '$8' },
                    { name: 'Coconut Latte (Hot / Cold)', desc: 'Coconut Milk | Espresso | Fresh Milk', price: '$8' },
                ],
            },
            {
                heading: 'Coffee/Tea',
                subCategory: 'Classic Tea',
                items: [
                    { name: 'English Breakfast', desc: '', price: '$5' },
                    { name: 'Earl Grey', desc: '', price: '$5' },
                    { name: 'Peppermint', desc: '', price: '$5' },
                    { name: 'Green Tea', desc: '', price: '$5' },
                    { name: 'Chamomile', desc: '', price: '$5' },
                ],
            },
            {
                heading: 'Coffee/Tea',
                subCategory: 'Specialty Tea',
                items: [
                    { name: 'Spiced Chai Latte (Hot / Cold)', desc: 'Spiced Chai Tea | Fresh Milk | Cinnamon', price: '$8' },
                    { name: 'Minty Lemon Tea', desc: 'Black Tea | Lemon Juice | Mint Leaves', price: '$8' },
                    { name: 'Golden Earl Tea', desc: 'Black Tea | Orange Juice | Grenadine | Soda', price: '$8' },
                ],
            },
            {
                heading: 'No alcohol',
                subCategory: 'Mocktails',
                items: [
                    { name: 'Tokyo Lemonade', desc: 'Strawberry Calpis | Sprite', price: '$12' },
                    { name: 'Mango Tango', desc: 'Mango Juice | Sprite | Whipped Cream', price: '$12' },
                    { name: 'Citrus Blush', desc: 'Orange | Apple | Cranberry Juice | Blueberry | Lemon | Soda', price: '$12' },
                ],
            },
            {
                heading: 'No alcohol',
                subCategory: 'Milkshakes',
                items: [
                    { name: 'Lava Chip Milkshake', desc: 'Chocolate | Chocolate Chips | Fresh Milk', price: '$10' },
                    { name: 'Very Strawberry Milkshake', desc: 'Strawberry | Yogurt | Fresh Milk', price: '$10' },
                ],
            },
            {
                heading: 'No alcohol',
                subCategory: 'Juices',
                items: [
                    { name: 'Orange Juice', desc: '', price: '$5' },
                    { name: 'Mango Juice', desc: '', price: '$5' },
                    { name: 'Apple Juice', desc: '', price: '$5' },
                    { name: 'Pineapple Juice', desc: '', price: '$5' },
                    { name: 'Cranberry Juice', desc: '', price: '$5' },
                ],
            },
            {
                heading: 'No alcohol',
                subCategory: 'Soft Drinks',
                items: [
                    { name: 'Coke', desc: '', price: '$5' },
                    { name: 'Coke Zero', desc: '', price: '$5' },
                    { name: 'Soda', desc: '', price: '$5' },
                    { name: 'Sprite', desc: '', price: '$5' },
                    { name: 'Ginger Ale', desc: '', price: '$5' },
                    { name: 'Tonic', desc: '', price: '$5' },
                ],
            },
            {
                heading: 'No alcohol',
                subCategory: 'Bottled Water',
                items: [
                    { name: 'Eira Still Water', desc: '', price: '$8' },
                    { name: 'Eira Sparkling Water', desc: '', price: '$8' },
                ],
            },
        ],
    },
}

const tabs = [
    { id: 'food', label: 'Food' },
    { id: 'beverages', label: 'Beverages' },
]

const TumblerIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8l1 12c.1.9 1 1.5 2 1.5h8c1 0 1.9-.6 2-1.5l1-12"></path>
        <path d="M4 8h16"></path>
        <path d="M9 12h2v2H9z"></path>
        <path d="M13 14h2v2h-2z"></path>
        <path d="M12 9A3 3 0 009 6a3 3 0 013-3"></path>
    </svg>
)

const WineGlassIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15v6"></path>
        <path d="M9 21h6"></path>
        <path d="M5 7c0 4.4 3.6 8 7 8s7-3.6 7-8-3.1-5-7-5-7 .6-7 5z"></path>
        <path d="M5 7h14"></path>
        <path d="M7 11c1.5 1 3 1 5 0s3.5-1 5 0"></path>
    </svg>
)

const BottleIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', paddingBottom: '0.2rem', fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'rgba(201,168,76,0.5)', letterSpacing: '0.1em', fontWeight: 600 }}>300ML</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', paddingBottom: '0.2rem', fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'rgba(201,168,76,0.5)', letterSpacing: '0.1em', fontWeight: 600 }}>500ML</div>
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', paddingBottom: '0.25rem', color: 'rgba(201,168,76,0.45)' }}><LeftIcon /></div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', paddingBottom: '0.25rem', color: 'rgba(201,168,76,0.45)' }}><RightIcon /></div>
            </>
        )
    }

    return null;
}

export default function FoodMenuPage() {
    const location = useLocation()
    // Read initial tab from router state (passed by navigate('/menu', { state: { tab } }))
    // Falls back to 'food'. URL stays clean — no ?tab= query param.
    const [activeTab, setActiveTab] = useState(() => location.state?.tab || 'food')
    const contentRef = useRef(null)

    const handleTabChange = (tab) => {
        gsap.to(contentRef.current, {
            opacity: 0,
            y: 10,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => {
                setActiveTab(tab)
                gsap.to(contentRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                })
            },
        })
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const data = menuData[activeTab]

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-dark)', color: 'var(--color-cream)' }}>
            <Navbar />

            {/* Hero */}
            <div
                style={{
                    paddingTop: '120px',
                    paddingBottom: '4rem',
                    textAlign: 'center',
                    borderBottom: '1px solid rgba(201,168,76,0.12)',
                    background: 'linear-gradient(to bottom, rgba(13,11,8,1) 0%, rgba(26,20,12,1) 100%)',
                }}
            >
                {/* Decorative bordered frame */}
                <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2.5rem 2rem', border: '1px solid rgba(201,168,76,0.22)', position: 'relative' }}>
                    {/* Corner accents */}
                    {[
                        { top: '-6px', left: '-6px', borderTop: '2px solid', borderLeft: '2px solid' },
                        { top: '-6px', right: '-6px', borderTop: '2px solid', borderRight: '2px solid' },
                        { bottom: '-6px', left: '-6px', borderBottom: '2px solid', borderLeft: '2px solid' },
                        { bottom: '-6px', right: '-6px', borderBottom: '2px solid', borderRight: '2px solid' },
                    ].map((s, i) => (
                        <div key={i} style={{ position: 'absolute', width: '20px', height: '20px', borderColor: 'var(--color-gold)', ...s }} />
                    ))}

                    <div
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.6rem',
                            letterSpacing: '0.4em',
                            color: 'rgba(201,168,76,0.7)',
                            textTransform: 'uppercase',
                            marginBottom: '1rem',
                        }}
                    >
                        Spice of Life · 51 Circular Road
                    </div>
                    <h1
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                            letterSpacing: '0.15em',
                            color: 'var(--color-cream)',
                            textTransform: 'uppercase',
                            fontWeight: 500,
                            marginBottom: '0.5rem',
                        }}
                    >
                        Our Menu
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', margin: '1rem 0' }}>
                        <span style={{ width: '40px', height: '1px', background: 'var(--color-gold)', opacity: 0.5 }} />
                        <span style={{ color: 'var(--color-gold)', fontSize: '0.8rem' }}>✦</span>
                        <span style={{ width: '40px', height: '1px', background: 'var(--color-gold)', opacity: 0.5 }} />
                    </div>
                    <p
                        style={{
                            fontFamily: 'var(--font-elegant)',
                            fontSize: '0.95rem',
                            color: 'rgba(245,240,232,0.5)',
                            lineHeight: 1.8,
                            fontStyle: 'italic',
                        }}
                    >
                        Crafted from ancient spice routes, served with modern mastery.
                        <br />All prices inclusive of GST. Allergen menu available on request.
                    </p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div
                style={{
                    position: 'sticky',
                    top: '60px',
                    zIndex: 40,
                    background: 'rgba(13,11,8,0.95)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(201,168,76,0.15)',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 0,
                    padding: '0',
                }}
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.6rem',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            padding: '1.25rem 2rem',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? '2px solid var(--color-gold)' : '2px solid transparent',
                            background: 'transparent',
                            color: activeTab === tab.id ? 'var(--color-gold)' : 'rgba(245,240,232,0.4)',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                        }}
                        onMouseEnter={e => { if (activeTab !== tab.id) e.target.style.color = 'var(--color-cream)' }}
                        onMouseLeave={e => { if (activeTab !== tab.id) e.target.style.color = 'rgba(245,240,232,0.4)' }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Menu Content */}
            <div ref={contentRef} style={{ maxWidth: '780px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>

                {/* ── Sections ─────────────────────────────────────────────── */}
                {data.sections.map((section, si) => {
                    // Reusable item row renderer
                    const isBeverages = activeTab === 'beverages';
                    const renderItemRow = (item, ii) => {
                        let leftPrice = null;
                        let rightPrice = item.price;

                        if (isBeverages && item.price.includes('/')) {
                            const prices = item.price.split('/').map(p => p.trim());
                            const p0 = parseInt(prices[0].replace(/\D/g, '')) || 0;
                            const p1 = parseInt(prices[1].replace(/\D/g, '')) || 0;
                            if (p0 < 50 && p1 >= 50) {
                                leftPrice = prices[0];
                                rightPrice = prices[1];
                            } else if (p1 < 50 && p0 >= 50) {
                                leftPrice = prices[1];
                                rightPrice = prices[0];
                            } else {
                                leftPrice = prices[0];
                                rightPrice = prices[1];
                            }
                        } else if (isBeverages) {
                            leftPrice = null;
                            rightPrice = item.price;
                        }

                        return (
                            <div
                                key={ii}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: isBeverages ? '1fr 4.5rem 4.5rem' : '1fr auto',
                                    gap: '1rem',
                                    alignItems: 'start',
                                    padding: '1.25rem 0',
                                    borderBottom: '1px dashed rgba(181,137,78,0.2)',
                                }}
                            >
                                <div>
                                    <div style={{
                                        fontFamily: 'var(--font-serif)',
                                        fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)',
                                        color: '#8A5D33',
                                        fontWeight: 400,
                                        marginBottom: item.desc ? '0.35rem' : 0,
                                    }}>
                                        {item.name}
                                    </div>
                                    {item.desc && (
                                        <div style={{
                                            fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                                            color: 'rgba(245,240,232,0.5)', lineHeight: 1.65,
                                        }}>
                                            {item.desc}
                                        </div>
                                    )}
                                </div>

                                {isBeverages ? (
                                    <>
                                        <div style={{
                                            fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--color-gold)',
                                            textAlign: 'right', paddingTop: '3px', fontWeight: 500,
                                        }}>
                                            {leftPrice}
                                        </div>
                                        <div style={{
                                            fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--color-gold)',
                                            textAlign: 'right', paddingTop: '3px', fontWeight: 500,
                                        }}>
                                            {rightPrice}
                                        </div>
                                    </>
                                ) : (
                                    <div style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '1.05rem',
                                        color: 'var(--color-gold)',
                                        whiteSpace: 'nowrap',
                                        fontWeight: 500,
                                        paddingTop: '3px',
                                        minWidth: '3.5rem',
                                        textAlign: 'right',
                                    }}>
                                        {item.price}
                                    </div>
                                )}
                            </div>
                        )
                    }

                    const prevSection = si > 0 ? data.sections[si - 1] : null;
                    const nextSection = si < data.sections.length - 1 ? data.sections[si + 1] : null;
                    const showHeading = !prevSection || prevSection.heading !== section.heading;
                    const isLastOfHeading = !nextSection || nextSection.heading !== section.heading;

                    return (
                        <div key={si} style={{ marginBottom: isLastOfHeading ? '4rem' : '3.5rem' }}>
                            {/* Section heading */}
                            {showHeading && (
                                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                                    <h2 style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                                        letterSpacing: '0.2em',
                                        color: 'var(--color-cream)',
                                        textTransform: 'uppercase',
                                        fontWeight: 500,
                                    }}>
                                        {section.heading}
                                    </h2>
                                    <div style={{ width: '60px', height: '1px', background: 'var(--color-gold)', opacity: 0.4, margin: '0.75rem auto 0' }} />
                                </div>
                            )}

                            {/* SubCategory Header */}
                            {section.subCategory && (
                                <div style={{ position: 'relative', marginBottom: '0.75rem', marginTop: showHeading ? '0.5rem' : '0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ flex: 1, height: '1px', background: 'rgba(176,122,80,0.25)' }} />
                                        <span style={{
                                            fontFamily: 'var(--font-display)', fontSize: '0.72rem',
                                            color: '#D3FBD8',
                                            letterSpacing: '0.25em', whiteSpace: 'nowrap',
                                            textTransform: 'uppercase',
                                        }}>{section.subCategory}</span>
                                        <span style={{ flex: 1, height: '1px', background: 'rgba(176,122,80,0.25)' }} />
                                    </div>

                                    {activeTab === 'beverages' && getSubCategoryIcons(section.subCategory) && (
                                        <div style={{ position: 'absolute', right: 0, bottom: 0, top: 0, display: 'grid', gridTemplateColumns: '4.5rem 4.5rem', width: '10rem', gap: '1rem', background: 'var(--color-dark)' }}>
                                            {getSubCategoryIcons(section.subCategory)}
                                        </div>
                                    )}
                                </div>
                            )}

                            {section.items.map(renderItemRow)}
                        </div>
                    )
                })}

                {/* Seasonal delivery note */}
                {activeTab === 'seasonal' && (
                    <div style={{
                        marginTop: '2rem', padding: '2rem',
                        border: '1px solid rgba(181,137,78,0.3)',
                        background: 'rgba(181,137,78,0.05)', textAlign: 'center',
                    }}>
                        <div style={{
                            fontFamily: 'var(--font-display)', fontSize: '0.6rem',
                            letterSpacing: '0.25em', color: 'var(--color-gold)',
                            textTransform: 'uppercase', marginBottom: '0.75rem',
                        }}>
                            Delivery & Takeaway Available
                        </div>
                        <p style={{
                            fontFamily: 'var(--font-elegant)', fontSize: '0.9rem',
                            color: 'rgba(245,240,232,0.55)', lineHeight: 1.8,
                        }}>
                            Orders require 48 hours advance notice. Delivery within 10km available via our concierge.
                            <br />Call <strong>+65 8223 0925</strong> or email <strong>hello@spiceoflife.sg</strong>
                        </p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}
