import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "../ui/chart";

interface ActivityLineChartProps {
    data: {
        created : number;
        date : string;
        resolved : number;
    }[];
    labelKey: string;
    config: ChartConfig;
    colors?: string[];
}
export function ActivityLineChart({ data, labelKey, config, colors }: ActivityLineChartProps) {
    return (
        <ChartContainer config={config} className="h-[200px] w-full">
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={labelKey} />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                {Object.keys(data[0])
                    .filter((key) => key !== "date")
                    .map((key,index) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={colors?.[index] || "#8884d8"}
                            activeDot={{ r: 8 }}
                        />
                    ))}
            </LineChart>
        </ChartContainer>
    );
}