import { useEffect, useState } from "react";
import axios from "axios";
import { EndPointsTree } from "@/types/PointsTree";

export default function RecastedComponent({ url }: { url: string }) {
  const [data, setData] = useState<EndPointsTree>();

  useEffect(() => {
    const fetchPointData = async () => {
      const res = await axios.get(`/api/endpoint?endPointUrl=${url}`);
      if (res.status === 200) {
        setData(res.data);
      }
    };
    fetchPointData();
  }, []);
  
  return <div className="m-2 p-2 border border-gray rounded-md">{data?.title}</div>;
}
