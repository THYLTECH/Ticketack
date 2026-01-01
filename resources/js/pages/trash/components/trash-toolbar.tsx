import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { Box, Search, Shield, Ticket, Trash2, User, X } from 'lucide-react';

interface Props {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    activeTab: 'ticket' | 'user' | 'asset' | 'role';
    onTabChange: (tab: 'ticket' | 'user' | 'asset' | 'role') => void;
    onClearSearch: () => void;
}

export function TrashToolbar({
    searchTerm,
    onSearchChange,
    activeTab,
    onTabChange,
    onClearSearch,
}: Props) {
    const __ = useTrans();

    const tabs = [
        { id: 'ticket', label: __('trash.tabs.tickets'), icon: Ticket },
        { id: 'user', label: __('trash.tabs.users'), icon: User },
        { id: 'asset', label: __('trash.tabs.assets'), icon: Box },
        { id: 'role', label: __('trash.tabs.roles'), icon: Shield },
    ] as const;

    return (
        <div className="flex w-full flex-col gap-4 rounded-md border bg-background p-2 pl-3 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <div className="mr-2 hidden items-center gap-2 text-sm font-medium text-muted-foreground md:flex">
                    <Trash2 className="h-4 w-4" />
                    <span>{__('trash.pages.index.toolbar.title')}</span>
                </div>

                <Separator
                    orientation="vertical"
                    className="mr-2 hidden h-6 md:block"
                />

                <div className="relative flex items-center">
                    <Search className="absolute left-2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        placeholder={__('trash.pages.index.toolbar.search')}
                        className="h-8 w-[200px] border-dashed bg-transparent pl-8 text-xs shadow-none focus-visible:border-solid focus-visible:ring-1"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {searchTerm && (
                    <Button
                        variant="ghost"
                        onClick={onClearSearch}
                        size="sm"
                        className="h-8 border-solid px-2 text-xs font-medium text-muted-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                        {__('tickets.pages.index.toolbar.clear')}
                        <X className="ml-2 h-3.5 w-3.5" />
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <Button
                            key={tab.id}
                            variant={isActive ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                'h-8 text-xs font-medium',
                                isActive &&
                                    'bg-secondary text-secondary-foreground shadow-sm',
                            )}
                        >
                            <Icon className="mr-2 h-3.5 w-3.5" />
                            {tab.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
