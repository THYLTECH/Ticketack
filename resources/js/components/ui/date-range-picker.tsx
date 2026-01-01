import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

interface DatePickerWithRangeProps
    extends React.HTMLAttributes<HTMLDivElement> {
    date: DateRange | undefined;
    onDateChange: (date: DateRange | undefined) => void;
    placeholder?: string;
}

export function DatePickerWithRange({
                                        className,
                                        date,
                                        onDateChange,
                                        placeholder = 'Pick a date',
                                    }: DatePickerWithRangeProps) {
    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        size="sm"
                        className={cn(
                            'h-9 w-fit justify-start text-left font-normal border-dashed shadow-sm hover:bg-muted/50',
                            !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5 opacity-50" />
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
                            <span>{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        autoFocus
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
