"use server";

import { naturalLanguageToSQL, NaturalLanguageToSQLInput, NaturalLanguageToSQLOutput } from '@/ai/flows/natural-language-to-sql';
import { summarizeData, SummarizeDataInput, SummarizeDataOutput } from '@/ai/flows/data-summarization';

export type DatabaseType = "SQL Server" | "SAP HANA";

export interface HandleQueryInput {
  naturalLanguageQuery: string;
  databaseType: DatabaseType;
}

export interface HandleQueryResult {
  success: boolean;
  data?: NaturalLanguageToSQLOutput;
  error?: string;
}

export async function handleQuery(input: HandleQueryInput): Promise<HandleQueryResult> {
  try {
    const aiInput: NaturalLanguageToSQLInput = {
      naturalLanguageQuery: input.naturalLanguageQuery,
      databaseType: input.databaseType,
    };
    const result = await naturalLanguageToSQL(aiInput);
    return { success: true, data: result };
  } catch (e: any) {
    console.error("Error in handleQuery:", e);
    return { success: false, error: e.message || "Failed to process query. Please try again." };
  }
}

export interface GetSummaryInput {
  data: string; // JSON string data
}

export interface GetSummaryResult {
  success: boolean;
  data?: SummarizeDataOutput;
  error?: string;
}

export async function getSummary(input: GetSummaryInput): Promise<GetSummaryResult> {
  try {
    // Ensure data is not excessively long for summarization to prevent overly verbose prompts
    const maxLength = 5000; // Characters
    const truncatedData = input.data.length > maxLength ? input.data.substring(0, maxLength) + "..." : input.data;

    const aiInput: SummarizeDataInput = {
      data: truncatedData,
    };
    const result = await summarizeData(aiInput);
    return { success: true, data: result };
  } catch (e: any)
  {
    console.error("Error in getSummary:", e);
    return { success: false, error: e.message || "Failed to generate summary. Please try again." };
  }
}
