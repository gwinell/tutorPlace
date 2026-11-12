'use client';

import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ImageOff, LoaderCircle } from 'lucide-react';
import { normalizeAssignmentPrompt } from '@/lib/assignment-prompt-format.mjs';
import { resolveMaterialAssetUrl, resolveMaterialLinkUrl } from '@/lib/material-links';

function MarkdownImage({ src, alt, baseUrl, allowLocalBlob }: { src?: string; alt?: string; baseUrl?: string; allowLocalBlob?: boolean }) {
  const imageUrl = allowLocalBlob && src?.startsWith('blob:') ? src : resolveMaterialAssetUrl(src, baseUrl);
  const privateImage = Boolean(imageUrl?.startsWith('/api/assignment-images/'));
  const [privateLoad, setPrivateLoad] = useState<{ url: string; source: string; error: string }>({ url: '', source: '', error: '' });
  const [failedUrl, setFailedUrl] = useState('');

  useEffect(() => {
    if (!imageUrl || !privateImage) return;
    let cancelled = false;
    let objectUrl = '';
    void fetch(imageUrl, { credentials: 'same-origin', cache: 'no-store' })
      .then(async response => {
        if (!response.ok) {
          const body = await response.json().catch(() => ({})) as { error?: string };
          throw new Error(body.error || 'Не удалось загрузить изображение.');
        }
        return response.blob();
      })
      .then(blob => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setPrivateLoad({ url: imageUrl, source: objectUrl, error: '' });
      })
      .catch(reason => { if (!cancelled) setPrivateLoad({ url: imageUrl, source: '', error: reason instanceof Error ? reason.message : 'Не удалось загрузить изображение.' }); });
    return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [imageUrl, privateImage]);

  const currentLoad = privateLoad.url === imageUrl ? privateLoad : null;
  const error = currentLoad?.error || (failedUrl === imageUrl ? 'Не удалось загрузить изображение. Проверь доступ или попроси репетитора проверить вложение.' : '');
  if (!imageUrl || error) return <span className="markdown-image-fallback" role="status"><ImageOff size={16}/><span>{error || (alt ? `Не удалось показать изображение «${alt}»` : 'Не удалось показать изображение')}</span></span>;
  if (privateImage && !currentLoad?.source) return <span className="markdown-image-loading" role="status"><LoaderCircle size={16}/><span>Загружаем изображение…</span></span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={currentLoad?.source || imageUrl} alt={alt || ''} loading="lazy" decoding="async" onError={() => setFailedUrl(imageUrl)}/>;
}

export default function MarkdownContent({ content, baseUrl, allowLocalBlob = false }: { content: string; baseUrl?: string; allowLocalBlob?: boolean }) {
  const markdownContent = useMemo(() => normalizeAssignmentPrompt(content), [content]);
  const components = useMemo<Components>(() => ({
    a: ({ node, href, children, ...props }) => {
      void node;
      return <a {...props} href={resolveMaterialLinkUrl(typeof href === 'string' ? href : undefined, baseUrl)}>{children}</a>;
    },
    img: ({ src, alt }) => <MarkdownImage src={typeof src === 'string' ? src : undefined} alt={alt} baseUrl={baseUrl} allowLocalBlob={allowLocalBlob}/>,
  }), [baseUrl, allowLocalBlob]);
  return <div className="markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{markdownContent}</ReactMarkdown></div>;
}
