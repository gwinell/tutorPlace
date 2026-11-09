'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {Play,Square,FileCode2,Terminal,Send,RotateCcw,LockKeyhole} from 'lucide-react';
import runtimeHost from '../public/runtime-host.js?raw';
import luaSource from '../public/fengari.js?raw';

type RuntimeMessage = { ctRuntime?: boolean; channel?: string; type?: string; text?: string };
type RuntimeProgram = { code: string; language: string; inputs: string[] };
type RuntimeController = {
  ready: boolean;
  activeChannel: string | null;
  register: (channel: string, listener: (message: RuntimeMessage) => void) => () => void;
  run: (channel: string, program: RuntimeProgram) => boolean;
  stop: (channel: string) => void;
};
const RuntimeContext = createContext<RuntimeController | null>(null);

export function RuntimeProvider({children}:{children:ReactNode}){
 const frame=useRef<HTMLIFrameElement>(null);
 const listeners=useRef(new Map<string,(message:RuntimeMessage)=>void>());
 const active=useRef<string|null>(null);
 const [ready,setReady]=useState(false),[activeChannel,setActiveChannel]=useState<string|null>(null);
 const register=useCallback((channel:string,listener:(message:RuntimeMessage)=>void)=>{
   listeners.current.set(channel,listener);
   return()=>{if(listeners.current.get(channel)===listener)listeners.current.delete(channel);};
 },[]);
 const run=useCallback((channel:string,program:RuntimeProgram)=>{
   if(!ready||active.current&&active.current!==channel)return false;
   active.current=channel;
   setActiveChannel(channel);
   frame.current?.contentWindow?.postMessage({command:'run',channel,...program},'*');
   return true;
 },[ready]);
 const stop=useCallback((channel:string)=>{
   if(active.current!==channel)return;
   frame.current?.contentWindow?.postMessage({command:'stop',channel},'*');
   active.current=null;
   setActiveChannel(null);
 },[]);
 useEffect(()=>{
   const receive=(event:MessageEvent<RuntimeMessage>)=>{
     if(event.source!==frame.current?.contentWindow||!event.data?.ctRuntime)return;
     const message=event.data;
     if(message.type==='ready')setReady(true);
     if(message.channel)listeners.current.get(message.channel)?.(message);
     if((message.type==='done'||message.type==='error')&&message.channel&&active.current===message.channel){active.current=null;setActiveChannel(null);}
   };
   window.addEventListener('message',receive);
   return()=>window.removeEventListener('message',receive);
 },[]);
 const controller=useMemo(()=>({ready,activeChannel,register,run,stop}),[ready,activeChannel,register,run,stop]);
 const source='<!doctype html><html><head><meta charset="utf-8"><title>codeTogether Runtime</title></head><body><script>window.CT_CHANNEL="shared-runtime";window.CT_LUA_SOURCE='+JSON.stringify(luaSource)+';'+runtimeHost+'</script></body></html>';
 return <RuntimeContext.Provider value={controller}>{children}<iframe ref={frame} title="Изолированная среда выполнения" srcDoc={source} onLoad={()=>frame.current?.contentWindow?.postMessage({command:'init'},'*')} sandbox="allow-scripts" className="runtime-frame" aria-hidden="true" tabIndex={-1}/></RuntimeContext.Provider>;
}

type CodeEditorProps = {value:string;onChange:(v:string)=>void;language?:string;filename?:string;readOnly?:boolean;runnable?:boolean;onActivity?:()=>void};
export default function CodeEditor(props:CodeEditorProps){
 const runtime=useContext(RuntimeContext);
 return runtime?<CodeEditorView {...props}/>:<RuntimeProvider><CodeEditorView {...props}/></RuntimeProvider>;
}

