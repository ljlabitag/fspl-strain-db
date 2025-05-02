import Providers from "./providers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;


export const metadata = {
    title: "FSPL Strain Database",
    icons: {
        icon: "/logo.png",
        shortcut: "/logo.png",
    },
    keywords: ["FSPL", "Strain Database", "Laboratory Management"],
    description: "A comprehensive database for managing laboratory strains.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col">    
                <Providers>
                <Navbar />
                <Toaster position="top-right" />
                    {children}
                <Footer />
                </Providers>
            </body>
        </html>
    );
}
