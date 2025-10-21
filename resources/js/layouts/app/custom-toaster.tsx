// layouts/app/custom-toaster.tsx

import { useAppearance } from '@/hooks/use-appearance';
import { Check, Info, Loader2, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast, Toaster } from 'sonner';

type FlashMessage =
    | string
    | {
          title: string;
          description?: string;
      };

interface FlashProps {
    success?: FlashMessage;
    error?: FlashMessage;
    flash?: {
        success?: FlashMessage;
        error?: FlashMessage;
    };
    errors?: Record<string, string>;
}

export function CustomToaster(props: FlashProps) {
    const { appearance } = useAppearance();
    const displayed = useRef<{
        success: FlashMessage | null;
        error: FlashMessage | null;
    }>({
        success: null,
        error: null,
    });

    useEffect(() => {
        const flashSuccess = props.flash?.success ?? props.success;
        const flashError = props.flash?.error ?? props.error;
        const validationErrors = props.errors;

        if (validationErrors) {
            const messages = Object.values(validationErrors);
            messages.forEach((msg) => {
                if (msg && msg !== displayed.current.error) {
                    displayed.current.error = msg;
                    toast.error('An validation error occurred', { description: msg });
                }
            });
        }

        if (flashSuccess && flashSuccess !== displayed.current.success) {
            displayed.current.success = flashSuccess;
            if (typeof flashSuccess === 'string') {
                toast.success(flashSuccess);
            } else {
                toast.success(flashSuccess.title, {
                    description: flashSuccess.description,
                });
            }
        }

        if (flashError && flashError !== displayed.current.error) {
            displayed.current.error = flashError;
            if (typeof flashError === 'string') {
                toast.error(flashError);
            } else {
                toast.error(flashError.title, {
                    description: flashError.description,
                });
            }
        }
    }, [props.flash, props.success, props.error, props.errors]);

    return (
        <Toaster
            icons={{
                success: <Check className="h-4 w-4 text-primary" />,
                error: <X className="h-4 w-4 text-destructive" />,
                info: <Info className="h-4 w-4 text-muted-foreground" />,
                loading: (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ),
            }}
            toastOptions={{
                classNames: {
                    title: 'text-sm font-base text-foreground',
                    description: 'text-xs !text-muted-foreground',
                    closeButton:
                        '!right-0 !top-3 !left-auto absolute hover:!bg-accent hover:!border-border',
                    toast: '!bg-card',
                },
            }}
            duration={4000}
            theme={appearance}
            position={'top-center'}
            closeButton
        />
    );
}
