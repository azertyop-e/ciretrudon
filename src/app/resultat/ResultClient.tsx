"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Result from "@/components/Result/Result";

export default function ResultClient() {
  const params = useSearchParams();
  const router = useRouter();

  const raw = params.get("families") ?? "";
  const families = raw
    .split(",")
    .map((s) => parseInt(s, 10))
    .filter((n) => !isNaN(n) && n >= 0 && n <= 3)
    .slice(0, 2)
    .map((index) => ({ index, percentage: 0 }));

  useEffect(() => {
    if (families.length === 0) {
      void router.replace("/questionnaire");
    }
  }, [families.length, router]);

  if (families.length === 0) {
    return null;
  }

  return (
    <Result
      families={families}
      onRestart={() => {
        void router.push("/questionnaire");
      }}
    />
  );
}
