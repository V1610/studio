"use client";

import { useState, useEffect } from "react";
import { getSummary, GetSummaryInput } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SummaryViewProps {
  queryResultJson: string; // Raw JSON string of query result
}

export function SummaryView({ queryResultJson }: SummaryViewProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSummary() {
      setIsLoading(true);
      setError(null);
      setSummary(null);
      
      if (!queryResultJson || queryResultJson.trim() === "[]" || queryResultJson.trim() === "{}") {
        setError("No data available to summarize.");
        setIsLoading(false);
        return;
      }

      try {
        const input: GetSummaryInput = { data: queryResultJson };
        const result = await getSummary(input);
        if (result.success && result.data) {
          setSummary(result.data.summary);
        } else {
          setError(result.error || "Failed to generate summary.");
          toast({
            variant: "destructive",
            title: "Summarization Error",
            description: result.error || "Could not generate summary for the data.",
          });
        }
      } catch (e: any) {
        setError(e.message || "An unexpected error occurred during summarization.");
        toast({
            variant: "destructive",
            title: "Summarization Failed",
            description: e.message || "An unexpected error occurred.",
          });
      } finally {
        setIsLoading(false);
      }
    }

    fetchSummary();
  }, [queryResultJson, toast]);

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-headline">
            <FileText className="h-5 w-5 text-primary" />
            Data Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-4" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Generating Summary</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card className="shadow-sm bg-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline">
          <FileText className="h-5 w-5 text-primary" />
          Data Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {summary ? (
          <p className="text-sm leading-relaxed text-foreground/90">{summary}</p>
        ) : (
          <p className="text-sm text-muted-foreground">No summary could be generated for this data.</p>
        )}
      </CardContent>
    </Card>
  );
}
