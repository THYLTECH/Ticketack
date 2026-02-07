// resources/js/components/landing/layout/header.tsx

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

import { Logo } from '@/components/logo';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';

// Icons
import { Menu, X } from 'lucide-react';

const menuItems = [
    { name: 'About', href: '#about' },
    { name: 'Solution', href: '#solution' },
    { name: 'Features', href: '#features' },
    { name: 'Help', href: '#help' },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
             setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeMenu = () => setIsOpen(false);

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
            scrolled ? "bg-background/80 backdrop-blur-xl border-b shadow-sm py-3" : "bg-transparent py-5"
        )}>
            {/* Navbar */}
            <nav className="mx-auto max-w-7xl px-6 md:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="#"
                        aria-label="Ticketack"
                        className="flex items-center space-x-2 group z-50"
                    >
                        <Logo className="h-8" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-2 bg-background/50 backdrop-blur-sm px-2 py-1.5 rounded-full border shadow-sm">
                        {menuItems.map((item, index) => (
                            <Button
                                key={index}
                                asChild
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-primary rounded-full px-4 text-sm font-medium transition-colors"
                            >
                                <a href={item.href}>
                                    {item.name}
                                </a>
                            </Button>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block">
                            <AppearanceToggleDropdown />
                        </div>

                        <Button
                            asChild
                            size="sm"
                            className="hidden sm:flex rounded-full px-6 font-semibold shadow-md hover:shadow-lg transition-all"
                        >
                            <Link href={route('auth.login')}>
                                Log In
                            </Link>
                        </Button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                            className="lg:hidden relative z-50 p-2 hover:bg-muted rounded-full transition-colors"
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ opacity: 0, rotate: -90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="w-6 h-6" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ opacity: 0, rotate: 90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: -90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="w-6 h-6" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/95 backdrop-blur-3xl z-40 lg:hidden flex flex-col pt-24 px-6"
                    >
                        <div className="space-y-6">
                            {/* Mobile Navigation */}
                            <nav className="flex flex-col space-y-2">
                                {menuItems.map((item, index) => (
                                    <motion.a
                                        key={index}
                                        href={item.href}
                                        onClick={closeMenu}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="text-2xl font-semibold hover:text-primary transition-colors py-2"
                                    >
                                        {item.name}
                                    </motion.a>
                                ))}
                            </nav>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="h-px bg-border/40 w-full"
                            />

                            {/* Mobile CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col gap-4"
                            >
                                <Button asChild size="lg" className="w-full text-lg font-semibold h-12 rounded-xl" onClick={closeMenu}>
                                    <Link href={route('auth.login')}>
                                        Log In
                                    </Link>
                                </Button>

                                <div className='flex items-center justify-between p-4 border rounded-xl bg-card'>
                                    <span className="font-medium">Appearance</span>
                                    <AppearanceToggleDropdown />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
