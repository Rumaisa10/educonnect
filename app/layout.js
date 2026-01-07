import { dbConnect } from "@/service/mongo";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { cn } from "./../lib/utils";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  // Pick only what you need to keep bundle small
  weight: ["400", "600"], // <-- add weights (e.g., 400 regular, 600 semibold)
  variable: "--font-poppins",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "EDUCONNECT",
  description: "EXPLORE | LEARN | BUILD | SHARE",
};

export default async function RootLayout({ children }) {
  const conn = await dbConnect();

  return (
    <html lang="en">
      <body
        className={cn(geistSans.variable, geistMono.variable, poppins.variable)}
      >
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
