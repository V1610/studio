// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview Converts natural language queries into HANA queries and fetches the resulting data.
 *
 * - naturalLanguageToHANA - A function that translates natural language to HANA and returns data.
 * - NaturalLanguageToHANAInput - The input type for the naturalLanguageToHANA function.
 * - NaturalLanguageToHANAOutput - The return type for the naturalLanguageToHANA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
// To implement actual database connections, you would import necessary drivers here.
// For example, for SAP HANA:
// import hanaClient from '@sap/hana-client';


const NaturalLanguageToHANAInputSchema = z.object({
  naturalLanguageQuery: z.string().describe('The natural language query to translate to HANA.'),
  hanaDatabaseSchema: z.string().describe('The HANA database schema.'),
});
export type NaturalLanguageToHANAInput = z.infer<
  typeof NaturalLanguageToHANAInputSchema
>;

const HANAQueryExecutionResultSchema = z.object({
  result: z.string().describe('The result of the HANA query execution.'),
});

const NaturalLanguageToHANAOutputSchema = z.object({
  hanaQuery: z.string().describe('The generated HANA query.'),
  queryResult: z.string().describe('The result of the HANA query execution.'),
});
export type NaturalLanguageToHANAOutput = z.infer<
  typeof NaturalLanguageToHANAOutputSchema
>;

export async function naturalLanguageToHANA(
  input: NaturalLanguageToHANAInput
): Promise<NaturalLanguageToHANAOutput> {
  return naturalLanguageToHANAFlow(input);
}

const executeHANAQuery = ai.defineTool({
  name: 'executeHANAQuery',
  description: 'Executes a HANA query and returns the result as a string.',
  inputSchema: z.object({
    query: z.string().describe('The HANA query to execute.'),
  }),
  outputSchema: z.string(),
}, async (input) => {
  console.log(`Executing HANA query: ${input.query}`);
  // TODO: Implement the actual SAP HANA query execution here.
  // This involves:
  // 1. Reading SAP HANA connection details (host, port, user, password)
  //    securely, preferably from environment variables (e.g., process.env.HANA_HOST).
  //    Example .env variables:
  //    HANA_HOST=your_hana_server_address
  //    HANA_PORT=your_hana_port (e.g., 30015 for a tenant DB, 30013 for system DB SQL port)
  //    HANA_USER=your_hana_username
  //    HANA_PASSWORD=your_hana_password
  //    HANA_ENCRYPT=true (optional, true by default with @sap/hana-client)
  //    HANA_SSLVALIDATECERTIFICATE=false (optional, true by default, set to false for self-signed certs in dev)
  // 2. Establishing a connection using the '@sap/hana-client' package.
  // 3. Executing the input.query.
  // 4. Formatting the result as a string (e.g., JSON.stringify(rows) or a custom string format).
  //    The current schema expects a raw string, but JSON string is often more useful.
  // 5. Handling errors gracefully.
  //
  // Example structure using '@sap/hana-client':
  // try {
  //   const conn = hanaClient.createConnection();
  //   const connectionParams = {
  //     host: process.env.HANA_HOST!,
  //     port: parseInt(process.env.HANA_PORT!, 10),
  //     uid: process.env.HANA_USER!,
  //     pwd: process.env.HANA_PASSWORD!,
  //     encrypt: process.env.HANA_ENCRYPT === 'true', // Default true
  //     sslValidateCertificate: process.env.HANA_SSLVALIDATECERTIFICATE !== 'false', // Default true
  //   };
  //   await new Promise((resolve, reject) => conn.connect(connectionParams, (err) => err ? reject(err) : resolve(undefined)));
  //   const results = await new Promise((resolve, reject) => conn.exec(input.query, (err, rows) => err ? reject(err) : resolve(rows)));
  //   conn.disconnect();
  //   return JSON.stringify(results); // Or format as a plain string if required by schema
  // } catch (err) {
  //   console.error('SAP HANA execution error:', err);
  //   return `Error executing HANA query: ${(err as Error).message}`;
  // }

  console.warn("SAP HANA execution not implemented. Returning placeholder data.");
  return `Dummy HANA query result for query: ${input.query}`;
});

const naturalLanguageToHANAFlow = ai.defineFlow(
  {
    name: 'naturalLanguageToHANAFlow',
    inputSchema: NaturalLanguageToHANAInputSchema,
    outputSchema: NaturalLanguageToHANAOutputSchema,
  },
  async input => {
    const {naturalLanguageQuery, hanaDatabaseSchema} = input;

    const translateToHANAQueryPrompt = ai.definePrompt({
      name: 'translateToHANAQueryPrompt',
      tools: [executeHANAQuery],
      input: {
        schema: z.object({
          naturalLanguageQuery: z.string(),
          hanaDatabaseSchema: z.string(),
        }),
      },
      output: {
        schema: z.object({
          hanaQuery: z.string().describe('The generated HANA query.'),
        }),
      },
      prompt: `You are a translator converting natural language queries into HANA SQL queries. 
      The HANA database schema is: {{{hanaDatabaseSchema}}}.

      Translate the following natural language query into a HANA SQL query:
      {{{naturalLanguageQuery}}}

      If the user is asking a question about the database, you MUST use the executeHANAQuery tool to get the answer.
      `,
    });

    const {output} = await translateToHANAQueryPrompt({
      naturalLanguageQuery: naturalLanguageQuery,
      hanaDatabaseSchema: hanaDatabaseSchema,
    });

    if (!output) {
      throw new Error('Failed to generate HANA query.');
    }

    // The prompt should call the tool, but if it doesn't, we'll try to call it ourselves.
    // This could happen if the LLM generates the query but doesn't "call" the tool in its response structure.
    let queryResult = 'The LLM did not use the tool to provide a query result.';
    try {
       // Check if the LLM's response (from the 'output' of the prompt) implies tool usage.
       // Genkit's tool use typically populates the fields defined in the tool's outputSchema
       // directly into the LLM's response if the prompt's output schema includes those fields
       // or if the LLM is instructed to structure its response that way.
       // Here, translateToHANAQueryPrompt's outputSchema only has `hanaQuery`.
       // Thus, the tool call's result isn't automatically part of `output`.
       // We must explicitly call the tool.
      queryResult = await executeHANAQuery({
        query: output.hanaQuery,
      });
    } catch (e: any) {
      console.warn(`Tool invocation for executeHANAQuery failed: ${e.message}`);
      queryResult = `Error executing HANA query: ${e.message}`;
    }

    return {
      hanaQuery: output.hanaQuery,
      queryResult: queryResult,
    };
  }
);

