import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { Ticket } from '@/types';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    CalendarIcon,
    Check,
    ChevronsUpDown,
    Clock,
    DollarSign,
    Loader2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface PreFillData {
    date: Date;
    hours: number;
    minutes: number;
    description?: string;
    schedule_id?: number;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ticket?: Ticket;
    availableTickets?: { id: number; title: string }[];
    initialValues?: PreFillData;
}

interface FormData {
    ticket_id: string | number;
    date: Date | undefined;
    start_time: string;
    hours: number;
    minutes: number;
    description: string;
    billable: string;
    schedule_id?: number;
}

export function TimeEntryDialog({
    open,
    onOpenChange,
    ticket,
    availableTickets = [],
    initialValues,
}: Props) {
    const __ = useTrans();
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(
        ticket ? ticket.id : null,
    );
    const [comboboxOpen, setComboboxOpen] = useState(false);
    const [datePopoverOpen, setDatePopoverOpen] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        wasSuccessful,
        transform,
    } = useForm<FormData>({
        ticket_id: ticket ? ticket.id : '',
        date: new Date(),
        start_time: format(new Date(), 'HH:mm'),
        hours: 0,
        minutes: 30,
        description: '',
        billable: '0',
    });

    useEffect(() => {
        if (initialValues && open) {
            setData((prev) => ({
                ...prev,
                date: initialValues.date,
                start_time: format(initialValues.date, 'HH:mm'),
                hours: initialValues.hours,
                minutes: initialValues.minutes,
                description: initialValues.description || '',
                schedule_id: initialValues.schedule_id,
                billable: '1',
            }));
        } else if (!open && !initialValues) {
            setData({
                ticket_id: ticket ? ticket.id : '',
                date: new Date(),
                start_time: format(new Date(), 'HH:mm'),
                hours: 0,
                minutes: 30,
                description: '',
                billable: '0',
            });
        }
    }, [initialValues, open, setData, ticket]);

    useEffect(() => {
        if (ticket) {
            setSelectedTicketId(ticket.id);
            setData('ticket_id', ticket.id);
        }
    }, [setData, ticket]);

    useEffect(() => {
        if (wasSuccessful) {
            reset();
            onOpenChange(false);
            if (!ticket) setSelectedTicketId(null);
        }
    }, [wasSuccessful, onOpenChange, reset, ticket]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.date) {
            toast.error(__('entries.dialog.toast.date_required'));
            return;
        }

        transform((data) => ({
            ...data,
            date: format(data.date!, 'yyyy-MM-dd'),
            ticket_id: parseInt(data.ticket_id.toString()),
            billable: data.billable === '1',
            start_time: data.start_time,
            schedule_id: data.schedule_id,
        }));

        post(route('tickets.entries.store'), {
        });
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialValues
                            ? __('schedule.dialog.conversion.title')
                            : __('entries.dialog.title')}
                    </DialogTitle>
                    <DialogDescription>
                        {initialValues
                            ? __('schedule.dialog.conversion.description')
                            : __('entries.dialog.description_indication')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-2">
                    <div className="grid gap-2">
                        <Label>{__('entries.dialog.ticket.label')}</Label>
                        {ticket ? (
                            <div className="flex items-center rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                                <span className="mr-2 font-semibold text-foreground">
                                    #{ticket.id}
                                </span>
                                <span className="truncate">{ticket.title}</span>
                            </div>
                        ) : (
                            <Popover
                                open={comboboxOpen}
                                onOpenChange={setComboboxOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={comboboxOpen}
                                        className={cn(
                                            'w-full justify-between font-normal',
                                            !selectedTicketId &&
                                                'text-muted-foreground',
                                        )}
                                    >
                                        {selectedTicketId
                                            ? availableTickets.find(
                                                  (t) =>
                                                      t.id === selectedTicketId,
                                              )?.title ||
                                              __(
                                                  'entries.dialog.ticket.selected',
                                              )
                                            : __(
                                                  'entries.dialog.ticket.placeholder',
                                              )}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-[calc(100vw-3rem)] p-0 sm:w-[450px]"
                                    align="start"
                                >
                                    <Command>
                                        <CommandInput
                                            placeholder={__(
                                                'entries.dialog.ticket.search',
                                            )}
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                {__(
                                                    'entries.dialog.ticket.empty',
                                                )}
                                            </CommandEmpty>
                                            <CommandGroup>
                                                <div className="max-h-[200px] overflow-y-auto">
                                                    {availableTickets.map(
                                                        (t) => (
                                                            <CommandItem
                                                                key={t.id}
                                                                value={`${t.id} ${t.title}`}
                                                                onSelect={() => {
                                                                    setSelectedTicketId(
                                                                        t.id,
                                                                    );
                                                                    setData(
                                                                        'ticket_id',
                                                                        t.id,
                                                                    );
                                                                    setComboboxOpen(
                                                                        false,
                                                                    );
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        'mr-2 h-4 w-4',
                                                                        selectedTicketId ===
                                                                            t.id
                                                                            ? 'opacity-100'
                                                                            : 'opacity-0',
                                                                    )}
                                                                />
                                                                <span className="truncate">
                                                                    <span className="mr-1 font-medium">
                                                                        #{t.id}
                                                                    </span>{' '}
                                                                    - {t.title}
                                                                </span>
                                                            </CommandItem>
                                                        ),
                                                    )}
                                                </div>
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        )}
                        {errors.ticket_id && (
                            <p className="text-xs text-destructive">
                                {errors.ticket_id}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>{__('entries.dialog.date.label')}</Label>
                            <Popover
                                open={datePopoverOpen}
                                onOpenChange={setDatePopoverOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !data.date &&
                                                'text-muted-foreground',
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {data.date ? (
                                            format(data.date, 'dd MMMM yyyy')
                                        ) : (
                                            <span>
                                                {__(
                                                    'entries.dialog.date.placeholder',
                                                )}
                                            </span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={data.date}
                                        onSelect={(d) => {
                                            setData('date', d);
                                            setDatePopoverOpen(false);
                                        }}
                                        autoFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.date && (
                                <p className="text-xs text-destructive">
                                    {errors.date}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label>
                                {__('schedule.dialog.planning.start_time')}
                            </Label>
                            <div className="relative">
                                <Input
                                    type="time"
                                    value={data.start_time}
                                    onChange={(e) =>
                                        setData('start_time', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="hours">
                                {__('entries.dialog.duration.hours')}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="hours"
                                    type="number"
                                    min="0"
                                    value={data.hours}
                                    onChange={(e) =>
                                        setData(
                                            'hours',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    className="pr-8"
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-xs text-muted-foreground">
                                        {__('entries.dialog.duration.h')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="minutes">
                                {__('entries.dialog.duration.minutes')}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="minutes"
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={data.minutes}
                                    onChange={(e) =>
                                        setData(
                                            'minutes',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    className="pr-10"
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-xs text-muted-foreground">
                                        {__('entries.dialog.duration.min')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(errors.hours || errors.minutes) && (
                        <p className="text-xs text-destructive">
                            {__('entries.dialog.duration.error')}
                        </p>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="description">
                            {__('entries.dialog.description.label')}
                        </Label>
                        <Textarea
                            id="description"
                            placeholder={__(
                                'entries.dialog.description.placeholder',
                            )}
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="min-h-[80px] resize-none"
                            rows={3}
                        />
                        {errors.description && (
                            <p className="text-xs text-destructive">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-3">
                        <Label>{__('entries.dialog.billable.label')}</Label>
                        <RadioGroup
                            value={data.billable}
                            onValueChange={(val) => setData('billable', val)}
                            className="grid grid-cols-2 gap-4"
                        >
                            <label
                                htmlFor="billable-no"
                                className={cn(
                                    'flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 transition-all hover:bg-accent hover:text-accent-foreground',
                                    data.billable === '0' &&
                                        'border-primary bg-primary/5',
                                )}
                            >
                                <RadioGroupItem
                                    value="0"
                                    id="billable-no"
                                    className="sr-only"
                                />
                                <Clock className="mb-2 h-6 w-6 text-muted-foreground" />
                                <span className="text-sm font-semibold">
                                    {__('entries.dialog.billable.standard')}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {__('entries.dialog.billable.not_billable')}
                                </span>
                            </label>

                            <label
                                htmlFor="billable-yes"
                                className={cn(
                                    'flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 transition-all hover:bg-accent hover:text-accent-foreground',
                                    data.billable === '1' &&
                                        'border-primary bg-primary/5',
                                )}
                            >
                                <RadioGroupItem
                                    value="1"
                                    id="billable-yes"
                                    className="sr-only"
                                />
                                <DollarSign className="mb-2 h-6 w-6 text-primary" />
                                <span className="text-sm font-semibold">
                                    {__('entries.dialog.billable.billable')}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {__('entries.dialog.billable.to_bill')}
                                </span>
                            </label>
                        </RadioGroup>
                    </div>

                    <DialogFooter className="gap-2 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            {__('entries.dialog.actions.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !selectedTicketId}
                        >
                            {processing && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {initialValues
                                ? __('schedule.dialog.planning.validate')
                                : __('entries.dialog.actions.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
