"use client";
import { fetchGraph } from "@/app/actions/fetchGraph";
import { Graph } from "@/components/Graph";
import useSWR from "swr";

export default function Page() {
  const { data } = useSWR(`graph`, () => fetchGraph());

  return (
    <div className="w-screen h-screen">
      {data && <Graph className="w-full h-full bg-gray-100" elements={data} />}
    </div>
  );
}
