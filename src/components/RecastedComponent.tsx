import { useEffect, useState } from "react";
import axios from "axios";
import { Point } from "@/types/Points";

export default function RecastedComponent({ url }: { url: string }) {
  const [data, setData] = useState<Point>();

  useEffect(() => {
    const fetchPointData = async () => {
      const res = await axios.get(`/api/endpoint?endPointUrl=${url}`);
      if (res.status === 200) {
        setData(res.data);
      }
    };
    fetchPointData();
  }, []);

  return <div className="m-2 p-2 border border-slate-300 rounded-md w-full max-h-36">{data?.title}</div>;
}
