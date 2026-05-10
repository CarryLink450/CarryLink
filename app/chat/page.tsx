import { ChatView } from "@/components/ChatView";
import { getAppData, getCurrentAccount } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ChatPage({
  searchParams
}: {
  searchParams: Promise<{ conversation?: string; trip?: string; request?: string; recipient?: string; error?: string }>;
}) {
  const params = await searchParams;
  const { conversations, deliveryRequests, messages, trips, users } = await getAppData();
  const currentAccount = await getCurrentAccount();
  const currentProfile = currentAccount?.profile;

  if (!currentProfile) {
    return <ChatView conversations={[]} messages={[]} users={users} currentProfileId="" error="No profile found for this account." />;
  }

  const myConversations = conversations.filter((conversation) =>
    conversation.participantIds.includes(currentProfile.id)
  );
  const recipient = users.find((user) => user.id === params.recipient);
  const trip = trips.find((item) => item.id === params.trip);
  const request = deliveryRequests.find((item) => item.id === params.request);
  const cannotMessageSelf = params.recipient === currentProfile.id;
  const draftTarget = recipient && !cannotMessageSelf
    ? {
        recipientId: recipient.id,
        recipientName: recipient.fullName,
        subject: trip
          ? `${trip.fromCity} to ${trip.toCity} trip`
          : request
            ? `${request.itemCategory} request to ${request.toCity}`
            : `Conversation with ${recipient.fullName}`
      }
    : null;

  const error = cannotMessageSelf
    ? "You cannot message yourself. Use this inbox to read messages from other members."
    : params.error;

  return (
    <ChatView
      conversations={myConversations}
      messages={messages}
      users={users}
      currentProfileId={currentProfile.id}
      activeConversationId={params.conversation}
      draftTarget={draftTarget}
      error={error}
    />
  );
}
