"use client";
import { Graph } from "@/components/Graph";
import { fetchGraph } from "@/lib/actions/fetchGraph";
import useSWR from "swr";

interface PointParams {
  id: string;
}

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { data } = useSWR(`graph/${id}`, () => fetchGraph(id));

  return (
    <div className="w-screen h-screen p-0">
      <Graph elements={data} className="w-full h-full bg-gray-100" />
    </div>
  );
}
