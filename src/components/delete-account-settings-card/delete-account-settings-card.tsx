"use client"; 

import { useState } from "react"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, AlertTriangle, EyeOff, Eye } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteAccount } from "@/lib/api-requests"
import { signOut } from "next-auth/react";

export default function DeleteAccount({ userId, token }: {
    userId: number,
    token: string
}) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState("");

    const handleDeleteAccount = async () => {
        const result = await deleteAccount(userId, password, token);

        if (!result.success) {
            setError("Ungültiges Passwort");
            return;
        }

        setError("");
        await signOut({ redirectTo: "/" });
    };

    return (
        <div>
            <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Konto löschen
                </CardTitle>
                <CardDescription>
                Lösche dein Konto und alle zugehörigen Daten dauerhaft. Diese Aktion kann nicht rückgängig gemacht werden.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="rounded-md bg-destructive/10 p-4 border border-destructive/20">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                    <h4 className="font-medium text-destructive">Warnung</h4>
                    <p className="text-sm text-destructive/80 mt-1">Das Löschen deines Kontos wird:</p>
                    <ul className="list-disc list-inside text-sm text-destructive/80 mt-2 space-y-1">
                        <li>Alle deine persönlichen Informationen dauerhaft entfernen</li>
                        <li>Alle deine Nachrichten und Unterhaltungen löschen</li>
                        <li>Dich von allen Freundeslisten entfernen</li>
                        <li>Alle aktiven Abonnements kündigen</li>
                    </ul>
                    </div>
                </div>
                </div>
                <div className="space-y-2">
                <Label htmlFor="delete-password">Passwort bestätigen</Label>
                <div className="relative">
                    <Input
                    id="delete-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Gib dein Passwort zur Bestätigung ein"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(s => !s)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground hover:text-muted-foreground"
                    >
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </div>
                </div>
            </CardContent>
            <CardFooter>
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <div className="flex justify-between items-center"></div>
                        <div className="text-red-900">{error && error}</div>
                        <AlertDialogTrigger asChild>    
                            <Button variant="destructive" disabled={!password} className="ml-auto">
                                <span className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Konto löschen
                                </span>
                            </Button>
                        </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Bist du absolut sicher?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Diese Aktion kann nicht rückgängig gemacht werden. Dein Konto wird zusammen mit all deinen Daten, Nachrichten und Beziehungen auf der Plattform dauerhaft gelöscht.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Ja, mein Konto löschen
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </div>
    );
}
