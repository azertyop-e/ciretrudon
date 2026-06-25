import { Suspense } from "react";
import ResultClient from "./ResultClient";

export const metadata = {
  title: "Cire Trudon — Votre essence",
  description: "Découvrez votre univers olfactif Cire Trudon.",
};

export default function ResultatPage() {
  return (
    <Suspense>
      <ResultClient />
    </Suspense>
  );
}
