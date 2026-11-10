'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from 'react';
import {Play,Square,FileCode2,Terminal,Send,RotateCcw,LockKeyhole} from 'lucide-react';
import runtimeHost from '../public/runtime-host.js?raw';
import luaSource from '../public/fengari.js?raw';
import turtleSource from '../public/turtle-shim.py?raw';

type TurtleEvent = { op: string; [key: string]: unknown };
type KumirExecutor = 'robot'|'turtle'|'drawer'|'text';
function findKumirExecutor(code:string):KumirExecutor{
 const match=code.match(/^\s*использовать\s+(Робот|Черепаха|Чертежник|Чертёжник)(?=\s|$)/im)?.[1]?.toLocaleLowerCase('ru-RU');
 return match==='робот'?'robot':match==='черепаха'?'turtle':match==='чертежник'||match==='чертёжник'?'drawer':'text';
}
type SyntaxToken = {type:'plain'|'keyword'|'string'|'number'|'comment'|'function'|'module'|'operator';text:string};
const pythonKeywords=new Set('False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(' '));
const pythonBuiltins=new Set('abs all any bool dict enumerate float int len list max min print range round set str sum tuple type zip'.split(' '));
const kumirKeywords=new Set('алг арг аргрез все выход дано для до иначе если исп использовать нц нач кон конец_если конец_цикла конец_пока конец_алг конец_данных пока при рез результат шаг таб то утв цикл цел вещ лог лит сим файл ввод вывод и или не да нет истина ложь нс'.split(' '));
const kumirCommands=new Set('вперед назад влево вправо вверх вниз закрасить опустить_перо поднять_перо перо_вниз перо_вверх очистить_поле'.split(' '));
function tokenizeSource(source:string,language:string):SyntaxToken[]{
 const tokens:SyntaxToken[]=[];
 const push=(type:SyntaxToken['type'],text:string)=>{if(!text)return;const previous=tokens.at(-1);if(previous?.type===type)previous.text+=text;else tokens.push({type,text});};
 let index=0;
 while(index<source.length){
  const current=source[index];
  if((language==='python'&&current==='#')||(language==='kumir'&&current==='|')){const end=source.indexOf('\n',index);const next=end<0?source.length:end;push('comment',source.slice(index,next));index=next;continue;}
  if(current==='\''||current==='"'){
   const quote=current,triple=language==='python'&&source.slice(index,index+3)===quote.repeat(3),delimiter=triple?quote.repeat(3):quote;let end=index+delimiter.length;
   while(end<source.length){if(source[end]==='\\'){end+=2;continue;}if(source.slice(end,end+delimiter.length)===delimiter){end+=delimiter.length;break;}end++;}
   push('string',source.slice(index,Math.min(end,source.length)));index=end;continue;
  }
  const word=source.slice(index).match(/^[\p{L}_][\p{L}\p{N}_]*/u)?.[0];
  if(word){
   const normalized=word.toLocaleLowerCase('ru-RU'),rest=source.slice(index+word.length),nextNonSpace=rest.match(/^\s*([\s\S])/)?.[1];
   let type:SyntaxToken['type']='plain';
   if(language==='python')type=pythonKeywords.has(word)?'keyword':pythonBuiltins.has(word)?'function':nextNonSpace==='('? 'function':'plain';
   else if(kumirKeywords.has(normalized))type='keyword';
   else if(/^(робот|черепаха|чертёжник|чертежник)$/i.test(word)&&/использовать\s+$/i.test(source.slice(0,index)))type='module';
   else type=kumirCommands.has(normalized)||nextNonSpace==='('? 'function':'plain';
   push(type,word);index+=word.length;continue;
  }
  const number=source.slice(index).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/)?.[0];
  if(number){push('number',number);index+=number.length;continue;}
  if(/[+\-*/%=<>!:.]/.test(current)){push('operator',current);index++;continue;}
  push('plain',current);index++;
 }
 return tokens;
}
type RuntimeMessage = { ctRuntime?: boolean; channel?: string; type?: string; text?: string; event?: TurtleEvent; bitmap?: ImageBitmap; executor?: string };
type RuntimeProgram = { code: string; language: string; inputs: string[]; outputLimit: number; turtleSource: string; roomId?: string; kumirInput?: string };
type RuntimeController = {
  ready: boolean;
  activeChannel: string | null;
  register: (channel: string, listener: (message: RuntimeMessage) => void) => () => void;
  run: (channel: string, program: RuntimeProgram) => boolean;
  stop: (channel: string) => void;
  turtleEvent: (channel: string, event: Record<string, unknown>) => void;
  executorEvent: (channel: string, event: Record<string, unknown>) => void;
};
const RuntimeContext = createContext<RuntimeController | null>(null);

