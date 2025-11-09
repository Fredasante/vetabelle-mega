import SearchPage from "@/components/Search/SearchPage";

export const metadata = {
  title: "Search | Vetabelle",
  description:
    "Search for products on Vetabelle to find your perfect beauty and wellness supplements.",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <>
      <SearchPage />
    </>
  );
}