function CodeEditorView({value,onChange,language='python',filename='student.py',readOnly=false,runnable=true,onActivity}:CodeEditorProps){
 const runtime=useContext(RuntimeContext);
 if(!runtime)throw new Error('CodeEditorView must be inside a RuntimeProvider.');
 const [channel]=useState(()=>crypto.randomUUID());
 const [output,setOutput]=useState(''),[running,setRunning]=useState(false),[waiting,setWaiting]=useState(false),[input,setInput]=useState(''),[loading,setLoading]=useState(false);
 const inputs=useRef<string[]>([]),timer=useRef<ReturnType<typeof setTimeout>|null>(null),source=useRef(''),outputRef=useRef<HTMLPreElement>(null),inputRef=useRef<HTMLInputElement>(null);
 const {activeChannel,ready,register,run:runProgram,stop:stopProgram}=runtime;
 useEffect(()=>register(channel,message=>{
   if(message.type==='loading')setLoading(true);
   if(message.type==='executing'){setLoading(false);if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>{stopProgram(channel);setRunning(false);setOutput(current=>current+'\nПрограмма остановлена: превышено 10 секунд выполнения.');},10000);}
   if(message.type==='stdout')setOutput(current=>(current+(message.text||'')).slice(-100000));
   if(message.type==='input'){if(timer.current)clearTimeout(timer.current);setWaiting(true);setRunning(false);setTimeout(()=>inputRef.current?.focus(),50);}
   if(message.type==='done'||message.type==='error'){if(timer.current)clearTimeout(timer.current);setRunning(false);setLoading(false);if(message.type==='error')setOutput(current=>current+'\n'+(message.text||'Ошибка выполнения.'));}
 }),[channel,register,stopProgram]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);stopProgram(channel);},[channel,stopProgram]);
 useEffect(()=>{if(outputRef.current)outputRef.current.scrollTop=outputRef.current.scrollHeight;},[output]);
 function run(replay=false){
   if(!ready)return;
   onActivity?.();
   if(!replay){inputs.current=[];source.current=value;}
   if(!runProgram(channel,{code:source.current,language,inputs:inputs.current}))return;
   setOutput('');setWaiting(false);setRunning(true);setLoading(false);
   if(timer.current)clearTimeout(timer.current);
   timer.current=setTimeout(()=>{stopProgram(channel);setRunning(false);setLoading(false);setOutput(current=>current+'\nСреда не ответила. Проверь подключение и попробуй запустить снова.');},45000);
 }
 function stop(){stopProgram(channel);if(timer.current)clearTimeout(timer.current);setRunning(false);setLoading(false);setWaiting(false);setOutput(current=>current+'\nВыполнение остановлено.');}
 function sendInput(event:FormEvent){event.preventDefault();inputs.current.push(input);setInput('');run(true);}
 return <div className="code-editor"><div className="editor-toolbar"><span><FileCode2 size={14}/>{filename}{readOnly&&<LockKeyhole size={12}/>}</span><div><span className="editor-language">{language==='lua'?'Lua':'Python 3'}</span>{runnable&&(running?<button onClick={stop} type="button" className="run-button stop"><Square size={12}/>Стоп</button>:<button onClick={()=>run()} type="button" className="run-button" disabled={!ready||Boolean(activeChannel&&activeChannel!==channel)}><Play size={12}/>Запустить</button>)}</div></div><div className="editor-area"><pre className="line-numbers" aria-hidden="true">{value.split('\n').map((_,i)=><span key={i}>{i+1}</span>)}</pre><textarea aria-label={'Код файла '+filename} value={value} onChange={e=>onChange(e.target.value)} readOnly={readOnly} spellCheck={false} autoCapitalize="off" autoComplete="off" autoCorrect="off" onKeyDown={e=>{if(e.key==='Tab'&&!readOnly){e.preventDefault();const t=e.currentTarget,s=t.selectionStart,end=t.selectionEnd;onChange(value.slice(0,s)+'    '+value.slice(end));requestAnimationFrame(()=>{t.selectionStart=t.selectionEnd=s+4;});}}}/></div>{runnable&&<div className="editor-terminal"><div className="terminal-toolbar"><span><Terminal size={13}/>Терминал</span><div>{running&&<small>{loading?'Загружаем среду…':'Выполняется…'}</small>}<button type="button" onClick={()=>setOutput('')} title="Очистить вывод"><RotateCcw size={12}/></button></div></div><pre ref={outputRef} className={output?'':'terminal-placeholder'}>{output||(running?(loading?'Первая загрузка Python может занять немного времени…':'Запускаем программу…'):'Нажми «Запустить», чтобы увидеть результат.')}{running&&<span className="terminal-caret"> ▍</span>}</pre>{waiting&&<form className="terminal-input" onSubmit={sendInput}><span>›</span><input ref={inputRef} aria-label="Ввод данных для программы" placeholder="Программа ждёт ввод…" value={input} onChange={e=>setInput(e.target.value)}/><button type="submit" aria-label="Отправить ввод"><Send size={15}/></button></form>}</div>}</div>;
}
