"use client";

import { useAgeVerification } from '@/contexts/age-verification-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ShieldCheck, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AgeVerificationModal() {
  const { isVerified, verifyAge, exitApp, isLoading } = useAgeVerification();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isVerified) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isVerified, isLoading]);

  // Prevent closing via Esc or overlay click
  const onOpenChange = (open: boolean) => {
    if (!open && !isVerified) {
      // Keep it open if not verified and user tries to close it
      setIsOpen(true); 
    } else {
      setIsOpen(open);
    }
  };
  
  if (isLoading) {
    // Optional: return a loading state or null if the modal should not flash
    return null; 
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground rounded-lg shadow-xl" aria-describedby="age-verification-description">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">
            <ShieldCheck className="inline-block w-8 h-8 mr-2" />
            Age Verification Required
          </DialogTitle>
          <DialogDescription id="age-verification-description" className="text-center text-muted-foreground pt-2">
            This website contains adult content that is not suitable for individuals under the age of 18 (or the age of majority in your jurisdiction).
            <br /><br />
            Please confirm you are of legal age to proceed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          <Button 
            variant="destructive" 
            onClick={() => {
              exitApp(); 
              // Potentially redirect or show a message that access is denied.
              // For now, exiting means the modal stays or re-appears if logic allows.
              // To truly block, ensure 'isVerified' remains false.
              // window.location.href = "about:blank"; // Example of exiting
            }} 
            className="w-full"
          >
            <XCircle className="mr-2 h-5 w-5" />
            Exit
          </Button>
          <Button 
            variant="default" 
            onClick={() => {
              verifyAge();
              setIsOpen(false);
            }} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <ShieldCheck className="mr-2 h-5 w-5" />
            I am 18 or Older
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
