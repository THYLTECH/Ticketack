import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app/layout';
import { useTrans } from '@/lib/translation';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Calendar as CalendarIcon,
    LayoutGrid,
    ListFilter,
    Monitor,
    Search,
    Sparkles,
    User as UserIcon,
    X,
} from 'lucide-react';
import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { FilterDropdown } from './components/filter-dropdown';
import { ResultCard } from './components/result-card';
import { ResultSkeleton } from './components/result-skeleton';
import { SearchProps, SearchResult } from './types';

export default function KnowledgeSearch({
    users,
    categories,
    assets,
}: SearchProps) {
    const trans = useTrans();
    const __ = (key: string): string => trans(key) as string;

    const { url } = usePage();

    const [query, setQuery] = React.useState('');
    const [date, setDate] = React.useState<DateRange | undefined>(undefined);

    const [authorId, setAuthorId] = React.useState<string | null>(null);
    const [categoryId, setCategoryId] = React.useState<string | null>(null);
    const [assetId, setAssetId] = React.useState<string | null>(null);
    const [typeFilter, setTypeFilter] = React.useState<string | null>(null);

    const [isSearching, setIsSearching] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsSearching(true);
            setIsLoading(false);
        }, 600);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('dashboard.pages.breadcrumbs.dashboard'),
            href: route('dashboard'),
        },
        { title: __('knowledge.pages.search.title'), href: url },
    ];

    const hasActiveFilters =
        date || authorId || categoryId || assetId || typeFilter;

    const clearFilters = () => {
        setDate(undefined);
        setAuthorId(null);
        setCategoryId(null);
        setAssetId(null);
        setTypeFilter(null);
    };

    const results: SearchResult[] = isSearching
        ? [
              {
                  id: 'vec_1',
                  ticket_id: 124,
                  title: 'Erreur de connexion SMTP sur Outlook',
                  snippet:
                      "L'utilisateur ne peut pas envoyer de mails. Le port 587 semble bloqué...",
                  score: 0.95,
                  type: 'ticket',
                  created_at: '2024-03-10T10:00:00',
                  author: { name: 'John Doe' },
              },
          ]
        : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('knowledge.pages.search.title')} />

            <div className="min-h-screen w-full bg-background pb-20">
                <div className="relative border-b border-border/40 px-4 py-12 sm:px-6 lg:px-8">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)]"></div>

                    <div className="mx-auto max-w-2xl text-center">
                        <Badge
                            variant="outline"
                            className="mb-6 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                        >
                            <Sparkles className="mr-2 h-3 w-3" />
                            Intelligence Artificielle
                        </Badge>

                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {__('knowledge.pages.search.hero_title')}
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
                            {__('knowledge.pages.search.hero_description')}
                        </p>

                        <div className="mx-auto mt-8 mb-8 max-w-2xl">
                            <form onSubmit={handleSearch} className="relative">
                                <div className="group relative flex h-14 w-full items-center overflow-hidden rounded-full border border-input bg-background shadow-sm transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 hover:border-emerald-500/50 hover:shadow-md">
                                    <div className="flex h-full items-center pl-4 text-muted-foreground transition-colors group-focus-within:text-emerald-600">
                                        <Search className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={__(
                                            'knowledge.pages.search.placeholder',
                                        )}
                                        className="h-full w-full bg-transparent px-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                    />
                                    <div className="flex h-full items-center pr-1.5">
                                        {query && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="mr-1 h-9 w-9 rounded-full text-muted-foreground hover:bg-muted"
                                                onClick={() => setQuery('')}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            type="submit"
                                            size="sm"
                                            className="h-10 rounded-full bg-emerald-600 px-6 font-medium text-white shadow-sm hover:bg-emerald-700"
                                            disabled={
                                                !query.trim() || isLoading
                                            }
                                        >
                                            {isLoading
                                                ? '...'
                                                : __(
                                                      'knowledge.buttons.search',
                                                  )}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={cn(
                                            'h-9 border-dashed text-xs shadow-sm transition-colors',
                                            'hover:border-emerald-500/50 hover:bg-emerald-50/50 hover:text-emerald-900 dark:hover:text-emerald-500',
                                            date
                                                ? 'border-solid border-emerald-500/50 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-100'
                                                : 'bg-transparent text-muted-foreground hover:text-foreground',
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-3.5 w-3.5 opacity-70" />
                                        {date?.from ? (
                                            date.to ? (
                                                <>
                                                    {format(
                                                        date.from,
                                                        'dd/MM/yy',
                                                    )}{' '}
                                                    -{' '}
                                                    {format(
                                                        date.to,
                                                        'dd/MM/yy',
                                                    )}
                                                </>
                                            ) : (
                                                format(date.from, 'dd/MM/yyyy')
                                            )
                                        ) : (
                                            __('knowledge.filters.date')
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="range"
                                        defaultMonth={date?.from}
                                        selected={date}
                                        onSelect={setDate}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>

                            <FilterDropdown
                                title={__('knowledge.filters.author')}
                                icon={<UserIcon className="h-3.5 w-3.5" />}
                                options={users.map((u) => ({
                                    value: String(u.id),
                                    label: u.name,
                                }))}
                                value={authorId}
                                onChange={setAuthorId}
                            />

                            <FilterDropdown
                                title={__('knowledge.filters.category')}
                                icon={<LayoutGrid className="h-3.5 w-3.5" />}
                                options={categories.map((c) => ({
                                    value: String(c.id),
                                    label: c.title,
                                }))}
                                value={categoryId}
                                onChange={setCategoryId}
                            />

                            <FilterDropdown
                                title={__('knowledge.filters.asset')}
                                icon={<Monitor className="h-3.5 w-3.5" />}
                                options={assets.map((a) => ({
                                    value: String(a.id),
                                    label: a.title,
                                }))}
                                value={assetId}
                                onChange={setAssetId}
                            />

                            <FilterDropdown
                                title={__('knowledge.filters.type')}
                                icon={<ListFilter className="h-3.5 w-3.5" />}
                                options={[
                                    { value: 'ticket', label: 'Ticket' },
                                    { value: 'pdf', label: 'PDF' },
                                    { value: 'image', label: 'Image' },
                                ]}
                                value={typeFilter}
                                onChange={setTypeFilter}
                            />

                            {hasActiveFilters && (
                                <>
                                    <Separator
                                        orientation="vertical"
                                        className="mx-1 h-6"
                                    />
                                    <Button
                                        variant="ghost"
                                        onClick={clearFilters}
                                        size="sm"
                                        className="h-9 border-solid px-2 text-xs font-medium text-muted-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        Clear
                                        <X className="ml-2 h-3.5 w-3.5" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                            <ResultSkeleton />
                            <ResultSkeleton />
                        </div>
                    ) : isSearching && results.length > 0 ? (
                        <div className="animate-in space-y-6 duration-500 fade-in slide-in-from-bottom-4">
                            <div className="flex items-baseline justify-between border-b border-border/40 pb-4">
                                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                                    {results.length}{' '}
                                    {__('knowledge.results.found')}
                                </h2>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                                {results.map((result) => (
                                    <ResultCard
                                        key={result.id}
                                        result={result}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </AppLayout>
    );
}
