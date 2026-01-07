// pages/welcome.tsx

// Necessary imports
import { Head } from '@inertiajs/react';

// Layouts
import Header from '@/components/landing/layout/header';
import Footer from '@/components/landing/layout/footer';
import ArrowUp from '@/components/landing/layout/arrow-up';

// Sections
import Hero from '@/components/landing/sections/hero';
import Solution from '@/components/landing/sections/solution';
import Features from '@/components/landing/sections/features';
import Cta from '@/components/landing/sections/cta';
import FAQ from '@/components/landing/sections/faq';
import About from '@/components/landing/sections/about';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />

            <Header />

            <ArrowUp />

            <main className='border-r border-l mx-auto max-w-6xl px-8'>
                <Hero />

                {/* Separator */}
                <div className="relative flex w-full flex-col justify-between md:flex-row">
                    <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-[99vw] border-t" />
                </div>

                <About />

                {/* Separator */}
                <div className="relative flex w-full flex-col justify-between md:flex-row">
                    <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-[99vw] border-t" />
                </div>

                <Solution />
                <Cta />
                <Features />

                {/* Separator */}
                <div className="relative flex w-full flex-col justify-between md:flex-row">
                    <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-[99vw] border-t" />
                </div>

                <FAQ />
            </main>

            <Footer />
        </>
    );
}
