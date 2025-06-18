"use client";

import { useState, useMemo, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TableView } from "./table-view";
import { ChartView } from "./chart-view";
import { SummaryView } from "./summary-view";
import { ViewSwitcher } from "./view-switcher";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code, AlertTriangle, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export type ViewType = "table" | "chart" | "summary";

interface ResultsDisplayProps {
  sqlQuery: string;
  queryResult: string; // JSON string
  databaseType: string;
}

function LoadingFallback() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

export function ResultsDisplay({ sqlQuery, queryResult, databaseType }: ResultsDisplayProps) {
  const [currentView, setCurrentView] = useState<ViewType>("table");

  const parsedData = useMemo(() => {
    try {
      if (!queryResult) return null;
      const result = JSON.parse(queryResult);
      // Ensure result is an array, even if it's a single object response
      return Array.isArray(result) ? result : (typeof result === 'object' && result !== null ? [result] : []);
    } catch (error) {
      console.error("Failed to parse query result:", error);
      return { error: "Failed to parse query result. Ensure it's valid JSON." };
    }
  }, [queryResult]);

  const hasErrorParsing = parsedData && typeof parsedData === 'object' && 'error' in parsedData;
  const isEmptyData = !parsedData || (Array.isArray(parsedData) && parsedData.length === 0);

  return (
    <Card className="mt-8 shadow-xl w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Query Results</CardTitle>
        <CardDescription>
          Database: <span className="font-semibold text-primary">{databaseType}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Code className="h-5 w-5 text-accent" /> Generated SQL Query
          </h3>
          <ScrollArea className="h-auto max-h-[150px] w-full rounded-md border bg-muted/50 p-3 shadow-inner">
            <pre className="text-sm font-code whitespace-pre-wrap break-all">
              {sqlQuery || "No SQL query generated."}
            </pre>
          </ScrollArea>
        </div>

        {hasErrorParsing ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Data Parsing Error</AlertTitle>
            <AlertDescription>{(parsedData as {error: string}).error}</AlertDescription>
          </Alert>
        ) : (
          <>
            <ViewSwitcher 
              currentView={currentView} 
              onViewChange={setCurrentView} 
              disabled={isEmptyData && currentView !== 'summary'} // Summary can still work with empty raw string
            />
            <div className="min-h-[400px] transition-all duration-300 ease-in-out">
              <Suspense fallback={<LoadingFallback />}>
                {isEmptyData && currentView !== 'summary' && (
                   <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Empty Result Set</AlertTitle>
                    <AlertDescription>The executed query returned no data.</AlertDescription>
                  </Alert>
                )}
                {!isEmptyData && currentView === "table" && <TableView data={parsedData as any[]} />}
                {!isEmptyData && currentView === "chart" && <ChartView data={parsedData as any[]} />}
                {currentView === "summary" && <SummaryView queryResultJson={queryResult} />}
              </Suspense>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
