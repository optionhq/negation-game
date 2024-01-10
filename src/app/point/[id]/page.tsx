"use client";
import { fetchGraph } from "@/app/actions/fetchGraph";
import { Graph } from "@/components/Graph";
import useSWR from "swr";

interface PointParams {
  id: string;
}

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { data } = useSWR(`graph/${id}`, () => fetchGraph(id));

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Graph elements={data} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
