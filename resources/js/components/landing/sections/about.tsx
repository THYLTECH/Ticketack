// resources/js/components/landing/sections/about.tsx

import { Badge } from '@/components/ui/badge';
import { Users, Layers, Brain, Database } from 'lucide-react';

export default function About() {
    return (
        <section className="py-16 md:py-32 border-t border-border/40" id="about">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
                <div className="space-y-6">
                    <div className='flex flex-col gap-4'>
                        <Badge variant={'outline'} className="w-fit">
                            <Users className="mr-2 size-4" />
                            About
                        </Badge>
                        <h2 className="text-4xl font-medium tracking-tight lg:text-5xl">
                            The bridge between raw data and smart support.
                        </h2>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        Ticketack is an intelligent ecosystem designed to solve the complexity of modern support. 
                        It doesn't just store tickets; it understands them by combining a robust Laravel 11 
                        backend with a specialized Python AI engine.
                    </p>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Layers className="size-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Centralized Hub</h4>
                                <p className="text-sm text-muted-foreground">A unified interface to manage, track, and resolve tickets with a seamless user experience.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Brain className="size-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Cognitive Extraction</h4>
                                <p className="text-sm text-muted-foreground">Automated OCR and chunking that turns PDFs and images into searchable knowledge.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="group relative overflow-hidden rounded-2xl border bg-muted/30 p-8">
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
                        <h3 className="mb-4 text-xl font-medium">How it works</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground">1</span>
                                <p className="text-sm"><strong>Upload:</strong> Drop any document into the platform. Files are securely stored in MinIO.</p>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground">2</span>
                                <p className="text-sm"><strong>Process:</strong> Our Python ETL workers extract text and generate high-dimensional vectors via BGE-M3.</p>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground">3</span>
                                <p className="text-sm"><strong>Resolve:</strong> Find answers instantly through semantic search and AI-assisted data retrieval.</p>
                            </li>
                        </ul>
                        <div className="mt-8 flex items-center gap-2 rounded-lg border border-dashed p-4">
                            <Database className="size-5 text-muted-foreground" />
                            <span className="text-xs font-mono text-muted-foreground italic">Powered by LanceDB & Redis for real-time indexing</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}