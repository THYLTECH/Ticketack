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
        <footer className="border-t bg-white dark:bg-transparent">
            <div className="mx-auto max-w-6xl  border-l border-r pt-20">
                <div className="flex items-start justify-between gap-12  px-6">
                    <div className="md:col-span-2">
                        <Link
                            href="/"
                            aria-label="go home"
                            className="block size-fit">
                            <Logo />
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-6 sm:gap-12 md:col-span-3">
                        {links.map((link, index) => (
                            <div
                                key={index}
                                className="space-y-4 text-sm col-span-1">
                                <span className="block font-medium">{link.group}</span>
                                {link.items.map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.href}
                                        target={item.target}
                                        className="text-muted-foreground hover:text-primary block duration-150">
                                        <span>{item.title}</span>
                                    </a>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6 px-6">
                    <span className="text-muted-foreground order-last block text-center text-sm md:order-first">© {new Date().getFullYear()} Ticketack, All rights reserved</span>
                </div>
            </div>
        </footer>
    )
}