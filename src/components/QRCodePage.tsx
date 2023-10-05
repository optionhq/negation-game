import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { LOCAL_STORAGE_KEYS } from './constants';
import { useRouter } from 'next/router';
import { FarcasterUser } from '@/types/FarcasterUser';

function QRCodePage() {
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.FARCASTER_USER);
    if (storedData) {
      const user: FarcasterUser = JSON.parse(storedData);
      setFarcasterUser(user);
    }
  }, []);

  useEffect(() => {
    if (!farcasterUser) {
      // If farcasterUser is not set, don't start polling
      return;
    }

    let intervalId: NodeJS.Timeout;

    const startPolling = () => {
      intervalId = setInterval(async () => {
        try {
          const response = await axios.get(`/api/signer?signer_uuid=${farcasterUser?.signer_uuid}`);
          const user = response.data as FarcasterUser;

          if (user?.status === 'approved') {
            localStorage.setItem(LOCAL_STORAGE_KEYS.FARCASTER_USER, JSON.stringify(user));
            setFarcasterUser(user);
            clearInterval(intervalId);
            router.push('/');
          }
        } catch (error) {
          console.error('Error during polling', error);
        }
      }, 2000);
    };

    startPolling();

    return () => {
      clearInterval(intervalId);
    };
  }, [farcasterUser, router]);

  return farcasterUser?.signer_approval_url ? (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <QRCode value={farcasterUser.signer_approval_url} className="mx-auto" />
        <p className="mt-4 mb-2">OR</p>
        <a 
          href={farcasterUser.signer_approval_url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:underline"
        >
          Click there to view the signer URL
        </a>
      </div>
    </div>
  ) : null;
}

export default QRCodePage;