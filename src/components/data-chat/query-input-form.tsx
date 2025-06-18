"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Database, Send } from "lucide-react";
import type { DatabaseType, HandleQueryInput } from "@/app/actions";

const formSchema = z.object({
  naturalLanguageQuery: z.string().min(10, {
    message: "Query must be at least 10 characters.",
  }).max(500, {
    message: "Query must not exceed 500 characters."
  }),
  databaseType: z.enum(["SQL Server", "SAP HANA"]),
});

type QueryFormValues = z.infer<typeof formSchema>;

interface QueryInputFormProps {
  onSubmit: (data: HandleQueryInput) => Promise<void>;
  isLoading: boolean;
}

export function QueryInputForm({ onSubmit, isLoading }: QueryInputFormProps) {
  const form = useForm<QueryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      naturalLanguageQuery: "",
      databaseType: "SQL Server",
    },
  });

  async function handleSubmit(data: QueryFormValues) {
    await onSubmit(data);
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline">
          <Database className="h-7 w-7 text-primary" />
          Query Your Data
        </CardTitle>
        <CardDescription>
          Enter your question in natural language and select the database type.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="naturalLanguageQuery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Show me total sales for each product last quarter'"
                      className="resize-none min-h-[100px] focus:ring-accent focus:border-accent"
                      {...field}
                      aria-label="Natural language query input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="databaseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger aria-label="Select database type">
                        <SelectValue placeholder="Select a database type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SQL Server">SQL Server</SelectItem>
                      <SelectItem value="SAP HANA">SAP HANA</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-300 ease-in-out transform hover:scale-105">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Translate & Fetch Data
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
