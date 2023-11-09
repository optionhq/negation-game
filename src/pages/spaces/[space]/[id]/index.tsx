// src/pages/spaces/[space]/[id]/index.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Cast } from "neynar-next/server";
import { getMaybeNegation } from "@/lib/useCasts";
import Home from '@/components/Home';

export default function ConversationPage() {
  const router = useRouter();
  const { id } = router.query;

  const [thread, setThread] = useState<Cast[]>([]);

  return (
    <div>
      <Home />
    </div>
  );
}