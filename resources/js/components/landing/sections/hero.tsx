// resources/js/components/landing/sections/hero.tsx

import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export default function Hero() {

    return (
        <section>
            <div className="relative pb-24 pt-36">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur">
                        <Sparkles className="h-4 w-4" />
                        <span>AI-Powered Ticket Intelligence</span>
                    </div>

                    <h1 className="mt-8 max-w-2xl text-balance text-5xl font-bold lg:text-6xl">Master your support with advanced AI.</h1>
                    <p className="my-6 max-w-2xl text-balance text-2xl text-foreground">Streamline ticket management with an intelligent ETL pipeline: automated OCR, BGE-M3 vectorization, and lightning-fast semantic search.</p>

                    <div className="flex flex-col items-center gap-3 *:w-full sm:flex-row sm:*:w-fit">
                        <Button asChild size="lg">
                            <a href="https://github.com/THYLTECH/Ticketack/blob/main/README.md" target='_blank'>
                                <span className="text-nowrap">Get Started</span>
                            </a>
                        </Button>
                        <Button key={2} asChild size="lg" variant="outline">
                            <a href="#about">
                                <span className="text-nowrap">Learn More</span>
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="mt-8">
                    <p className="font-medium text-muted-foreground">Built with ❤️ by teams at :</p>
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