import {test} from 'node:test';
import assert from 'node:assert/strict';
import {documentFrom,encode,replaceText,Y} from '../lib/collaboration.ts';
test('Одновременные правки двух участников объединяются без потери вставок',()=>{
 const a=documentFrom(undefined,'hello\n'),b=documentFrom(undefined,'hello\n');
 replaceText(a,'hello student\n');replaceText(b,'teacher hello\n');
 const updateA=Y.encodeStateAsUpdate(a),updateB=Y.encodeStateAsUpdate(b);
 Y.applyUpdate(a,updateB);Y.applyUpdate(b,updateA);
 assert.equal(a.getText('code').toString(),b.getText('code').toString());
 assert.match(a.getText('code').toString(),/student/);assert.match(a.getText('code').toString(),/teacher/);
 a.destroy();b.destroy();
});
test('Большой файл сохраняется и восстанавливается с историей',()=>{
 const doc=documentFrom(undefined,'# Python\n');replaceText(doc,'# Python\n'+'print("Привет")\n'.repeat(6000));const state=encode(doc),restored=documentFrom(state,'');assert.equal(restored.getText('code').toString(),doc.getText('code').toString());doc.destroy();restored.destroy();
});
