"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Loader2 } from 'lucide-react';

export default function CreateRedirectPage() {
  const router = useRouter();
  
  // Automatically redirect to the correct goals/create page
  useEffect(() => {
    router.push('/goals/create');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Redirecting to goal creation page...</p>
        </div>
      </main>
    </div>
  );
}