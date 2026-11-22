export type ChatParticipantRole = "teacher" | "student";

export type ChatParticipant = {
  id: string;
  name: string;
  role: ChatParticipantRole;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  body: string;
  createdAt: string;
};

export type ConversationSummary = {
  id: string;
  tutorId: string;
  studentId: string;
  participant: ChatParticipant;
  subject?: string | null;
  lessonId?: string | null;
  unreadCount: number;
  updatedAt: string;
  lastMessage?: Pick<ChatMessage, "body" | "senderId" | "createdAt"> | null;
};

export type SupportTicketStatus = "open" | "waiting" | "resolved";

export type SupportTicketMessage = {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: "user" | "support";
  body: string;
  createdAt: string;
};

export type ChatAccessStatus = "pending" | "approved" | "denied" | "revoked" | "expired";

export type ChatAccessRequest = {
  id: string;
  ticketId: string;
  conversationId: string;
  conversationLabel: string;
  requesterName: string;
  purpose: string;
  status: ChatAccessStatus;
  createdAt: string;
  expiresAt?: string | null;
};

export type SupportTicket = {
  id: string;
  subject: string;
  status: SupportTicketStatus;
  requester: { id: string; name: string };
  preview?: string | null;
  updatedAt: string;
  unreadCount: number;
  linkedConversation?: { id: string; label: string } | null;
  availableConversations?: { id: string; label: string }[];
  accessRequest?: ChatAccessRequest | null;
};

export type ConversationApi = {
  listConversations(signal?: AbortSignal): Promise<ConversationSummary[]>;
  listMessages(conversationId: string, signal?: AbortSignal): Promise<ChatMessage[]>;
  sendMessage(conversationId: string, body: string): Promise<ChatMessage>;
};

export type SupportApi = {
  listTickets(signal?: AbortSignal): Promise<SupportTicket[]>;
  listTicketMessages(ticketId: string, signal?: AbortSignal): Promise<SupportTicketMessage[]>;
  createTicket(input: { subject: string; body: string }): Promise<SupportTicket>;
  replyToTicket(ticketId: string, body: string): Promise<SupportTicketMessage>;
  requestChatAccess(input: { ticketId: string; conversationId: string; purpose: string }): Promise<ChatAccessRequest>;
  respondToChatAccess(input: { ticketId: string; requestId: string; approved: boolean }): Promise<ChatAccessRequest>;
  loadSharedConversation(ticketId: string, signal?: AbortSignal): Promise<ChatMessage[]>;
  revokeChatAccess(ticketId: string): Promise<void>;
};

export function formatMessageTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(date);
}

export function formatMessageDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(date);
}
