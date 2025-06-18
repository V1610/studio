// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Converts natural language queries to SQL and retrieves data.
 *
 * - naturalLanguageToSQL - A function that translates natural language to SQL and retrieves data.
 * - NaturalLanguageToSQLInput - The input type for the naturalLanguageToSQL function.
 * - NaturalLanguageToSQLOutput - The return type for the naturalLanguageToSQL function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NaturalLanguageToSQLInputSchema = z.object({
  naturalLanguageQuery: z
    .string()
    .describe('The natural language query to translate to SQL.'),
  databaseType: z.enum(['SQL Server', 'SAP HANA']).describe('The type of the database.'),
});
export type NaturalLanguageToSQLInput = z.infer<
  typeof NaturalLanguageToSQLInputSchema
>;

const NaturalLanguageToSQLOutputSchema = z.object({
  sqlQuery: z.string().describe('The generated SQL query.'),
  queryResult: z.string().describe('The result of the SQL query in JSON format.'),
});
export type NaturalLanguageToSQLOutput = z.infer<
  typeof NaturalLanguageToSQLOutputSchema
>;

export async function naturalLanguageToSQL(
  input: NaturalLanguageToSQLInput
): Promise<NaturalLanguageToSQLOutput> {
  return naturalLanguageToSQLFlow(input);
}

const executeSqlQuery = ai.defineTool(
  {
    name: 'executeSqlQuery',
    description: 'Executes a SQL query against the database and returns the result as JSON.',
    inputSchema: z.object({
      sqlQuery: z.string().describe('The SQL query to execute.'),
      databaseType: z
        .enum(['SQL Server', 'SAP HANA'])
        .describe('The type of the database to execute the query against.'),
    }),
    outputSchema: z.string(),
  },
  async input => {
    // TODO: Replace with actual database query execution logic.
    // This is a placeholder implementation.
    console.log(
      `Executing SQL query: ${input.sqlQuery} against database type: ${input.databaseType}`
    );
    return JSON.stringify([
      {column1: 'value1', column2: 'value2'},
      {column1: 'value3', column2: 'value4'},
    ]);
  }
);

const prompt = ai.definePrompt({
  name: 'naturalLanguageToSQLPrompt',
  input: {schema: NaturalLanguageToSQLInputSchema},
  output: {schema: NaturalLanguageToSQLOutputSchema},
  tools: [executeSqlQuery],
  prompt: `You are an expert at translating natural language queries into SQL queries.

  The user will provide a natural language query, and you must translate it into a valid SQL query for the specified database type.
  If the user asks to execute the query, then execute the query by calling the executeSqlQuery tool. Always call this function if the prompt asks you to execute the query.

  Natural Language Query: {{{naturalLanguageQuery}}}
  Database Type: {{{databaseType}}}

  Ensure that the generated SQL query is correct and executable.
  Also, ensure you call the executeSqlQuery tool to execute the query, and return the result in the queryResult field.
`,
});

const naturalLanguageToSQLFlow = ai.defineFlow(
  {
    name: 'naturalLanguageToSQLFlow',
    inputSchema: NaturalLanguageToSQLInputSchema,
    outputSchema: NaturalLanguageToSQLOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    
    if (!output) {
      console.error("[naturalLanguageToSQLFlow] LLM prompt did not produce an output.");
      return {
        sqlQuery: "Error: LLM failed to generate a response.",
        queryResult: "[]" 
      };
    }

    let validatedQueryResult = output.queryResult;
    try {
      // Attempt to parse to check if it's valid JSON.
      // The schema description for NaturalLanguageToSQLOutputSchema.queryResult
      // already asks the LLM for a JSON string.
      JSON.parse(validatedQueryResult);
    } catch (e) {
      // If parsing fails, queryResult was not a valid JSON string.
      // This can happen if the LLM doesn't use the tool and instead writes
      // a textual message in the queryResult field.
      console.warn(`[naturalLanguageToSQLFlow] output.queryResult from LLM was not valid JSON. ` +
                   `Content: "${validatedQueryResult}". Defaulting to '[]' to prevent downstream parsing errors.`);
      validatedQueryResult = "[]"; 
    }

    return {
        sqlQuery: output.sqlQuery,
        queryResult: validatedQueryResult
    };
  }
);
