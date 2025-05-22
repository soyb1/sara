import ImageGeneratorPageClient from '@/components/image-generator/image-generator-page-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SARA - Image Generator',
  description: 'Generate unique NSFW images from text prompts.',
};

export default function ImageGeneratorPage() {
  return (
    <div className="w-full">
      <ImageGeneratorPageClient />
    </div>
  );
}
