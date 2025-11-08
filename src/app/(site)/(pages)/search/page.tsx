import { Suspense } from "react";
import SearchPage from "@/components/Search/SearchPage";
import { ClipLoader } from "react-spinners";

export const metadata = {
  title: "Search Products | Vetabelle",
  description:
    "Find your favorite Vetabelle wellness supplements. Search for collagen, biotin, keratin, and other beauty-boosting products to enhance your natural glow.",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <ClipLoader size={40} color="#000080" />
        </div>
      }
    >
      <SearchPage />
    </Suspense>
  );
}
