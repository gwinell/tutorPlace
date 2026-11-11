import { normalizeGithubSource } from './github-source.ts';

/** Return the raw GitHub directory that contains a linked course material file. */
export function githubMaterialBaseUrl(source: string | null | undefined): string | undefined {
  if (!source) return undefined;
  try {
    return new URL('.', normalizeGithubSource(source).url).href;
  } catch {
    return undefined;
  }
}

/** Resolve a Markdown asset against its public GitHub file while rejecting unsafe schemes. */
export function resolveMaterialAssetUrl(value: string | undefined, baseUrl?: string): string | undefined {
  if (!value) return undefined;
  const input = value.trim();
  if (!input) return undefined;
  try {
    if (/^[a-z][a-z\d+.-]*:/i.test(input)) {
      const absolute = new URL(input);
      return absolute.protocol === 'https:' ? absolute.href : undefined;
    }
    if (input.startsWith('//')) return undefined;
    if (!baseUrl) return input;
    const resolved = new URL(input, baseUrl);
    return resolved.protocol === 'https:' ? resolved.href : undefined;
  } catch {
    return undefined;
  }
}

/** Turn relative course file links into GitHub's rendered branch view. */
export function resolveMaterialLinkUrl(value: string | undefined, baseUrl?: string): string | undefined {
  if (!value) return undefined;
  const input = value.trim();
  if (!input || input.startsWith('#') || /^[a-z][a-z\d+.-]*:/i.test(input) || input.startsWith('//') || !baseUrl) return input || undefined;
  try {
    const resolved = new URL(input, baseUrl);
    if (resolved.protocol !== 'https:' || resolved.hostname !== 'raw.githubusercontent.com') return undefined;
    const segments = resolved.pathname.split('/').filter(Boolean);
    if (segments.length < 4) return resolved.href;
    const [owner, repository, ...refAndPath] = segments;
    const view = resolved.pathname.endsWith('/') ? 'tree' : 'blob';
    const path = refAndPath.join('/') + (view === 'tree' ? '/' : '');
    return `https://github.com/${owner}/${repository}/${view}/${path}${resolved.search}${resolved.hash}`;
  } catch {
    return undefined;
  }
}

export function convertHtmlImagesToMarkdown(content: string): string {
  return content.replace(/<img\b([^>]*?)\/?>/gi, (_tag, attributes: string) => {
    const getAttribute = (name: string) => {
      const match = attributes.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
      return match?.[1] ?? match?.[2] ?? match?.[3] ?? '';
    };
    const src = getAttribute('src').trim();
    if (!src) return '';
    const alt = getAttribute('alt').replace(/[\r\n]+/g, ' ').replace(/\\/g, '\\\\').replace(/\]/g, '\\]');
    return `![${alt}](<${src}>)`;
  });
}
