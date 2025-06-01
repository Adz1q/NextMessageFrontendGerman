import LandingPage from "@/components/landing-page/landing-page";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "NextMessage | Startseite",
  description: "Die beste Messaging- und Videoanruf-App der Welt!",
};

export default async function HomePage() {
    const session: Session | null = await auth();

    if (session !== null) {
        redirect("/dashboard");
    }

    return <LandingPage />;
}
