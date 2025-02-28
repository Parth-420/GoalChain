"use client";

import { FC } from 'react';
import Link from 'next/link';
import { ConnectWalletButton } from '@/components/ui/connect-wallet-button';
import { ModeToggle } from '@/components/mode-toggle';
import { Target } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';

export const Header: FC = () => {
  const { connected } = useWallet();
  const pathname = usePathname();

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Target className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">GoalChain</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {connected ? (
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/goals/create" className="text-foreground hover:text-primary transition-colors">
                    Create Goal
                  </Link>
                </li>
              </ul>
            </nav>
          ) : (
            <nav>
              <ul className="hidden md:flex space-x-6">
                <li>
                  <Link href="/#how-it-works" className="text-foreground hover:text-primary transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="text-foreground hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="text-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          )}
          
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </header>
  );
};