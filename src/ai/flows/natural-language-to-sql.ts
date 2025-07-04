// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Converts natural language queries to SQL and retrieves data.
 *
 * - naturalLanguageToSQL - A function that translates natural language to SQL and retrieves data.
 * - NaturalLanguageToSQLInput - The input type for the naturalLanguageToSQL function.
 * - NaturalLanguageToSQLOutput - The return type for the naturalLanguageToSQL function
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as sql from 'mssql'; // Import the mssql package
// For SAP HANA (if handling here, though there's a dedicated HANA flow):
// import hanaClient from '@sap/hana-client';

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
    description: 'Executes a SQL query against the database and returns the result as JSON string.',
    inputSchema: z.object({
      sqlQuery: z.string().describe('The SQL query to execute.'),
      databaseType: z
        .enum(['SQL Server', 'SAP HANA'])
        .describe('The type of the database to execute the query against.'),
    }),
    outputSchema: z.string(),
  },
  async input => {
    console.log(
      `Executing SQL query: ${input.sqlQuery} against database type: ${input.databaseType}`
    );

    if (input.databaseType === 'SQL Server') {
      try {
        const pool = await sql.connect({
          server: process.env.SQLSERVER_HOST!,
          user: process.env.SQLSERVER_USER!,
          password: process.env.SQLSERVER_PASSWORD!,
          database: process.env.SQLSERVER_DATABASE!,
          port: process.env.SQLSERVER_PORT ? parseInt(process.env.SQLSERVER_PORT, 10) : 1433,
          options: {
            encrypt: process.env.SQLSERVER_ENCRYPT === 'true',
            trustServerCertificate: process.env.SQLSERVER_TRUST_SERVER_CERTIFICATE === 'true'
          }
        });
        const result = await pool.request().query(input.sqlQuery);
        await pool.close();
        return JSON.stringify(result.recordset);
      } catch (err) {
        console.error('SQL Server execution error:', err);
        return JSON.stringify({ error: `Failed to execute SQL Server query: ${(err as Error).message}` });
      }
    } else if (input.databaseType === 'SAP HANA') {
      // TODO: SAP HANA specific logic using '@sap/hana-client' package
      // Example structure:
      // try {
      //   const hanaClient = require('@sap/hana-client'); // Ensure this is imported or required
      //   const conn = hanaClient.createConnection();
      //   await new Promise((resolve, reject) => conn.connect({
      //     host: process.env.HANA_HOST!,
      //     port: process.env.HANA_PORT ? parseInt(process.env.HANA_PORT, 10) : 30015, // e.g. 30015 for tenant DBs
      //     uid: process.env.HANA_USER!,
      //     pwd: process.env.HANA_PASSWORD!,
      //     encrypt: process.env.HANA_ENCRYPT === 'true',
      //     sslValidateCertificate: process.env.HANA_SSLVALIDATECERTIFICATE !== 'false'
      //   }, (err) => err ? reject(err) : resolve(undefined)));
      //   const result = await new Promise((resolve, reject) => conn.exec(input.sqlQuery, (err, rows) => err ? reject(err) : resolve(rows)));
      //   conn.disconnect();
      //   return JSON.stringify(result);
      // } catch (err) {
      //   console.error('SAP HANA execution error (via SQL flow):', err);
      //   return JSON.stringify({ error: `Failed to execute SAP HANA query: ${(err as Error).message}` });
      // }
      console.warn("SAP HANA execution (via SQL flow) not implemented. Returning placeholder data.");
      return JSON.stringify([
        {column1: 'hana_value1_via_sql_flow', column2: 'hana_value2_via_sql_flow'}
      ]);
    }

    console.error(`Unsupported database type: ${input.databaseType}`);
    return JSON.stringify({ error: `Unsupported database type: ${input.databaseType}` });
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
      // Or, the tool itself returned an error message that isn't JSON.
      // If it's an error from the tool, it should already be JSON like {"error": "message"}.
      // This catch is more for when the LLM bypasses the tool.
      console.warn(`[naturalLanguageToSQLFlow] output.queryResult from LLM or tool was not valid JSON. ` +
                   `Content: "${validatedQueryResult}". Defaulting to '[]' to prevent downstream parsing errors if it's not a structured error already.`);
      
      // Check if the string *looks* like our JSON error object, if so, preserve it.
      // Otherwise, default to empty array.
      if (!(validatedQueryResult && validatedQueryResult.trim().startsWith('{"error":'))) {
         validatedQueryResult = "[]";
      }
    }

    return {
        sqlQuery: output.sqlQuery,
        queryResult: validatedQueryResult
    };
  }
);

