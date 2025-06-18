
"use client";

import { useState } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { QueryInputForm } from '@/components/data-chat/query-input-form';
import { ResultsDisplay } from '@/components/data-chat/results-display';
import { handleQuery, HandleQueryInput, HandleQueryResult } from './actions';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";


export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queryData, setQueryData] = useState<HandleQueryResult['data'] & { databaseType?: string } | null>(null);
  const { toast } = useToast();

  const handleQuerySubmit = async (data: HandleQueryInput) => {
    setIsLoading(true);
    setError(null);
    setQueryData(null);

    try {
      const result = await handleQuery(data);
      if (result.success && result.data) {
        setQueryData({ ...result.data, databaseType: data.databaseType });
      } else {
        setError(result.error || "An unknown error occurred.");
        toast({
          variant: "destructive",
          title: "Query Error",
          description: result.error || "Failed to process your query. Please check your input or try again later.",
        });
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
      toast({
        variant: "destructive",
        title: "Application Error",
        description: e.message || "An unexpected error occurred while submitting your query.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AppHeader />
      <main className="flex-1 container max-w-5xl mx-auto py-8 px-4">
        <div className="space-y-8">
          <QueryInputForm onSubmit={handleQuerySubmit} isLoading={isLoading} />

          {isLoading && (
            <Card className="mt-8 shadow-xl w-full">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-6 w-1/4 mb-4" />
                
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-20 w-full mb-4" />

                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          )}

          {error && !isLoading && (
            <Alert variant="destructive" className="mt-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {queryData && !isLoading && !error && (
            <ResultsDisplay
              sqlQuery={queryData.sqlQuery}
              queryResult={queryData.queryResult}
              databaseType={queryData.databaseType || "N/A"}
            />
          )}
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Quintech Softech LLP. All rights reserved.
      </footer>
    </>
  );
}
