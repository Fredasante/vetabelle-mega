import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Vetabelle | Beauty & Wellness Supplements",
  description:
    "Empowering women with premium wellness supplements made with Collagen, Biotin, and Keratin — for glowing skin, strong nails, and luscious hair.",
  icons: {
    icon: "/vetabelle-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
