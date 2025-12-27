import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
    date: DateRange | undefined;
    onSelect: (date: DateRange | undefined) => void;
    className?: string;
    placeholder?: string;
    align?: "center" | "end" | "start";
}

export function DateRangeFilter({
    date,
    onSelect,
    className,
    placeholder = "Select a date",
    align = "end"
}: DateRangePickerProps) {
    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[260px] justify-start text-left font-normal shadow-sm hover:bg-accent",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "dd LLL yyyy")} -{" "}
                                    {format(date.to, "dd LLL yyyy")}
                                </>
                            ) : (
                                format(date.from, "dd LLL yyyy")
                            )
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 shadow-xl border-border" align={align}>
                    <Calendar
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={onSelect}
                        className="rounded-md border-none"
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}