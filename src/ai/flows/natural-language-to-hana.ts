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
  // TODO: Implement the actual HANA query execution here.
  // This is a placeholder implementation that returns a dummy result.
  console.log(`Executing HANA query: ${input.query}`);
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
    let queryResult = 'The LLM did not use the tool.';
    try {
      queryResult = await executeHANAQuery({
        query: output.hanaQuery,
      });
    } catch (e) {
      console.warn('The LLM did not call the tool, and tool invocation failed.');
    }

    return {
      hanaQuery: output.hanaQuery,
      queryResult: queryResult,
    };
  }
);
