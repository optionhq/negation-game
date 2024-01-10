"use client";
import { fetchGraph } from "@/app/actions/fetchGraph";
import { Graph } from "@/components/Graph";
import useSWR from "swr";

export default function Page() {
  const { data } = useSWR(`graph`, () => fetchGraph());

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Graph elements={data} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
