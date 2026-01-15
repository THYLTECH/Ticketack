export const START_HOUR = 0;
export const END_HOUR = 24;
export const HOURS = Array.from(
    { length: END_HOUR - START_HOUR },
    (_, i) => START_HOUR + i,
);
export const CELL_HEIGHT = 60;
export const WORK_START_HOUR = 8;

export const COLORS = [
    'bg-blue-500/10 border-l-4 border-blue-500 text-blue-700 dark:text-blue-100',
    'bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-700 dark:text-emerald-100',
    'bg-violet-500/10 border-l-4 border-violet-500 text-violet-700 dark:text-violet-100',
    'bg-amber-500/10 border-l-4 border-amber-500 text-amber-700 dark:text-amber-100',
    'bg-rose-500/10 border-l-4 border-rose-500 text-rose-700 dark:text-rose-100',
];

export const DOT_COLORS = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-amber-500',
    'bg-rose-500',
];

