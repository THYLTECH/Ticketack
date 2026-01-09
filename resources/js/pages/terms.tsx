// resources/js/components/landing/sections/terms.tsx

import ArrowUp from '@/components/landing/layout/arrow-up';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {

    return (
        <>
            <Head title="Terms of Use" />

            <ArrowUp />

            <main className="mx-auto max-w-6xl border-r border-l px-8">
                <section className="mx-auto max-w-4xl px-6 py-16 md:py-24">
                    <Button variant={'link'} className="!px-0 pb-8" asChild>
                        <Link href={route('landing')}>
                            <ArrowLeft />
                            Back to Home
                        </Link>
                    </Button>

                    <div className="mb-12 flex flex-col gap-4 border-b pb-8">
                        <Badge variant="outline" className="w-fit">
                            Legal Documentation
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
                            Terms of Use
                        </h1>
                        <p className="text-muted-foreground">
                            Last updated: January 2026
                        </p>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-10">
                        <div className="space-y-4">
                            <h2 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
                                1. Introduction
                            </h2>
                            <p className="leading-relaxed text-muted-foreground">
                                Welcome to <strong>Ticketack</strong>. By
                                accessing this platform, you agree to be bound
                                by these Terms of Use. As an open-source
                                project, Ticketack is designed to provide an
                                intelligent infrastructure for ticket
                                management. If you do not agree with any part of
                                these terms, please do not use this application.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">
                                2. Intellectual Property & Open Source
                            </h2>
                            <p className="leading-relaxed text-muted-foreground">
                                The core source code of Ticketack is available
                                on GitHub and is licensed under the{' '}
                                <strong>MIT License</strong>. While the code is
                                open-source, the specific branding, logos, and
                                UI assets are the property of the project
                                maintainers unless otherwise stated. You are
                                free to fork, modify, and deploy the application
                                in accordance with the MIT license terms, which
                                require the inclusion of the original copyright
                                notice.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">
                                3. Limitation of Liability
                            </h2>
                            <p className="leading-relaxed text-muted-foreground">
                                This website and the software are provided{' '}
                                <strong>"as is"</strong>, without warranty of
                                any kind, express or implied. In no event shall
                                the authors or copyright holders be liable for
                                any claim, damages, or other liability, whether
                                in an action of contract, tort, or otherwise,
                                arising from, out of, or in connection with the
                                software or the use or other dealings in the
                                software.
                            </p>
                            <p className="leading-relaxed text-muted-foreground">
                                This includes, but is not limited to, data loss
                                within your MinIO storage, Redis queue failures,
                                or inaccuracies in the AI-generated output from
                                the BGE-M3 model.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">
                                4. Usage & Infrastructure
                            </h2>
                            <p className="leading-relaxed text-muted-foreground">
                                Users deploying Ticketack are responsible for
                                their own infrastructure costs and security.
                                This includes the proper configuration of Docker
                                containers, environment variables, and access
                                controls for the integrated LanceDB and MinIO
                                services.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold text-foreground">
                                5. Contact
                            </h2>
                            <p className="leading-relaxed text-muted-foreground">
                                For any questions regarding these Terms or the
                                project's development, you can reach out through
                                the official GitHub repository or the contact
                                methods provided on the platform's home page.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground italic">
                        Ticketack — An Open Source AI Ticket Management System.
                    </div>
                </section>
            </main>
        </>
    );
}
