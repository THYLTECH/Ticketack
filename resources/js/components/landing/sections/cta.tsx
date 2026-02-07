// resources/js/components/landing/sections/cta.tsx

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

export default function Cta() {
    return (
        <section className="py-16 md:py-24 px-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 md:px-16 md:py-20 text-center shadow-2xl"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
                
                <div className="relative z-10 mx-auto max-w-4xl space-y-8">
                    <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-5xl">
                        Ready to elevate your support experience?
                    </h2>
                    
                    <div className="flex items-center justify-center">
                        <Button asChild size="lg" variant="secondary" className="h-14 rounded-full px-10 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                            <a href="https://github.com/THYLTECH/Ticketack/blob/main/README.md" target="_blank" rel="noopener noreferrer">
                                Get Started Now
                            </a>
                        </Button>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}