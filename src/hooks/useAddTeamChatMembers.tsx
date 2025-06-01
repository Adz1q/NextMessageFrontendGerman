"use client";

import { addTeamChatMembers } from "@/lib/api-requests";
import React, { useEffect, useState } from "react";

type Friend = {
    id: number;
    username: string;
    profilePictureUrl: string;
    friendshipId: number;
    date: string;
};

type TeamChatMember = {
    id: number;
    userId: number;
    chatId: number;
    username: string;
    profilePictureUrl: string;
    allowMessagesFromNonFriends: boolean;
    friend: boolean;
};

export const useAddTeamChatMembers = (chatId: number, userId: number, token: string, members: TeamChatMember[], friends: Friend[]) => {
    const [selectedFriendIds, setSelectedFriendIds] = useState<Set<number>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error", message: string } | null>(null);
    const [notAddedFriends, setNotAddedFriends] = useState<Friend[]>([]);

    useEffect(() => {
        const memberUserIds = new Set(members.map(m => m.userId));
        const notAdded = friends.filter(friend => !memberUserIds.has(friend.id));

        setNotAddedFriends(notAdded);
    }, [friends, members]); 

    const handleAddTeamChatMembers = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (selectedFriendIds.size === 0) {
            setStatus({ type: "error", message: "Bitte wähle mindestens einen Freund aus, um ihn zum Team-Chat hinzuzufügen" });
            return;        
        }

        setIsSubmitting(true);
        setStatus(null);

        const newMemberIds = Array.from(selectedFriendIds);

        const result = await addTeamChatMembers(chatId, userId, newMemberIds, token);

        if (!result.success) {
            setStatus({ type: "error", message: "Fehler beim Hinzufügen von Team-Chat-Mitgliedern." });
            return;
        }

        setIsSubmitting(false);
        setStatus({ type: "success", message: "Chat-Mitglieder erfolgreich hinzugefügt" });
        setSelectedFriendIds(new Set());
    };

    return {
        selectedFriendIds,
        setSelectedFriendIds,
        isSubmitting,
        setIsSubmitting,
        status,
        setStatus,
        handleAddTeamChatMembers,
        notAddedFriends,
    };
};

