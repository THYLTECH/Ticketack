// resources/js/components/landing/sections/hero.tsx

import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero() {

    return (
        <section className="relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
            </div>

            <div className="relative pb-24 pt-36 px-4 md:px-6">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md shadow-sm">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>AI-Powered Ticket Intelligence</span>
                        </div>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-8 max-w-4xl text-balance text-5xl font-extrabold tracking-tight lg:text-7xl"
                    >
                        Master your support with <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">advanced AI.</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 max-w-2xl text-balance text-lg md:text-xl text-muted-foreground"
                    >
                        Streamline ticket management with an intelligent ETL pipeline: automated OCR, BGE-M3 vectorization, and lightning-fast semantic search.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-8 flex flex-col items-center gap-4 sm:flex-row"
                    >
                        <Button asChild size="lg" className="h-12 rounded-full px-8 text-base shadow-lg hover:shadow-xl transition-all hover:scale-105">
                            <a href="https://github.com/THYLTECH/Ticketack/blob/main/README.md" target='_blank'>
                                <span className="text-nowrap">Get Started</span>
                            </a>
                        </Button>
                        <Button key={2} asChild size="lg" variant="outline" className="h-12 rounded-full px-8 text-base hover:bg-muted/50">
                            <a href="#about">
                                <span className="text-nowrap">Learn More</span>
                            </a>
                        </Button>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-12"
                    >
                        <p className="font-medium text-sm text-muted-foreground uppercase tracking-widest">Built with ❤️ by teams at :</p>
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-8 md:gap-16 grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                            <div className="flex">
                                <img
                                    className="mx-auto h-7 w-fit dark:brightness-0 dark:invert"
                                    src={`images/teams/id_white.png`}
                                    alt="ID Ingenierie Logo"
                                    width="auto"
                                />
                                {/* <img
                                    className="mx-auto h-8 w-fit block dark:hidden"
                                    src={`images/teams/id_color.png`}
                                    alt="placeholder one"
                                    width="auto"
                                /> */}
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-8 w-fit hidden dark:block"
                                    src={`images/teams/thyltech_white.png`}
                                    alt="THYLTECH Logo"
                                    width="auto"
                                />
                                <img
                                    className="mx-auto h-8 w-fit block dark:hidden"
                                    src={`images/teams/thyltech_color.png`}
                                    alt="THYLTECH Logo"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-8 w-fit hidden dark:block"
                                    src={`images/teams/ig2i_white.png`}
                                    alt="IG2I Logo"
                                    width="auto"
                                />
                                <img
                                    className="mx-auto h-8 w-fit block dark:hidden"
                                    src={`images/teams/ig2i_color.png`}
                                    alt="IG2I Logo"
                                    width="auto"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 100, rotateX: 10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, type: 'spring' }}
                    className="relative mt-20 mx-auto max-w-6xl perspective-1000"
                >
                    <div className="bg-background rounded-xl overflow-hidden border shadow-2xl shadow-primary/10 ring-1 ring-border">
                        <img
                            src={`images/app_home.png`}
                            className="aspect-[16/9] w-full object-cover"
                            alt="placeholder hero"
                            // width="2880"
                            // height="1842"
                        />
                         {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}