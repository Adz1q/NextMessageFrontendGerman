"use client"; 

import type React from "react"

import { useState } from "react"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, Edit } from "lucide-react"
import { changeTeamChatName } from "@/lib/api-requests";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

const formSchema = z.object({
    name: z.string()
        .min(1, { message: "Chat-Name muss zwischen 1 und 16 Zeichen lang sein" })
        .max(16, { message: "Chat-Name muss zwischen 1 und 16 Zeichen lang sein" }),
}).refine((data) => {
    return /^[a-zA-Z]/.test(data.name);
}, {
    message: "Chat-Name muss mit einem Buchstaben beginnen",
    path: ["name"],
});

export default function ChangeTeamChatName({ userId, chatId, token }: { 
    userId: number, 
    chatId: number,
    token: string,
}) {
    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const result = await changeTeamChatName(chatId, userId, data.name, token);

        if (!result.success) {
            setError("Fehler beim Ändern des Team-Chat-Namens.");
            return;
        }

        setError("");
        
    };

    return (
        <div>
            <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                    Chat-Name
                </CardTitle>
                <CardDescription>
                    Aktualisiere den Chat-Namen. Änderungen sind für andere Benutzer sichtbar.
                </CardDescription>
            </CardHeader>    
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>   
                    <CardContent className="space-y-4">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => {
                                return <FormItem>
                                        <FormLabel className="text-md font-500 text-foreground">Gib einen neuen Chat-Namen ein</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Chat-Name"
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
                        <Button type="submit" disabled={!form.watch('name')?.trim()} className="ml-auto">
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