export function RuntimeProvider({children}:{children:ReactNode}){
 const frame=useRef<HTMLIFrameElement>(null);
 const listeners=useRef(new Map<string,(message:RuntimeMessage)=>void>());
 const active=useRef<string|null>(null);
 const activeEngine=useRef<'browser'|'kumir'>('browser');
 const kumirWorker=useRef<Worker|null>(null);
 const [ready,setReady]=useState(false),[activeChannel,setActiveChannel]=useState<string|null>(null);
 const register=useCallback((channel:string,listener:(message:RuntimeMessage)=>void)=>{
   listeners.current.set(channel,listener);
   return()=>{if(listeners.current.get(channel)===listener)listeners.current.delete(channel);};
 },[]);
 const run=useCallback((channel:string,program:RuntimeProgram)=>{
   if(!ready||active.current&&active.current!==channel)return false;
   if(program.language==='kumir'&&!program.roomId)return false;
   active.current=channel;
   setActiveChannel(channel);
   if(program.language==='kumir'){
     activeEngine.current='kumir';
     if(!kumirWorker.current){
       kumirWorker.current=new Worker('/qumir/worker.js?v=4',{type:'module',name:'codeTogether Kumir'});
       kumirWorker.current.onmessage=event=>{
         const message=event.data as RuntimeMessage;
         if(message.channel)listeners.current.get(message.channel)?.(message);
         if((message.type==='done'||message.type==='error')&&message.channel&&active.current===message.channel){active.current=null;setActiveChannel(null);}
       };
       kumirWorker.current.onerror=()=>{
         const failedChannel=active.current;
         if(failedChannel)listeners.current.get(failedChannel)?.({type:'error',text:'Ошибка среды Кумир. Перезапусти программу.'});
         active.current=null;setActiveChannel(null);kumirWorker.current?.terminate();kumirWorker.current=null;
       };
     }
     kumirWorker.current.postMessage({type:'run',channel,...program,input:program.kumirInput});
     return true;
   }
   activeEngine.current='browser';
   frame.current?.contentWindow?.postMessage({command:'run',channel,...program},'*');
   return true;
 },[ready]);
 const stop=useCallback((channel:string)=>{
   if(active.current!==channel)return;
   if(activeEngine.current==='kumir'){
     kumirWorker.current?.terminate();kumirWorker.current=null;
   }
   frame.current?.contentWindow?.postMessage({command:'stop',channel},'*');
   active.current=null;
   setActiveChannel(null);
 },[]);
 const turtleEvent=useCallback((channel:string,event:Record<string,unknown>)=>{
   frame.current?.contentWindow?.postMessage({command:'turtle-event',channel,event},'*');
 },[]);
 const executorEvent=useCallback((channel:string,event:Record<string,unknown>)=>{
   if(activeEngine.current==='kumir'&&kumirWorker.current)kumirWorker.current.postMessage({type:'input-event',channel,event});
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
 const controller=useMemo(()=>({ready,activeChannel,register,run,stop,turtleEvent,executorEvent}),[ready,activeChannel,register,run,stop,turtleEvent,executorEvent]);
 const source='<!doctype html><html><head><meta charset="utf-8"><title>codeTogether Runtime</title></head><body><script>window.CT_CHANNEL="shared-runtime";window.CT_LUA_SOURCE='+JSON.stringify(luaSource)+';window.CT_TURTLE_SOURCE='+JSON.stringify(turtleSource)+';'+runtimeHost+'</script></body></html>';
 return <RuntimeContext.Provider value={controller}>{children}<iframe ref={frame} title="Изолированная среда выполнения" srcDoc={source} onLoad={()=>frame.current?.contentWindow?.postMessage({command:'init'},'*')} sandbox="allow-scripts" className="runtime-frame" aria-hidden="true" tabIndex={-1}/></RuntimeContext.Provider>;
}

type CodeEditorProps = {value:string;onChange:(v:string)=>void;language?:string;filename?:string;roomId?:string;readOnly?:boolean;runnable?:boolean;kumirWorkspace?:boolean;onActivity?:()=>void};
export default function CodeEditor(props:CodeEditorProps){
 const runtime=useContext(RuntimeContext);
 return runtime?<CodeEditorView {...props}/>:<RuntimeProvider><CodeEditorView {...props}/></RuntimeProvider>;
}

function CodeEditorView({value,onChange,language='python',filename='student.py',roomId,readOnly=false,runnable=true,kumirWorkspace=false,onActivity}:CodeEditorProps){
 const runtime=useContext(RuntimeContext);
 if(!runtime)throw new Error('CodeEditorView must be inside a RuntimeProvider.');
 const [channel]=useState(()=>crypto.randomUUID());
 const [output,setOutput]=useState(''),[running,setRunning]=useState(false),[waiting,setWaiting]=useState(false),[input,setInput]=useState(''),[loading,setLoading]=useState(false);
 const [turtleEvents,setTurtleEvents]=useState<TurtleEvent[]>([]),[turtleVisible,setTurtleVisible]=useState(false),[qumirVisible,setQumirVisible]=useState(language==='kumir'),[qumirHasFrame,setQumirHasFrame]=useState(false),[qumirExecutor,setQumirExecutor]=useState<KumirExecutor>(()=>language==='kumir'?findKumirExecutor(value):'text'),[kumirInput,setKumirInput]=useState('');
 const inputs=useRef<string[]>([]),timer=useRef<ReturnType<typeof setTimeout>|null>(null),source=useRef(''),outputCharacters=useRef(0),executionElapsed=useRef(0),executionSegmentStarted=useRef<number|null>(null),outputRef=useRef<HTMLPreElement>(null),inputRef=useRef<HTMLInputElement>(null),qumirCanvas=useRef<HTMLCanvasElement>(null),highlightRef=useRef<HTMLPreElement>(null),lineNumbersRef=useRef<HTMLPreElement>(null);
 const syntaxTokens=useMemo(()=>language==='python'||language==='kumir'?tokenizeSource(value,language):[],[value,language]);
 const executorHint=useRef<KumirExecutor>(language==='kumir'?findKumirExecutor(value):'text');
 const {activeChannel,ready,register,run:runProgram,stop:stopProgram}=runtime;
 const sendTurtleEvent=runtime.turtleEvent;
 const sendExecutorEvent=runtime.executorEvent;
 useEffect(()=>register(channel,message=>{
   if(message.type==='loading')setLoading(true);
   if(message.type==='executing'){setLoading(false);if(language==='kumir')setQumirExecutor(['robot','turtle','drawer','text'].includes(message.executor||'')?message.executor as KumirExecutor:executorHint.current);if(timer.current)clearTimeout(timer.current);executionSegmentStarted.current=performance.now();timer.current=setTimeout(()=>{stopProgram(channel);executionElapsed.current=10000;executionSegmentStarted.current=null;setRunning(false);setOutput(current=>(current+'\nПрограмма остановлена: превышено 10 секунд выполнения.').slice(-100000));},Math.max(1,10000-executionElapsed.current));}
   if(message.type==='stdout'){const text=message.text||'';outputCharacters.current+=text.length;setOutput(current=>(current+text).slice(-100000));}
   if(message.type==='turtle'&&message.event){setTurtleVisible(true);setTurtleEvents(current=>current.length<10000?[...current,message.event!]:current);}
   if(message.type==='canvas'&&message.bitmap&&qumirCanvas.current){setQumirVisible(true);setQumirHasFrame(true);if(['robot','turtle','drawer','text'].includes(message.executor||''))setQumirExecutor(message.executor as KumirExecutor);const context=qumirCanvas.current.getContext('2d');context?.clearRect(0,0,qumirCanvas.current.width,qumirCanvas.current.height);context?.drawImage(message.bitmap,0,0);message.bitmap.close();}
   if(message.type==='input'){if(timer.current)clearTimeout(timer.current);if(executionSegmentStarted.current!==null){executionElapsed.current+=performance.now()-executionSegmentStarted.current;executionSegmentStarted.current=null;}setWaiting(true);setRunning(false);setTimeout(()=>inputRef.current?.focus(),50);}
   if(message.type==='done'||message.type==='error'){if(timer.current)clearTimeout(timer.current);if(executionSegmentStarted.current!==null){executionElapsed.current+=performance.now()-executionSegmentStarted.current;executionSegmentStarted.current=null;}setRunning(false);setLoading(false);if(message.type==='error')setOutput(current=>current+'\n'+(message.text||'Ошибка выполнения.'));}
 }),[channel,language,register,stopProgram]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);stopProgram(channel);},[channel,stopProgram]);
 useEffect(()=>{if(outputRef.current)outputRef.current.scrollTop=outputRef.current.scrollHeight;},[output]);
 function run(replay=false){
   if(!ready)return;
   if(!replay&&value.length>100000){setOutput('Файл слишком большой: максимум 100 000 символов.');return;}
   onActivity?.();
   if(!replay){inputs.current=[];source.current=value;outputCharacters.current=0;executionElapsed.current=0;executionSegmentStarted.current=null;setTurtleEvents([]);setTurtleVisible(false);setQumirVisible(language==='kumir');setQumirHasFrame(false);executorHint.current=language==='kumir'?findKumirExecutor(source.current):'text';setQumirExecutor(executorHint.current);if(qumirCanvas.current){const context=qumirCanvas.current.getContext('2d');context?.clearRect(0,0,qumirCanvas.current.width,qumirCanvas.current.height);}}
   if(!runProgram(channel,{code:source.current,language,inputs:inputs.current,outputLimit:Math.max(0,100000-outputCharacters.current),turtleSource,roomId,kumirInput}))return;
   setOutput('');setWaiting(false);setRunning(true);setLoading(false);
   if(timer.current)clearTimeout(timer.current);
   timer.current=setTimeout(()=>{stopProgram(channel);setRunning(false);setLoading(false);setOutput(current=>current+'\nСреда не ответила. Проверь подключение и попробуй запустить снова.');},45000);
 }
 function stop(){stopProgram(channel);if(timer.current)clearTimeout(timer.current);setRunning(false);setLoading(false);setWaiting(false);setOutput(current=>current+'\nВыполнение остановлено.');}
 function sendInput(event:FormEvent){event.preventDefault();inputs.current.push(input);setInput('');run(true);}
 return (
  <div className={'code-editor'+(kumirWorkspace?' kumir-workspace-editor':'')}>
   <div className="editor-toolbar">
    <span><FileCode2 size={14}/>{filename}{readOnly&&<LockKeyhole size={12}/>}</span>
    <div>
     <span className="editor-language">{language==='lua'?'Lua':language==='kumir'?'Кумир':'Python 3'}</span>
     {runnable&&(running
      ?<button onClick={stop} type="button" className="run-button stop"><Square size={12}/>Стоп</button>
      :<button onClick={()=>run()} type="button" className="run-button" title={language==='kumir'&&!roomId?'Запуск Кумир доступен в рабочей комнате':''} disabled={!ready||Boolean(activeChannel&&activeChannel!==channel)||(language==='kumir'&&!roomId)}><Play size={12}/>Запустить</button>)}
    </div>
   </div>
   <div className={'editor-area'+(syntaxTokens.length?' has-syntax-highlighting':'')}>
    <pre ref={lineNumbersRef} className="line-numbers" aria-hidden="true">{value.split('\n').map((_,i)=><span key={i}>{i+1}</span>)}</pre>
    {syntaxTokens.length>0&&<pre ref={highlightRef} className="syntax-highlight" aria-hidden="true">{syntaxTokens.map((token,index)=><span className={'syntax-'+token.type} key={index}>{token.text}</span>)}</pre>}
    <textarea className={syntaxTokens.length?'syntax-source':''} aria-label={'Код файла '+filename} value={value} onChange={e=>onChange(e.target.value)} readOnly={readOnly} spellCheck={false} autoCapitalize="off" autoComplete="off" autoCorrect="off" onScroll={e=>{const target=e.currentTarget;if(highlightRef.current)highlightRef.current.style.transform=`translate(${-target.scrollLeft}px,${-target.scrollTop}px)`;if(lineNumbersRef.current)lineNumbersRef.current.style.transform=`translateY(${-target.scrollTop}px)`;}} onKeyDown={e=>{if(e.key==='Tab'&&!readOnly){e.preventDefault();const t=e.currentTarget,s=t.selectionStart,end=t.selectionEnd;onChange(value.slice(0,s)+'    '+value.slice(end));requestAnimationFrame(()=>{t.selectionStart=t.selectionEnd=s+4;});}}}/>
   </div>
   {runnable&&<div className="editor-terminal">
    <div className="terminal-toolbar">
     <span><Terminal size={13}/>{language==='kumir'?'Ввод и вывод':'Терминал'}</span>
     <div>{running&&<small>{loading?'Компилируем…':'Выполняется…'}</small>}<button type="button" onClick={()=>setOutput('')} title="Очистить вывод"><RotateCcw size={12}/></button></div>
    </div>
    {language==='kumir'&&<details className="kumir-stdin"><summary>Ввод программы</summary><textarea aria-label="Ввод для программы Кумир" value={kumirInput} onChange={event=>setKumirInput(event.target.value)} placeholder="Введи данные по одному на строке" rows={3}/></details>}
    <pre ref={outputRef} className={output?'':'terminal-placeholder'}>{output||(running?(loading?'Компиляция программы на сервере…':'Запускаем программу…'):'Нажми «Запустить», чтобы увидеть результат.')}{running&&<span className="terminal-caret"> ▍</span>}</pre>
    {waiting&&<form className="terminal-input" onSubmit={sendInput}><span>›</span><input ref={inputRef} aria-label="Ввод данных для программы" placeholder="Программа ждёт ввод…" value={input} onChange={e=>setInput(e.target.value)}/><button type="submit" aria-label="Отправить ввод"><Send size={15}/></button></form>}
   </div>}
   {language==='kumir'&&qumirVisible&&<section className="qumir-executor">
    <header><span>{qumirExecutor==='text'?'Текстовый режим':'Исполнитель'}</span><strong>{({robot:'Робот',turtle:'Черепаха',drawer:'Чертёжник',text:'Текстовый вывод'} as Record<string,string>)[qumirExecutor]||'Кумир'}</strong></header>
    {!qumirHasFrame&&<div className="qumir-stage-empty"><strong>{qumirExecutor==='text'?'Текстовая программа':'Поле готово'}</strong><span>{qumirExecutor==='text'?'Ввод и вывод программы доступны слева.':'Запусти программу, чтобы увидеть исполнителя.'}</span></div>}
    <canvas ref={qumirCanvas} width={720} height={440} aria-label="Поле исполнителя Кумир" tabIndex={0} onPointerDown={event=>{event.currentTarget.setPointerCapture(event.pointerId);const rect=event.currentTarget.getBoundingClientRect();sendExecutorEvent(channel,{type:'pointerdown',clientX:(event.clientX-rect.left)/rect.width*720,clientY:(event.clientY-rect.top)/rect.height*440,pointerId:event.pointerId,button:event.button,buttons:event.buttons});}} onPointerMove={event=>{const rect=event.currentTarget.getBoundingClientRect();sendExecutorEvent(channel,{type:'pointermove',clientX:(event.clientX-rect.left)/rect.width*720,clientY:(event.clientY-rect.top)/rect.height*440,pointerId:event.pointerId,buttons:event.buttons});}} onPointerUp={event=>sendExecutorEvent(channel,{type:'pointerup',clientX:event.nativeEvent.offsetX/event.currentTarget.clientWidth*720,clientY:event.nativeEvent.offsetY/event.currentTarget.clientHeight*440,pointerId:event.pointerId,button:event.button,buttons:0})} onWheel={event=>{event.preventDefault();sendExecutorEvent(channel,{type:'wheel',clientX:event.nativeEvent.offsetX/event.currentTarget.clientWidth*720,clientY:event.nativeEvent.offsetY/event.currentTarget.clientHeight*440,deltaY:event.deltaY});}} onKeyDown={event=>{sendExecutorEvent(channel,{type:'keydown',key:event.key,code:event.code});}}/>
   </section>}
   {turtleVisible&&<TurtleCanvas events={turtleEvents} onEvent={event=>sendTurtleEvent(channel,event)} onClear={()=>setTurtleEvents([])}/>}
  </div>
 );
}

