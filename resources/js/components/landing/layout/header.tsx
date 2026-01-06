// resources/js/components/landing/layout/header.tsx

// Necessary imports
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

import { Logo } from '@/components/logo';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';

// Icons
import { Menu, X } from 'lucide-react';

const menuItems = [
    { name: 'Solution', href: '#solution' },
    { name: 'Features', href: '#features' },
    { name: 'Faq', href: '#faq' },
];

export default function Header() {
    const [menuState, setMenuState] = React.useState(false);
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className={cn(
                    'fixed z-20 w-full transition-all duration-300',
                    'border-b bg-background/75 backdrop-blur-lg',
                )}
            >
                <div className="mx-auto max-w-6xl px-8 border-r border-l">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-4 lg:gap-0 lg:py-3">
                        <div className="flex w-full justify-between gap-6 lg:w-auto items-center">
                            <Link
                                href="#top"
                                aria-label="home"
                                className="flex items-center space-x-2"
                            >
                                <Logo />
                            </Link>

                            <Separator orientation="vertical" className="!h-6 hidden lg:block" />

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={
                                    menuState == true
                                        ? 'Close Menu'
                                        : 'Open Menu'
                                }
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                            >
                                <Menu className="m-auto size-6 duration-200 in-data-[state=active]:scale-0 in-data-[state=active]:rotate-180 in-data-[state=active]:opacity-0" />
                                <X className="absolute inset-0 m-auto size-6 scale-0 -rotate-180 opacity-0 duration-200 in-data-[state=active]:scale-100 in-data-[state=active]:rotate-0 in-data-[state=active]:opacity-100" />
                            </button>

                            <div className="m-auto hidden size-fit lg:block">
                                <ul className="flex gap-1">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                            >
                                                <Link
                                                    href={item.href}
                                                    className="text-base"
                                                >
                                                    <span>{item.name}</span>
                                                </Link>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border bg-background p-6 shadow-2xl shadow-zinc-300/20 in-data-[state=active]:block md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:in-data-[state=active]:flex dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="block text-muted-foreground duration-150 hover:text-accent-foreground"
                                            >
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">

                                <AppearanceToggleDropdown />

                                <Button
                                    asChild
                                    size="sm"
                                >
                                    <Link href={route('auth.login')}>
                                        <span>Log In</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
