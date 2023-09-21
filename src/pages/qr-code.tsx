import { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { useRouter } from 'next/router';
import { LOCAL_STORAGE_KEYS } from '../components/constants';

interface FarcasterUser {
  signer_uuid: string;
  public_key: string;
  status: string;
  signer_approval_url?: string;
  fid?: number;
  username?: string;
  profile_picture?: string;
}

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
    <div className="signer-approval-container">
      <QRCode value={farcasterUser.signer_approval_url} />
      <div className="or-divider">OR</div>
      <a href={farcasterUser.signer_approval_url} target="_blank" rel="noopener noreferrer">
        Click here to view the signer URL
      </a>
    </div>
  ) : null;
}

export default QRCodePage;