function TurtleCanvas({events,onEvent,onClear}:{events:TurtleEvent[];onEvent:(event:Record<string,unknown>)=>void;onClear:()=>void}){
 const canvas=useRef<HTMLCanvasElement>(null);
 const [size,setSize]=useState({width:600,height:260});
 useEffect(()=>{const element=canvas.current;if(!element)return;const observer=new ResizeObserver(()=>{const bounds=element.getBoundingClientRect();setSize({width:bounds.width,height:bounds.height});});observer.observe(element);return()=>observer.disconnect();},[]);
 useEffect(()=>{
  const element=canvas.current;if(!element)return;
  const node=element,dpr=window.devicePixelRatio||1,width=size.width,height=size.height,scale=Math.min(width/600,height/400);
  node.width=Math.max(1,Math.round(width*dpr));node.height=Math.max(1,Math.round(height*dpr));
  const context=node.getContext('2d');if(!context)return;context.scale(dpr,dpr);
  let background='#fff',world={llx:-300,lly:-200,urx:300,ury:200};
  const point=(x:number,y:number)=>world.llx===-300&&world.lly===-200&&world.urx===300&&world.ury===200?[width/2+x*scale,height/2-y*scale]:[(x-world.llx)/(world.urx-world.llx)*width,(world.ury-y)/(world.ury-world.lly)*height];
  const paint=(event:TurtleEvent)=>{
    if(event.op==='clear'){context.clearRect(0,0,width,height);background='#fff';return;}
    if(event.op==='background'){background=String(event.color||'#fff');return;}
    if(event.op==='world'){world={llx:Number(event.llx),lly:Number(event.lly),urx:Number(event.urx),ury:Number(event.ury)};return;}
    if(event.op==='line'){
     const [x1,y1]=point(Number(event.x1),Number(event.y1)),[x2,y2]=point(Number(event.x2),Number(event.y2));context.beginPath();context.moveTo(x1,y1);context.lineTo(x2,y2);context.strokeStyle=String(event.color||'black');context.lineWidth=Math.max(1,Number(event.width||1)*scale);context.lineCap='round';context.stroke();
    }else if(event.op==='dot'){
     const [x,y]=point(Number(event.x),Number(event.y));context.beginPath();context.arc(x,y,Math.max(1,Number(event.radius)*scale),0,Math.PI*2);context.fillStyle=String(event.color||'black');context.fill();
    }else if(event.op==='polygon'&&Array.isArray(event.points)&&event.points.length){
     context.beginPath();event.points.forEach((item,index)=>{const [x,y]=point(Number(item[0]),Number(item[1]));if(index===0)context.moveTo(x,y);else context.lineTo(x,y);});context.closePath();context.fillStyle=String(event.color||'black');context.fill();
    }else if(event.op==='text'){
     const [x,y]=point(Number(event.x),Number(event.y));context.fillStyle=String(event.color||'black');context.font=`${Math.max(10,Number(event.size||12)*scale)}px Arial`;context.textAlign=(event.align as CanvasTextAlign)||'left';context.fillText(String(event.text||''),x,y);
    }
  };
  events.forEach(event=>{if(event.op!=='cursor')paint(event);});
  context.fillStyle=background;context.globalCompositeOperation='destination-over';context.fillRect(0,0,width,height);context.globalCompositeOperation='source-over';
 },[events,size]);
 const worldPoint=(event:MouseEvent<HTMLCanvasElement>)=>{const rect=event.currentTarget.getBoundingClientRect();if(worldEvent)return {x:Number(worldEvent.llx)+(event.clientX-rect.left)/rect.width*(Number(worldEvent.urx)-Number(worldEvent.llx)),y:Number(worldEvent.ury)-(event.clientY-rect.top)/rect.height*(Number(worldEvent.ury)-Number(worldEvent.lly))};const scale=Math.min(rect.width/600,rect.height/400);return {x:(event.clientX-rect.left-rect.width/2)/scale,y:(rect.height/2-(event.clientY-rect.top))/scale};};
 const cursor=[...events].reverse().find(event=>event.op==='cursor');
 const visibleCursor=cursor?.visible===true?cursor:null;
 const worldEvent=[...events].reverse().find(event=>event.op==='world');
 const scale=Math.min(size.width/600,size.height/400);
 const cursorLeft=worldEvent?`${(Number(cursor?.x)-Number(worldEvent.llx))/(Number(worldEvent.urx)-Number(worldEvent.llx))*100}%`:`calc(50% + ${Number(cursor?.x||0)*scale}px)`;
 const cursorTop=worldEvent?`${(Number(worldEvent.ury)-Number(cursor?.y))/(Number(worldEvent.ury)-Number(worldEvent.lly))*100}%`:`calc(50% - ${Number(cursor?.y||0)*scale}px)`;
 return <section className="turtle-panel"><div className="turtle-panel-heading"><span><span className="eyebrow">Рисунок программы</span><strong>Черепаха</strong></span><button type="button" className="text-link" onClick={onClear}><RotateCcw size={14}/>Очистить</button></div><div className="turtle-canvas-wrap"><canvas ref={canvas} className="turtle-canvas" tabIndex={0} aria-label="Поле рисунка черепахи. Нажми, чтобы передать программе нажатия клавиш." onKeyDown={event=>{if(event.key.length===1||event.key.startsWith('Arrow'))event.preventDefault();onEvent({type:'key',key:event.key.toLowerCase()});}} onKeyUp={event=>onEvent({type:'key',phase:'keyup',key:event.key.toLowerCase()})} onClick={event=>onEvent({type:'click',...worldPoint(event)})}/>{visibleCursor&&<span className={'turtle-cursor shape-'+String(visibleCursor.shape||'classic').replace(/[^a-z-]/gi,'')} aria-hidden="true" style={{left:cursorLeft,top:cursorTop,transform:`translate(-50%,-50%) rotate(${-Number(visibleCursor.angle||0)}deg)`,borderBottomColor:String(visibleCursor.color||'var(--purple)'),background:String(visibleCursor.color||'var(--purple)')}}/>}</div></section>;
}
