// src/pages/spaces/[space]/[id]/index.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Cast } from "neynar-next/server";
import { getMaybeNegation } from "@/lib/useCasts";

export default function ConversationPage() {
  const router = useRouter();
  const { id } = router.query;

  const [thread, setThread] = useState<Cast[]>([]);

  // useEffect(() => {
  //   if (id) {
  //     // Fetch the thread of responses to the selected conversation cast
  //     axios.get(`/api/cast/${id}/thread`)
  //       .then(response => {
  //         const thread = response.data.result.casts.map(cast => getMaybeNegation(cast));
  //         setThread(thread);
  //       })
  //       .catch(error => console.error('Error fetching thread:', error));
  //   }
  // }, [id]);

  return (
    <div>
      <h1>Thread for cast {id}</h1>
    </div>
  );
}