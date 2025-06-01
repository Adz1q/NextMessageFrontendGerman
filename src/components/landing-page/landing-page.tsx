"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquareText, Zap, ShieldCheck, Users, ExternalLink, ChevronRight, MessageCircle } from 'lucide-react';

const FeatureCard = ({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
}) => (
    <div className="flex flex-col items-center p-6 text-center bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="mb-4 text-primary">
            <Icon size={48} strokeWidth={1.5} />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
);

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-dvh bg-background text-foreground"> 
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2" prefetch={false}>
                        <MessageCircle className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">NextMessage</span>
                    </Link>
                    <nav className="flex items-center gap-2 sm:gap-4">
                        <Link href="/sign-in" passHref prefetch={false}>
                            <Button variant="ghost" size="sm">
                                Anmelden
                            </Button>
                        </Link>
                        <Link href="/sign-up" passHref prefetch={false}>
                            <Button variant="default" size="sm">
                                Registrieren
                            </Button>
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1">
                <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-primary/5 via-background to-background">
                    <div className="px-4 md:px-6 text-center"> 
                        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6 text-foreground leading-tight">
                            Verbinde dich <span className="text-primary">schneller</span> und <span className="text-primary">sicherer</span>.
                        </h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mb-8">
                            NextMessage ist eine moderne Messaging-Plattform, die Eleganz mit Leistung verbindet. Schließe dich uns an und entdecke eine neue Dimension der Kommunikation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center"> 
                            <Link href="/sign-up" passHref prefetch={false}>
                                <Button size="lg" className="w-full sm:w-auto">
                                    Kostenlos loslegen
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="#features" passHref prefetch={false}>
                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                    Mehr erfahren
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
                <section id="features" className="w-full py-16 md:py-24 bg-muted/40">
                    <div className="px-4 md:px-6">
                        <div className="mb-12 text-center"> 
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                                Warum NextMessage?
                            </h2>
                            <p className="mt-3 text-muted-foreground md:text-lg max-w-2xl mx-auto">
                                Wir haben NextMessage für dich entwickelt – deine Privatsphäre, Bequemlichkeit und dein Bedürfnis, in Verbindung zu bleiben.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                            <FeatureCard
                                icon={MessageSquareText}
                                title="Echtzeit-Unterhaltungen"
                                description="Nachrichten erscheinen sofort und ohne Verzögerung und gewährleisten einen reibungslosen und dynamischen Gesprächsfluss."
                            />
                            <FeatureCard
                                icon={Zap}
                                title="Moderne Benutzeroberfläche"
                                description="Ein sauberes, intuitives und ästhetisch ansprechendes Design, das die Kommunikation zum Vergnügen macht."
                            />
                            <FeatureCard
                                icon={ShieldCheck}
                                title="Sicherheit & Datenschutz zuerst"
                                description="Deine Gespräche sind wichtig. Wir verwenden moderne Methoden, um deine Daten zu schützen und deine Privatsphäre zu gewährleisten."
                            />
                            <FeatureCard
                                icon={Users}
                                title="Einfache Kontaktverwaltung"
                                description="Einfaches Hinzufügen von Freunden und intuitive Verwaltung deiner Kontaktliste und Gruppen."
                            />
                             <FeatureCard
                                icon={ExternalLink}
                                title="Integrationen (Bald verfügbar!)"
                                description="Wir planen Integrationen mit beliebten Tools, um deinen Workflow zu optimieren."
                            />
                             <FeatureCard
                                icon={Zap}
                                title="Plattformübergreifende Verfügbarkeit"
                                description="Nutze NextMessage auf deinem Desktop und deinen Mobilgeräten (Mobile-App in Entwicklung)."
                            />
                        </div>
                    </div>
                </section>
                <section className="w-full py-20 md:py-32">
                    <div className="px-4 md:px-6 text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground mb-6">
                            Bereit loszulegen?
                        </h2>
                        <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg mb-8">
                            Schließe dich Tausenden von Benutzern an, die bereits eine neue Qualität der Kommunikation genießen. Die Registrierung dauert nur einen Moment.
                        </p>
                        <Link href="/sign-up" passHref prefetch={false}>
                            <Button size="lg" className="w-full max-w-xs mx-auto">
                                Erstelle dein NextMessage-Konto
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
            <footer className="w-full border-t bg-muted/20">
                <div className="flex flex-col items-center justify-center gap-2 h-20 px-4 text-center sm:h-16 sm:flex-row sm:justify-between md:px-6">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} NextMessage. Alle Rechte vorbehalten.
                    </p>
                    <nav className="flex gap-4 sm:gap-6 text-xs">
                        <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors" prefetch={false}>
                            Nutzungsbedingungen
                        </Link>
                        <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors" prefetch={false}>
                            Datenschutzrichtlinie
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
