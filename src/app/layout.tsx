import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";

export const metadata: Metadata = {
    title: "NextMessage",
    description: "Die beste Messaging- und Videoanruf-App der Welt!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
      <html lang="en-EN" suppressHydrationWarning>
          <body>
              <ThemeProvider 
                attribute="class"
                defaultTheme="dark" 
                enableSystem 
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
          </body>
      </html>
    );
}
