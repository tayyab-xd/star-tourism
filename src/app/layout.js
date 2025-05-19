import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { AppProvider } from "./context/context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Star Toursim",
  description: "Star Tourism Club delivers exceptional travel experiences across Pakistan .Catering to families, groups, corporations, and students, we offer meticulously planned itineraries that encompass transportation, accommodations, and culinary delights. Our deep-rooted local knowledge ensures seamless journeys for both domestic and international travelers, allowing you to fully immerse in the beauty of Pakistan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
        <Navbar/>
        {children}
        </AppProvider>
      </body>
    </html>
  );
}
