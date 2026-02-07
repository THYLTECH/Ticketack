export type ViewType = 'day' | 'week' | 'month';

export interface EventLayout {
    left: number;
    width: number;
    column: number;
    totalColumns: number;
}

export interface ResizingEvent {
    id: number | string;
    initialY: number;
    initialDuration: number;
    currentDuration: number;
    startData: string;
}


