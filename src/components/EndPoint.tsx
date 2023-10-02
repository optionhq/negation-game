import React, { useEffect, useState } from 'react';
import { getEndPoint } from '../hooks/useEndPoints';
import { PointsTree } from '@/types/PointsTree';

function EndPointComponent() {
  const [data, setData] = useState<PointsTree | null>(null);
  const url = 'https://warpcast.com/nor/0x73b7e784';

  useEffect(() => {
    async function fetchData() {
      const endPointData = await getEndPoint(url);
      setData(endPointData);
    }

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{data.title}</h1>
      <p>ID: {data.id}</p>
      <p>Points: {data.points}</p>
      <p>Reply Count: {data.replyCount}</p>
    </div>
  );
}

export default EndPointComponent;