
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
  console.log('[chatWithAdultChatbot Exported Function] Received input:', JSON.stringify(input, null, 2));
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
  {{role}}: {{content}}
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
    console.log('[chatWithAdultChatbotFlow RUNNING] Attempting to call prompt with input:', JSON.stringify(input, null, 2));
    try {
      const {output} = await prompt(input);
      console.log('[chatWithAdultChatbotFlow] Received output from prompt:', JSON.stringify(output, null, 2));

      if (!output || typeof output.response !== 'string' || output.response.trim() === "") {
        const errorDetail = `Output received: ${JSON.stringify(output)}`;
        console.error('[chatWithAdultChatbotFlow] AI returned an empty or invalid response structure.', errorDetail);
        return { response: "I seem to be having trouble forming a reply right now. Please try sending a different message or try again in a moment. (Technical: AI Output Invalid/Empty)" };
      }
      return output;
    } catch (error: any) {
      const errorMessage = error?.message || JSON.stringify(error);
      console.error('[chatWithAdultChatbotFlow] Critical error during prompt execution:', errorMessage, error);
      return { response: `A critical error occurred on my side while trying to think (Details: ${errorMessage.substring(0,100)}...). Please try again later. (Technical: AI Call Failed)` };
    }
  }
);

// Helper for Handlebars 'eq' - though not strictly needed for the current simplified prompt history.
// Genkit's built-in Handlebars should manage standard helpers like #if and #each.
if (Handlebars && typeof Handlebars.registerHelper === 'function') {
  if (!Handlebars.helpers.eq) { // Register only if not already registered
    Handlebars.registerHelper('eq', function (a, b) {
      return a === b;
    });
  }
} else {
  console.warn('[chatWithAdultChatbot Flow] Handlebars or registerHelper not available. Conditional logic in prompt might not work if complex helpers are used.');
}
