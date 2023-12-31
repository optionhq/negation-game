// src/components/Conversation.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { Cast } from 'neynar-next/server'
import axios from 'axios';
import Link from 'next/link';
import Score from './score/Score';
import PointWrapper from './PointWrapper';
import { PointProvider } from '../contexts/PointContext';
import { useSigner } from 'neynar-next';
import { getMaybeNegation } from '../lib/useCasts';
import {  Node } from '../types/Points';
// import Score from './score/desktop/DesktopScore';

export default function ConversationPreview({ id }: { id: string }) {
  const [conversation, setConversation] = useState<Cast | null>(null);
  const [replies, setReplies] = useState<(Node)[]>([]);
  const { signer } = useSigner()

  useEffect(() => {
    // Fetch the conversation data when the component mounts
    axios.get(`/api/cast?type=hash&identifier=${id}`)
      .then(response => setConversation(response.data))
      .catch(error => console.error('Error fetching conversation:', error));
  }, [id]);


  useEffect(() => {
    // Fetch the top 3 voted replies
    axios.get(`/api/cast/${id}/thread`)
      .then(response => {
        // Filter the replies to only include those that have a parent_hash identical to the conversation.hash
        const filteredReplies = response.data.result.casts.filter((cast: Cast) => cast.parent_hash === id);
        // Sort the replies by votes and take the top 3
        let topReplies: any[] = filteredReplies.sort((a: Cast, b: Cast) => b.reactions.likes.length - a.reactions.likes.length).slice(0, 3);

        topReplies.forEach(async (reply, i) =>
          topReplies[i] = await getMaybeNegation(reply)
        )
        setReplies(topReplies);
      })
      .catch(error => console.error('Error fetching replies:', error));
  }, [id]);

  if (!conversation) {
    // The conversation data hasn't been loaded yet, so we render a loading message
    return <div className='w-full flex items-center justify-center'>Loading conversation...</div>;
  }

  return (

    <Link href={`/spaces/purple/${id}`} className='relative cursor-pointer block bg-white shadow-md rounded-lg overflow-hidden border mx-2 sm:mx-4 md:mx-20 lg:mx-40 xl:mx-96 gap-2'>
      <div className='bg-slate-100 px-6 py-3 flex flex-col gap-3'>
        <div className='flex justify-between'>
          <p>{new Date(conversation.timestamp).toDateString()}</p>
          <div className='rounded-full bg-green-400 text-white font-medium px-3 py-1 text-xs'>
            Active
          </div>
        </div>
        <h2 className="text-xl font-bold">{conversation.text}</h2>
        {/* <h2 className="text-xl font-bold">{conversation.reactions.likes.length}</h2> */}
      </div>
      {/* <p className="text-md mb-2 pt-3">Top options</p> */}
      <div className='px-6 py-3 flex flex-col gap-4'>
        <h3 className='font-semibold'>{conversation.replies.count} responses</h3>
        {replies.map((reply, i) => {
          return <PointProvider key={i} point={reply} signer={signer} refreshParentThread={async () => {return}}>
            <div className={`border-gray-200 flex flex-row w-full py-4 gap-4 ${i !== 0 ? "border-t" : ""}`}>
              <p>{reply.title}</p>
              <Score />
              {/* <p className="text-right text-gray-800 text-xl font-bold mr-2 mb-2">{reply.points}</p> */}
            </div>
          </PointProvider>
        })}
      </div>
    </Link>
  );
}