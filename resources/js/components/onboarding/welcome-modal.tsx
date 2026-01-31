import * as React from 'react';
import { useState, useEffect } from 'react';
import { useOnboarding } from './onboarding-provider';
import { Button } from '@/components/ui/button';
import { useTrans } from '@/lib/translation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { BookOpen } from 'lucide-react';

export function WelcomeModal() {
    const { showOnboarding, hasSeenPage, markPageAsSeen } = useOnboarding();
    const [isOpen, setIsOpen] = useState(false);
    const __ = useTrans();

    useEffect(() => {
        if (showOnboarding && !hasSeenPage('welcome')) {
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [showOnboarding, hasSeenPage]);

    const handleClose = () => {
        setIsOpen(false);
        markPageAsSeen('welcome');
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md" showCloseButton={false}>
                <DialogHeader className="items-center">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center">
                        {__('onboarding.welcome.title')}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {__('onboarding.welcome.description')}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="sm:justify-center">
                    <Button onClick={handleClose}>
                        {__('onboarding.welcome.button')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
