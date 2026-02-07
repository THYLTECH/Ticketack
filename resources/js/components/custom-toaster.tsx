// layouts/app/custom-toaster.tsx

import { useAppearance } from '@/hooks/use-appearance';
import { useTrans } from '@/lib/translation';
import { Check, Info, Loader2, X } from 'lucide-react';
import { useEffect } from 'react';
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

    const __ = useTrans();

    useEffect(() => {
        const flashSuccess = props.flash?.success ?? props.success;
        const flashError = props.flash?.error ?? props.error;
        const validationErrors = props.errors;

        if (validationErrors) {
            const messages = Object.values(validationErrors);
            messages.forEach((msg) => {
                if (msg) {
                    toast.error(__('common.flash.error'), {
                        description: msg,
                    });
                }
            });
        }

        if (flashSuccess) {
            if (typeof flashSuccess === 'string') {
                toast.success(flashSuccess);
            } else {
                toast.success(flashSuccess.title, {
                    description: flashSuccess.description,
                });
            }
        }

        if (flashError) {
            if (typeof flashError === 'string') {
                toast.error(flashError);
            } else {
                toast.error(flashError.title, {
                    description: flashError.description,
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.flash, props.success, props.error, props.errors]);

    return (
        <Toaster
            icons={{
                success: <Check className="h-4 w-4 !text-primary" />,
                error: <X className="h-4 w-4 !text-destructive" />,
                info: <Info className="h-4 w-4 !text-muted-foreground" />,
                loading: (
                    <Loader2 className="h-4 w-4 animate-spin !text-muted-foreground" />
                ),
            }}
            toastOptions={{
                classNames: {
                    title: 'text-sm font-base !text-foreground',
                    description: 'text-xs !text-muted-foreground',
                    closeButton: `
                        !right-0 !top-3 !left-auto absolute
                        hover:!bg-accent !border-border !bg-transparent !text-foreground
                        dark:!text-foreground
                    `,
                    toast: '!bg-card !border !border-border',
                },
            }}
            duration={4000}
            theme={appearance}
            position={'top-center'}
            closeButton
        />
    );
}
