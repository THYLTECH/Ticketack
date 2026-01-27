// resources/js/components/landing/sections/about.tsx

import { Badge } from '@/components/ui/badge';
import { Users, Layers, Brain, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
    return (
        <section className="py-24 md:py-32 relative" id="about">
            <div className="mx-auto max-w-7xl px-6 md:px-8">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div className='flex flex-col gap-6'>
                            <Badge variant={'outline'} className="w-fit px-4 py-1.5 border-primary/20 bg-primary/5 text-primary">
                                <Users className="mr-2 size-4" />
                                About
                            </Badge>
                            <h2 className="text-4xl font-bold tracking-tight lg:text-5xl leading-tight">
                                The bridge between <span className="text-primary">raw data</span> and smart support.
                            </h2>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Ticketack is an intelligent ecosystem designed to solve the complexity of modern support. 
                            It doesn't just store tickets; it understands them by combining a robust Laravel 11 
                            backend with a specialized Python AI engine.
                        </p>
                        
                        <div className="space-y-6 pt-4">
                            <div className="flex gap-4 group">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                    <Layers className="size-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Centralized Hub</h4>
                                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">A unified interface to manage, track, and resolve tickets with a seamless user experience.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 group">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                    <Brain className="size-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Cognitive Extraction</h4>
                                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">Automated OCR and chunking that turns PDFs and images into searchable knowledge.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="group relative overflow-hidden rounded-3xl border bg-card/50 p-8 md:p-12 shadow-2xl backdrop-blur-sm ring-1 ring-white/10 dark:ring-white/5">
                            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />
                            
                            <h3 className="mb-8 text-2xl font-bold">How it works</h3>
                            <ul className="space-y-8 relative z-10">
                                <li className="flex items-start gap-4">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">1</span>
                                    <div>
                                        <p className="font-medium text-foreground">Upload</p>
                                        <p className="text-sm text-muted-foreground mt-1">Drop any document into the platform. Files are securely stored in MinIO.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">2</span>
                                    <div>
                                        <p className="font-medium text-foreground">Process</p>
                                        <p className="text-sm text-muted-foreground mt-1">Our Python ETL workers extract text and generate high-dimensional vectors via BGE-M3.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">3</span>
                                    <div>
                                        <p className="font-medium text-foreground">Resolve</p>
                                        <p className="text-sm text-muted-foreground mt-1">Find answers instantly through semantic search and AI-assisted data retrieval.</p>
                                    </div>
                                </li>
                            </ul>
                            <div className="mt-10 flex items-center gap-3 rounded-xl border border-dashed border-primary/20 p-4 bg-primary/5">
                                <Database className="size-5 text-primary" />
                                <span className="text-xs font-medium text-primary/80 italic">Powered by LanceDB & Redis for real-time indexing</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}