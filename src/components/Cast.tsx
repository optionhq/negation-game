import React, { useState } from 'react';
import axios from 'axios';
import { FarcasterUser } from '@/types/FarcasterUser';
import config from '@/config';

function Cast({ farcasterUser, reloadThreads }: {farcasterUser?: FarcasterUser, reloadThreads: () => void }) {
  const [castText, setCastText] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleCast = async () => {
    try {
      const response = await axios.post('/api/cast', {
        text: castText,
        signer_uuid: farcasterUser?.signer_uuid,
        parent: config.parentUrl,
      });
      if (response.status === 200) {
        setCastText('');
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        reloadThreads();
      }
    } catch (error) {
      console.error('Could not send the cast', error);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={castText} 
        onChange={(e) => setCastText(e.target.value)} 
        style={{ width: '200px', height: '30px', margin: '10px' }}
      />
      <button onClick={handleCast}>Make point</button>
      {showSuccessMessage && <p>Point created</p>}
    </div>
  );
}

export default Cast;