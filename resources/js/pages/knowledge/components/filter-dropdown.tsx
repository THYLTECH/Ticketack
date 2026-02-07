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
import { useTrans } from '@/lib/translation';

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
    const __ = useTrans();

    const triggerClass = cn(
        'h-9 border-dashed text-xs shadow-sm transition-colors',
        'hover:border-primary/50 hover:bg-primary/10 hover:text-primary',
        selectedValues.size > 0
            ? 'border-solid border-primary/50 bg-primary/10 text-primary'
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
                                        {selectedValues.size} {__('knowledge.filters.selected')}
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
                        <CommandEmpty>{__('knowledge.filters.empty')}</CommandEmpty>
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
                                        {__('knowledge.filters.clear')}
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
