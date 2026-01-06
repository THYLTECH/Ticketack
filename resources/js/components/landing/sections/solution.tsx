// resources/js/components/landing/sections/solution.tsx

// Shadnc UI Components
import { Badge } from '@/components/ui/badge';

// Icons
import { Cpu, Target, Zap } from 'lucide-react';

export default function Solution() {
    return (
        <>
            <section className="py-16 md:py-32">
                <div className="space-y-8 md:space-y-16">
                    <div className='flex flex-col gap-4'>
                        <Badge variant={'outline'}>
                            <Target />
                            Our Solution
                        </Badge>
                        <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
                            Lorem ipsum dolor sit amet.
                        </h2>
                    </div>
                    <div className="relative">
                        <div className="relative z-10 space-y-4 md:w-1/2">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing
                                elit.{' '}
                                <span className="font-medium">
                                    Sed do eiusmod tempor
                                </span>{' '}
                                incididunt ut labore et dolore magna aliqua.
                            </p>
                            <p>
                                Ut enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo
                                consequat.
                            </p>

                            <div className="grid grid-cols-2 gap-3 pt-6 sm:gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Zap className="size-4" />
                                        <h3 className="text-sm font-medium">
                                            Placeholder A
                                        </h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Duis aute irure dolor in reprehenderit in
                                        voluptate velit esse cillum dolore.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Cpu className="size-4" />
                                        <h3 className="text-sm font-medium">
                                            Placeholder B
                                        </h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Excepteur sint occaecat cupidatat non
                                        proident, sunt in culpa qui officia
                                        deserunt.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 h-fit md:absolute md:inset-x-0 md:-inset-y-12 md:mt-0 md:mask-l-from-35% md:mask-l-to-55%">
                            <div className="relative rounded-2xl border border-dotted border-border/50 p-2">
                                <img
                                    src="images/placeholder.svg"
                                    className="hidden max-h-[300px] w-full rounded-[12px] object-cover dark:block"
                                    alt="placeholder dark"
                                    width={1207}
                                    height={929}
                                />
                                <img
                                    src="images/placeholder.svg"
                                    className="rounded-[12px] max-h-[300px] shadow w-full object-cover dark:hidden"
                                    alt="placeholder light"
                                    width={1207}
                                    height={929}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-16 md:py-32">
                <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-medium">Lorem ipsum dolor sit amet.</h2>
                    <div className="space-y-6">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. <span className="font-bold">Sed do eiusmod tempor</span> incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
