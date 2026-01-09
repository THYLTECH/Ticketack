import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ListFilter, Search, X } from 'lucide-react';
import React from 'react';

interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Toolbar({ children, className, ...props }: ToolbarProps) {
    return (
        <div
            className={cn(
                'flex w-full items-center justify-between rounded-md border bg-background p-2 pl-3 shadow-sm',
                className,
            )}
            {...props}
        >
            <div className="flex flex-1 flex-wrap items-center gap-2">
                {children}
            </div>
        </div>
    );
}

export function ToolbarLabel({ label }: { label: string }) {
    return (
        <>
            <div className="ml-2 hidden items-center gap-2 text-sm font-medium text-muted-foreground md:flex">
                <ListFilter className="h-4 w-4" />
                <span>{label}</span>
            </div>
            <Separator
                orientation="vertical"
                className="mr-2 hidden h-6 md:block"
            />
        </>
    );
}

interface ToolbarSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function ToolbarSearch({
    value,
    onChange,
    placeholder,
    className,
}: ToolbarSearchProps) {
    return (
        <div className="relative flex items-center">
            <Search className="absolute left-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
                placeholder={placeholder}
                className={cn(
                    'h-8 w-37.5 border-dashed bg-transparent pl-8 text-xs shadow-none focus-visible:border-solid focus-visible:ring-1 lg:w-62.5',
                    className,
                )}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

interface ToolbarResetProps {
    onClick: () => void;
    label: string;
}

export function ToolbarReset({ onClick, label }: ToolbarResetProps) {
    return (
        <>
            <Separator
                orientation="vertical"
                className="mx-1 hidden h-6 sm:block"
            />
            <Button
                variant="ghost"
                onClick={onClick}
                size="sm"
                className="h-8 border-solid px-2 text-xs font-medium text-muted-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
            >
                {label}
                <X className="ml-2 h-3.5 w-3.5" />
            </Button>
        </>
    );
}

export function ToolbarSeparator() {
    return (
        <Separator
            orientation="vertical"
            className="mx-1 hidden h-6 sm:block"
        />
    );
}

export function getToolbarButtonStyle(isActive: boolean = false) {
    return cn(
        'h-9 w-auto min-w-[100px] justify-start border-dashed text-left text-xs font-normal shadow-none transition-all hover:bg-accent hover:text-accent-foreground',
        isActive
            ? 'border-solid border-primary/50 bg-accent font-medium text-accent-foreground'
            : 'bg-transparent text-muted-foreground',
    );
}

interface FilterButtonContentProps {
    icon?: React.ReactNode;
    title?: string;
    isSelected: boolean;
    children?: React.ReactNode;
}

export function FilterButtonContent({
    icon,
    title,
    isSelected,
    children,
}: FilterButtonContentProps) {
    return (
        <div className="flex items-center gap-2">
            {icon}
            <span className={cn(isSelected && 'font-semibold')}>{title}</span>
            {isSelected && children && (
                <>
                    <Separator orientation="vertical" className="mx-1 h-3" />
                    {children}
                </>
            )}
        </div>
    );
}
