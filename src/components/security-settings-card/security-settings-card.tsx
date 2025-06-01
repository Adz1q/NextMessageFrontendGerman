"use client"; 

import type React from "react"

import { useState } from "react"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KeyRound, Save, EyeOff, Eye } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { changePassword } from "@/lib/api-requests"
import { signOut } from "next-auth/react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

const formSchema = z.object({
    currentPassword: z.string()
        .min(5, { message: "Passwort muss zwischen 5 und 32 Zeichen lang sein" })
        .max(32, { message: "Passwort muss zwischen 5 und 32 Zeichen lang sein" }),
    newPassword: z.string()
        .min(5, { message: "Passwort muss zwischen 5 und 32 Zeichen lang sein" })
        .max(32, { message: "Passwort muss zwischen 5 und 32 Zeichen lang sein" }),
    confirmNewPassword: z.string()
        .min(5, { message: "Passwort muss zwischen 5 und 32 Zeichen lang sein" })
        .max(32, { message: "Passwort muss zwischen 5 und 32 Zeichen lang sein" }),
}).refine((data) => {
    return data.currentPassword !== data.newPassword;
}, {
    message: "Neues Passwort darf nicht mit dem alten übereinstimmen",
    path: ["newPassword"],
}).refine((data) => {
    return data.newPassword == data.confirmNewPassword;
}, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmNewPassword"], 
});

export default function SecuritySettingsCard({ userId, token }: {
    userId: number,
    token: string
}) {
    const [error, setError] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const result = await changePassword(userId, data.currentPassword, data.newPassword, token);

        if (!result.success) {
            setError("Ungültiges Passwort");
            return;
        }
        
        setError("");
        await signOut({ redirectTo: "/sign-in" });
    };

    return (
        <div>
            <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Sicherheitseinstellungen
                </CardTitle>
                <CardDescription>
                    Aktualisiere dein Passwort, um dein Konto sicher zu halten.
                    Diese Aktion löst eine Abmeldung aus.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=""
                >
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel className="text-md font-500 text-foreground">Gib dein Passwort ein</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showCurrentPassword ? "text" : "password"}
                                                placeholder="Gib dein aktuelles Passwort ein"
                                                {...field}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowCurrentPassword(s => !s)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground hover:text-muted-foreground"
                                            >
                                                {showCurrentPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel className="text-md font-500 text-foreground">Gib dein Passwort ein</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showNewPassword ? "text" : "password"}
                                                placeholder="Gib dein neues Passwort ein"
                                                {...field}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowNewPassword(s => !s)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground hover:text-muted-foreground"
                                            >
                                                {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        /> 
                        <FormField
                            control={form.control}
                            name="confirmNewPassword"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel className="text-md font-500 text-foreground">Gib dein Passwort ein</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmNewPassword ? "text" : "password"}
                                                placeholder="Bestätige dein neues Passwort"
                                                {...field}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowConfirmNewPassword(s => !s)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground hover:text-muted-foreground"
                                            >
                                                {showConfirmNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />   
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {error && <div className="text-red-900">{error}</div>}
                        <Button
                            type="submit"
                            disabled={!form.watch("currentPassword")?.trim() || !form.watch("newPassword")?.trim() || !form.watch("confirmNewPassword")?.trim()}
                            className="ml-auto"
                        >
                            <span className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                Passwort aktualisieren
                            </span>
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </div>
    );
}
