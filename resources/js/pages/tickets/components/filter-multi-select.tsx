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
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import React from 'react';

interface FilterOptionBase {
    id: number | string;
    color?: string;
}

interface Props<T extends FilterOptionBase> {
    icon?: React.ReactNode;
    placeholder: string;
    value?: string;
    options: T[];
    onChange: (val: string) => void;
    labelKey?: keyof T;
    className?: string;
}

export function FilterMultiSelect<T extends FilterOptionBase>({
    icon,
    placeholder,
    value,
    options,
    onChange,
    labelKey = 'title' as keyof T,
    className,
}: Props<T>) {
    const __ = useTrans();
    const selectedValues = new Set(value ? value.split(',') : []);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        'h-9 border-dashed text-xs shadow-sm hover:bg-muted/50',
                        className,
                    )}
                >
                    {icon && (
                        <span className="mr-2 text-muted-foreground">
                            {icon}
                        </span>
                    )}
                    {placeholder}

                    {selectedValues.size > 0 && (
                        <>
                            <Separator
                                orientation="vertical"
                                className="mx-2 h-4"
                            />
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
                                        {__(
                                            'tickets.pages.index.toolbar.selection.selected',
                                        )}
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) =>
                                            selectedValues.has(
                                                option.id.toString(),
                                            ),
                                        )
                                        .map((option) => (
                                            <Badge
                                                variant="secondary"
                                                key={option.id}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {String(option[labelKey])}
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
                    <CommandInput placeholder={placeholder} />
                    <CommandList>
                        <CommandEmpty>
                            {__(
                                'tickets.pages.index.toolbar.selection.no_results',
                            )}
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const idStr = option.id.toString();
                                const isSelected = selectedValues.has(idStr);

                                return (
                                    <CommandItem
                                        key={option.id}
                                        onSelect={() => {
                                            const newSet = new Set(
                                                selectedValues,
                                            );
                                            if (isSelected) {
                                                newSet.delete(idStr);
                                            } else {
                                                newSet.add(idStr);
                                            }
                                            onChange(
                                                Array.from(newSet).join(','),
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
                                        {option.color && (
                                            <div
                                                className="mr-2 h-2 w-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        option.color,
                                                }}
                                            />
                                        )}
                                        <span>{String(option[labelKey])}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => onChange('')}
                                        className="justify-center text-center"
                                    >
                                        {__(
                                            'tickets.pages.index.toolbar.clear',
                                        )}
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
