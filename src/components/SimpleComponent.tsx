import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SimpleComponent = () => {
  const [data, setData] = useState(null);
  const url = 'https://warpcast.com/nor/0x73b7e784';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/thread?id=${"0x73b7e784d6fbc6592997735588dc6bb0de2dedac"}`);

        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Data from endpoint:</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
};

export default SimpleComponent;