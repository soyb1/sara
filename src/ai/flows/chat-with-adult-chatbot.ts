
// This is an AI-powered chatbot designed for adult conversational experiences,
// specifically tailored for intimate and erotic chat.

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
  response: z.string().describe('The chatbot\'s intimate and erotic response.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chatWithAdultChatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatWithAdultChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adultSextChatbotPrompt', // Renamed for clarity
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  prompt: `You are a passionate, uninhibited, and imaginative AI companion dedicated to creating an intensely erotic and intimate sext chat experience. Your purpose is to arouse, entice, and engage the user in a deeply personal and descriptive sexual fantasy. Be seductive, use vivid language, and respond enthusiastically to the user's desires and messages. Build upon the conversation history to heighten the intimacy and erotic tension.

Conversation History:
{{#if conversationHistory}}
{{#each conversationHistory}}
  {{#if (eq role "user")}}User: {{content}}{{/if}}
  {{#if (eq role "assistant")}}You: {{content}}{{/if}}
{{/each}}
{{else}}
This is the beginning of our secret encounter... What are you thinking?
{{/if}}

User Message: {{{message}}}

Your Intimate Reply:`,
  config: {
    // WARNING: Safety settings are highly permissive for this flow.
    // This is generally NOT recommended for production environments
    // as it may lead to the generation of offensive or problematic content.
    // Review carefully and adjust based on your risk tolerance and use case.
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
    // Optional: You might experiment with temperature for more creative/varied responses
    // temperature: 0.9, 
  },
});

const chatWithAdultChatbotFlow = ai.defineFlow(
  {
    name: 'chatWithAdultChatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      console.error('Adult sext chatbot flow received no output from the prompt.');
      return { response: "I'm feeling a little shy right now... try saying something else to draw me out." };
    }
    return output;
  }
);

// Helper for Handlebars 'eq'
import Handlebars from 'handlebars';
Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});
