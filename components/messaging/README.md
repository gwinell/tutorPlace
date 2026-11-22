# Messaging components

These client components are independent of `components/platform.tsx` so the platform shell can decide where each view appears:

- `ChatCenter` — private tutor/student conversations, scoped to a tutor–student relationship.
- `SupportInbox` — support tickets for end users and support staff, with explicit consent before exposing a specific personal conversation.

The components receive API adapters as props. Keep these adapters stable across renders (for example, create them at module scope or memoize them) because the views refresh lists and messages while mounted.

## Contracts

Shared types are exported from `contracts.ts`.

```ts
<ChatCenter viewerId={user.id} api={conversationApi} initialConversationId={id} />
<SupportInbox viewerId={user.id} viewerRole="user" api={supportApi} />
```

`ChatCenter` expects the conversation list to include only chats where the authenticated user is a participant. The server must derive access from the session, never trust a client-supplied tutor/student pair.

`SupportInbox` is separate from personal chats. `requestChatAccess` must create an auditable, pending request scoped to one conversation and ticket. It must not reveal conversation messages. `loadSharedConversation` returns messages only after the affected user approved the request and while that approval is active. The response is read-only in the support UI. `respondToChatAccess` and `revokeChatAccess` must create audit events.

Suggested HTTP adapter mapping:

| Adapter method | HTTP request | Expected data |
| --- | --- | --- |
| `listConversations` | `GET /api/conversations` | `{ conversations: ConversationSummary[] }` |
| `listMessages(id)` | `GET /api/conversations/:id/messages` | `{ messages: ChatMessage[] }` |
| `sendMessage(id, body)` | `POST /api/conversations/:id/messages` | `{ message: ChatMessage }`, JSON `{ body }` |
| `listTickets` | `GET /api/support/tickets` | `{ tickets: SupportTicket[] }` |
| `listTicketMessages(id)` | `GET /api/support/tickets/:id/messages` | `{ messages: SupportTicketMessage[] }` |
| `createTicket(input)` | `POST /api/support/tickets` | `{ ticket: SupportTicket }`, JSON `{ subject, body }` |
| `replyToTicket(id, body)` | `POST /api/support/tickets/:id/messages` | `{ message: SupportTicketMessage }`, JSON `{ body }` |
| `requestChatAccess(input)` | `POST /api/support/tickets/:id/access` | `{ request: ChatAccessRequest }`, JSON `{ conversationId, purpose }` |
| `respondToChatAccess(input)` | `POST /api/support/tickets/:id/consent` | `{ request: ChatAccessRequest }`, JSON `{ requestId, approved }` |
| `loadSharedConversation(id)` | `GET /api/support/tickets/:id/access` | `{ messages: ChatMessage[] }`, only after consent |
| `revokeChatAccess(id)` | `DELETE /api/support/tickets/:id/access` | `{ ok: true }` |

All requests must use the current authenticated session, enforce role checks on the server, and return stable error messages for the caller to display. Message bodies are plain text; the UI does not render HTML.
