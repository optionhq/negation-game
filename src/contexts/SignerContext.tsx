"use client";

import { Signer } from '@/types/Signer';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';


const api = "/api/signer"
const STORAGE_KEY = 'farcaster-signer'
const signingType = "neynar"

type SignerContextType = {
  signer: Signer | null;
  isLoading: boolean,
  setSigner: React.Dispatch<React.SetStateAction<Signer | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SignerContext = createContext<SignerContextType | undefined>(undefined);

export function useSigner() {
  const context = useContext(SignerContext);
  if (!context) {
    throw new Error('useSigner must be used within a UserProvider');
  }
  return context;
}

export function SignerProvider({ children }: { children: ReactNode }) {
  const [signer, setSigner] = useState<Signer | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)


  // Load existing user upon page load
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY)
    if (storedData) {
      const signer = JSON.parse(storedData, (key, value) => {
        return key === 'fid' ? Number(value) : value;
      }) as Signer
      setSigner(signer)
    }
    setIsLoading(false)
  }, [])

  return (
    <SignerContext.Provider value={{ signer, setSigner, isLoading, setIsLoading }}>
      {children}
    </SignerContext.Provider>
  )

}