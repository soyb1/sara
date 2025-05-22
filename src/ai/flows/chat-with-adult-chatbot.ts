
// This is an AI-powered chatbot designed for adult conversational experiences,
// specifically tailored for intimate and erotic chat.

'use server';

import {ai} from '@/ai/genkit';
import {z}from 'genkit';
import Handlebars from 'handlebars'; // Import Handlebars directly

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
  console.log('[chatWithAdultChatbot Flow] Received input:', JSON.stringify(input, null, 2));
  return chatWithAdultChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adultSextChatbotPrompt',
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
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    ],
  },
});

const chatWithAdultChatbotFlow = ai.defineFlow(
  {
    name: 'chatWithAdultChatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input: ChatbotInput): Promise<ChatbotOutput> => {
    try {
      console.log('[chatWithAdultChatbotFlow] Attempting to call prompt with input:', JSON.stringify(input, null, 2));
      const {output} = await prompt(input);
      console.log('[chatWithAdultChatbotFlow] Received output from prompt:', JSON.stringify(output, null, 2));

      if (!output || typeof output.response !== 'string') {
        console.error('[chatWithAdultChatbotFlow] Invalid or missing output from prompt. Fallback response will be used.');
        return { response: "I'm feeling a little overwhelmed right now... can you try a different approach?" };
      }
      return output;
    } catch (error) {
      console.error('[chatWithAdultChatbotFlow] Error during prompt execution:', error);
      // Ensure a valid ChatbotOutput is returned even in case of an error during the prompt call
      return { response: "Something went wrong on my end, and I couldn't process that. Please try again." };
    }
  }
);

// Helper for Handlebars 'eq'
// Ensure Handlebars is available. If it's managed by Genkit implicitly, this explicit registration might be redundant
// but doesn't harm. If not, it's necessary.
if (Handlebars && typeof Handlebars.registerHelper === 'function') {
  Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
  });
} else {
  console.warn('[chatWithAdultChatbot Flow] Handlebars or registerHelper not available. Conditional logic in prompt might not work.');
}
