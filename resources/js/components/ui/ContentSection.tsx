
export default function ContentSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">Ticketack: The Unified Platform for Simplified Ticket Management</h2>
                <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
                    <div className="relative mb-6 sm:mb-0">
                        <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                            <img src="./images/thyltech_logo_black.png" className="hidden rounded-[15px] dark:block" alt="payments illustration dark" width={1207} height={929} />
                            <img src="./images/thyltech_logo_black.png" className="rounded-[15px] shadow dark:hidden" alt="payments illustration light" width={1207} height={929} />
                        </div>
                    </div>

                    <div className="relative space-y-4">
                        <p className="text-muted-foreground">
                            Our mission is to <span className="text-accent-foreground font-bold">centralize and simplify</span> the tracking of all your technical issues.
                        </p>
                        <p className="text-muted-foreground">This tool reduces difficult tracking, loss of information and lack of visibility caused by problem reports via emails.</p>

                        <div className="pt-6">
                            <blockquote className="border-l-4 pl-4">
                                <p>Using Ticketack gave us a lot of time back to focus on our core business</p>

                                <div className="mt-6 space-y-3">
                                    <cite className="block font-medium">Ludovic ISAERT, CEO</cite>
                                    <img className="h-5 w-fit dark:invert" src="https://id-ingenierie.com/wp-content/uploads/2019/12/logo_texte_long_noir@3x-1024x131.png" alt="ID-Ingenierie Logo" height="20" width="auto" />
                                </div>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}