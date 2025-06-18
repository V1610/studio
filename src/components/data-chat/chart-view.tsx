"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, BarChart3 as BarChartIcon } from "lucide-react";
import { useMemo } from "react";

interface ChartViewProps {
  data: any[]; // Parsed JSON data
}

export function ChartView({ data }: ChartViewProps) {
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0 || typeof data[0] !== 'object' || data[0] === null) {
      return null;
    }

    const keys = Object.keys(data[0]);
    let categoryKey: string | undefined;
    let valueKey: string | undefined;

    // Find first string key for category and first number key for value
    for (const key of keys) {
      if (typeof data[0][key] === 'string' && !categoryKey) {
        categoryKey = key;
      } else if (typeof data[0][key] === 'number' && !valueKey) {
        valueKey = key;
      }
      if (categoryKey && valueKey) break;
    }
    
    // If no string key, try to use any key as category if it's not the value key
    if (!categoryKey && keys.length > 1) {
        categoryKey = keys.find(k => k !== valueKey);
    }


    if (!categoryKey || !valueKey) {
      return null;
    }
    
    // Ensure unique categories if possible, or limit items
    const MAX_ITEMS = 20;
    const processedData = data.slice(0, MAX_ITEMS).map(item => ({
      category: String(item[categoryKey!]),
      value: Number(item[valueKey!]),
    }));
    
    return { data: processedData, categoryKey: "category", valueKey: "value" };

  }, [data]);

  if (!chartData) {
    return (
      <Alert>
        <BarChartIcon className="h-4 w-4" />
        <AlertTitle>Chart Not Available</AlertTitle>
        <AlertDescription>
          The current data structure is not suitable for automatic chart generation.
          Please ensure your query returns data with clear categorical (text) and numerical columns.
        </AlertDescription>
      </Alert>
    );
  }

  const chartConfig = {
    [chartData.valueKey]: {
      label: chartData.valueKey.charAt(0).toUpperCase() + chartData.valueKey.slice(1),
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <div className="h-[400px] w-full p-4 border rounded-lg shadow-inner bg-card">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.data} accessibilityLayer>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey={chartData.categoryKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-xs"
            />
            <YAxis tickLine={false} tickMargin={10} axisLine={false} className="text-xs" />
            <Tooltip
              cursor={{ fill: "hsl(var(--accent) / 0.2)" }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Legend />
            <Bar dataKey={chartData.valueKey} fill="hsl(var(--primary))" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
