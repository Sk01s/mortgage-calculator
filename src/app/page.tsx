import { Metadata } from "next";
import MortgageForm from "@/components/MortgageForm";

export const metadata: Metadata = {
  title: "Mortgage Calculater",
};
export default function Home() {
  return (
    <main>
      <MortgageForm />
    </main>
  );
}
