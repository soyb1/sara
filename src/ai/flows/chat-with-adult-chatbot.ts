
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
  {{role}}: {{content}}
{{/each}}

User Message: {{{message}}}

Chatbot Response:`,
  config: { // NOTE: Safety settings relaxed for this flow. Review for production.
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
      // Handle cases where the model might return nothing or an unexpected structure
      // even if safety settings are relaxed.
      console.error('Adult chatbot flow received no output from the prompt.');
      return { response: "I'm sorry, I couldn't generate a response right now." };
    }
    return output;
  }
);

