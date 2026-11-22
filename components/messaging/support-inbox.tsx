"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, Check, LifeBuoy, LockKeyhole, MessageSquareText, Plus, Send, ShieldCheck } from "lucide-react";
import styles from "./messaging.module.css";
import { formatMessageDate, formatMessageTime, type ChatAccessRequest, type ChatMessage, type SupportApi, type SupportTicket, type SupportTicketMessage } from "./contracts";

export type SupportInboxProps = {
  viewerId: string;
  viewerRole: "user" | "support";
  api: SupportApi;
  pollIntervalMs?: number;
  onError?: (message: string) => void;
};

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0] || "").join("").toLocaleUpperCase("ru-RU") || "?";
}

function ticketStatus(status: SupportTicket["status"]) {
  if (status === "resolved") return "Решено";
  if (status === "waiting") return "Ждём ответа";
  return "Открыто";
}

function makeGroups<T extends { createdAt: string }>(messages: T[]) {
  const groups: { date: string; label: string; messages: T[] }[] = [];
  for (const message of messages) {
    const date = new Date(message.createdAt);
    if (Number.isNaN(date.getTime())) continue;
    const key = date.toDateString();
    let group = groups[groups.length - 1];
    if (!group || group.date !== key) {
      group = { date: key, label: formatMessageDate(message.createdAt), messages: [] };
      groups.push(group);
    }
    group.messages.push(message);
  }
  return groups;
}

function ChatAccessCard({ request, viewerRole, onRespond, busy }: {
  request: ChatAccessRequest;
  viewerRole: "user" | "support";
  onRespond: (approved: boolean) => void;
  busy: boolean;
}) {
  const statusText = request.status === "pending" ? "Ожидает решения" : request.status === "approved" ? "Доступ разрешён" : request.status === "denied" ? "Доступ отклонён" : request.status === "revoked" ? "Доступ отозван" : "Срок доступа истёк";
  return <section className={styles.notice} aria-label="Запрос на доступ к личной переписке">
    <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
      <LockKeyhole size={17} aria-hidden="true" />
      <div style={{ flex: 1 }}>
        <strong>{viewerRole === "user" ? "Запрос на просмотр переписки" : "Доступ к личной переписке"}</strong>
        <p style={{ margin: "5px 0 0" }}>{request.requesterName} просит открыть чат «{request.conversationLabel}» для поддержки. Причина: {request.purpose}</p>
        {request.expiresAt && <small>Разрешение действует до {new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(request.expiresAt))}</small>}
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          <span className={styles.status}><ShieldCheck size={13} aria-hidden="true" />{statusText}</span>
          {viewerRole === "user" && request.status === "pending" && <>
            <button type="button" className={styles.primaryButton} disabled={busy} onClick={() => onRespond(true)}><Check size={14} />Разрешить</button>
            <button type="button" className={styles.secondaryButton} disabled={busy} onClick={() => onRespond(false)}>Отказать</button>
          </>}
          {viewerRole === "support" && request.status === "approved" && <span>Согласие и его срок сохранены в журнале доступа.</span>}
        </div>
      </div>
    </div>
  </section>;
}

