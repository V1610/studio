"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface TableViewProps {
  data: any[]; // Parsed JSON data
}

export function TableView({ data }: TableViewProps) {
  if (!data || data.length === 0) {
    return (
       <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>The query returned no data to display in the table.</AlertDescription>
      </Alert>
    );
  }

  // Assuming data is an array of objects
  const headers = Object.keys(data[0] || {});

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border shadow-inner">
      <Table className="min-w-full">
        <TableCaption>Query Results Table</TableCaption>
        <TableHeader className="sticky top-0 bg-muted/90 backdrop-blur-sm">
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header} className="font-semibold text-foreground">{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-accent/10 transition-colors">
              {headers.map((header) => (
                <TableCell key={`${rowIndex}-${header}`}>{String(row[header])}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
