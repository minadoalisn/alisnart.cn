const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const builder = path.join(root, 'scripts/build-public-site.cjs');
const html = '<!doctype html><html><head><title>Test page</title><script type="application/ld+json">{"@type":"WebPage"}</script></head><body><h1>Buyer checklist</h1></body></html>';
const factory = html.replace('</body>', '<a href="https://wa.me/8618026422225">WhatsApp</a><a href="mailto:lansenlight@gmail.com">Email</a></body>').replace('</head>', '<link rel="canonical" href="https://alisnart.cn/en/factory.html"></head>');
function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'alisn-public-build-test-'));
  t.after(() => {
    assert.ok(path.basename(dir).startsWith('alisn-public-build-test-'));
    assert.equal(path.dirname(dir), fs.realpathSync(os.tmpdir()));
    fs.rmSync(dir, {recursive:true, force:true});
  });
  function write(name, data) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), {recursive:true});
    fs.writeFileSync(path.join(dir, name), data);
  }
  write('index.html', html);
  write('en/factory.html', factory);
  write('robots.txt', 'User-agent: *\nAllow: /\nSitemap: https://alisnart.cn/sitemap.xml\n');
  write('sitemap.xml', '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://alisnart.cn/</loc></url></urlset>');
  return {dir, write};
}
function api() {
  assert.ok(fs.existsSync(builder), 'public-only build gate must exist');
  return require(builder);
}
test('Vercel serves only the validated output directory', () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json')));
  assert.equal(config.outputDirectory, '.public-site');
  assert.equal(config.buildCommand, 'node scripts/build-public-site.cjs');
});
test('only the explicitly reviewed main commit skips the duplicate Git deployment', () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json')));
  for (const [ref, message, expected] of [
    ['main', '[reviewed-cli-promotion] validated release', 0],
    ['main', 'Publish the next podcast', 1],
    ['codex/test', '[reviewed-cli-promotion] validated release', 1],
    ['', '', 1]
  ]) {
    const result = spawnSync(config.ignoreCommand, {shell:true, env:{...process.env, VERCEL_GIT_COMMIT_REF:ref, VERCEL_GIT_COMMIT_MESSAGE:message}});
    assert.equal(result.status, expected, ref + ': ' + message);
  }
});
test('factory source is real HTML with the approved contact channels', () => {
  const body = fs.readFileSync(path.join(root, 'en/factory.html'), 'utf8');
  assert.match(body, /^<!doctype html>/i);
  assert.ok(body.includes('https://wa.me/8618026422225'));
  assert.ok(body.includes('mailto:lansenlight@gmail.com'));
});
test('copies public pages and future podcast episodes without leaking source or secrets', t => {
  const {dir, write} = fixture(t);
  const allowed = ['podcast/future-episode.html', 'assets/css/site.css', 'business-images/example.webp', 'data/podcast.json'];
  const blocked = ['admin.html', 'about-final.html', 'AGENTS.md', 'scripts/check.py', 'reports/private.json', '.env', 'assets/test.pem', 'assets/.credentials.json', 'data/private.json', 'en/factory.html.bak', 'en_site/index.html'];
  for (const name of allowed) write(name, name.endsWith('.html') ? html : name.endsWith('.json') ? '[]' : 'public test asset');
  for (const name of blocked) write(name, 'DO_NOT_PUBLISH');
  const result = api().build(dir);
  for (const name of allowed) assert.ok(fs.existsSync(path.join(result.output, name)), name);
  for (const name of blocked) assert.ok(!fs.existsSync(path.join(result.output, name)), name);
  assert.ok(result.files.every(row => /^[a-f0-9]{64}$/.test(row.sha256)));
});
test('rejects Base64 pretending to be HTML before creating output', t => {
  const {dir, write} = fixture(t);
  write('en/factory.html', Buffer.from(factory).toString('base64'));
  assert.throws(() => api().build(dir), /not an HTML document/);
  assert.ok(!fs.existsSync(path.join(dir, '.public-site')));
});
test('preserves the two reviewed podcast text media dependencies without publishing probe files', t => {
  const {dir, write} = fixture(t);
  write('podcast/ep8-heritage-digital-2026.html', html.replace('</body>', "<script>fetch('ep8-cover.txt');fetch('ep8-audio.txt')</script></body>"));
  write('podcast/ep8-cover.txt', 'aW1hZ2U=');
  write('podcast/ep8-audio.txt', 'YXVkaW8=');
  write('podcast/probe.txt', 'not public');
  const result = api().build(dir);
  assert.equal(fs.readFileSync(path.join(result.output, 'podcast/ep8-cover.txt'), 'utf8'), 'aW1hZ2U=');
  assert.equal(fs.readFileSync(path.join(result.output, 'podcast/ep8-audio.txt'), 'utf8'), 'YXVkaW8=');
  assert.ok(!fs.existsSync(path.join(result.output, 'podcast/probe.txt')));
});
test('blocks a podcast page when its literal local fetch dependency is missing', t => {
  const {dir, write} = fixture(t);
  write('podcast/future-episode.html', html.replace('</body>', "<script>fetch('missing-cover.txt')</script></body>"));
  assert.throws(() => api().build(dir), /missing podcast fetch target/);
});
test('omits an exact redirected legacy page only when its target is published', t => {
  const {dir, write} = fixture(t);
  write('ai-tutorial.html', '&lt;html&gt;legacy source&lt;/html&gt;');
  write('vercel.json', JSON.stringify({redirects:[{source:'/ai-tutorial.html', destination:'/', permanent:true}]}));
  const result = api().build(dir);
  assert.ok(!fs.existsSync(path.join(result.output, 'ai-tutorial.html')));
});
test('rejects a redirect whose destination is absent from public output', t => {
  const {dir, write} = fixture(t);
  write('vercel.json', JSON.stringify({redirects:[{source:'/ai-tutorial.html', destination:'/missing.html', permanent:true}]}));
  assert.throws(() => api().build(dir), /missing redirect target/);
});
test('rejects malformed JSON-LD', t => {
  const {dir, write} = fixture(t);
  write('index.html', html.replace('{"@type":"WebPage"}', '{broken'));
  assert.throws(() => api().build(dir), /invalid JSON-LD/);
});
test('rejects malformed public JSON', t => {
  const {dir, write} = fixture(t);
  write('data/podcast.json', '{broken');
  assert.throws(() => api().build(dir), /invalid JSON/);
});
test('rejects duplicate homepage sitemap entries', t => {
  const {dir, write} = fixture(t);
  write('sitemap.xml', '<urlset><url><loc>https://alisnart.cn/</loc></url><url><loc>https://alisnart.cn/index.html</loc></url></urlset>');
  assert.throws(() => api().build(dir), /duplicate homepage/);
});
test('rejects a sitemap entry missing from the artifact', t => {
  const {dir, write} = fixture(t);
  write('sitemap.xml', '<urlset><url><loc>https://alisnart.cn/missing.html</loc></url></urlset>');
  assert.throws(() => api().build(dir), /missing sitemap target/);
});
test('rejects the known stale factory contact', t => {
  const {dir, write} = fixture(t);
  write('en/factory.html', factory.replace('8618026422225', '8615791503693'));
  assert.throws(() => api().build(dir), /factory contact/);
});
test('does not overwrite an existing output directory', t => {
  const {dir, write} = fixture(t);
  write('.public-site/keep.txt', 'preserve');
  assert.throws(() => api().build(dir), /output already exists/);
  assert.equal(fs.readFileSync(path.join(dir, '.public-site/keep.txt'), 'utf8'), 'preserve');
});
test('rejects symlinked public directories instead of following them', t => {
  const {dir} = fixture(t);
  fs.mkdirSync(path.join(dir, 'private'));
  fs.symlinkSync(path.join(dir, 'private'), path.join(dir, 'assets'), 'junction');
  assert.throws(() => api().build(dir), /symlink/);
});
