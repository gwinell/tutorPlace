"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, MessageCircle, Search, Send } from "lucide-react";
import styles from "./messaging.module.css";
import { formatMessageDate, formatMessageTime, type ChatMessage, type ConversationApi, type ConversationSummary } from "./contracts";

export type ChatCenterProps = {
  viewerId: string;
  api: ConversationApi;
  initialConversationId?: string;
  pollIntervalMs?: number;
  onError?: (message: string) => void;
};

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0] || "").join("").toLocaleUpperCase("ru-RU") || "?";
}

function shortTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return formatMessageTime(value);
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(date);
}

function messageGroups(messages: ChatMessage[]) {
  const groups: { date: string; label: string; messages: ChatMessage[] }[] = [];
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

export default function ChatCenter({ viewerId, api, initialConversationId, pollIntervalMs = 7000, onError }: ChatCenterProps) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedId, setSelectedId] = useState(initialConversationId || "");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);
  const selectedConversation = conversations.find(item => item.id === selectedId) || null;

  const reportError = useCallback((value: unknown, fallback: string) => {
    const message = value instanceof Error ? value.message : fallback;
    setError(message);
    onError?.(message);
  }, [onError]);

  const refreshConversations = useCallback(async (signal?: AbortSignal) => {
    const next = await api.listConversations(signal);
    setConversations(next);
    if (!selectedId && next.length) setSelectedId(initialConversationId && next.some(item => item.id === initialConversationId) ? initialConversationId : next[0].id);
    if (selectedId && !next.some(item => item.id === selectedId)) setSelectedId("");
  }, [api, initialConversationId, selectedId]);

  const refreshMessages = useCallback(async (conversationId: string, signal?: AbortSignal) => {
    const next = await api.listMessages(conversationId, signal);
    setMessages(next);
    return next;
  }, [api]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    void refreshConversations(controller.signal)
      .catch(value => { if (!controller.signal.aborted) reportError(value, "Не удалось загрузить переписки."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [refreshConversations, reportError]);

  useEffect(() => {
    if (!selectedId) { setMessages([]); return; }
    const controller = new AbortController();
    setLoadingMessages(true);
    setError("");
    void refreshMessages(selectedId, controller.signal)
      .catch(value => { if (!controller.signal.aborted) reportError(value, "Не удалось загрузить сообщения."); })
      .finally(() => { if (!controller.signal.aborted) setLoadingMessages(false); });
    const interval = window.setInterval(() => {
      void refreshMessages(selectedId, controller.signal).catch(value => {
        if (!controller.signal.aborted) reportError(value, "Не удалось обновить переписку.");
      });
    }, Math.max(4000, pollIntervalMs));
    return () => { controller.abort(); window.clearInterval(interval); };
  }, [pollIntervalMs, refreshMessages, reportError, selectedId]);

  useEffect(() => {
    if (!loadingMessages && messages.length) threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [loadingMessages, messages]);

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ru-RU");
    if (!query) return conversations;
    return conversations.filter(item => `${item.participant.name} ${item.subject || ""}`.toLocaleLowerCase("ru-RU").includes(query));
  }, [conversations, search]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !selectedId || sending) return;
    setSending(true);
    setError("");
    try {
      const message = await api.sendMessage(selectedId, body);
      setMessages(current => current.some(item => item.id === message.id) ? current : [...current, message]);
      setDraft("");
      void refreshConversations().catch(value => reportError(value, "Сообщение отправлено, но список не обновился."));
    } catch (value) {
      reportError(value, "Не удалось отправить сообщение.");
    } finally {
      setSending(false);
    }
  }

  function openConversation(id: string) {
    setSelectedId(id);
    setMessages([]);
    setError("");
  }

  const mobilePane = selectedId ? "thread" : "list";

  return <section className={styles.shell} data-pane={mobilePane} aria-label="Чаты с репетиторами и учениками">
    <aside className={styles.sidebar} aria-label="Список переписок">
      <div className={styles.sidebarHeader}>
        <div><h2 className={styles.title}>Сообщения</h2><p className={styles.subtitle}>Личные чаты по занятиям</p></div>
        <MessageCircle size={20} aria-hidden="true" />
      </div>
      <label className={styles.searchWrap}>
        <Search className={styles.searchIcon} size={15} aria-hidden="true" />
        <span className={styles.srOnly}>Найти переписку</span>
        <input className={styles.search} value={search} onChange={event => setSearch(event.target.value)} placeholder="Найти переписку" />
      </label>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {loading ? <div className={styles.loadingState} role="status">Загружаем переписки…</div> : filtered.length ? <div className={styles.conversationList}>
        {filtered.map(conversation => <button type="button" className={styles.conversationButton} key={conversation.id} aria-current={conversation.id === selectedId} onClick={() => openConversation(conversation.id)}>
          <span className={styles.avatar} aria-hidden="true">{initials(conversation.participant.name)}</span>
          <span className={styles.conversationInfo}>
            <span className={styles.conversationTop}><span className={styles.personName}>{conversation.participant.name}</span><span className={styles.smallTime}>{shortTime(conversation.lastMessage?.createdAt || conversation.updatedAt)}</span></span>
            <span className={styles.meta}>{conversation.participant.role === "teacher" ? "Репетитор" : "Ученик"}{conversation.subject ? ` · ${conversation.subject}` : ""}</span>
            <span className={styles.preview}>{conversation.lastMessage?.body || "Начните переписку"}</span>
          </span>
          {conversation.unreadCount > 0 && <span className={styles.unread} aria-label={`Новых сообщений: ${conversation.unreadCount}`}>{conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}</span>}
        </button>)}
      </div> : <div className={styles.emptyState}><strong className={styles.emptyTitle}>{search ? "Ничего не найдено" : "Пока нет переписок"}</strong><span>{search ? "Измените запрос" : "Переписка появится после связи с учеником или репетитором."}</span></div>}
    </aside>

    <div className={styles.thread}>
      {selectedConversation ? <>
        <header className={styles.threadHeader}>
          <button type="button" className={`${styles.iconButton} ${styles.responsiveBack}`} aria-label="К списку переписок" onClick={() => setSelectedId("")}><ArrowLeft size={18} /></button>
          <div className={styles.threadIdentity}>
            <span className={styles.avatar} aria-hidden="true">{initials(selectedConversation.participant.name)}</span>
            <div><div className={styles.personName}>{selectedConversation.participant.name}</div><div className={styles.meta}>{selectedConversation.participant.role === "teacher" ? "Репетитор" : "Ученик"}{selectedConversation.subject ? ` · ${selectedConversation.subject}` : ""}</div></div>
          </div>
        </header>
        <div className={styles.threadBody} ref={threadRef} role="log" aria-live="polite" aria-relevant="additions text">
          {loadingMessages ? <div className={styles.loadingState}>Загружаем сообщения…</div> : messages.length ? messageGroups(messages).map(group => <div key={group.date} style={{ display: "contents" }}>
            <span className={styles.dateDivider}>{group.label}</span>
            {group.messages.map(message => {
              const mine = message.senderId === viewerId;
              return <article className={`${styles.messageRow} ${mine ? styles.messageRowMine : ""}`} key={message.id}>
                <div className={styles.messageMeta}><span>{mine ? "Вы" : message.senderName}</span><time dateTime={message.createdAt}>{formatMessageTime(message.createdAt)}</time></div>
                <div className={styles.bubble}>{message.body}</div>
              </article>;
            })}
          </div>) : <div className={styles.emptyState}><strong className={styles.emptyTitle}>Начните разговор</strong><span>Обсудите занятие, материалы или домашнее задание.</span></div>}
        </div>
        <form className={styles.composer} onSubmit={send}>
          <label className={styles.srOnly} htmlFor="chat-message">Сообщение</label>
          <textarea id="chat-message" className={styles.composerInput} value={draft} onChange={event => setDraft(event.target.value)} placeholder="Напишите сообщение" maxLength={4000} rows={1} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
          <button type="submit" className={styles.primaryButton} disabled={!draft.trim() || sending} aria-label="Отправить сообщение"><Send size={16} /><span>Отправить</span></button>
        </form>
      </> : <div className={styles.emptyState}><MessageCircle size={27} aria-hidden="true" /><strong className={styles.emptyTitle}>Выберите переписку</strong><span>Сообщения ученика и репетитора видны только участникам чата.</span></div>}
    </div>
  </section>;
}
