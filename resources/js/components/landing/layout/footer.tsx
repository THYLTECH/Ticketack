// resources/js/components/landing/layout/footer.tsx

// Necessary imports
import { Link } from '@inertiajs/react'

// Components

import { Logo } from '@/components/logo'

const links = [
    {
        group: 'Product',
        items: [
            {
                title: 'About',
                href: '#about',
            },
            {
                title: 'Solution',
                href: '#solution',
            },
            {
                title: 'Features',
                href: '#features',
            },
            {
                title: 'Help',
                href: '#help',
            },
        ],
    },
    {
        group: 'Resources',
        items: [
            {
                title: 'Source code',
                href: 'https://github.com/THYLTECH/Ticketack',
                target: '_blank',
            },
            {
                title: 'Readme',
                href: 'https://github.com/THYLTECH/Ticketack/blob/main/README.md',
                target: '_blank',
            },
        ],
    },
    {
        group: 'Legal',
        items: [
            {
                title: 'Terms',
                href: route('terms'),
            },
            {
                title: 'License',
                href: 'https://github.com/THYLTECH/Ticketack/blob/main/LICENSE.md',
                target: '_blank',
            },
        ],
    },
]

export default function Footer() {
    return (
        <footer className="border-t bg-background pt-16 md:pt-24 pb-8">
            <div className="mx-auto max-w-7xl px-6 md:px-8">
                <div className="flex flex-col xl:flex-row justify-between gap-12 xl:gap-20">
                    <div className="xl:w-1/3 space-y-4">
                        <Link
                            href="/"
                            aria-label="go home"
                            className="flex items-center gap-2 max-w-max">
                            <Logo className="h-8 w-8" />
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                            Advanced AI-powered ticketing intelligence for modern support teams. Streamline your workflows today.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 xl:w-2/3">
                        {links.map((link, index) => (
                            <div
                                key={index}
                                className="space-y-4">
                                <span className="block text-sm font-semibold tracking-wider uppercase text-foreground/90">{link.group}</span>
                                <ul className="space-y-2">
                                    {link.items.map((item, index) => (
                                        <li key={index}>
                                            <a
                                                href={item.href}
                                                target={item.target}
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 block py-1">
                                                {item.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="text-muted-foreground text-sm">© {new Date().getFullYear()} Ticketack. All rights reserved.</span>
                    <div className="flex items-center gap-6">
                        {/* Social icons could go here */}
                    </div>
                </div>
            </div>
        </footer>
    )
}