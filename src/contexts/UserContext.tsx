import { createContext, useContext } from 'react';
import { Signer } from 'neynar-next/server';

type FarcasterSignerContextType = {
  farcasterSigner: Signer | null;
  setFarcasterUser: React.Dispatch<React.SetStateAction<Signer | null>>;
};

export const FarcasterSignerContext = createContext<FarcasterSignerContextType | undefined>(undefined);

export function useFarcasterSigner() {
  const context = useContext(FarcasterSignerContext);
  if (!context) {
    throw new Error('useFarcasterSigner must be used within a FarcasterSignerProvider');
  }
  return context;
}