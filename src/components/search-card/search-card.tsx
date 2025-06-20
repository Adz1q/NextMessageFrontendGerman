"use client";  

import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MessagesSquare, Network, Search, Sparkles, Users, UserSearch } from "lucide-react";
import { Button } from "../ui/button";
import { getChats, getFriends, getFriendshipRequestsBySenderId, getUsersBySimilarUsername } from "@/lib/api-requests";
import { useEffect, useState } from "react";
import FoundUserCard from "../found-user-card/found-user-card";
import { Session } from "next-auth";

type FoundUser = {
    id: number;
    username: string;
    profilePictureUrl: string;
    date: string;
    allowMessagesFromNonFriends: boolean;
};

type Friend = {
    id: number;
    username: string;
    profilePictureUrl: string;
    friendshipId: number;
    date: string;
};

type Chat = {
    id: number;
    name: string;
    lastUpdated: string;
    profilePictureUrl: string;
    type: string;
};

type FriendshipRequest = {
    id: number;
    senderId: number;
    receiverId: number;
    date: string;
};

const formSchema = z.object({
    username: z.string().min(1, { message: "Gib mindestens einen Buchstaben ein" }),
});

const EmptyStateBlock = ({
    icon: Icon,
    title,
    text,
}: {
    icon: React.ElementType;
    title: string;
    text: string;
}) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-6 md:p-8 text-muted-foreground border-2 border-dashed border-border/40 rounded-xl bg-card/50 h-full hover:shadow-lg hover:border-primary/30 transition-all duration-200">
            <Icon className="h-12 w-12 md:h-14 md:w-14 mb-4 text-primary/70" strokeWidth={1.5} />
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1.5">{title}</h3>
            <p className="max-w-xs text-xs md:text-sm leading-relaxed">{text}</p>
        </div>
    );
};

export default function SearchCard({ session }: { session: Session }) {
    const [error, setError] = useState("");
    const [foundUsers, setFoundUsers] = useState<FoundUser[] | null>(null);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [chats, setChats] = useState<Chat[]>([]);
    const [friendshipRequests, setFriendshipRequests] = useState<FriendshipRequest[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            const friendsResult = await getFriends(parseInt(session?.user?.id), session?.user?.token);
            const chatsResult = await getChats(session?.user?.id, session?.user?.token);
            const friendshipRequestsResult = await getFriendshipRequestsBySenderId(parseInt(session?.user?.id), session?.user?.token);

            if (!friendsResult.success || !chatsResult.success || !friendshipRequestsResult.success) {
                setError("Fehler beim Abrufen von Freunden, Chats oder Freundschaftsanfragen");
                return;
            }
    
            setFriends(friendsResult.data);
            setChats(chatsResult.data);
            setFriendshipRequests(friendshipRequestsResult.data);
        };

        fetchData();        
    }, [foundUsers, friends, chats, session?.user?.token, session?.user?.id]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const result = await getUsersBySimilarUsername(data.username, session?.user?.token);

        if (!result.success) {
            setError(result.error);
            return;
        }

        setError("");
        setFoundUsers(result.data);
    };

    return (
        <div className="flex flex-col pt-4">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="flex items-center justify-center text-3xl sm:text-4xl gap-3 font-semibold text-foreground mb-2">
                    <Users className="h-8 w-8 text-primary" />
                    <div>Finde neue Freunde</div>
                </div>
                <div className="text-muted-foreground text-sm sm:text-base">
                    Suche nach Benutzern anhand ihres Benutzernamens, um sie hinzuzufügen und ihnen Nachrichten zu senden.
                </div>
            </div>
            <div className="items-center flex flex-col border-b pb-6">
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex gap-4 justify-center items-start w-full"
                    >
                        <FormField 
                            control={form.control}
                            name="username"
                            render={({ field }) => {
                                return <FormItem className="flex flex-col w-full max-w-md">
                                    <FormControl>
                                        <Input 
                                            type="text"
                                            placeholder="Benutzername"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-sm"/>
                                </FormItem>
                            }}
                        />
                        <Button> 
                            <Search/>
                            Suchen
                        </Button>
                    </form>
                </Form>          
            </div>
            <div className="flex flex-col gap-6 p-6">
                {error && <div className="text-2xl w-full text-center">{error}</div>}
                {!foundUsers && (
                    <div className="m-12 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 flex-grow content-start md:content-center p-2 md:p-0">
                        <EmptyStateBlock
                            icon={UserSearch}
                            title="Entdecke neue Leute"
                            text="Verwende die Suchleiste oben, um Benutzer anhand ihres Benutzernamens zu finden. Beginne mit dem Aufbau deines Netzwerks!"
                        />
                        <EmptyStateBlock
                            icon={Network}
                            title="Erweitere deinen Kreis"
                            text="Verbinde dich mit neuen Freunden, Kollegen oder Personen, die deine Interessen über NextMessage teilen."
                        />
                        <EmptyStateBlock
                            icon={MessagesSquare}
                            title="Starte eine Unterhaltung"
                            text="Sobald du jemanden gefunden hast, sende eine Freundschaftsanfrage und beginne sofort und sicher zu chatten."
                        />
                        <EmptyStateBlock
                            icon={Sparkles}
                            title="Entdecke Funktionen"
                            text="Sieh dir Gruppenchats, Nachrichtenreaktionen und andere Tools an, um deine Kommunikation zu verbessern."
                        />
                    </div>
                )}
                {foundUsers && <div className="flex items-center justify-center gap-3 text-3xl w-full font-500">Suchergebnis <Search /></div>}
                {foundUsers?.map((foundUser) => <FoundUserCard key={foundUser.id} foundUser={foundUser} chats={chats} friends={friends} friendshipRequests={friendshipRequests} session={session}/>)}
            </div>
        </div>
    );
}
