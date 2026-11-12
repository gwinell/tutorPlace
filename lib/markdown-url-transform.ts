import { defaultUrlTransform } from 'react-markdown';

export function markdownUrlTransform(url: string, key: string, allowLocalBlob = false) {
  if (allowLocalBlob && key === 'src' && url.startsWith('blob:')) return url;
  return defaultUrlTransform(url);
}
