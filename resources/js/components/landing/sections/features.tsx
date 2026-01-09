// resources/js/components/landing/sections/features.tsx

import { Badge } from '@/components/ui/badge';
import {
    Cpu,
    Rocket,
    Sparkles,
    Zap,
    Search,
    Database,
    ShieldCheck
} from 'lucide-react';

export default function Features() {
    return (
        <section className="py-12 md:py-20" id='features'>
            <div className="space-y-8 md:space-y-16">
                <div className="relative z-10 space-y-6 md:space-y-12">
                    <div className='flex flex-col gap-4'>
                        <Badge variant={'outline'}>
                            <Rocket className="mr-2 size-4" />
                            Features
                        </Badge>
                        <h2 className="text-4xl font-medium text-balance lg:text-5xl">
                            Next-gen tools for modern support teams.
                        </h2>
                    </div>
                    <p className="max-w-2xl text-muted-foreground">
                        Ticketack leverages a robust Python-based ETL pipeline and vector storage to transform 
                        how you interact with your support data.
                    </p>
                </div>

                <div className="relative grid divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4" />
                            <h3 className="text-sm font-medium">Smart OCR</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Automated text extraction using Unstructured, handling complex layouts and various file formats effortlessly.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Search className="size-4" />
                            <h3 className="text-sm font-medium">Semantic Search</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Go beyond keywords. Find relevant tickets based on meaning and context using BGE-M3 embeddings.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Database className="size-4" />
                            <h3 className="text-sm font-medium">Vector Storage</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            High-performance data management with LanceDB for lightning-fast retrieval and document chunking.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4" />
                            <h3 className="text-sm font-medium">Real-time ETL</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Asynchronous document processing powered by Redis workers ensures your dashboard is always up to date.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="size-4" />
                            <h3 className="text-sm font-medium">S3-Compatible</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Secure and scalable object storage using MinIO, ensuring your data is handled with enterprise-grade standards.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4" />
                            <h3 className="text-sm font-medium">Scalable Core</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Built on a containerized Docker architecture, ready to scale from small teams to large enterprises.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}