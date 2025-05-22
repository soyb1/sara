"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { handleGenerateImage } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { Sparkles, ImagePlay, Image as ImageIcon, Wand2 } from "lucide-react";

const imageGenFormSchema = z.object({
  prompt: z.string().min(3, "Prompt must be at least 3 characters long."),
  improvePrompt: z.boolean().optional(),
});

type ImageGenFormValues = z.infer<typeof imageGenFormSchema>;

export default function ImageGeneratorPageClient() {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [finalPromptUsed, setFinalPromptUsed] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ImageGenFormValues>({
    resolver: zodResolver(imageGenFormSchema),
    defaultValues: {
      prompt: "",
      improvePrompt: true,
    },
  });

  const onSubmit = async (data: ImageGenFormValues) => {
    setIsLoading(true);
    setGeneratedImageUrl(null);
    setFinalPromptUsed(null);

    const formData = new FormData();
    formData.append("prompt", data.prompt);
    if (data.improvePrompt) {
      formData.append("improvePrompt", "on");
    }
    
    const result = await handleGenerateImage(formData);
    setIsLoading(false);

    if (result.success && result.imageUrl) {
      setGeneratedImageUrl(result.imageUrl);
      setFinalPromptUsed(result.finalPrompt || data.prompt);
      toast({
        title: "Image Generated!",
        description: "Your image has been successfully created.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Image Generation Error",
        description: result.error || "Failed to generate the image.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <ImagePlay className="mr-2 h-7 w-7 text-primary" /> NSFW Image Generator
          </CardTitle>
          <CardDescription>
            Craft your desires into visual art. Describe what you want to see, and let the AI bring it to life.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="prompt-textarea" className="text-lg">Your Vision (Prompt)</FormLabel>
                    <FormControl>
                      <Textarea
                        id="prompt-textarea"
                        placeholder="e.g., A mystical forest under a crimson moon, ethereal figures dancing..."
                        className="min-h-[120px] text-base"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="improvePrompt"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-secondary/30">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                        id="improve-prompt-checkbox"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="improve-prompt-checkbox" className="cursor-pointer flex items-center">
                        <Wand2 className="mr-2 h-5 w-5 text-accent" />
                        Enhance Prompt with AI
                      </FormLabel>
                       <p className="text-xs text-muted-foreground">
                        Let AI refine your prompt for potentially better results.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/80 text-primary-foreground text-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" /> Create Image
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
        <Card className="w-full max-w-2xl p-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <ImageIcon className="h-16 w-16 animate-pulse text-primary" />
            <p className="text-lg text-muted-foreground">Conjuring your masterpiece... please wait.</p>
          </div>
        </Card>
      )}

      {generatedImageUrl && !isLoading && (
        <Card className="w-full max-w-2xl shadow-2xl overflow-hidden">
          <CardHeader>
            <CardTitle>Your Generated Image</CardTitle>
            {finalPromptUsed && <CardDescription className="text-xs italic">Generated with prompt: "{finalPromptUsed}"</CardDescription>}
          </CardHeader>
          <CardContent className="flex justify-center items-center bg-black/20 p-4">
            <Image 
              src={generatedImageUrl} 
              alt={finalPromptUsed || "Generated image"} 
              width={512} 
              height={512} 
              className="rounded-lg border-2 border-accent shadow-lg"
              data-ai-hint="generated art"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
