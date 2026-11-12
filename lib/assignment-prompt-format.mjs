const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const blockTags = new Set(['address', 'article', 'aside', 'div', 'footer', 'header', 'main', 'nav', 'section', 'summary']);
const recognizedTags = new Set(['a', 'b', 'blockquote', 'br', 'code', 'del', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'li', 'ol', 'p', 'pre', 's', 'strike', 'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'u', 'ul']);

function decodeEntities(value) {
  return value.replace(/&(#(?:x[\da-f]+|\d+)|amp|apos|gt|lt|nbsp|quot);/gi, (entity, name) => {
    const lower = name.toLowerCase();
    if (lower === 'amp') return '&';
    if (lower === 'apos') return "'";
    if (lower === 'gt') return '>';
    if (lower === 'lt') return '<';
    if (lower === 'nbsp') return ' ';
    if (lower === 'quot') return '"';
    const number = lower.startsWith('#x') ? Number.parseInt(lower.slice(2), 16) : Number.parseInt(lower.slice(1), 10);
    try { return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : entity; } catch { return entity; }
  });
}

function findTagEnd(source, start) {
  let quote = '';
  for (let index = start + 1; index < source.length; index++) {
    const character = source[index];
    if (quote) {
      if (character === quote) quote = '';
    } else if (character === '"' || character === "'") quote = character;
    else if (character === '>') return index;
  }
  return -1;
}

function parseAttributes(source) {
  const attributes = {};
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;
  while ((match = pattern.exec(source))) attributes[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? '');
  return attributes;
}

function parseHtml(source) {
  const root = { tag: 'root', children: [] };
  const stack = [root];
  const appendText = text => { if (text) stack.at(-1).children.push({ tag: '#text', text }); };
  const close = tag => {
    for (let index = stack.length - 1; index > 0; index--) {
      if (stack[index].tag === tag) { stack.length = index; return; }
    }
  };
  let index = 0;
  while (index < source.length) {
    if (source.startsWith('<!--', index)) {
      const end = source.indexOf('-->', index + 4);
      index = end < 0 ? source.length : end + 3;
      continue;
    }
    if (source[index] !== '<') {
      const next = source.indexOf('<', index);
      appendText(source.slice(index, next < 0 ? source.length : next));
      index = next < 0 ? source.length : next;
      continue;
    }
    const end = findTagEnd(source, index);
    if (end < 0) { appendText('<'); index++; continue; }
    const raw = source.slice(index, end + 1);
    const match = /^<\s*(\/?)\s*([a-z][\w:-]*)([\s\S]*?)\s*(\/?)>$/i.exec(raw);
    if (!match) { appendText(raw); index = end + 1; continue; }
    const closing = Boolean(match[1]), tag = match[2].toLowerCase();
    if (closing) close(tag);
    else {
      if (tag === 'p' || tag === 'li' || tag === 'tr') {
        const current = stack.at(-1);
        if (current.tag === tag) close(tag);
      }
      const node = { tag, attributes: parseAttributes(match[3].replace(/\/\s*$/, '')), rawOpen: raw, children: [] };
      stack.at(-1).children.push(node);
      if (!voidTags.has(tag) && !match[4]) stack.push(node);
    }
    index = end + 1;
  }
  return root;
}

function escapeMarkdownText(value) {
  return decodeEntities(value).replace(/\\/g, '\\\\');
}

function safeUrl(value) {
  const url = String(value || '').trim();
  if (!url || /[\r\n<>]/.test(url) || /^\s*(?:javascript|data|vbscript):/i.test(url) || url.startsWith('//')) return '';
  if (/^[a-z][a-z\d+.-]*:/i.test(url) && !/^https?:/i.test(url)) return '';
  return url.replace(/\s/g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29');
}

function textContent(node) {
  if (node.tag === '#text') return decodeEntities(node.text);
  return (node.children || []).map(textContent).join('');
}

function fenceFor(value) {
  const runs = value.match(/`+/g) || [];
  return '`'.repeat(Math.max(3, ...runs.map(run => run.length + 1)));
}

function renderInline(node, context = {}) {
  if (node.tag === '#text') return escapeMarkdownText(node.text);
  const tag = node.tag, children = () => (node.children || []).map(child => renderInline(child, context)).join('');
  const content = children();
  if (tag === 'br') return '\n';
  if (tag === 'img') {
    const source = safeUrl(node.attributes?.src);
    if (!source) return node.attributes?.alt ? `_${escapeMarkdownText(node.attributes.alt)}_` : '';
    const alt = String(node.attributes?.alt || 'Изображение').replace(/([\\\]])/g, '\\$1').replace(/[\r\n]+/g, ' ');
    return `![${alt}](<${source}>)`;
  }
  if (tag === 'a') {
    const href = safeUrl(node.attributes?.href);
    return href ? `[${content.trim()}](<${href}>)` : content;
  }
  if (tag === 'strong' || tag === 'b') return content ? `**${content}**` : '';
  if (tag === 'em' || tag === 'i') return content ? `*${content}*` : '';
  if (tag === 'del' || tag === 's' || tag === 'strike') return content ? `~~${content}~~` : '';
  if (tag === 'u') return content;
  if (tag === 'sub') return content ? `~${content}~` : '';
  if (tag === 'sup') return content ? `^${content}^` : '';
  if (tag === 'code' && !context.pre) {
    const fence = '`'.repeat(Math.max(1, ...((content.match(/`+/g) || []).map(run => run.length + 1))));
    return `${fence}${content.includes('`') ? ` ${content} ` : content}${fence}`;
  }
  if (tag === 'pre') {
    const code = textContent(node).replace(/^\n|\n$/g, '');
    const fence = fenceFor(code);
    return `\n\n${fence}\n${code}\n${fence}\n\n`;
  }
  if (/^h[1-6]$/.test(tag)) return `\n\n${'#'.repeat(Number(tag[1]))} ${content.trim()}\n\n`;
  if (tag === 'p') return `\n\n${content.trim()}\n\n`;
  if (tag === 'blockquote') return `\n\n${content.trim().split('\n').map(line => line ? `> ${line}` : '>').join('\n')}\n\n`;
  if (tag === 'hr') return '\n\n---\n\n';
  if (tag === 'ul' || tag === 'ol') return renderList(node);
  if (tag === 'table') return renderTable(node);
  if (tag === 'td' || tag === 'th') return content.trim().replace(/\|/g, '\\|');
  if (tag === 'tr') return (node.children || []).filter(child => child.tag === 'td' || child.tag === 'th').map(child => renderInline(child, context)).join(' | ');
  if (blockTags.has(tag)) return `\n\n${content.trim()}\n\n`;
  if (recognizedTags.has(tag)) return content;
  return `&lt;${node.rawOpen.slice(1, -1)}&gt;${content}&lt;/${tag}&gt;`;
}

function renderList(node, indent = '') {
  const ordered = node.tag === 'ol';
  let index = Number.parseInt(node.attributes?.start || '1', 10) || 1;
  const items = (node.children || []).filter(child => child.tag === 'li');
  return items.map(item => {
    const marker = ordered ? `${index++}. ` : '- ';
    const continuationIndent = `${indent}${' '.repeat(marker.length)}`;
    const lines = [];
    let hasContent = false;
    let inline = '';
    const flushInline = () => {
      const text = inline.trim();
      inline = '';
      if (!text) return;
      const parts = text.split('\n');
      if (!hasContent) {
        lines.push(`${indent}${marker}${parts.shift()}`);
        hasContent = true;
      }
      lines.push(...parts.map(part => `${continuationIndent}${part}`));
    };
    for (const child of item.children || []) {
      if (child.tag === 'ul' || child.tag === 'ol') {
        flushInline();
        if (!hasContent) {
          lines.push(`${indent}${marker.trimEnd()}`);
          hasContent = true;
        }
        lines.push(renderList(child, continuationIndent));
      } else if (child.tag === 'p' || blockTags.has(child.tag)) {
        flushInline();
        inline = (child.children || []).map(item => renderInline(item)).join('');
        flushInline();
      } else inline += renderInline(child);
    }
    flushInline();
    return lines.join('\n');
  }).join('\n');
}

function renderTable(node) {
  const rows = [];
  const collect = current => {
    if (current.tag === 'tr') rows.push((current.children || []).filter(child => child.tag === 'td' || child.tag === 'th').map(child => renderInline(child).trim()));
    else for (const child of current.children || []) collect(child);
  };
  collect(node);
  if (!rows.length) return '';
  const columns = Math.max(...rows.map(row => row.length));
  const format = row => `| ${Array.from({ length: columns }, (_, index) => row[index] || '').join(' | ')} |`;
  return `\n\n${format(rows[0])}\n${format(Array.from({ length: columns }, () => '---'))}${rows.slice(1).map(row => `\n${format(row)}`).join('')}\n\n`;
}

/** Convert stored HTML fragments into safe Markdown while leaving existing Markdown untouched. */
export function normalizeAssignmentPrompt(source) {
  const value = String(source || '').replace(/\r\n?/g, '\n');
  if (!/<\/?[a-z][\w:-]*(?:\s|\/?>)/i.test(value)) return value;
  const tree = parseHtml(value);
  return tree.children.map(node => renderInline(node)).join('').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}
