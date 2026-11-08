import * as Y from 'yjs';
export function encodeUpdate(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  }
  return btoa(binary);
}
export function encode(doc: Y.Doc) { return encodeUpdate(Y.encodeStateAsUpdate(doc)); }
export function decode(value:string){return Uint8Array.from(atob(value),c=>c.charCodeAt(0));}
export function documentFrom(state:string|undefined,code:string){const doc=new Y.Doc();if(state)Y.applyUpdate(doc,decode(state));else{const client=doc.clientID;doc.clientID=1;doc.getText('code').insert(0,code);doc.clientID=client;}return doc;}
export function replaceText(doc:Y.Doc,next:string){const text=doc.getText('code'),old=text.toString();let start=0;while(start<old.length&&start<next.length&&old[start]===next[start])start++;let end=0;while(end<old.length-start&&end<next.length-start&&old[old.length-1-end]===next[next.length-1-end])end++;doc.transact(()=>{const count=old.length-start-end;if(count)text.delete(start,count);const insert=next.slice(start,next.length-end);if(insert)text.insert(start,insert);});}
export {Y};
