import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import * as React from 'react';
import { FilterOption } from '../types';

interface FilterProps {
    title: string;
    icon?: React.ReactNode;
    options: FilterOption[];
    value: string | null;
    onChange: (value: string | null) => void;
}

export function FilterDropdown({
    title,
    icon,
    options,
    value,
    onChange,
}: FilterProps) {
    const selectedValues = new Set(value ? value.split(',') : []);
    const [open, setOpen] = React.useState(false);

    const triggerClass = cn(
        'h-9 border-dashed text-xs shadow-sm transition-colors',
        'hover:border-emerald-500/50 hover:bg-emerald-50/50 hover:text-emerald-900 dark:hover:text-emerald-500',
        selectedValues.size > 0
            ? 'border-solid border-emerald-500/50 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-500'
            : 'bg-transparent text-muted-foreground hover:text-foreground',
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={triggerClass}>
                    {icon && <span className="mr-2 opacity-70">{icon}</span>}
                    {title}
                    {selectedValues.size > 0 && (
                        <>
                            <Separator
                                orientation="vertical"
                                className="mx-2 h-4"
                            />
                            <div className="flex space-x-1">
                                {selectedValues.size > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 text-[10px] font-normal"
                                    >
                                        {selectedValues.size} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) =>
                                            selectedValues.has(option.value),
                                        )
                                        .map((option) => (
                                            <Badge
                                                variant="secondary"
                                                key={option.value}
                                                className="rounded-sm px-1 text-[10px] font-normal"
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedValues.has(
                                    option.value,
                                );
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            const newSet = new Set(
                                                selectedValues,
                                            );
                                            if (isSelected) {
                                                newSet.delete(option.value);
                                            } else {
                                                newSet.add(option.value);
                                            }
                                            const filterValues =
                                                Array.from(newSet);
                                            onChange(
                                                filterValues.length
                                                    ? filterValues.join(',')
                                                    : null,
                                            );
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'opacity-50 [&_svg]:invisible',
                                            )}
                                        >
                                            <Check className="h-4 w-4" />
                                        </div>
                                        <span>{option.label}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => onChange(null)}
                                        className="justify-center text-center font-medium"
                                    >
                                        Clear
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