export default function SupportInbox({ viewerId, viewerRole, api, pollIntervalMs = 10000, onError }: SupportInboxProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState<SupportTicketMessage[]>([]);
  const [sharedMessages, setSharedMessages] = useState<ChatMessage[]>([]);
  const [showSharedChat, setShowSharedChat] = useState(false);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [subject, setSubject] = useState("");
  const [draft, setDraft] = useState("");
  const [newBody, setNewBody] = useState("");
  const [accessConversationId, setAccessConversationId] = useState("");
  const [accessPurpose, setAccessPurpose] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);
  const selectedTicket = tickets.find(ticket => ticket.id === selectedId) || null;
  const openCount = useMemo(() => tickets.filter(ticket => ticket.status !== "resolved").length, [tickets]);

  const reportError = useCallback((value: unknown, fallback: string) => {
    const message = value instanceof Error ? value.message : fallback;
    setError(message);
    onError?.(message);
  }, [onError]);

  const refreshTickets = useCallback(async (signal?: AbortSignal) => {
    const next = await api.listTickets(signal);
    setTickets(next);
    if (selectedId && !next.some(ticket => ticket.id === selectedId)) setSelectedId("");
  }, [api, selectedId]);

  const refreshMessages = useCallback(async (ticketId: string, signal?: AbortSignal) => {
    const next = await api.listTicketMessages(ticketId, signal);
    setMessages(next);
  }, [api]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    void refreshTickets(controller.signal)
      .catch(value => { if (!controller.signal.aborted) reportError(value, "Не удалось загрузить обращения."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [refreshTickets, reportError]);

  useEffect(() => {
    if (!selectedId) { setMessages([]); setSharedMessages([]); setShowSharedChat(false); return; }
    const controller = new AbortController();
    setLoadingMessages(true);
    void refreshMessages(selectedId, controller.signal)
      .catch(value => { if (!controller.signal.aborted) reportError(value, "Не удалось загрузить переписку с поддержкой."); })
      .finally(() => { if (!controller.signal.aborted) setLoadingMessages(false); });
    const interval = window.setInterval(() => {
      void refreshMessages(selectedId, controller.signal).catch(value => {
        if (!controller.signal.aborted) reportError(value, "Не удалось обновить обращение.");
      });
      void refreshTickets(controller.signal).catch(() => {});
    }, Math.max(5000, pollIntervalMs));
    return () => { controller.abort(); window.clearInterval(interval); };
  }, [pollIntervalMs, refreshMessages, refreshTickets, reportError, selectedId]);

  useEffect(() => {
    if (!loadingMessages) threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [loadingMessages, messages, sharedMessages]);

  async function createTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!subject.trim() || !newBody.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      const ticket = await api.createTicket({ subject: subject.trim(), body: newBody.trim() });
      setTickets(current => [ticket, ...current.filter(item => item.id !== ticket.id)]);
      setSelectedId(ticket.id);
      setSubject("");
      setNewBody("");
      setCreating(false);
    } catch (value) {
      reportError(value, "Не удалось создать обращение.");
    } finally {
      setBusy(false);
    }
  }

  async function reply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedId || !draft.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      const message = await api.replyToTicket(selectedId, draft.trim());
      setMessages(current => [...current, message]);
      setDraft("");
      void refreshTickets().catch(() => {});
    } catch (value) {
      reportError(value, "Не удалось отправить ответ.");
    } finally {
      setBusy(false);
    }
  }

  async function respondToConsent(request: ChatAccessRequest, approved: boolean) {
    if (busy || !selectedId) return;
    setBusy(true);
    setError("");
    try {
      await api.respondToChatAccess({ ticketId: selectedId, requestId: request.id, approved });
      await refreshTickets();
    } catch (value) {
      reportError(value, "Не удалось сохранить решение по доступу.");
    } finally {
      setBusy(false);
    }
  }

  async function requestAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedId || !accessConversationId || !accessPurpose.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      await api.requestChatAccess({ ticketId: selectedId, conversationId: accessConversationId, purpose: accessPurpose.trim() });
      setAccessPurpose("");
      await refreshTickets();
    } catch (value) {
      reportError(value, "Не удалось отправить запрос на доступ.");
    } finally {
      setBusy(false);
    }
  }

  async function showAuthorizedChat() {
    if (!selectedId || busy) return;
    setBusy(true);
    setError("");
    try {
      const loaded = await api.loadSharedConversation(selectedId);
      setSharedMessages(loaded);
      setShowSharedChat(true);
    } catch (value) {
      reportError(value, "Доступ к чату не подтверждён или истёк.");
    } finally {
      setBusy(false);
    }
  }

  async function revokeAccess() {
    if (!selectedId || busy) return;
    setBusy(true);
    setError("");
    try {
      await api.revokeChatAccess(selectedId);
      setSharedMessages([]);
      setShowSharedChat(false);
      await refreshTickets();
    } catch (value) {
      reportError(value, "Не удалось отозвать доступ.");
    } finally {
      setBusy(false);
    }
  }

  const mobilePane = selectedId || creating ? "ticket" : "list";

  return <section className={styles.shell} data-pane={mobilePane} aria-label="Поддержка TutorPlace">
    <aside className={styles.sidebar} aria-label="Список обращений">
      <div className={styles.sidebarHeader}>
        <div><h2 className={styles.title}>Поддержка</h2><p className={styles.subtitle}>{openCount ? `${openCount} активных обращения` : "Поможем разобраться с платформой"}</p></div>
        <LifeBuoy size={20} aria-hidden="true" />
      </div>
      {viewerRole === "user" && <div style={{ padding: "0 16px 12px" }}><button type="button" className={styles.primaryButton} style={{ width: "100%" }} onClick={() => { setCreating(true); setSelectedId(""); }}><Plus size={15} />Новое обращение</button></div>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      {loading ? <div className={styles.loadingState} role="status">Загружаем обращения…</div> : tickets.length ? <div className={styles.ticketList}>
        {tickets.map(ticket => <button type="button" className={styles.ticketButton} key={ticket.id} aria-current={ticket.id === selectedId} onClick={() => { setCreating(false); setSelectedId(ticket.id); setShowSharedChat(false); }}>
          <span className={styles.avatar} aria-hidden="true"><MessageSquareText size={18} /></span>
          <span className={styles.ticketInfo}>
            <span className={styles.ticketTop}><span className={styles.ticketSubject}>{ticket.subject}</span><span className={styles.smallTime}>{new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(new Date(ticket.updatedAt))}</span></span>
            <span className={styles.meta}>{ticketStatus(ticket.status)}{viewerRole === "support" ? ` · ${ticket.requester.name}` : ""}</span>
            <span className={styles.preview}>{ticket.preview || "Нет сообщений"}</span>
          </span>
          {ticket.unreadCount > 0 && <span className={styles.unread} aria-label={`Новых сообщений: ${ticket.unreadCount}`}>{ticket.unreadCount}</span>}
        </button>)}
      </div> : <div className={styles.emptyState}><strong className={styles.emptyTitle}>Обращений пока нет</strong><span>{viewerRole === "user" ? "Создайте обращение, если нужна помощь." : "Новые обращения появятся здесь."}</span></div>}
    </aside>

    <div className={styles.thread}>
      {creating && viewerRole === "user" ? <>
        <header className={styles.threadHeader}>
          <button type="button" className={`${styles.iconButton} ${styles.responsiveBack}`} aria-label="К списку обращений" onClick={() => setCreating(false)}><ArrowLeft size={18} /></button>
          <div><h3 className={styles.title}>Новое обращение</h3><p className={styles.subtitle}>Опишите, с чем нужна помощь</p></div>
        </header>
        <form onSubmit={createTicket} style={{ display: "grid", alignContent: "start", gap: 14, maxWidth: 620, padding: 24 }}>
          <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>Тема
            <input className={styles.supportInput} value={subject} onChange={event => setSubject(event.target.value)} maxLength={120} required placeholder="Например, не открывается урок" style={{ minHeight: 40, padding: "9px 11px", fontWeight: 400 }} />
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>Сообщение
            <textarea className={styles.textArea} value={newBody} onChange={event => setNewBody(event.target.value)} maxLength={4000} rows={7} required placeholder="Опишите проблему и укажите, что уже пробовали" style={{ padding: "10px 11px", fontWeight: 400, resize: "vertical" }} />
          </label>
          <div className={styles.notice}>Личные переписки ученика и репетитора не видны поддержке. Если для решения понадобится посмотреть отдельный чат, специалист запросит ваше согласие.</div>
          <button type="submit" className={styles.primaryButton} disabled={busy || !subject.trim() || !newBody.trim()}><Send size={15} />Отправить обращение</button>
        </form>
      </> : selectedTicket ? <>
        <header className={styles.threadHeader}>
          <button type="button" className={`${styles.iconButton} ${styles.responsiveBack}`} aria-label="К списку обращений" onClick={() => setSelectedId("")}><ArrowLeft size={18} /></button>
          <div className={styles.threadIdentity}>
            <span className={styles.avatar} aria-hidden="true">{viewerRole === "support" ? initials(selectedTicket.requester.name) : <LifeBuoy size={18} />}</span>
            <div><h3 className={styles.personName}>{selectedTicket.subject}</h3><div className={styles.meta}>{ticketStatus(selectedTicket.status)}{viewerRole === "support" ? ` · ${selectedTicket.requester.name}` : ""}</div></div>
          </div>
          {viewerRole === "support" && selectedTicket.linkedConversation && <button type="button" className={styles.secondaryButton} onClick={() => setAccessConversationId(selectedTicket.linkedConversation!.id)}><LockKeyhole size={14} />Запросить доступ к чату</button>}
        </header>

        {error && <p className={styles.error} role="alert">{error}</p>}

        {selectedTicket.accessRequest && <ChatAccessCard request={selectedTicket.accessRequest} viewerRole={viewerRole} onRespond={approved => void respondToConsent(selectedTicket.accessRequest!, approved)} busy={busy} />}

        {viewerRole === "support" && accessConversationId && <form onSubmit={requestAccess} style={{ display: "grid", gap: 8, margin: "0 16px 12px", padding: 12, border: "1px solid var(--border, #e6e1d8)", borderRadius: 10 }}>
          <strong style={{ fontSize: 13 }}>Запросить временный доступ к переписке</strong>
          <p className={styles.subtitle} style={{ margin: 0 }}>Пользователь должен разрешить просмотр. Доступ ограничивается выбранным чатом и записывается в журнал.</p>
          {(selectedTicket.availableConversations?.length || 0) > 1 && <label style={{ display: "grid", gap: 5, fontSize: 12 }}>Личная переписка<select className={styles.textArea} value={accessConversationId} onChange={event => setAccessConversationId(event.target.value)}>{selectedTicket.availableConversations!.map(chat => <option value={chat.id} key={chat.id}>{chat.label}</option>)}</select></label>}
          <label className={styles.srOnly} htmlFor="chat-access-purpose">Причина запроса</label>
          <textarea id="chat-access-purpose" className={styles.textArea} value={accessPurpose} onChange={event => setAccessPurpose(event.target.value)} maxLength={500} required rows={2} placeholder="Для решения проблемы нужно проверить сообщение о ссылке на занятие" style={{ padding: 9, resize: "vertical" }} />
          <div style={{ display: "flex", gap: 8 }}><button type="submit" className={styles.primaryButton} disabled={busy || !accessPurpose.trim()}>Отправить запрос</button><button type="button" className={styles.secondaryButton} onClick={() => setAccessConversationId("")}>Отмена</button></div>
        </form>}

        {selectedTicket.accessRequest?.status === "approved" && viewerRole === "support" && <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "0 16px 10px" }}>
          <button type="button" className={styles.secondaryButton} disabled={busy} onClick={() => void showAuthorizedChat()}><ShieldCheck size={14} />{showSharedChat ? "Обновить личный чат" : "Открыть разрешённый чат"}</button>
          <span className={styles.status}>Доступ только для чтения</span>
        </div>}
        {selectedTicket.accessRequest?.status === "approved" && viewerRole === "user" && <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 16px 10px" }}><button type="button" className={styles.secondaryButton} disabled={busy} onClick={() => void revokeAccess()}>Отозвать согласие</button></div>}

        {showSharedChat && <section style={{ margin: "0 16px 12px", border: "1px solid var(--border, #e6e1d8)", borderRadius: 10, overflow: "hidden" }} aria-label="Разрешённая переписка, только для чтения">
          <header style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "var(--surface-2, #f7f5f0)", fontSize: 13, fontWeight: 600 }}><ShieldCheck size={15} />Разрешённый чат · только для чтения</header>
          <div style={{ display: "grid", gap: 8, maxHeight: 240, overflow: "auto", padding: 12 }}>
            {sharedMessages.length ? sharedMessages.map(message => <article key={message.id} style={{ display: "grid", gap: 3, padding: 9, borderRadius: 8, background: "var(--surface-2, #f7f5f0)" }}><span className={styles.messageMeta}>{message.senderName}<time dateTime={message.createdAt}>{formatMessageTime(message.createdAt)}</time></span><span style={{ fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{message.body}</span></article>) : <span className={styles.subtitle}>В этой переписке пока нет сообщений.</span>}
          </div>
        </section>}

        <div className={styles.threadBody} ref={threadRef} role="log" aria-live="polite" aria-relevant="additions text">
          {loadingMessages ? <div className={styles.loadingState}>Загружаем сообщения…</div> : messages.length ? makeGroups(messages).map(group => <div key={group.date} style={{ display: "contents" }}>
            <span className={styles.dateDivider}>{group.label}</span>
            {group.messages.map(message => {
              const mine = message.senderId === viewerId;
              return <article className={`${styles.messageRow} ${mine ? styles.messageRowMine : ""}`} key={message.id}>
                <div className={styles.messageMeta}><span>{mine ? "Вы" : message.senderName}</span><time dateTime={message.createdAt}>{formatMessageTime(message.createdAt)}</time></div>
                <div className={styles.bubble}>{message.body}</div>
              </article>;
            })}
          </div>) : <div className={styles.emptyState}><strong className={styles.emptyTitle}>Обращение создано</strong><span>Напишите сообщение, чтобы продолжить.</span></div>}
        </div>
        <form className={styles.composer} onSubmit={reply}>
          <label className={styles.srOnly} htmlFor="support-reply">Ответ в обращении</label>
          <textarea id="support-reply" className={styles.composerInput} value={draft} onChange={event => setDraft(event.target.value)} placeholder={viewerRole === "support" ? "Ответить пользователю" : "Напишите в поддержку"} maxLength={4000} rows={1} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
          <button type="submit" className={styles.primaryButton} disabled={busy || !draft.trim()} aria-label="Отправить ответ"><Send size={16} /><span>Отправить</span></button>
        </form>
      </> : <div className={styles.emptyState}><LifeBuoy size={27} aria-hidden="true" /><strong className={styles.emptyTitle}>Выберите обращение</strong><span>Поддержка видит только содержание обращения и данные, необходимые для ответа.</span></div>}
    </div>
  </section>;
}
