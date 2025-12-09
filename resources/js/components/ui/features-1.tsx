import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Settings2, Sparkles , SquareKanban, Calendar , BugOff ,Tags} from 'lucide-react'
import React from 'react';
import { ReactNode } from 'react'

interface FeaturesProps
{
    achievementsTitle?: string;
    achievementsDescription?: string;
    achievements?: Array<{
        label: string;
        value: string;
        icon?: string;
    }>;
}
const defaultAchievements = [
    { label: "Companies ", value: "300+",},
    { label: "Projects ", value: "300+" },
    { label: "Team Members ", value: "300+"},
    { label: "Users ", value: "300+"},
]
export default function Features(
    {
        achievementsTitle = "Our Achievements in Numbers",
        achievementsDescription = "Providing businesses with effective tools to improve workflows, boost efficiency, and encourage growth.",
        achievements = defaultAchievements
    } : FeaturesProps) {
    
    return (
        <section className="bg-zinc-50 py-8 md:py-16 dark:bg-transparent">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">{achievementsTitle}</h2>
                    <p className="mt-4">{achievementsDescription}</p>
                </div>
                <div className="@min-4xl:max-w-full @min-4xl:grid-cols-4 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
                    {achievements.map(({ label, value, icon }) => (
                        <Card key={label} className="shadow-zinc-950/5">
                            <CardHeader className="pb-3">
                                <CardDecorator>
                                    {
                                        icon === "Calendar" ? (
                                            <Calendar className="h-8 w-8" aria-hidden />
                                        ) : icon === "Bugoff" ? (
                                            <BugOff className="h-8 w-8" aria-hidden />
                                        ) : icon === "Settings2" ? (
                                            <Settings2 className="h-8 w-8" aria-hidden />
                                        ) : icon === "SquareKanban" ? (
                                            <SquareKanban className="h-8 w-8" aria-hidden />
                                        ) : icon === "Tags" ? (
                                            <Tags className="h-8 w-8" aria-hidden />
                                        ) : (
                                            <Sparkles className="h-8 w-8" aria-hidden />
                                        )
                                    }
                                </CardDecorator>
                            </CardHeader>
                            
                            <CardContent>
                                <h3 className="text-lg font-semibold">{label}</h3>
                                <p className="mt-2 text-sm">{value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
        />

        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)
