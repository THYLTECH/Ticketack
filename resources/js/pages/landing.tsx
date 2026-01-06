// pages/welcome.tsx

// Necessary imports
import { Head, Link, usePage } from '@inertiajs/react';
import { useUpdateThemes } from '@/hooks/use-update-theme';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Types
import { type SharedData } from '@/types';

// Layouts
import Header from '@/components/landing/layout/header';
import Footer from '@/components/landing/layout/footer';
import ArrowUp from '@/components/landing/layout/arrow-up';

// Sections
import Hero from '@/components/landing/sections/hero';
import Solution from '@/components/landing/sections/solution';
import Features from '@/components/landing/sections/features';
import Cta from '@/components/landing/sections/cta';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const __ = useTrans();
    useUpdateThemes();

    return (
        <>
            <Head title="Welcome" />

            <Header />

            {/* <ArrowUp /> */}

            <main className='border-r border-l mx-auto max-w-6xl px-8'>
                <Hero />
                <Solution />
                <Cta />
                <Features />
            </main>

            <Footer />
        </>
    );
}
