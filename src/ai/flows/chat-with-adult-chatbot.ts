// This is an AI-powered chatbot designed for adult conversational experiences.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotInputSchema = z.object({
  message: z.string().describe('The user message to respond to.'),
  conversationHistory: z
    .array(z.object({role: z.enum(['user', 'assistant']), content: z.string()}))
    .optional()
    .describe('The conversation history.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chatWithAdultChatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatWithAdultChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adultChatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  prompt: `You are an engaging and entertaining AI chatbot designed for adult conversational experiences. Respond to the user message while maintaining the context of the conversation history.

Conversation History:
{{#each conversationHistory}}
  {{#if (eq role \"user\")}}User: {{content}}{{/if}}
  {{#if (eq role \"assistant\")}}Assistant: {{content}}{{/if}}
{{/each}}

User Message: {{{message}}}

Chatbot Response:`,
});

const chatWithAdultChatbotFlow = ai.defineFlow(
  {
    name: 'chatWithAdultChatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
