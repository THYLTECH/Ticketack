import { Cell, Label, Pie, PieChart } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import {PieChartIcon} from "lucide-react";
import { useTrans } from "@/lib/translation";

interface StatsPieChartProps {
    title: string;
    indicator?: string;
    data: { title: string; tickets_count: number; color: string }[];
    total: number;
}

export function StatsPieChart({ title, data, total, indicator }: StatsPieChartProps) {
    const chartConfig = useMemo(() => {
        return data.reduce((acc, item) => {
            acc[item.title] = {
                label: item.title,
                color: item.color,
            };
            return acc;
        }, {} as ChartConfig);
    }, [data]);

    const __ = useTrans();

    return (
        <Card className="p-4 flex flex-col">
            <CardHeader className="p-0 pb-4 text-center">
                <CardTitle className="text-sm font-semibold uppercase tracking-tight text-muted-foreground">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {total === 0 ? (
                    <div className="relative flex h-[200px] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-muted/20 bg-muted/5">
                        <div className="absolute flex flex-col items-center gap-1">
                            <PieChartIcon className="size-8 text-muted-foreground/20" />
                            <p className="text-xs font-medium text-muted-foreground/40">
                                {__('dashboard.pages.stats.no_data')}
                            </p>
                        </div>
                    </div>
                        ) : (
                        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                            <PieChart>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Pie
                                    data={data}
                                    dataKey="tickets_count"
                                    nameKey="title"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    cornerRadius={5}
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || "var(--chart-1)"} />
                                    ))}
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                            {data.length}
                                                        </tspan>
                                                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-xs uppercase">
                                                            {indicator}
                                                        </tspan>
                                                    </text>
                                                );
                                            }
                                        }}
                                    />
                                </Pie>
                                <ChartLegend content={<ChartLegendContent nameKey="title" />} className="-translate-y-2 flex-wrap" />
                            </PieChart>
                        </ChartContainer>
                )}
                    </CardContent>
        </Card>
    );
};