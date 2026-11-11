export type GithubSource={url:string;format:'md'|'ipynb'};

export function isGithubMaterialContentType(value:string|null){
 const mediaType=value?.split(';',1)[0]?.trim().toLowerCase();
 return mediaType==='text/plain'||mediaType==='text/markdown'||mediaType==='application/json'||mediaType==='application/octet-stream';
}

/** Validate and canonicalize a public GitHub Markdown or notebook file URL. */
export function normalizeGithubSource(value:string):GithubSource{
 if(value.length>2000||/[\u0000-\u001f\u007f]/.test(value))throw new Error('Укажи публичную ссылку GitHub на файл .md или .ipynb.');
 const input=value.trim();
 if(/(?:^|\/)(?:\.{1,2})(?:\/|$)|%2f|%5c|%2e/i.test(input))throw new Error('Путь GitHub содержит недопустимый сегмент.');
 let parsed:URL;try{parsed=new URL(input);}catch{throw new Error('Укажи корректную ссылку GitHub.');}
 if(parsed.protocol!=='https:'||parsed.username||parsed.password||parsed.port||parsed.search||parsed.hash)throw new Error('Ссылка GitHub должна использовать HTTPS и не содержать параметры.');
 if(parsed.hostname!=='github.com'&&parsed.hostname!=='raw.githubusercontent.com')throw new Error('Разрешены только github.com и raw.githubusercontent.com.');
 const segments=parsed.pathname.split('/').filter(Boolean).map(segment=>{try{return decodeURIComponent(segment);}catch{throw new Error('Ссылка GitHub содержит некорректный путь.');}});
 if(!segments.every(segment=>segment&&segment!=='.'&&segment!=='..'&&!/[\\/\u0000-\u001f\u007f]/.test(segment)))throw new Error('Путь GitHub содержит недопустимый сегмент.');
 let owner:string,repo:string,fileSegments:string[];
 if(parsed.hostname==='github.com'){
  if(segments.length<5||segments[2]!=='blob')throw new Error('Укажи ссылку на файл GitHub вида owner/repo/blob/branch/path.');
  [owner,repo]=segments;fileSegments=segments.slice(3);
 }else{
  if(segments.length<4)throw new Error('Укажи raw.githubusercontent.com ссылку вида owner/repo/branch/path.');
  [owner,repo]=segments;fileSegments=segments.slice(2);
 }
 if(!/^[A-Za-z0-9_.-]{1,100}$/.test(owner)||!/^[A-Za-z0-9_.-]{1,100}$/.test(repo)||fileSegments.length<2)throw new Error('Ссылка GitHub содержит некорректный репозиторий, ветку или файл.');
 const file=fileSegments.join('/');if(!/\.(md|ipynb)$/i.test(file))throw new Error('Поддерживаются только файлы .md и .ipynb.');
 const format=file.toLowerCase().endsWith('.ipynb')?'ipynb':'md';
 const encoded=[owner,repo,...fileSegments].map(encodeURIComponent).join('/');
 return {url:'https://raw.githubusercontent.com/'+encoded,format};
}
