// resources/js/components/landing/sections/hero.tsx

import React from 'react'
import { Link } from '@inertiajs/react'
import { useAppearance } from '@/hooks/use-appearance'
import { Button } from '@/components/ui/button'

export default function Hero() {

    return (
        <section>
            <div className="relative pb-24 pt-52">
                <div>
                    <h1 className="mt-8 max-w-2xl text-balance text-5xl font-bold lg:text-6xl">Lorem ipsum dolor sit amet.</h1>
                    <p className="my-6 max-w-2xl text-balance text-2xl text-foreground">Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

                    <div className="flex flex-col items-center gap-3 *:w-full sm:flex-row sm:*:w-fit">
                        <Button asChild size="lg">
                            <Link href="#link">
                                <span className="text-nowrap">Lorem ipsum</span>
                            </Link>
                        </Button>
                        <Button key={2} asChild size="lg" variant="outline">
                            <Link href="#link">
                                <span className="text-nowrap">Dolor sit</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="mt-8">
                    <p className="font-medium text-muted-foreground">Lorem ipsum dolor sit amet:</p>
                    <div className="mt-4 flex flex-wrap items-center gap-12">
                        <div className="flex">
                            <img
                                className="mx-auto h-8 w-fit opacity-80 hidden dark:block"
                                src={`images/teams/id_white.png`}
                                alt="placeholder one"
                                width="auto"
                            />
                            <img
                                className="mx-auto h-8 w-fit opacity-80 block dark:hidden"
                                src={`images/teams/id_color.png`}
                                alt="placeholder one"
                                width="auto"
                            />
                        </div>

                        <div className="flex">
                            <img
                                className="mx-auto h-8 w-fit opacity-80 hidden dark:block"
                                src={`images/teams/ig2i_white.png`}
                                alt="placeholder two"
                                width="auto"
                            />
                            <img
                                className="mx-auto h-8 w-fit opacity-80 block dark:hidden"
                                src={`images/teams/ig2i_color.png`}
                                alt="placeholder two"
                                width="auto"
                            />
                        </div>
                        <div className="flex">
                            <img
                                className="mx-auto h-8 w-fit opacity-80 hidden dark:block"
                                src={`images/teams/thyltech_white.png`}
                                alt="placeholder three"
                                width="auto"
                            />
                            <img
                                className="mx-auto h-8 w-fit opacity-80 block dark:hidden"
                                src={`images/teams/thyltech_color.png`}
                                alt="placeholder three"
                                width="auto"
                            />
                        </div>
                    </div>
                </div>

                <div className="relative -mr-56 mt-16 w-full sm:mr-0">
                    <div className="bg-background rounded-(--radius) relative mx-auto overflow-hidden border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
                        <img
                            src={`images/placeholder.svg`}
                            className="aspect-[16/9] w-full object-cover"
                            alt="placeholder hero"
                            width="2880"
                            height="1842"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}