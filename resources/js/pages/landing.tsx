// pages/welcome.tsx

// Necessary imports
import { Head, Link, usePage } from '@inertiajs/react';
import { useUpdateThemes } from '@/hooks/use-update-theme';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Shadcn UI Components
import { Button } from '@/components/ui/button';

// Types
import { type SharedData } from '@/types';
import { About3 } from '@/components/ui/About3';
import ContentSection from '@/components/ui/ContentSection';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const __ = useTrans();
    useUpdateThemes();

    return (
        <>
            <Head title="Landing page" />
            <div className="flex min-h-screen flex-col items-center p-6 lg:justify-center lg:p-8 ">
            <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 lg:px-8">
                    <img src="./images/Logo_temp_Ticketack.png" alt="Ticketack Logo" className="h-12 w-12" />
                    <nav className="flex items-center gap-2 sm:gap-4">
                        {auth.user ? (
                            <Button asChild variant={'default'} className="shadow-md">
                                <Link href={route('dashboard')}>{__('landing.pages.buttons.home')}</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant={'ghost'} className="text-foreground hover:bg-accent hover:text-accent-foreground">
                                    <Link href={route('auth.login')}>{__('landing.pages.buttons.login')}</Link>
                                </Button>
                                <Button asChild variant={'default'} className="shadow-md"> 
                                    <Link href={route('auth.register')}>
                                        {__('landing.pages.buttons.register')}
                                    </Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            </header>
                <About3 
                    title={__("landing.pages.title")} 
                    description={__("landing.pages.description")}
                    breakout={
                        {
                            src : "https://id-ingenierie.com/wp-content/uploads/2019/12/logo_texte_long_noir@3x-1024x131.png",
                            alt : "logo",
                            companyTitle : __("landing.pages.breakout.companyTitle"),
                            companyDescription :__("landing.pages.breakout.companyDescription"),
                            teamTitle : __("landing.pages.breakout.teamTitle"),
                            teamDescription : __("landing.pages.breakout.teamDescription"),
                            buttonText : __("landing.pages.buttons.company"),
                            buttonUrl : "https://id-ingenierie.com/",
                        }}
     
                    companiesTitle=''
                    companies = {[
                    ]}

                    mainImage={
                        {
                            src :"./images/app_preview.png",
                            alt : "App preview"
                        }}
                    achievementsTitle={__("landing.pages.achievementsTitle")}
                    achievementsDescription={__("landing.pages.achievementsDescription")}
                    achievements={[
                        {
                            label: __("landing.pages.achievements.1.label"),
                            value: __("landing.pages.achievements.1.value"),
                            icon : "SquareKanban",
                        },
                        {
                            label: __("landing.pages.achievements.2.label"),
                            value: __("landing.pages.achievements.2.value"),
                            icon : "Bugoff",
                        },
                        {
                            label: __("landing.pages.achievements.3.label"),
                            value: __("landing.pages.achievements.3.value"),
                            icon : "Tags"
                        },
                        {
                            label: __("landing.pages.achievements.4.label"),
                            value: __("landing.pages.achievements.4.value"),
                            icon : "Calendar"
                        }
                    ]}
                />
            </div>
        </>
    );
}
