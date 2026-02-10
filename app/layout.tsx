import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "โปรแกรมคำนวณค่าใช้จ่าย",
  description: "Split badminton expenses among players",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
