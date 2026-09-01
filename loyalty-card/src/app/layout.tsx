import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { NavigationLoadingProvider } from "@/components/motion/NavigationLoadingProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Third Hour Loyalty Card",
  description: "Third Hour virtual loyalty card",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${cormorant.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full">
        {/* Phone-first: designs are 402px wide; center a single column on larger screens. */}
        <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-background">
          <MotionProvider>
            <NavigationLoadingProvider>{children}</NavigationLoadingProvider>
          </MotionProvider>
        </div>
      </body>
    </html>
  );
}
