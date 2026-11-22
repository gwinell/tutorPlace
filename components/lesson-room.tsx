'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, LoaderCircle, Video, WifiOff } from 'lucide-react';
import styles from './lesson-room.module.css';

type LessonTab = 'video' | 'board';

type MeetingConfig = {
  domain: string;
  roomName: string;
  jwt: string;
  displayName: string;
};

type WhiteboardConfig = {
  url: string;
  boardName: string;
};

type JitsiApiOptions = {
  roomName: string;
  parentNode: HTMLElement;
  jwt?: string;
  userInfo: { displayName: string };
  lang: string;
  configOverwrite: Record<string, unknown>;
  interfaceConfigOverwrite: Record<string, unknown>;
};

type JitsiApi = {
  dispose: () => void;
  addEventListener: (event: string, listener: (event: unknown) => void) => void;
  removeEventListener?: (event: string, listener: (event: unknown) => void) => void;
};

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (domain: string, options: JitsiApiOptions) => JitsiApi;
  }
}

type LessonRoomProps = {
  lessonId: string;
  lessonTitle: string;
  onBack?: () => void;
};

const apiScripts = new Map<string, Promise<void>>();

function jitsiServer(domain: string) {
  const normalized = /^https?:\/\//i.test(domain) ? domain : `${window.location.protocol}//${domain}`;
  const server = new URL(normalized);
  return { host: server.host, source: new URL('/external_api.js', server.origin).href };
}

function loadJitsiApi(domain: string) {
  const { source } = jitsiServer(domain);
  if (window.JitsiMeetExternalAPI) return Promise.resolve();

  const loaded = apiScripts.get(source);
  if (loaded) return loaded;

  const request = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = source;
    script.async = true;
    script.onload = () => window.JitsiMeetExternalAPI ? resolve() : reject(new Error('Jitsi API did not initialize.'));
    script.onerror = () => reject(new Error('Could not load the local Jitsi client.'));
    document.head.append(script);
  });
  apiScripts.set(source, request);
  return request;
}

async function getJson<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(path, { credentials: 'same-origin', signal, headers: { Accept: 'application/json' } });
  const data = await response.json().catch(() => null) as { error?: unknown } | null;
  if (!response.ok) {
    const message = data && typeof data.error === 'string' ? data.error : 'Не удалось открыть комнату урока.';
    throw new Error(message);
  }
  return data as T;
}

