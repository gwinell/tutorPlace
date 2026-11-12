const baseUrl = (process.env.SEO_BASE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
const siteUrl = 'https://code-together.ru';

const pages = [
  { path: '/', expected: 'Разобраться в коде.' },
  { path: '/offer', expected: 'Публичная оферта' },
  { path: '/privacy', expected: 'Политика обработки персональных данных' },
  { path: '/python', expected: 'От первых строк Python', service: true },
  { path: '/oge-informatika', expected: 'ОГЭ по информатике: решаем задачи', service: true },
  { path: '/ege-informatika', expected: 'ЕГЭ по информатике: теория', service: true },
  { path: '/mcko-informatika', expected: 'МЦКО по информатике: готовимся', service: true },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function tagFor(html, expression, name) {
  const tag = html.match(expression)?.[0];
  assert(tag, `Missing ${name}`);
  return tag;
}

function attr(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? '';
}

function visibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

const results = new Map();
for (const page of pages) {
  const response = await fetch(`${baseUrl}${page.path}`, { redirect: 'manual' });
  assert(response.status === 200, `${page.path} returned HTTP ${response.status}`);
  const html = await response.text();
  const text = visibleText(html);
  assert(text.includes(page.expected), `${page.path} does not render expected content in server HTML`);
  assert(/<h1\b/i.test(html), `${page.path} has no server-rendered H1`);

  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const descriptionTag = tagFor(html, /<meta\b[^>]*\bname="description"[^>]*>/i, `${page.path} description`);
  const description = attr(descriptionTag, 'content');
  const canonicalTag = tagFor(html, /<link\b[^>]*\brel="canonical"[^>]*>/i, `${page.path} canonical`);
  const canonical = attr(canonicalTag, 'href');
  const ogUrlTag = tagFor(html, /<meta\b[^>]*\bproperty="og:url"[^>]*>/i, `${page.path} og:url`);
  const ogUrl = attr(ogUrlTag, 'content');
  assert(title, `${page.path} has an empty title`);
  assert(description.length >= 40, `${page.path} has a missing or unusually short meta description`);
  const expectedCanonical = page.path === '/' ? siteUrl : `${siteUrl}${page.path}`;
  assert(canonical === expectedCanonical, `${page.path} has a non-self canonical: ${canonical}`);
  assert(ogUrl === canonical, `${page.path} og:url does not match canonical`);

  if (page.service) {
    const jsonLdTag = tagFor(html, /<script\b[^>]*\btype="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/i, `${page.path} JSON-LD`);
    const jsonLdText = jsonLdTag.replace(/^<[\s\S]*?>/, '').replace(/<\/script>$/i, '');
    const schema = JSON.parse(jsonLdText);
    const graph = schema['@graph'];
    assert(schema['@context'] === 'https://schema.org' && Array.isArray(graph), `${page.path} has an invalid schema graph`);
    const types = graph.flatMap((node) => Array.isArray(node['@type']) ? node['@type'] : [node['@type']]);
    for (const type of ['Person', 'Service', 'WebPage', 'BreadcrumbList']) assert(types.includes(type), `${page.path} JSON-LD is missing ${type}`);
    const person = graph.find((node) => node['@type'] === 'Person');
    const service = graph.find((node) => node['@type'] === 'Service');
    const webPage = graph.find((node) => node['@type'] === 'WebPage');
    const breadcrumb = graph.find((node) => node['@type'] === 'BreadcrumbList');
    assert(text.includes(person.name) && text.includes(person.description), `${page.path} Person markup is not supported by visible text`);
    assert(text.includes(person.jobTitle), `${page.path} Person job title is not supported by visible text`);
    assert(text.includes(service.name) && text.includes(service.description) && text.includes(service.serviceType), `${page.path} Service markup is not supported by visible text`);
    assert(webPage.name === service.name && text.includes(webPage.description) && webPage.inLanguage === 'ru', `${page.path} WebPage markup is not supported by visible content`);
    assert(breadcrumb.itemListElement.length === 2 && breadcrumb.itemListElement[0].item === siteUrl, `${page.path} breadcrumb does not match visible navigation`);
  }

  results.set(page.path, { title, description });
}

assert(new Set([...results.values()].map((item) => item.title)).size === pages.length, 'Page titles are not unique');
assert(new Set([...results.values()].map((item) => item.description)).size === pages.length, 'Page descriptions are not unique');

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
assert(sitemapResponse.ok, `sitemap.xml returned HTTP ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
for (const page of pages) assert(sitemap.includes(`${siteUrl}${page.path === '/' ? '/' : page.path}`), `sitemap.xml is missing ${page.path}`);
assert(!sitemap.includes('/refund'), 'sitemap.xml includes the /refund redirect');

const robotsResponse = await fetch(`${baseUrl}/robots.txt`);
assert(robotsResponse.ok, `robots.txt returned HTTP ${robotsResponse.status}`);
const robots = await robotsResponse.text();
assert(/User-Agent:\s*\*/i.test(robots) && /Allow:\s*\//i.test(robots), 'robots.txt does not allow public pages');
assert(/Disallow:\s*\/api\//i.test(robots) && /Disallow:\s*\/\?demo=/i.test(robots), 'robots.txt must continue to disallow the API and demo routes');
assert(/Sitemap:\s*https:\/\/code-together\.ru\/sitemap\.xml/i.test(robots), 'robots.txt has no sitemap reference');

const home = await (await fetch(`${baseUrl}/`)).text();
for (const path of ['/python', '/oge-informatika', '/ege-informatika', '/mcko-informatika']) {
  assert(new RegExp(`href="${path}"`).test(home), `Home page is missing an internal link to ${path}`);
}

console.log(`SEO smoke check passed for ${pages.length} pages, sitemap, robots.txt, canonical metadata, visible content, and JSON-LD.`);
