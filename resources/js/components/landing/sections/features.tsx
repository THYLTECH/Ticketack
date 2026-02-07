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
import { motion } from 'framer-motion';

const features = [
    {
        icon: Sparkles,
        title: "Smart OCR",
        description: "Automated text extraction using Unstructured, handling complex layouts and various file formats effortlessly."
    },
    {
        icon: Search,
        title: "Semantic Search",
        description: "Go beyond keywords. Find relevant tickets based on meaning and context using BGE-M3 embeddings."
    },
    {
        icon: Database,
        title: "Vector Storage",
        description: "High-performance data management with LanceDB for lightning-fast retrieval and document chunking."
    },
    {
        icon: Zap,
        title: "Real-time ETL",
        description: "Asynchronous document processing powered by Redis workers ensures your dashboard is always up to date."
    },
    {
        icon: ShieldCheck,
        title: "S3-Compatible",
        description: "Secure and scalable object storage using MinIO, ensuring your data is handled with enterprise-grade standards."
    },
    {
        icon: Cpu,
        title: "Scalable Core",
        description: "Built on a containerized Docker architecture, ready to scale from small teams to large enterprises."
    }
];

export default function Features() {
    return (
        <section className="py-24 md:py-32 bg-secondary/10" id='features'>
            <div className="mx-auto max-w-7xl px-6 md:px-8 space-y-16">
                <div className="relative z-10 space-y-6 md:space-y-8 text-center max-w-3xl mx-auto">
                    <div className='flex flex-col items-center gap-4'>
                        <Badge variant={'outline'} className="px-4 py-1.5 border-primary/20 bg-background text-primary">
                            <Rocket className="mr-2 size-4" />
                            Features
                        </Badge>
                        <h2 className="text-4xl font-bold text-foreground text-balance lg:text-5xl tracking-tight">
                            Next-gen tools for modern support teams.
                        </h2>
                    </div>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Ticketack leverages a robust Python-based ETL pipeline and vector storage to transform 
                        how you interact with your support data.
                    </p>
                </div>

                <motion.div 
                    initial="hidden"
                    whileInView="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div 
                            key={index}
                            className="group relative overflow-hidden rounded-2xl border bg-background p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10 space-y-4">
                                <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                    <feature.icon className="size-6" />
                                </div>
                                <h3 className="text-xl font-bold">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}