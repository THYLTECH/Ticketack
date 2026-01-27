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

            <main className='min-h-screen bg-background text-foreground'>
                <Hero />
                <About />
                <Solution />
                <Cta />
                <Features />
                <FAQ />
            </main>

            <Footer />
        </>
    );
}
