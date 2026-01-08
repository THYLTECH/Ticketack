import {
    FilterButtonContent,
    getToolbarButtonStyle,
} from '@/components/data-toolbar';
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
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, PlusCircle } from 'lucide-react';
import * as React from 'react';

interface Option {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface FilterMultiSelectProps {
    title?: string;
    placeholder?: string;
    options: Option[];
    value?: string;
    onChange: (value: string) => void;
    className?: string;
    icon?: React.ReactNode;
}

export function FilterMultiSelect({
    title,
    placeholder,
    options,
    value,
    onChange,
    className,
    icon,
}: FilterMultiSelectProps) {
    const __ = useTrans();
    const selectedValues = new Set(value ? value.split(',') : []);

    const handleSelect = (optionValue: string) => {
        const newSelectedValues = new Set(selectedValues);
        if (newSelectedValues.has(optionValue)) {
            newSelectedValues.delete(optionValue);
        } else {
            newSelectedValues.add(optionValue);
        }
        const filterValues = Array.from(newSelectedValues);
        onChange(filterValues.length ? filterValues.join(',') : '');
    };

    const handleClear = () => {
        onChange('');
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        getToolbarButtonStyle(selectedValues.size > 0),
                        className,
                    )}
                >
                    <FilterButtonContent
                        icon={icon || <PlusCircle className="mr-2 h-4 w-4" />}
                        title={title}
                        isSelected={selectedValues.size > 0}
                    >
                        <Badge
                            variant="secondary"
                            className="rounded-sm px-1 font-normal lg:hidden"
                        >
                            {selectedValues.size}
                        </Badge>
                        <div className="hidden space-x-1 lg:flex">
                            {selectedValues.size > 2 ? (
                                <Badge
                                    variant="secondary"
                                    className="rounded-sm px-1 font-normal"
                                >
                                    {selectedValues.size}{' '}
                                    {__('common.filters.selected') ||
                                        'selected'}
                                </Badge>
                            ) : (
                                options
                                    .filter((option) =>
                                        selectedValues.has(option.value),
                                    )
                                    .map((option) => (
                                        <Badge
                                            key={option.value}
                                            variant="secondary"
                                            className="rounded-sm px-1 font-normal"
                                        >
                                            {option.label}
                                        </Badge>
                                    ))
                            )}
                        </div>
                    </FilterButtonContent>
                    <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={placeholder || title} />
                    <CommandList>
                        <CommandEmpty>
                            {__('common.filters.no_results') ||
                                'No results found.'}
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedValues.has(
                                    option.value,
                                );
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() =>
                                            handleSelect(option.value)
                                        }
                                    >
                                        <div
                                            className={cn(
                                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'opacity-50 [&_svg]:invisible',
                                            )}
                                        >
                                            <Check className={cn('h-4 w-4')} />
                                        </div>
                                        {option.icon && (
                                            <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                        )}
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
                                        onSelect={handleClear}
                                        className="justify-center text-center"
                                    >
                                        {__('common.filters.clear') ||
                                            'Clear filters'}
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
