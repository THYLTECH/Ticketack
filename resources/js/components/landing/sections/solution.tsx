import { Badge } from '@/components/ui/badge';
import { Cpu, Target, Zap } from 'lucide-react';

export default function Solution() {
    return (
        <>
            <section className="pt-16 md:pt-32 pb-8 md:pb-16" id='solution'>
                <div className="space-y-8 md:space-y-16">
                    <div className='flex flex-col gap-4'>
                        <Badge variant={'outline'}>
                            <Target className="mr-2 size-4" />
                            Our Solution
                        </Badge>
                        <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
                            Infrastructure engineered for performance.
                        </h2>
                    </div>
                    <div className="relative">
                        <div className="relative z-10 space-y-4 md:w-1/2">
                            <p>
                                Ticketack converts raw documents into actionable data instantly. 
                                <span className="font-medium"> Our Unstructured-powered OCR engine </span> 
                                analyzes every file to extract its core substance.
                            </p>
                            <p>
                                By leveraging state-of-the-art models like BGE-M3, we ensure precise contextual understanding of your business requirements.
                            </p>

                            <div className="grid grid-cols-2 gap-3 pt-6 sm:gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Zap className="size-4" />
                                        <h3 className="text-sm font-medium">
                                            Asynchronous ETL Processing
                                        </h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Redis-driven queues for smooth and uninterrupted workflows.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Cpu className="size-4" />
                                        <h3 className="text-sm font-medium">
                                            Scalable Architecture
                                        </h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Containerized deployment via Docker for simplified scaling.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 h-fit md:absolute md:inset-x-0 md:-inset-y-12 md:mt-0 md:mask-l-from-35% md:mask-l-to-55%">
                            <div className="relative rounded-2xl border border-dotted border-border/50 p-2">
                                <img
                                    src="images/placeholder.svg"
                                    className="hidden max-h-[300px] w-full rounded-[12px] object-cover dark:block"
                                    alt="Technical infrastructure"
                                    width={1207}
                                    height={929}
                                />
                                <img
                                    src="images/placeholder.svg"
                                    className="rounded-[12px] max-h-[300px] shadow w-full object-cover dark:hidden"
                                    alt="Technical infrastructure"
                                    width={1207}
                                    height={929}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="pb-16 md:pb-32 pt-8 md:pt-16">
                <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-medium">Semantic Search & Vector Storage.</h2>
                    <div className="space-y-6">
                        <p>Don't just search for keywords—search for intent. We use LanceDB to store vectorized data, enabling search with unprecedented speed.</p>
                        <p>
                            Coupled with <span className="font-bold">S3-compatible MinIO storage</span>, your documents are secured and instantly accessible by our Python workers for LangChain-powered chunking.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}