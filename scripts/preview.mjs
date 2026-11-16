import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

const root = resolve('rendered');
createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const file = resolve(root, '.' + decodeURIComponent(url.pathname), 'index.html');
  if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  try {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(await readFile(file));
  } catch { res.writeHead(404).end('Page not found'); }
}).listen(4173, '127.0.0.1', () => console.log('KB preview: http://127.0.0.1:4173/kb/incidents/4471-review/'));
