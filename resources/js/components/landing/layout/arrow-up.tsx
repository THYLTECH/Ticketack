// resources/js/components/landing/layout/arrow-up.tsx

import React from 'react'
import { ArrowUp as ArrowUpIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ArrowUp() {
    const [visible, setVisible] = React.useState(false)

    React.useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 320)
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()

        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const scrollToTop = () => {
        if (typeof window === 'undefined') return
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div
            aria-hidden={!visible}
            className={[
                'fixed right-4 bottom-4 z-40 transition-opacity duration-200',
                visible ? 'opacity-100' : 'pointer-events-none opacity-0',
            ].join(' ')}
        >
            <Button
                size="icon"
                variant="default"
                className="h-11 w-11 rounded-full shadow-lg shadow-black/10"
                onClick={scrollToTop}
                aria-label="Back to top"
            >
                <ArrowUpIcon className="h-5 w-5" />
            </Button>
        </div>
    )
}