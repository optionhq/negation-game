import { LinkPointsTree } from '@/types/PointsTree';
import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { Signer } from 'neynar-next/server'

interface TripleDotMenuProps {
  isTripleDotOpen: boolean;
  setTripleDotMenu: React.Dispatch<React.SetStateAction<boolean>>;
  farcasterSigner: Signer | null;
  e: LinkPointsTree;
  refreshParentThread: () => Promise<void>;
}


const TripleDotMenu: React.FC<TripleDotMenuProps> = ({
    isTripleDotOpen,
    setTripleDotMenu,
    farcasterSigner,
    e,
    refreshParentThread
  }) => {
    
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setTripleDotMenu(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setTripleDotMenu(prevState => !prevState)
        }}
        className="absolute right-0 top-0 p-2"
      >
        ...
      </button>
      {isTripleDotOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
          <button
            className={`w-full px-4 py-2 text-left ${(!farcasterSigner || 'fid' in farcasterSigner && e?.author?.fid !== farcasterSigner.fid) ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={async (event) => {
              event.stopPropagation();
              if (farcasterSigner && 'fid' in farcasterSigner && e.author?.fid === farcasterSigner.fid) {
                try {
                  await axios.delete(`/api/cast/${e.id}/delete`, {
                    data: {
                      signerUuid: farcasterSigner.signer_uuid
                    },
                  });
                  refreshParentThread()
                  setTripleDotMenu(false);
                } catch (error) {
                  console.error('Failed to delete cast:', error);
                }
              }
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TripleDotMenu;