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
import axios from 'axios';
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
    const [results, setResults] = React.useState<SearchResult[]>([]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim().length < 3) return;

        setIsLoading(true);

        try {
            const payload: Record<string, string | null> = {
                query,
                author_id: authorId,
                category_id: categoryId,
                asset_id: assetId,
                type_filter: typeFilter,
            };

            if (date?.from) {
                payload.date_from = format(date.from, 'yyyy-MM-dd');
            }
            if (date?.to) {
                payload.date_to = format(date.to, 'yyyy-MM-dd');
            }

            const response = await axios.post(
                route('knowledge.api.search'),
                payload,
            );

            setResults(response.data.results);
            setIsSearching(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('knowledge.pages.search.title')} />

            <div className="min-h-screen w-full bg-background pb-5">
                <div className="relative border-b border-border/40 px-4 py-3 sm:px-6 lg:px-8">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-size-[16px_16px] dark:bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)]"></div>

                    <div className="mx-auto max-w-2xl text-center">
                        <Badge
                            variant="outline"
                            className="mb-6 border-primary/20 bg-primary/10 text-primary"
                        >
                            <Sparkles className="mr-2 h-3 w-3" />
                            {__('knowledge.pages.search.badge')}
                        </Badge>

                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {__('knowledge.pages.search.hero_title')}
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
                            {__('knowledge.pages.search.hero_description')}
                        </p>

                        <div className="mx-auto mt-8 mb-8 max-w-2xl">
                            <form onSubmit={handleSearch} className="relative">
                                <div className="group relative flex h-14 w-full items-center overflow-hidden rounded-full border border-input bg-background shadow-sm transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 hover:border-primary/50 hover:shadow-md">
                                    <div className="flex h-full items-center pl-4 text-muted-foreground transition-colors group-focus-within:text-primary">
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
                                            className="h-10 rounded-full bg-primary px-6 font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                                            disabled={
                                                query.trim().length < 3 ||
                                                isLoading
                                            }
                                        >
                                            {isLoading
                                                ? __(
                                                      'knowledge.buttons.loading',
                                                  )
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
                                            'hover:border-primary/50 hover:bg-primary/10 hover:text-primary',
                                            date
                                                ? 'border-solid border-primary/50 bg-primary/10 text-primary'
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
                                        {__('knowledge.filters.clear')}
                                        <X className="ml-2 h-3.5 w-3.5" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="container mx-auto max-w-5xl px-4 py-3 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                            <div className="h-64 animate-pulse rounded-xl border border-border/60 bg-muted/10 p-8 md:col-span-2" />
                            <ResultSkeleton />
                            <ResultSkeleton />
                        </div>
                    ) : isSearching && results.length > 0 ? (
                        <div className="animate-in space-y-8 duration-500 fade-in slide-in-from-bottom-4">
                            <div className="flex items-baseline justify-between border-b border-border/40 pb-2">
                                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                                    {results.length}{' '}
                                    {__('knowledge.results.found')}
                                </h2>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                                {results.map((result, index) => {
                                    const isBestMatch = index === 0;

                                    return (
                                        <ResultCard
                                            key={result.id}
                                            result={result}
                                            isFeatured={isBestMatch}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ) : isSearching ? (
                        <div className="animate-in py-3 text-center zoom-in-95 fade-in">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                <Search className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground">
                                {__('knowledge.results.empty_title')}
                            </h3>
                            <p className="mt-1 text-muted-foreground">
                                {__('knowledge.results.empty_description')}
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>
        </AppLayout>
    );
}
