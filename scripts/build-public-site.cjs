// Publish only reviewed static paths, never the repository root.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {TextDecoder} = require('node:util');

const rootFiles = new Set([
  'about.html', 'ai-answer-hub.html', 'ai-faq.html', 'ai-tutorial.html',
  'art-installations.html', 'baidu_verify_codeva-im4D9lRCYA.html', 'cases.html',
  'copywriting.html', 'cultural-banquet-show.html', 'geo-promotion.html', 'geo.html',
  'index.html', 'light-designer.html', 'news-detail.html', 'news.html', 'podcast.html',
  'seo.html', 'services.html', 'stage-installations.html', 'urban-renewal.html',
  '7b3e99cf8369883da4fbdc05a82a7051.txt', 'baidu_verify_codeva-im4D9lRCYA',
  'ai-search-ready.txt', 'llms.txt', 'robots.txt', 'sitemap.xml',
  'geo-feed.json', 'schema-markup.json', 'hero-bg.webp'
]);
const publicDirs = new Set(['assets', 'business-images', 'cases-images', 'cases', 'solutions', 'en', 'podcast']);
const publicData = new Set(['data/geo-keywords.json', 'data/news.json', 'data/podcast.json', 'data/search-platforms.json']);
// Existing episode 8 decodes these public media files in its browser player.
// Do not allow arbitrary .txt files (probes and video chunks remain excluded).
const publicMedia = new Set(['podcast/ep8-cover.txt', 'podcast/ep8-audio.txt']);
const extensions = new Set(['.html', '.css', '.js', '.svg', '.webp', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.mp3', '.mp4', '.vtt', '.pdf']);

function build(source) {
  const root = fs.realpathSync(source);
  const output = path.join(root, '.public-site');
  // Never clear an existing directory: this also prevents stale files leaking.
  if (fs.existsSync(output)) throw new Error('output already exists; use a fresh isolated checkout');
  const files = new Map();
  function visit(relative) {
    const absolute = path.join(root, relative);
    const info = fs.lstatSync(absolute);
    if (info.isSymbolicLink()) throw new Error('symlink is not permitted: ' + relative);
    if (info.isDirectory()) {
      for (const name of fs.readdirSync(absolute).sort()) {
        if (!name.startsWith('.')) visit(relative + '/' + name);
      }
    } else if (info.isFile()) {
      const name = path.posix.basename(relative);
      if (relative.includes('/') && !publicData.has(relative) && !publicMedia.has(relative) && (!publicDirs.has(relative.split('/')[0]) || !extensions.has(path.extname(name).toLowerCase()))) return;
      if (name === 'admin.html' || name.endsWith('-final.html')) return;
      files.set(relative, fs.readFileSync(absolute));
    }
  }
  for (const name of [...rootFiles, ...publicData, ...publicDirs].sort()) {
    if (fs.existsSync(path.join(root, name))) visit(name);
  }
  // Exact existing redirects are routes, not documents. Keep legacy encoded
  // sources out of the artifact, and fail if a destination would be missing.
  const configPath = path.join(root, 'vercel.json');
  const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {};
  const redirects = (config.redirects || []).filter(r => r.permanent === true && /^\/[\w./-]*$/.test(r.source) && /^\/[\w./-]*$/.test(r.destination));
  for (const route of redirects) files.delete(route.source.slice(1));
  for (const route of redirects) {
    let target = route.destination.slice(1);
    if (!target || target.endsWith('/')) target += 'index.html';
    if (!files.has(target)) throw new Error('missing redirect target: ' + route.destination);
  }
  for (const name of ['index.html', 'en/factory.html', 'robots.txt', 'sitemap.xml']) {
    if (!files.has(name)) throw new Error('missing required public file: ' + name);
  }
  const utf8 = new TextDecoder('utf-8', {fatal:true});
  for (const [name, bytes] of files) {
    if (!/\.(html|json|xml|txt|css|js|svg|vtt)$/.test(name)) continue;
    const text = utf8.decode(bytes);
    if (name.endsWith('.json')) {
      try { JSON.parse(text); } catch { throw new Error('invalid JSON: ' + name); }
    }
    if (name.endsWith('.html') && name !== 'baidu_verify_codeva-im4D9lRCYA.html') {
      if (!/^\s*(?:<!doctype\s+html\b[^>]*>\s*)?<html\b/i.test(text)) throw new Error('not an HTML document: ' + name);
      for (const script of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
        if (name.startsWith('podcast/')) {
          for (const dependency of script[2].matchAll(/\bfetch\(\s*["']([^"']+)["']/g)) {
            const url = new URL(dependency[1], 'https://alisnart.cn/' + name);
            if (url.origin === 'https://alisnart.cn' && !files.has(decodeURIComponent(url.pathname).slice(1))) throw new Error('missing podcast fetch target: ' + dependency[1]);
          }
        }
        if (!/\btype\s*=\s*["']application\/ld\+json["']/i.test(script[1])) continue;
        try { JSON.parse(script[2]); } catch { throw new Error('invalid JSON-LD: ' + name); }
      }
    }
  }
  const factory = utf8.decode(files.get('en/factory.html'));
  if (!factory.includes('https://wa.me/8618026422225') || !factory.includes('mailto:lansenlight@gmail.com') || factory.includes('8615791503693')) throw new Error('factory contact regression');
  if (!/<link\b(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']https:\/\/alisnart\.cn\/en\/factory\.html["'])/i.test(factory)) throw new Error('factory canonical regression');
  const sitemap = utf8.decode(files.get('sitemap.xml'));
  if (!/<urlset\b/.test(sitemap) || !/<\/urlset>\s*$/.test(sitemap)) throw new Error('invalid sitemap envelope');
  const urls = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(m => m[1]);
  if (!urls.length) throw new Error('empty sitemap');
  if (urls.includes('https://alisnart.cn/index.html')) throw new Error('duplicate homepage sitemap URL; use /');
  if (new Set(urls).size !== urls.length) throw new Error('duplicate sitemap URL');
  for (const loc of urls) {
    const url = new URL(loc);
    if (url.origin !== 'https://alisnart.cn') throw new Error('unexpected sitemap origin: ' + loc);
    let relative = decodeURIComponent(url.pathname).slice(1);
    if (!relative || relative.endsWith('/')) relative += 'index.html';
    if (!files.has(relative)) throw new Error('missing sitemap target: ' + loc);
  }
  // All validations finish before any output is created.
  fs.mkdirSync(output);
  const manifest = [];
  for (const [name, bytes] of files) {
    const target = path.join(output, name);
    fs.mkdirSync(path.dirname(target), {recursive:true});
    fs.writeFileSync(target, bytes, {flag:'wx'});
    manifest.push({path:name, bytes:bytes.length, sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
  }
  return {output, files:manifest, sitemapEntries:urls.length};
}
module.exports = {build};
if (require.main === module) {
  try {
    const result = build(path.resolve(__dirname, '..'));
    console.log(JSON.stringify({status:'passed', files:result.files.length, sitemapEntries:result.sitemapEntries, output:'.public-site'}));
  } catch (error) {
    console.error('Public-site build blocked: ' + error.message);
    process.exitCode = 1;
  }
}
