// app/search/page.tsx
import { Suspense } from "react";
import SearchPage from "@/components/Search/SearchPage";
import { ClipLoader } from "react-spinners";

export const metadata = {
  title: "Search Products | Your Store Name",
  description: "Search for products in our store",
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
