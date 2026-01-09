import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useInitials } from '@/hooks/use-initials';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { ChevronLeft, ChevronRight, Filter, Search, Users, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
    solvers: User[];
    selectedIds: number[];
    onToggle: (id: number) => void;
}

export function SolverFilters({ solvers, selectedIds, onToggle }: Props) {
    const __ = useTrans();
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    const getInitials = useInitials();

    const filtered = solvers.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()),
    );

    const activeCount = filtered.filter((s) =>
        selectedIds.includes(s.id),
    ).length;

    return (
        <div className={cn(
            "flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300",
            isOpen ? "w-72" : "w-12"
        )}>
            {!isOpen && (
                <div className="flex h-full items-center justify-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(true)}
                        className="h-10 w-10"
                        title={__('schedule.filters.technicians')}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </div>
            )}

            {isOpen && (
                <>
                    <div className="flex flex-col gap-4 border-b bg-muted/10 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                <Filter className="h-4 w-4 text-primary" />
                                <span>{__('schedule.filters.technicians')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="secondary"
                                    className="h-5 px-1.5 font-mono text-[10px]"
                                >
                                    {activeCount}/{filtered.length}
                                </Badge>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="h-6 w-6"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="relative">
                            <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                placeholder={__('schedule.filters.search_placeholder')}
                                className="h-9 w-full bg-background pr-8 pl-8 text-xs transition-all focus-visible:ring-1"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-1 right-1 h-7 w-7 hover:bg-transparent"
                                    onClick={() => setSearch('')}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="space-y-2 p-3">
                            {filtered.length > 0 ? (
                                filtered.map((solver) => {
                                    const isSelected = selectedIds.includes(solver.id);
                                    return (
                                        <div
                                            key={solver.id}
                                            onClick={() => onToggle(solver.id)}
                                            className={cn(
                                                'group flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 transition-all duration-200 ease-in-out',
                                                isSelected
                                                    ? 'border-primary/30 bg-primary/5 shadow-sm'
                                                    : 'border-transparent hover:bg-muted/50',
                                            )}
                                        >
                                            <Checkbox
                                                checked={isSelected}
                                                className={cn(
                                                    'pointer-events-none',
                                                    'data-[state=checked]:border-primary data-[state=checked]:bg-primary',
                                                    !isSelected &&
                                                        'opacity-50 group-hover:opacity-100',
                                                )}
                                            />

                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <Avatar
                                                    className={cn(
                                                        'h-8 w-8 border-2 transition-all',
                                                        isSelected
                                                            ? 'border-primary/20'
                                                            : 'border-transparent',
                                                    )}
                                                >
                                                    <AvatarImage
                                                        src={solver.avatar?.url}
                                                    />
                                                    <AvatarFallback className="bg-background text-[10px]">
                                                        {getInitials(solver.name)}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex flex-col overflow-hidden">
                                                    <span
                                                        className={cn(
                                                            'truncate text-xs leading-none font-semibold transition-colors',
                                                            isSelected
                                                                ? 'text-foreground'
                                                                : 'text-muted-foreground group-hover:text-foreground',
                                                        )}
                                                    >
                                                        {solver.name}
                                                    </span>
                                                    <span className="mt-1 truncate text-[10px] text-muted-foreground/70">
                                                        {solver.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground/50">
                                    <Users className="mb-2 h-8 w-8 opacity-20" />
                                    <p className="text-xs">
                                        {__('schedule.filters.no_results')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </>
            )}
        </div>
    );
}
