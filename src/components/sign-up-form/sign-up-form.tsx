"use client"; 

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/actions";
import { signIn } from "next-auth/react";

const formSchema = z.object({
    username: z.string()
        .min(4, { message: "Benutzername muss zwischen 4 und 12 Zeichen lang sein" })
        .max(12, { message: "Benutzername muss zwischen 4 und 12 Zeichen lang sein" }),
    email: z.string()
        .min(4, { message: "E-Mail muss zwischen 4 und 50 Zeichen lang sein" })
        .max(50, { message: "E-Mail muss zwischen 4 und 50 Zeichen lang sein" }),
    password: z.string()
        .min(5, { message: "Passwort muss zwischen 5 und 32 Zeichen lang sein" })
        .max(32, { message: "Passwort muss zwischen 5 und 32 Zeichen lang sein" }),
    confirmPassword: z.string()
        .min(5, { message: "Passwort muss zwischen 5 und 32 Zeichen lang sein" })
        .max(32, { message: "Passwort muss zwischen 5 und 32 Zeichen lang sein" }),
}).refine((data) => {
    return /^[a-zA-Z]/.test(data.username);
}, {
    message: "Benutzername muss mit einem Buchstaben beginnen",
    path: ["username"],
}).refine((data) => {
    return data.password === data.confirmPassword;
}, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"], 
});


export default function SignUpForm() {
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const registerResponse = await signUp(data.username, data.email, data.password);

        if (!registerResponse.success) {
            setError("Bei der Registrierung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
            return;
        }

        try {
            const loginResponse = await signIn("credentials", {
                redirect: false,
                login: data.email,
                password: data.password,
            });

            if (!loginResponse || !loginResponse.ok) {
                throw new Error("Etwas ist mit der automatischen Anmeldung schiefgelaufen, bitte melde dich manuell an");
            }

            setError("");
            router.push("/dashboard");
        }
        catch (error: unknown) {
            const responseError = error as Error;

            console.log(responseError);
            setSuccess("Konto erstellt, bitte melde dich an, um fortzufahren");
            router.push("/sign-in");
        }
    };

    return (
        <div className="flex gap-12 items-center flex-col min-h-screen p-24">
            <div className="flex flex-col justify-center items-center gap-4">
                <div className={"text-4xl font-bold flex items-center justify-center"}>
                    Willkommen
                </div>
                <div className={"text-lg flex items-center justify-center text-muted-foreground"}>
                    Gib deine Anmeldedaten ein, um dein Konto zu registrieren
                </div>
            </div>
            <div className="max-w-md w-full flex flex-col gap-8">
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="max-w-md w-full flex flex-col gap-6"
                    >
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
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel className="text-md font-500 text-foreground">Gib deine E-Mail-Adresse ein</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="E-Mail"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <FormField 
                            control={form.control}
                            name="password"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel className="text-md font-500 text-foreground">Gib dein Passwort ein</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Passwort"
                                                {...field}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(s => !s)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground hover:text-muted-foreground"
                                            >
                                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel className="text-md font-500 text-foreground">Bestätige dein Passwort</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Passwort bestätigen"
                                                {...field}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowConfirmPassword(s => !s)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground hover:text-muted-foreground"
                                            >
                                                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <Button type="submit" className="w-full">Registrieren</Button>
                        {error && <div className="flex justify-center items-center">
                            <div className="text-red-900 font-medium">{error}</div>
                        </div>}
                        {success && <div className="flex justify-center items-center">
                            <div className="text-green-700 font-medium">{success}</div>
                        </div>}
                    </form>
                </Form>
                <div className={"flex justify-center items-center max-w-md w-full"}>
                    <Link href="/sign-in" className="hover:underline">Hast du bereits ein Konto? Anmelden</Link>
                </div>
            </div>
        </div>
    );
}
