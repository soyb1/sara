
"use server";

import {improvePrompt, type ImprovePromptInput} from "@/ai/flows/improve-prompt";
import {chatWithAdultChatbot, type ChatbotInput} from "@/ai/flows/chat-with-adult-chatbot";
import {generateImage, type GenerateImageInput} from "@/ai/flows/generate-image";
import { z } from "zod";
import type { ConversationMessage } from "@/components/chat/chat-page-client";

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
  console.log("[handleChat] Received formData:", formData.get("message"));
  try {
    const parsedData = ChatFormSchema.parse({
      message: formData.get("message"),
      conversationHistory: formData.get("conversationHistory"),
    });
    console.log("[handleChat] Parsed form data:", parsedData);

    let history: ConversationMessage[] = [];
    if (parsedData.conversationHistory) {
      try {
        history = JSON.parse(parsedData.conversationHistory) as ConversationMessage[];
      } catch (e) {
        console.error("[handleChat] Failed to parse conversation history JSON:", e);
        // Keep history empty or handle error appropriately
      }
    }
    
    const chatbotInput: ChatbotInput = {
      message: parsedData.message,
      conversationHistory: history.map(msg => ({ role: msg.role, content: msg.content })),
    };
    console.log("[handleChat] Prepared chatbotInput:", JSON.stringify(chatbotInput, null, 2));

    const result = await chatWithAdultChatbot(chatbotInput);
    console.log("[handleChat] Received result from chatWithAdultChatbot flow:", JSON.stringify(result, null, 2));

    if (result && typeof result.response === 'string') {
      return { success: true, response: result.response };
    } else {
      console.error("[handleChat] Chatbot flow returned invalid or missing response:", result);
      return { success: false, error: "Chatbot returned an unexpected response." };
    }
  } catch (error) {
    console.error("[handleChat] Error in handleChat:", error);
    const errorMessage = error instanceof z.ZodError 
      ? error.errors.map(e => e.message).join(", ") 
      : error instanceof Error ? error.message : "An unexpected error occurred.";
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
