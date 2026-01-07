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
        <section className="py-16 md:py-24" id='help'>
            <div className="grid gap-8 md:grid-cols-5 md:gap-12">
                <div className="md:col-span-2">
                    <div className='flex flex-col gap-4'>
                        <Badge variant={'outline'}>
                            <HelpCircle className="mr-2 size-4" />
                            FAQs
                        </Badge>
                        <h2 className="text-foreground text-4xl font-semibold">Common Questions</h2>
                    </div>
                    <p className="text-muted-foreground mt-4 text-balance text-lg">Understanding Ticketack's technology.</p>
                    <p className="text-muted-foreground mt-6 hidden md:block">
                        Learn more about how our AI-powered ETL pipeline, vector databases, and secure storage work together to optimize your support workflow.
                    </p>
                </div>

                <div className="md:col-span-3">
                    <Accordion type="single" collapsible>
                        {faqItems.map((item) => (
                            <AccordionItem key={item.id} value={item.id}>
                                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-base text-muted-foreground">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                <p className="text-muted-foreground mt-6 md:hidden">
                    Learn more about how our AI-powered ETL pipeline, vector databases, and secure storage work together.
                </p>
            </div>
        </section>
    )
}