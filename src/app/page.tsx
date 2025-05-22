import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(theme(colors.primary),transparent_2px)] [background-size:32px_32px]"></div>
      <h1 className="text-6xl font-bold mb-6 text-primary tracking-tight">
        Welcome to <span className="text-accent">My AI GF</span>
      </h1>
      <p className="text-xl mb-8 max-w-2xl text-foreground/90">
        Explore AI-driven adult conversational experiences and generate unique NSFW images.
        Please ensure you have verified your age to access all features.
      </p>
      <div className="space-y-4">
        <p className="text-lg text-muted-foreground">
          Navigate using the sidebar once you proceed.
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform hover:scale-105">
          <Link href="/app/chat">
            Go to App
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
      <footer className="absolute bottom-8 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} My AI GF. All rights reserved.
      </footer>
    </main>
  );
}
