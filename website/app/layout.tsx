import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Third Hour Cafe | The best hour of your day",
  description:
    "Third Hour Cafe in San Pablo City — coffee, comfort, and a reason to stay a little longer.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
