// resources/js/components/landing/sections/faq.tsx

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { HelpCircle } from 'lucide-react'

export default function FAQ() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'How does the AI handle my documents?',
            answer: 'We use the Unstructured library for advanced OCR and document parsing. Your files are processed through a Python-based ETL pipeline that extracts text, chunks it using LangChain, and converts it into searchable vectors.',
        },
        {
            id: 'item-2',
            question: 'What is semantic search?',
            answer: 'Unlike traditional keyword search, semantic search understands the intent and context of your query. By using BGE-M3 embeddings, Ticketack can find relevant tickets even if the exact words don’t match.',
        },
        {
            id: 'item-3',
            question: 'Where is my data stored?',
            answer: 'Your raw files are stored in secure, S3-compatible MinIO buckets. The vectorized representations used for AI search are managed by LanceDB, ensuring both security and high-speed retrieval.',
        },
        {
            id: 'item-4',
            question: 'Is the processing real-time?',
            answer: 'Yes. We utilize Redis as a message broker to handle document processing asynchronously. This means your tickets are indexed and searchable almost immediately without slowing down the user interface.',
        },
        {
            id: 'item-5',
            question: 'Can I scale the infrastructure?',
            answer: 'Absolutely. The entire system is containerized with Docker. This architecture allows you to scale workers and storage independently based on your volume of support tickets.',
        },
    ]

    return (
        <section className="py-24 md:py-32" id='help'>
            <div className="mx-auto max-w-7xl px-6 md:px-8">
                <div className="grid gap-12 md:grid-cols-5 md:gap-24">
                    <div className="md:col-span-2 space-y-6">
                        <div className='flex flex-col gap-4'>
                            <Badge variant={'outline'} className="w-fit px-4 py-1.5 border-primary/20 bg-primary/5 text-primary">
                                <HelpCircle className="mr-2 size-4" />
                                FAQs
                            </Badge>
                            <h2 className="text-foreground text-4xl font-bold tracking-tight">Common Questions</h2>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Understanding Ticketack's technology.
                        </p>
                        <p className="text-muted-foreground leading-relaxed hidden md:block">
                            Learn more about how our AI-powered ETL pipeline, vector databases, and secure storage work together to optimize your support workflow.
                        </p>
                    </div>

                    <div className="md:col-span-3">
                        <Accordion type="single" collapsible className="w-full">
                            {faqItems.map((item) => (
                                <AccordionItem key={item.id} value={item.id} className="border-b border-border/50">
                                    <AccordionTrigger className="cursor-pointer text-lg font-medium hover:text-primary transition-colors py-6 text-left hover:no-underline">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    <p className="text-muted-foreground mt-6 md:hidden">
                        Learn more about how our AI-powered ETL pipeline, vector databases, and secure storage work together.
                    </p>
                </div>
            </div>
        </section>
    )
}