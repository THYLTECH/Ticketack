import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

interface DatePickerWithRangeProps
    extends React.HTMLAttributes<HTMLDivElement> {
    date: DateRange | undefined;
    onDateChange: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
                                        className,
                                        date,
                                        onDateChange,
                                    }: DatePickerWithRangeProps) {
    const __ = useTrans();

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={'outline'}
                        size="sm"
                        className={cn(
                            'h-8 w-fit justify-start text-left font-normal shadow-none transition-all',
                            !date &&
                            'border-dashed bg-transparent text-muted-foreground hover:bg-muted/50',
                            date &&
                            'border-solid border-primary/50 bg-accent font-medium text-accent-foreground',
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'LLL dd, y')} -{' '}
                                    {format(date.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>{__('entries.toolbar.date_range')}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={onDateChange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
