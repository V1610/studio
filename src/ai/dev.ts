import { config } from 'dotenv';
config();

import '@/ai/flows/natural-language-to-hana.ts';
import '@/ai/flows/data-summarization.ts';
import '@/ai/flows/natural-language-to-sql.ts';