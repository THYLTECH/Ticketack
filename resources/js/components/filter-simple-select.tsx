import {
    FilterButtonContent,
    getToolbarButtonStyle,
} from '@/components/data-toolbar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import { useTrans } from '@/lib/translation';
import React from 'react';

export interface FilterOption {
    value: string;
    label: string;
    color?: string;
}

interface FilterSimpleSelectProps {
    title: string;
    value?: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    icon?: React.ReactNode;
    placeholder?: string;
}

export function FilterSimpleSelect({
    title,
    value,
    onChange,
    options,
    icon,
    placeholder = 'All',
}: FilterSimpleSelectProps) {
    const __ = useTrans();
    const isSelected = value && value !== 'all';
    const selectedOption = options.find((o) => o.value === value);

    return (
        <Select value={value || 'all'} onValueChange={onChange}>
            <SelectTrigger className={getToolbarButtonStyle(!!isSelected)}>
                <FilterButtonContent
                    icon={icon}
                    title={title}
                    isSelected={!!isSelected}
                >
                    {selectedOption && (
                        <span className="max-w-[80px] truncate">
                            {selectedOption.label}
                        </span>
                    )}
                </FilterButtonContent>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">
                    {placeholder === 'All'
                        ? __('common.filters.all') || 'All'
                        : placeholder}
                </SelectItem>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                            {option.color && (
                                <div
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: option.color }}
                                />
                            )}
                            {option.label}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
