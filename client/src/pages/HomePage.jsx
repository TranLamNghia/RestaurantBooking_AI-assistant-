import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingCTA from '../components/FloatingCTA'
import HeroSection from '../sections/HeroSection'
import ConceptSection from '../sections/ConceptSection'
import ParallaxTextSection from '../sections/ParallaxTextSection'
import MenuShowcaseSection from '../sections/MenuShowcaseSection'
import SpacesSection from '../sections/SpacesSection'
import PromotionsGallerySection from '../sections/PromotionsGallerySection'

export default function HomePage() {
    return (
        <div style={{ background: 'var(--color-dark)' }}>
            <Navbar />
            <FloatingCTA />
            <main>
                <HeroSection />
                <ConceptSection />
                <ParallaxTextSection />
                <MenuShowcaseSection />
                <SpacesSection />
                <PromotionsGallerySection />
            </main>
            <Footer />
        </div>
    )
}
