"use client"; 

import { useState } from "react"
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DoorOpen } from "lucide-react"
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
import { leaveTeamChat } from "@/lib/api-requests";
import { useRouter } from "next/navigation";

export default function LeaveTeamChat({ chatId, userId, token }: {
    chatId: number,
    userId: number,
    token: string
}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLeaveChat = async () => {
        const result = await leaveTeamChat(chatId, userId, token);

        if (!result.success) {
            setError("Fehler beim Verlassen des Team-Chats.");
            return;
        }

        setError("");
        router.push("/dashboard");
    };

    return (
        <div>
            <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <DoorOpen className="h-5 w-5" />
                        Chat verlassen
                    </CardTitle>
                <CardDescription>
                    Das Verlassen eines Chats ist eine Aktion, die nicht rückgängig gemacht werden kann.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <div className="flex justify-between items-center"></div>
                        <div className="text-red-900">{error && error}</div>
                        <AlertDialogTrigger asChild>    
                            <Button variant="destructive" className="ml-auto">
                                <span className="flex items-center gap-2">
                                <DoorOpen className="h-4 w-4" />
                                Chat verlassen
                                </span>
                            </Button>
                        </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Bist du absolut sicher?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Diese Aktion kann nicht rückgängig gemacht werden. Der Chat wird aus deiner Chat-Liste gelöscht.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleLeaveChat}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Ja, den Chat verlassen
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </div>
    );
}
