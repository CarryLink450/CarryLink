"use client";

import { Send } from "lucide-react";
import Link from "next/link";
import { sendMessageAction } from "@/app/actions";
import type { Conversation, Message, User } from "@/types";
import { findUserFromList } from "@/lib/utils";

type DraftTarget = {
  recipientId: string;
  subject: string;
  recipientName: string;
} | null;

export function ChatView({
  conversations,
  messages,
  users,
  currentProfileId,
  activeConversationId,
  draftTarget,
  error
}: {
  conversations: Conversation[];
  messages: Message[];
  users: User[];
  currentProfileId: string;
  activeConversationId?: string;
  draftTarget?: DraftTarget;
  error?: string;
}) {
  const activeConversation =
    conversations.find((conversation) => conversation.id === activeConversationId) ??
    conversations[0] ??
    null;

  const thread = activeConversation
    ? messages.filter((message) => message.conversationId === activeConversation.id)
    : [];
  const recipientId =
    activeConversation?.participantIds.find((id) => id !== currentProfileId) ??
    draftTarget?.recipientId ??
    "";
  const activeSubject = activeConversation?.subject ?? draftTarget?.subject ?? "New conversation";
  const latestByConversation = new Map(
    conversations.map((conversation) => {
      const latest = messages
        .filter((message) => message.conversationId === conversation.id)
        .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
        .at(-1);
      return [conversation.id, latest];
    })
  );
  const sortedThread = [...thread].sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-ink">Messages</h1>
          <p className="mt-2 text-slate-600">In-app chat for coordinating details after a match.</p>
        </div>
      </section>
      <section className="section">
        {error ? <p className="mb-5 rounded-lg bg-coral/10 p-4 text-sm font-medium text-coral">{error}</p> : null}
        <div className="grid min-h-[640px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft lg:grid-cols-[320px_1fr]">
          <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r">
            {conversations.length ? conversations.map((conversation) => {
              const latest = latestByConversation.get(conversation.id);
              const hasNewReply = latest ? latest.senderId !== currentProfileId : false;
              const active = activeConversation?.id === conversation.id;
              return (
                <Link
                  key={conversation.id}
                  href={`/chat?conversation=${conversation.id}`}
                  className={`block w-full border-b border-slate-100 p-4 text-left hover:bg-slate-50 ${active ? "bg-skywash" : ""}`}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-ink">{conversation.subject}</span>
                    {hasNewReply ? <span className="shrink-0 rounded-full bg-coral px-2 py-0.5 text-[11px] font-semibold text-white">New</span> : null}
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">{conversation.participantIds.map((id) => findUserFromList(id, users).fullName).join(", ")}</span>
                  {latest ? <span className="mt-2 block truncate text-xs text-slate-500">{latest.body}</span> : null}
                </Link>
              );
            }) : (
              <p className="p-4 text-sm text-slate-500">No conversations yet.</p>
            )}
          </aside>
          <div className="flex flex-col">
            <div className="border-b border-slate-200 p-4">
              <p className="font-semibold text-ink">{activeSubject}</p>
              <p className="text-sm text-slate-500">
                {draftTarget && !activeConversation ? `Messaging ${draftTarget.recipientName}. ` : ""}
                Confirm item contents, legal status, handoff, delivery, and compensation before agreeing.
              </p>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
              {sortedThread.length ? sortedThread.map((message) => {
                const user = findUserFromList(message.senderId, users);
                const mine = message.senderId === currentProfileId;
                return (
                  <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[78%] rounded-lg p-3 text-sm leading-6 ${mine ? "bg-trust text-white" : "bg-white text-slate-700 shadow-sm"}`}>
                      <p className="mb-1 text-xs font-semibold opacity-80">{user.fullName}</p>
                      <p>{message.body}</p>
                    </div>
                  </div>
                );
              }) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
                  {draftTarget ? "Write the first message to start this conversation." : "Select a conversation or message a traveler from a trip card."}
                </div>
              )}
            </div>
            <form action={sendMessageAction} className="flex gap-3 border-t border-slate-200 p-4">
              <input type="hidden" name="conversationId" value={activeConversation?.id ?? ""} />
              <input type="hidden" name="recipientId" value={recipientId} />
              <input type="hidden" name="subject" value={activeSubject} />
              <input className="field" name="body" required disabled={!recipientId} placeholder={recipientId ? "Write a message" : "Open a trip or conversation to message"} />
              <button className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-trust text-white hover:bg-ink disabled:cursor-not-allowed disabled:bg-slate-300" type="submit" aria-label="Send message" disabled={!recipientId}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
