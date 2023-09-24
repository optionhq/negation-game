import axios from 'axios';

export async function fetchThread(id: string) {
  try {
    const response = await axios.get('https://api.neynar.com/v1/farcaster/all-casts-in-thread', {
      params: {
        api_key: process.env.NEYNAR_API_KEY,
        threadHash: id,
      },
      headers: {accept: 'text/plain'}
    });

    if (response.status !== 200) {
      console.error(`Error fetching thread: ${response.statusText}`);
      return;
    }
    
    return response.data.result.casts;
  } catch (error) {
    console.error('Error in fetchThread:', error);
  }
}