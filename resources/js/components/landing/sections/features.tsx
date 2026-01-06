// resources/js/components/landing/sections/features.tsx

// Icons
import { Badge } from '@/components/ui/badge';
import {
    Cpu,
    Fingerprint,
    Pencil,
    Rocket,
    Settings2,
    Sparkles,
    Zap,
} from 'lucide-react';

export default function Features() {
    return (
        <section className="py-12 md:py-20">
            <div className="space-y-8 md:space-y-16">
                <div className="relative z-10 space-y-6 md:space-y-12">
                    <div className='flex flex-col gap-4'>
                        <Badge variant={'outline'}>
                            <Rocket />
                            Features
                        </Badge>
                        <h2 className="text-4xl font-medium text-balance lg:text-5xl">
                            Lorem ipsum dolor sit amet
                        </h2>
                    </div>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit. Sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua ut enim ad minim veniam.
                    </p>
                </div>

                <div className="relative grid divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4" />
                            <h3 className="text-sm font-medium">Lorem One</h3>
                        </div>
                        <p className="text-sm">
                            Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4" />
                            <h3 className="text-sm font-medium">Lorem Two</h3>
                        </div>
                        <p className="text-sm">
                            Excepteur sint occaecat cupidatat non proident,
                            sunt in culpa qui officia deserunt.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Fingerprint className="size-4" />

                            <h3 className="text-sm font-medium">Lorem Three</h3>
                        </div>
                        <p className="text-sm">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Pencil className="size-4" />

                            <h3 className="text-sm font-medium">
                                Lorem Four
                            </h3>
                        </div>
                        <p className="text-sm">
                            Nemo enim ipsam voluptatem quia voluptas sit
                            aspernatur aut odit aut fugit.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Settings2 className="size-4" />

                            <h3 className="text-sm font-medium">Lorem Five</h3>
                        </div>
                        <p className="text-sm">
                            Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4" />

                            <h3 className="text-sm font-medium">
                                Lorem Six
                            </h3>
                        </div>
                        <p className="text-sm">
                            Quis autem vel eum iure reprehenderit qui in ea
                            voluptate velit esse quam nihil molestiae.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
