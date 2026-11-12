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
    else if (character === '<') return -1;
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
    if (!/^<(?:\/?[a-z])/i.test(source.slice(index))) {
      appendText('<');
      index++;
      continue;
    }
    const end = findTagEnd(source, index);
    if (end < 0) { appendText('<'); index++; continue; }
    const raw = source.slice(index, end + 1);
    const match = /^<(\/?)([a-z][\w:-]*)([\s\S]*?)\s*(\/?)>$/i.exec(raw);
    if (!match) { appendText(raw); index = end + 1; continue; }
    const closing = Boolean(match[1]), tag = match[2].toLowerCase();
    if (!recognizedTags.has(tag) && !blockTags.has(tag) && !tag.includes('-')) {
      appendText(raw);
      index = end + 1;
      continue;
    }
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

function encodeMarkdownText(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeMarkdownPunctuation(value) {
  return value.replace(/([\\`*_{}\[\]()#+\-.!|~])/g, '\\$1');
}

function escapeMarkdownText(value) {
  return escapeMarkdownPunctuation(encodeMarkdownText(decodeEntities(value)));
}

function escapeMarkdownLinkLabel(value) {
  return escapeMarkdownPunctuation(encodeMarkdownText(value));
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
  if (tag === 'br') return '\\' + '\n';
  if (tag === 'img') {
    const source = safeUrl(node.attributes?.src);
    if (!source) return node.attributes?.alt ? `_${escapeMarkdownText(node.attributes.alt)}_` : '';
    const alt = escapeMarkdownLinkLabel(String(node.attributes?.alt || 'Изображение').replace(/[\r\n]+/g, ' '));
    return `![${alt}](<${source}>)`;
  }
  if (tag === 'a') {
    const href = safeUrl(node.attributes?.href);
    const label = escapeMarkdownLinkLabel(textContent(node).trim());
    return href && label ? `[${label}](<${href}>)` : content;
  }
  if (tag === 'strong' || tag === 'b') return content ? `**${content}**` : '';
  if (tag === 'em' || tag === 'i') return content ? `*${content}*` : '';
  if (tag === 'del' || tag === 's' || tag === 'strike') return content ? `~~${content}~~` : '';
  if (tag === 'u') return content;
  if (tag === 'sub') return content ? `~${content}~` : '';
  if (tag === 'sup') return content ? `^${content}^` : '';
  if (tag === 'code' && !context.pre) {
    const code = textContent(node);
    const fence = '`'.repeat(Math.max(1, ...((code.match(/`+/g) || []).map(run => run.length + 1))));
    return `${fence}${code.includes('`') ? ` ${code} ` : code}${fence}`;
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
  if (tag === 'ul' || tag === 'ol') return `\n\n${renderList(node)}\n\n`;
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

function protectMarkdownCode(source) {
  let marker = 'CTPROMPTCODESEGMENT';
  while (source.includes(marker)) marker += 'X';
  const saved = [];
  const placeholder = value => {
    const token = `${marker}${saved.length}END`;
    saved.push([token, value]);
    return token;
  };

  const lines = source.match(/[^\n]*\n|[^\n]+$/g) || [];
  const protectedLines = [];
  for (let index = 0; index < lines.length; index++) {
    const opening = lines[index].replace(/\n$/, '').match(/^ {0,3}(`{3,}|~{3,})([^\n]*)$/);
    if (!opening || (opening[1][0] === '`' && opening[2].includes('`'))) {
      protectedLines.push(lines[index]);
      continue;
    }
    const fence = opening[1], character = fence[0];
    const block = [lines[index]];
    let closed = false;
    while (++index < lines.length) {
      block.push(lines[index]);
      const closing = lines[index].replace(/\n$/, '').match(/^ {0,3}(`+|~+)[ \t]*$/);
      if (closing && closing[1][0] === character && closing[1].length >= fence.length) {
        closed = true;
        break;
      }
    }
    protectedLines.push(placeholder(block.join('')));
    if (!closed) break;
  }

  const withoutFences = protectedLines.join('');
  const markdownLines = withoutFences.match(/[^\n]*\n|[^\n]+$/g) || [];
  const protectedMarkdownLines = [];
  const withoutQuotePrefix = line => {
    let value = line.replace(/\n$/, ''), prefix = '';
    while (true) {
      const match = value.match(/^ {0,3}>[ \t]?/);
      if (!match) break;
      prefix += match[0];
      value = value.slice(match[0].length);
    }
    return { prefix, value };
  };
  const isBlankLine = line => withoutQuotePrefix(line).value.trim() === '';
  const isIndentedCodeLine = line => /^(?: {4,}|\t)/.test(withoutQuotePrefix(line).value);
  for (let index = 0; index < markdownLines.length; index++) {
    const line = markdownLines[index];
    const quote = withoutQuotePrefix(line);
    const startsQuoteCode = quote.prefix.length > 0 && isIndentedCodeLine(line);
    const startsIndentedCode = isIndentedCodeLine(line) && (index === 0 || isBlankLine(markdownLines[index - 1]) || startsQuoteCode);
    if (!startsIndentedCode) {
      protectedMarkdownLines.push(line);
      continue;
    }
    const block = [line];
    let hasNextCodeLine = true;
    while (index + 1 < markdownLines.length && hasNextCodeLine) {
      const next = markdownLines[index + 1];
      if (isIndentedCodeLine(next)) {
        block.push(next);
        index++;
        continue;
      }
      if (isBlankLine(next) && index + 2 < markdownLines.length && isIndentedCodeLine(markdownLines[index + 2])) {
        block.push(next, markdownLines[index + 2]);
        index += 2;
        continue;
      }
      hasNextCodeLine = false;
    }
    protectedMarkdownLines.push(placeholder(block.join('')));
  }

  const withIndentedCodeProtected = protectedMarkdownLines.join('');
  const withInlineCodeProtected = withIndentedCodeProtected.replace(/(^|[^`])(`+)(?!`)([\s\S]*?)\2(?!`)/gm, (match, prefix) => `${prefix}${placeholder(match.slice(prefix.length))}`);
  const withAutolinksProtected = withInlineCodeProtected.replace(/<(https?:\/\/[^<>\s]+)>/gi, (match, value) => {
    const url = safeUrl(value);
    return placeholder(url ? `[${escapeMarkdownLinkLabel(value)}](<${url}>)` : escapeMarkdownText(match));
  });
  return {
    value: withAutolinksProtected,
    restore(value) {
      return saved.reduce((result, [token, code]) => result.replace(token, code), value);
    },
  };
}

/** Convert stored HTML fragments into safe Markdown while leaving existing Markdown untouched. */
export function normalizeAssignmentPrompt(source) {
  const value = String(source || '').replace(/\r\n?/g, '\n');
  const protectedCode = protectMarkdownCode(value);
  if (!/<\/?[a-z][\w:-]*(?:\s|\/?>)/i.test(protectedCode.value)) return value;
  const tree = parseHtml(protectedCode.value);
  const markdown = tree.children.map(node => renderInline(node)).join('').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return protectedCode.restore(markdown);
}
