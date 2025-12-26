import * as React from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useTrans } from '@/lib/translation'

interface MultiSelectSimpleProps {
    label?: string;
    placeholder?: string;
    items: { id: string; label: string }[];
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
};

const MultiSelectSimple = ({ label, placeholder, items, selectedIds, onSelectionChange }: MultiSelectSimpleProps) => {
    const __ = useTrans(); 
    const id = React.useId();
    const [open, setOpen] = React.useState(false);

    const isAllSelected = items.length > 0 && selectedIds.length === items.length;

    const toggleItem = (itemId: string) => {
        const next = selectedIds.includes(itemId)
            ? selectedIds.filter((i) => i !== itemId)
            : [...selectedIds, itemId];
        onSelectionChange(next);
    };

    const toggleAll = () => {
        onSelectionChange(isAllSelected ? [] : items.map((i) => i.id));
    };

    return (
        <div className='w-full space-y-2'>
            {label && <Label htmlFor={id}>{label}</Label>}
            <Popover open={open} onOpenChange={setOpen} modal={false}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between pl-2 h-auto min-h-10 hover:bg-background border-input p-1"
                    >
                        <div className="flex flex-wrap gap-1 items-center max-h-24 overflow-y-auto w-full pr-2 py-1">
                            {selectedIds.length > 0 ? (
                                selectedIds.map((itemId) => {
                                    const item = items.find((i) => i.id === itemId)
                                    return (
                                        <Badge key={itemId} variant="secondary" className="rounded-sm px-1 font-normal flex items-center gap-1 shrink-0">
                                            {item?.label || itemId}
                                            <span
                                                role="button"
                                                className="ml-1 rounded-full outline-none hover:bg-muted-foreground/20 p-0.5"
                                                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleItem(itemId); }}
                                            >
                                                <X className="size-3 text-muted-foreground hover:text-foreground" />
                                            </span>
                                        </Badge>
                                    )
                                })
                            ) : (
                                <span className="text-muted-foreground ml-1">{placeholder || __('components.ui.multi_select.placeholder_assets') }</span>
                            )}
                        </div>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 z-50" align="start">
                    <Command className='w-full'>
                        <CommandInput placeholder={__('components.ui.multi_select.search_asset')} />
                        <CommandList>
                            <CommandEmpty>{__('components.ui.multi_select.no_user_found')}</CommandEmpty>
                            <CommandGroup>
                                <CommandItem onSelect={toggleAll} className='flex items-center gap-2 px-2 font-medium cursor-pointer'>
                                    <div className={cn(
                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                        isAllSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                                    )}>
                                        {isAllSelected && <Check className="h-3 w-3" />}
                                    </div>
                                    <span>{isAllSelected ? "Deselect all" : "Select all"}</span>
                                </CommandItem>
                                <CommandSeparator className="my-1" />
                                {items.map((item) => (
                                    <CommandItem key={item.id} onSelect={() => toggleItem(item.id)} className='flex items-center gap-2 px-2 cursor-pointer'>
                                        <div className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                            selectedIds.includes(item.id) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                        )}>
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span className='truncate'>{item.label}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default MultiSelectSimple;