export default function LessonRoom({ lessonId, lessonTitle, onBack }: LessonRoomProps) {
  const [activeTab, setActiveTab] = useState<LessonTab>('video');
  const [meeting, setMeeting] = useState<MeetingConfig | null>(null);
  const [whiteboard, setWhiteboard] = useState<WhiteboardConfig | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [boardLoading, setBoardLoading] = useState(false);
  const [videoAttempted, setVideoAttempted] = useState(false);
  const [boardAttempted, setBoardAttempted] = useState(false);
  const [videoError, setVideoError] = useState('');
  const [boardError, setBoardError] = useState('');
  const [connectionState, setConnectionState] = useState<'waiting' | 'connected'>('waiting');
  const videoMount = useRef<HTMLDivElement>(null);
  const videoApi = useRef<JitsiApi | null>(null);
  const videoRequest = useRef<AbortController | null>(null);
  const boardRequest = useRef<AbortController | null>(null);

  const requestMeeting = useCallback(async () => {
    if (meeting || videoLoading || videoAttempted) return;
    setVideoAttempted(true);
    setVideoLoading(true);
    setVideoError('');
    const controller = new AbortController();
    videoRequest.current = controller;
    try {
      const config = await getJson<MeetingConfig>(`/api/lessons/${encodeURIComponent(lessonId)}/meeting`, controller.signal);
      if (!config.domain || !config.roomName || !config.jwt || !config.displayName) throw new Error('Сервер не выдал доступ к видеокомнате этого урока.');
      setMeeting(config);
    } catch (error) {
      if (!controller.signal.aborted) setVideoError(error instanceof Error ? error.message : 'Не удалось открыть видеовстречу.');
    } finally {
      if (videoRequest.current === controller) videoRequest.current = null;
      if (!controller.signal.aborted) setVideoLoading(false);
    }
  }, [lessonId, meeting, videoLoading, videoAttempted]);

  const requestWhiteboard = useCallback(async () => {
    if (whiteboard || boardLoading || boardAttempted) return;
    setBoardAttempted(true);
    setBoardLoading(true);
    setBoardError('');
    const controller = new AbortController();
    boardRequest.current = controller;
    try {
      const config = await getJson<WhiteboardConfig>(`/api/lessons/${encodeURIComponent(lessonId)}/whiteboard-token`, controller.signal);
      if (!config.boardName || !config.url) throw new Error('Сервер не выдал доступ к доске этого урока.');
      const boardUrl = new URL(config.url);
      if (boardUrl.protocol !== 'https:' && boardUrl.hostname !== 'localhost' && !boardUrl.hostname.endsWith('.localhost')) {
        throw new Error('Адрес доски должен использовать HTTPS.');
      }
      setWhiteboard(config);
    } catch (error) {
      if (!controller.signal.aborted) setBoardError(error instanceof Error ? error.message : 'Не удалось открыть доску.');
    } finally {
      if (boardRequest.current === controller) boardRequest.current = null;
      if (!controller.signal.aborted) setBoardLoading(false);
    }
  }, [lessonId, whiteboard, boardLoading, boardAttempted]);

  useEffect(() => () => {
    videoRequest.current?.abort();
    boardRequest.current?.abort();
  }, []);

  useEffect(() => {
    if (activeTab === 'video') void requestMeeting();
    else void requestWhiteboard();
  }, [activeTab, requestMeeting, requestWhiteboard]);

  useEffect(() => {
    if (!meeting || !videoMount.current || videoApi.current) return;
    let disposed = false;
    let api: JitsiApi | null = null;
    const onJoined = () => setConnectionState('connected');
    const onLeft = () => setConnectionState('waiting');
    const server = jitsiServer(meeting.domain);

    void loadJitsiApi(meeting.domain).then(() => {
      if (disposed || !videoMount.current || !window.JitsiMeetExternalAPI) return;
      api = new window.JitsiMeetExternalAPI(server.host, {
        roomName: meeting.roomName,
        parentNode: videoMount.current,
        jwt: meeting.jwt,
        userInfo: { displayName: meeting.displayName },
        lang: 'ru',
        configOverwrite: {
          prejoinConfig: { enabled: true },
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          disableDeepLinking: true,
          doNotStoreRoom: true,
          toolbarButtons: ['microphone', 'camera', 'desktop', 'chat', 'raisehand', 'tileview', 'hangup', 'settings', 'fullscreen'],
        },
        interfaceConfigOverwrite: {
          APP_NAME: 'TutorPlace',
          DEFAULT_BACKGROUND: '#f7f6f1',
          SHOW_JITSI_WATERMARK: true,
        },
      });
      api.addEventListener('videoConferenceJoined', onJoined);
      api.addEventListener('videoConferenceLeft', onLeft);
      videoApi.current = api;
    }).catch(error => {
      if (!disposed) setVideoError(error instanceof Error ? error.message : 'Не удалось подключиться к Jitsi.');
    });

    return () => {
      disposed = true;
      api?.removeEventListener?.('videoConferenceJoined', onJoined);
      api?.removeEventListener?.('videoConferenceLeft', onLeft);
      api?.dispose();
      if (videoApi.current === api) videoApi.current = null;
    };
  }, [meeting]);

  const retryVideo = () => {
    setMeeting(null);
    setVideoError('');
    setVideoLoading(false);
    setVideoAttempted(false);
  };
  const retryBoard = () => {
    setWhiteboard(null);
    setBoardError('');
    setBoardLoading(false);
    setBoardAttempted(false);
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        {onBack ? <button className={styles.back} type="button" onClick={onBack}><ArrowLeft size={17} /> К урокам</button> : <span className={styles.brand}>TutorPlace</span>}
        <div className={styles.lessonTitle}>
          <span className={styles.kicker}>Онлайн-урок</span>
          <h1>{lessonTitle}</h1>
        </div>
        <span className={`${styles.status} ${connectionState === 'connected' ? styles.statusLive : ''}`}>
          <i aria-hidden="true" />{connectionState === 'connected' ? 'На связи' : 'Комната урока'}
        </span>
      </header>

      <nav className={styles.tabs} aria-label="Инструменты урока">
        <button type="button" className={activeTab === 'video' ? styles.active : ''} aria-pressed={activeTab === 'video'} onClick={() => setActiveTab('video')}><Video size={17} /> Видеосвязь</button>
        <button type="button" className={activeTab === 'board' ? styles.active : ''} aria-pressed={activeTab === 'board'} onClick={() => setActiveTab('board')}><BookOpen size={17} /> Доска</button>
      </nav>

      <section className={styles.workspace} aria-label="Рабочее место урока">
        <div className={`${styles.panel} ${activeTab === 'video' ? styles.panelActive : styles.panelHidden}`} aria-hidden={activeTab !== 'video'}>
          {!meeting && videoLoading && <div className={styles.loading}><LoaderCircle size={20} /> Подключаем защищённую видеокомнату</div>}
          {!meeting && !videoLoading && videoError && <div className={styles.errorState}><WifiOff size={22} /><strong>Видеосвязь пока недоступна</strong><p>{videoError}</p><button type="button" onClick={retryVideo}>Попробовать снова</button></div>}
          <div ref={videoMount} className={styles.videoFrame} />
        </div>

        <div className={`${styles.panel} ${activeTab === 'board' ? styles.panelActive : styles.panelHidden}`} aria-hidden={activeTab !== 'board'}>
          {!whiteboard && boardLoading && <div className={styles.loading}><LoaderCircle size={20} /> Загружаем общую доску</div>}
          {!whiteboard && !boardLoading && boardError && <div className={styles.errorState}><WifiOff size={22} /><strong>Доска пока недоступна</strong><p>{boardError}</p><button type="button" onClick={retryBoard}>Попробовать снова</button></div>}
          {whiteboard && <iframe className={styles.boardFrame} title={`Общая доска: ${whiteboard.boardName}`} src={whiteboard.url} allow="clipboard-read; clipboard-write" referrerPolicy="strict-origin-when-cross-origin" />}
        </div>
      </section>

      <p className={styles.privacyNote}>Видеозапись занятия отключена. Вход в комнату доступен участникам этого урока.</p>
    </main>
  );
}
