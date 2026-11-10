import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const host=fs.readFileSync(new URL('../public/runtime-host.js',import.meta.url),'utf8');
const source=host.slice(host.indexOf('  function workerMain(){'),host.indexOf('  function ensure(){'))+'\nworkerMain();';
const luaSource=fs.readFileSync(new URL('../public/fengari.js',import.meta.url),'utf8');
function worker(){const messages=[];const scope={TextDecoder,TextEncoder,Uint8Array,ArrayBuffer,console,atob,btoa,fetch,URL,setTimeout,clearTimeout,postMessage:m=>messages.push(m)};scope.self=scope;const context=vm.createContext(scope);vm.runInContext(source,context);return {messages,async run(code,inputs=[],outputLimit=100000){messages.length=0;await context.onmessage({data:{code,language:'lua',inputs,luaSource,outputLimit}});return messages;}};}
test('Настоящая браузерная сборка Lua выполняет код и выводит результат',async()=>{const w=worker();const messages=await w.run('print(2 + 3)');assert.equal(messages.find(m=>m.type==='stdout')?.text,'5\n');assert.equal(messages.at(-1).type,'done');});
test('Lua запрашивает ввод и продолжает с переданной строкой',async()=>{const w=worker();let messages=await w.run('local name = io.read(); print("Hello, " .. name)');assert.equal(messages.at(-1).type,'input');messages=await w.run('local name = io.read(); print("Hello, " .. name)',['Alex']);assert.equal(messages.filter(m=>m.type==='stdout').map(m=>m.text).join(''),'Alex\nHello, Alex\n');assert.equal(messages.at(-1).type,'done');});
test('Синтаксическая ошибка Lua возвращается в терминал',async()=>{const w=worker();const messages=await w.run('this is not valid lua!!!');assert.equal(messages.at(-1).type,'error');assert.ok(messages.at(-1).text.length>0);});
test('Среда отклоняет исходник больше 100 000 символов до выполнения',async()=>{const w=worker();const messages=await w.run(' '.repeat(100001));assert.equal(messages.at(-1).type,'error');assert.match(messages.at(-1).text,/100 000/);});
test('Среда останавливает программу при превышении лимита вывода',async()=>{const w=worker();const messages=await w.run('print(string.rep("x", 100001))');assert.equal(messages.at(-1).type,'error');assert.match(messages.at(-1).text,/Слишком большой вывод/);});
test('Продолжение программы учитывает оставшийся лимит вывода',async()=>{const w=worker();const messages=await w.run('io.write(string.rep("x", 1001))',[],1000);assert.equal(messages.at(-1).type,'error');assert.match(messages.at(-1).text,/Слишком большой вывод/);});
