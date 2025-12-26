import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

interface StatsBarChartProps {
    data: {
        id?: number | string;
        name?: string;
        title?: string;
        key?: string;
        tickets_count?: number;
        count?: number;
        avg_resolution_time?: number;
        avatar?: any;
    }[];
    dataKey: string;
    labelKey: string;
    layout?: "horizontal" | "vertical";
    config: ChartConfig;
}

export function StatsBarChart({ data, dataKey, labelKey, layout = "horizontal", config }: StatsBarChartProps) {
    return (
        <>
            {layout === "horizontal" ? (
                <ChartContainer config={config} className="h-[200px] w-full">
                    <BarChart
                        data={data}
                        layout={layout}
                        margin={{ left: 40, right: 20 }}
                    >
                        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey={labelKey}
                            type="category"
                            tickLine={false}
                            axisLine={true}
                        />
                        <YAxis type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideIndicator />}
                        />
                        <Bar
                            dataKey={dataKey}
                            fill="var(--primary)"
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                        />
                    </BarChart>
                </ChartContainer>
            ) : (
                <ChartContainer config={config} className="h-full w-full">
                    <BarChart
                        data={data}
                        layout={layout}
                        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey={labelKey}
                            type="category"
                            tickLine={false}
                            axisLine={true}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideIndicator />}
                        />
                        <Bar
                            dataKey={dataKey}
                            fill="var(--primary)"
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                        />
                    </BarChart>
                </ChartContainer>
            )}
        </>

    );
}