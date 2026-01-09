// resources/js/components/landing/layout/header.tsx

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

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
    const [isOpen, setIsOpen] = React.useState(false);

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

    const closeMenu = () => setIsOpen(false);

    return (
        <header className="sticky top-0 z-40">
            {/* Navbar */}
            <nav className="border-b bg-background/80 backdrop-blur-md">
                <div className="mx-auto max-w-6xl px-4 md:px-8 py-4 border-x">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link
                            href="#"
                            aria-label="Ticketack"
                            className="flex items-center space-x-2 group"
                        >
                            <Logo />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {menuItems.map((item, index) => (
                                <Button
                                    key={index}
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-foreground"
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
                                className="hidden sm:flex"
                            >
                                <Link href={route('auth.login')}>
                                    Log In
                                </Link>
                            </Button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                                className="lg:hidden relative z-40 p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                {isOpen ? (
                                    <X className="w-5 h-5" />
                                ) : (
                                    <Menu className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 lg:hidden"
                    onClick={closeMenu}
                    style={{ top: '68px' }}
                />
            )}

            {/* Mobile Sidebar */}
            <div
                className={cn(
                    'fixed left-0 top-[68px] h-[calc(100vh-68px)] w-full max-w-sm bg-background border-r border-border/40 shadow-xl overflow-y-auto',
                    'lg:hidden transition-transform duration-300 ease-in-out',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="p-6 space-y-6">
                    {/* Mobile Navigation */}
                    <nav className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-4">
                            Navigation
                        </p>
                        {menuItems.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                onClick={closeMenu}
                                className="block px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
                            >
                                {item.name}
                            </a>
                        ))}
                    </nav>

                    {/* Divider */}
                    <div className="h-px bg-border/40" />

                    {/* Mobile CTA */}
                    <div className="flex w-full items-center gap-2">
                        <Button asChild className="flex-1" onClick={closeMenu}>
                            <Link href={route('auth.login')}>
                                Log In
                            </Link>
                        </Button>

                        <div className='border rounded-md'>
                            <AppearanceToggleDropdown />
                        </div>

                    </div>
                </div>
            </div>
        </header>
    );
}
