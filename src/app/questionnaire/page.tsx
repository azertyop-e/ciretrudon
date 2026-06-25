import Questionnaire from "@/components/Questionnaire/Questionnaire";

export const metadata = {
  title: "Cire Trudon",
  description: "Découvrez votre senteur à travers une expérience olfactive immersive.",
};

export default function QuestionnairePage() {
  return (
    <main>
      <Questionnaire />
    </main>
  );
}
