// Optional Node server: npm run build && npm start  (serves ./dist on PORT or 3000)
import http from 'node:http'; import { readFile } from 'node:fs/promises'; import { extname, join, normalize } from 'node:path';
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.json':'application/json','.svg':'image/svg+xml'};
http.createServer(async (q,s)=>{const p=normalize(decodeURIComponent(q.url.split('?')[0])).replace(/^(\.\.[/\\])+/,'');
 let f=join('dist',p==='/'?'index.html':p); let b; try{b=await readFile(f)}catch{f=join('dist','index.html');b=await readFile(f)}
 s.writeHead(200,{'Content-Type':T[extname(f)]||'application/octet-stream','Cache-Control':f.includes('assets')?'public,max-age=31536000':'no-cache'});s.end(b)
}).listen(process.env.PORT||3000,()=>console.log('Running on http://localhost:'+(process.env.PORT||3000)));
