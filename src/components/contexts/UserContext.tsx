import { createContext, useContext } from 'react';
import { FarcasterUser } from '@/types/FarcasterUser';

type FarcasterUserContextType = {
  farcasterUser: FarcasterUser | null;
  setFarcasterUser: React.Dispatch<React.SetStateAction<FarcasterUser | null>>;
};

export const FarcasterUserContext = createContext<FarcasterUserContextType | undefined>(undefined);

export function useFarcasterUser() {
  const context = useContext(FarcasterUserContext);
  if (!context) {
    throw new Error('useFarcasterUser must be used within a FarcasterUserProvider');
  }
  return context;
}