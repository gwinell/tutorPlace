import type { ChatMessage, ChatAccessRequest, ConversationApi, ConversationSummary, SupportApi, SupportTicket, SupportTicketMessage } from './contracts';

async function request<T>(path:string, init?:RequestInit):Promise<T>{const response=await fetch(path,{credentials:'same-origin',headers:{Accept:'application/json','Content-Type':'application/json',...init?.headers},...init});const payload=await response.json().catch(()=>({})) as {error?:string};if(!response.ok)throw new Error(payload.error||'Не удалось выполнить запрос.');return payload as T;}
export const conversationApi:ConversationApi={
  async listConversations(signal){return (await request<{conversations:ConversationSummary[]}>('/api/conversations',{signal})).conversations;},
  async listMessages(id,signal){return (await request<{messages:ChatMessage[]}>(`/api/conversations/${encodeURIComponent(id)}/messages`,{signal})).messages;},
  async sendMessage(id,body){return (await request<{message:ChatMessage}>(`/api/conversations/${encodeURIComponent(id)}/messages`,{method:'POST',body:JSON.stringify({body})})).message;},
};
export const supportApi:SupportApi={
  async listTickets(signal){return (await request<{tickets:SupportTicket[]}>('/api/support/tickets',{signal})).tickets;},
  async listTicketMessages(id,signal){return (await request<{messages:SupportTicketMessage[]}>(`/api/support/tickets/${encodeURIComponent(id)}/messages`,{signal})).messages;},
  async createTicket(input){return (await request<{ticket:SupportTicket}>('/api/support/tickets',{method:'POST',body:JSON.stringify(input)})).ticket;},
  async replyToTicket(id,body){return (await request<{message:SupportTicketMessage}>(`/api/support/tickets/${encodeURIComponent(id)}/messages`,{method:'POST',body:JSON.stringify({body})})).message;},
  async requestChatAccess(input){return (await request<{request:ChatAccessRequest}>(`/api/support/tickets/${encodeURIComponent(input.ticketId)}/access`,{method:'POST',body:JSON.stringify(input)})).request;},
  async respondToChatAccess(input){return (await request<{request:ChatAccessRequest}>(`/api/support/tickets/${encodeURIComponent(input.ticketId)}/consent`,{method:'POST',body:JSON.stringify(input)})).request;},
  async loadSharedConversation(id,signal){return (await request<{messages:ChatMessage[]}>(`/api/support/tickets/${encodeURIComponent(id)}/access`,{signal})).messages;},
  async revokeChatAccess(id){await request<{ok:boolean}>(`/api/support/tickets/${encodeURIComponent(id)}/access`,{method:'DELETE'});},
};
