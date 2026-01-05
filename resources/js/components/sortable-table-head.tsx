import { Button } from '@/components/ui/button';
import { TableHead } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

interface Props {
    label: string;
    column: string;
    currentSort: string;
    currentDirection: 'asc' | 'desc';
    onSort: (column: string) => void;
    className?: string;
}

export function SortableTableHead({
    label,
    column,
    currentSort,
    currentDirection,
    onSort,
    className,
}: Props) {
    const isActive = currentSort === column;

    return (
        <TableHead className={className}>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onSort(column)}
                className={cn(
                    '-ml-3 h-8 text-xs font-semibold tracking-wider uppercase transition-colors',
                    isActive
                        ? 'font-bold text-foreground'
                        : 'text-muted-foreground/70 hover:text-foreground',
                    className?.includes('text-right') && 'ml-auto',
                )}
            >
                {label}
                <div className="ml-2 flex flex-col">
                    {isActive ? (
                        currentDirection === 'asc' ? (
                            <ArrowUp className="h-3.5 w-3.5 text-primary" />
                        ) : (
                            <ArrowDown className="h-3.5 w-3.5 text-primary" />
                        )
                    ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5 opacity-30" />
                    )}
                </div>
            </Button>
        </TableHead>
    );
}
