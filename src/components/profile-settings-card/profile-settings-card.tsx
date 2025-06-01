"use client"; 

import type React from "react"

import { useState } from "react"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserCircle, Save } from "lucide-react"
import { changeUsername } from "@/lib/api-requests";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { signOut } from "next-auth/react";

const formSchema = z.object({
    username: z.string()
        .min(4, { message: "Benutzername muss zwischen 4 und 12 Zeichen lang sein" })
        .max(12, { message: "Benutzername muss zwischen 4 und 12 Zeichen lang sein" }),
}).refine((data) => {
    return /^[a-zA-Z]/.test(data.username);
}, {
    message: "Benutzername muss mit einem Buchstaben beginnen",
    path: ["username"],
});

export default function ProfileSettingsCard({ userId, token }: { 
    userId: number, 
    token: string
}) {
    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const result = await changeUsername(userId, data.username, token);

        if (!result.success) {
            setError("Benutzername ist bereits vergeben");
            return;
        }

        setError("");
        await signOut({ redirectTo: "/sign-in" });
    };

    return (
        <div>
            <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Profilinformationen
                </CardTitle>
                <CardDescription>
                    Aktualisiere deine Profilinformationen. Änderungen sind für andere Benutzer sichtbar. <br />
                    Diese Aktion löst eine Abmeldung aus.
                </CardDescription>
            </CardHeader>    
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>   
                    <CardContent className="space-y-4">
                        <FormField 
                            control={form.control}
                            name="username"
                            render={({ field }) => {
                                return <FormItem>
                                        <FormLabel className="text-md font-500 text-foreground">Gib deinen Benutzernamen ein</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Benutzername"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                            }}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {error && <div className="text-red-900">{error}</div>}
                        <Button type="submit" disabled={!form.watch('username')?.trim()} className="ml-auto">
                            <span className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                Änderungen speichern
                            </span>
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </div>
    );
}
