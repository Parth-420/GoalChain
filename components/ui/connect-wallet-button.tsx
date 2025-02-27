"use client";

import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet } from 'lucide-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export const ConnectWalletButton: FC = () => {
  const { connected, connecting, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  // Create a custom button instead of using WalletMultiButton to avoid hydration issues
  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  return (
    <Button 
      onClick={handleClick} 
      size="lg"
      disabled={connecting}
    >
      {connecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : connected ? (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
};