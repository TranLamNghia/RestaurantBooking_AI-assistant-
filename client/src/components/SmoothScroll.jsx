import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from '@studio-freight/lenis'

// Disable browser scroll restoration globally — Lenis manages scroll position
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
}

export default function SmoothScroll({ children }) {
    const lenisRef = useRef(null)
    const { pathname } = useLocation()

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        })
        lenisRef.current = lenis

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
            lenisRef.current = null
        }
    }, [])

    // Scroll to top on every route change — delayed so new page's useEffects settle first
    useEffect(() => {
        const t = setTimeout(() => {
            if (lenisRef.current) {
                lenisRef.current.scrollTo(0, { immediate: true })
            } else {
                window.scrollTo(0, 0)
            }
        }, 50)
        return () => clearTimeout(t)
    }, [pathname])

    return children
}
