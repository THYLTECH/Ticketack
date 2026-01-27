import { Badge } from '@/components/ui/badge';
import { Cpu, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Solution() {
    return (
        <>
            <section className="py-16 md:py-24" id='solution'>
                <div className="mx-auto max-w-7xl px-6 md:px-8 space-y-24">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className='flex flex-col gap-6 order-2 lg:order-1'>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="relative rounded-2xl border border-border/50 bg-muted/20 p-2 shadow-2xl"
                            >
                                <img
                                    src="images/app_tickets.png"
                                    className="hidden w-full rounded-xl object-cover dark:block shadow-inner"
                                    alt="Technical infrastructure"
                                    width={1207}
                                    height={929}
                                />
                                <img
                                    src="images/app_tickets.png"
                                    className="w-full rounded-xl shadow-inner object-cover dark:hidden"
                                    alt="Technical infrastructure"
                                    width={1207}
                                    height={929}
                                />
                            </motion.div>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8 order-1 lg:order-2"
                        >
                            <div className="space-y-6">
                                <Badge variant={'outline'} className="w-fit px-4 py-1.5 border-primary/20 bg-primary/5 text-primary">
                                    <Target className="mr-2 size-4" />
                                    Our Solution
                                </Badge>
                                <h2 className="text-3xl font-bold tracking-tight md:text-5xl leading-tight">
                                    Infrastructure engineered for <span className="text-primary">performance</span>.
                                </h2>
                            </div>
                            
                            <div className="text-lg text-muted-foreground space-y-4">
                                <p>
                                    Ticketack converts raw documents into actionable data instantly. 
                                    <span className="font-semibold text-foreground"> Our Unstructured-powered OCR engine </span> 
                                    analyzes every file to extract its core substance.
                                </p>
                                <p>
                                    By leveraging state-of-the-art models like BGE-M3, we ensure precise contextual understanding of your business requirements.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                                <div className="space-y-3 p-4 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                                    <div className="flex items-center gap-3 text-primary">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Zap className="size-5" />
                                        </div>
                                        <h3 className="text-base font-semibold text-foreground">
                                            Asynchronous ETL
                                        </h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Redis-driven queues for smooth and uninterrupted workflows.
                                    </p>
                                </div>
                                <div className="space-y-3 p-4 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                                    <div className="flex items-center gap-3 text-primary">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Cpu className="size-5" />
                                        </div>
                                        <h3 className="text-base font-semibold text-foreground">
                                            Scalable Architecture
                                        </h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Containerized deployment via Docker for simplified scaling.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="rounded-3xl bg-secondary/20 p-8 md:p-12">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold md:text-4xl text-foreground">Semantic Search & Vector Storage.</h2>
                                <div className="space-y-6 text-lg text-muted-foreground">
                                    <p>Don't just search for keywords—search for intent. We use LanceDB to store vectorized data, enabling search with unprecedented speed.</p>
                                    <p>
                                        Coupled with <span className="font-semibold text-foreground">S3-compatible MinIO storage</span>, your documents are secured and instantly accessible by our Python workers for LangChain-powered chunking.
                                    </p>
                                </div>
                            </div>
                            <img 
                                src="images/app_knowledge.png"
                                className="aspect-[16/9] w-full object-cover"
                                alt="Knowledge Base"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}