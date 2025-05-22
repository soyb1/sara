"use server";

import {improvePrompt, type ImprovePromptInput} from "@/ai/flows/improve-prompt";
import {chatWithAdultChatbot, type ChatbotInput} from "@/ai/flows/chat-with-adult-chatbot";
import {generateImage, type GenerateImageInput} from "@/ai/flows/generate-image";
import { z } from "zod";
import type { ConversationMessage } from "@/components/chat/chat-page-client"; // Assuming this type will be created

// Schema for chat form data
const ChatFormSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
  conversationHistory: z.string().optional(), // JSON string of ConversationMessage[]
});

// Schema for image generation form data
const ImageGenFormSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty."),
  improvePrompt: z.preprocess(value => value === "on", z.boolean()).optional(),
});


export async function handleChat(formData: FormData) {
  try {
    const parsedData = ChatFormSchema.parse({
      message: formData.get("message"),
      conversationHistory: formData.get("conversationHistory"),
    });

    let history: ConversationMessage[] = [];
    if (parsedData.conversationHistory) {
      try {
        history = JSON.parse(parsedData.conversationHistory) as ConversationMessage[];
      } catch (e) {
        console.error("Failed to parse conversation history:", e);
        // Keep history empty or handle error appropriately
      }
    }
    
    const chatbotInput: ChatbotInput = {
      message: parsedData.message,
      conversationHistory: history.map(msg => ({ role: msg.role, content: msg.content })),
    };

    const result = await chatWithAdultChatbot(chatbotInput);
    return { success: true, response: result.response };
  } catch (error) {
    console.error("Chat Error:", error);
    const errorMessage = error instanceof z.ZodError ? error.errors.map(e => e.message).join(", ") : "An unexpected error occurred.";
    return { success: false, error: errorMessage };
  }
}

export async function handleGenerateImage(formData: FormData) {
  try {
    const parsedData = ImageGenFormSchema.parse({
      prompt: formData.get("prompt"),
      improvePrompt: formData.get("improvePrompt"),
    });

    let finalPrompt = parsedData.prompt;

    if (parsedData.improvePrompt) {
      try {
        const improvedResult = await improvePrompt({ prompt: finalPrompt });
        if (improvedResult.improvedPrompt) {
          finalPrompt = improvedResult.improvedPrompt;
        }
      } catch (e) {
        console.warn("Failed to improve prompt, using original:", e);
        // Optionally notify user that prompt improvement failed
      }
    }
    
    const imageGenInput: GenerateImageInput = { prompt: finalPrompt };
    const result = await generateImage(imageGenInput);
    return { success: true, imageUrl: result.image, finalPrompt: finalPrompt };
  } catch (error) {
    console.error("Image Generation Error:", error);
    const errorMessage = error instanceof z.ZodError ? error.errors.map(e => e.message).join(", ") : "An unexpected error occurred during image generation.";
    return { success: false, error: errorMessage };
  }
}
