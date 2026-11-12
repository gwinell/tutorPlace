'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import {Play,Square,FileCode2,Terminal,Send,RotateCcw,LockKeyhole,ChevronDown,PenLine,Paintbrush,Bot,ZoomIn,ZoomOut,Maximize2,Minus,Plus} from 'lucide-react';
import runtimeHost from '../public/runtime-host.js?raw';
import luaSource from '../public/fengari.js?raw';
import turtleSource from '../public/turtle-shim.py?raw';

type TurtleEvent = { op: string; [key: string]: unknown };
type KumirExecutor = 'robot'|'turtle'|'drawer'|'painter'|'text';
type RobotFieldState = {x:number;y:number;width:number;height:number;painted:string[];hWalls:string[];vWalls:string[]};
type RobotView = {zoom:number;panX:number;panY:number};
const defaultRobotField:RobotFieldState={x:0,y:0,width:7,height:7,painted:[],hWalls:[],vWalls:[]};
const defaultRobotView:RobotView={zoom:1,panX:0,panY:0};
const executorNames:Record<KumirExecutor,string>={robot:'Робот',turtle:'Черепаха',drawer:'Чертёжник',painter:'Рисователь',text:'Текстовый вывод'};
function findKumirExecutor(code:string):KumirExecutor{
 const match=code.match(/^\s*использовать\s+(Робот|Черепаха|Чертежник|Чертёжник|Рисователь)(?=\s|$)/im)?.[1]?.toLocaleLowerCase('ru-RU');
 return match==='робот'?'robot':match==='черепаха'?'turtle':match==='чертежник'||match==='чертёжник'?'drawer':match==='рисователь'?'painter':'text';
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
type RuntimeMessage = { ctRuntime?: boolean; channel?: string; type?: string; text?: string; event?: TurtleEvent; bitmap?: ImageBitmap; executor?: string; state?:RobotFieldState };
type RuntimeProgram = { code: string; language: string; inputs: string[]; outputLimit: number; turtleSource: string; roomId?: string; demo?:boolean; kumirInput?: string; robotField?:RobotFieldState; robotView?:RobotView };
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
   if(program.language==='kumir'&&!program.roomId&&!program.demo)return false;
   active.current=channel;
   setActiveChannel(channel);
   if(program.language==='kumir'){
     activeEngine.current='kumir';
     if(!kumirWorker.current){
       kumirWorker.current=new Worker('/qumir/worker.js?v=9',{type:'module',name:'codeTogether Kumir'});
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
   if(activeEngine.current==='kumir')kumirWorker.current?.postMessage({type:'stop',channel});
   frame.current?.contentWindow?.postMessage({command:'stop',channel},'*');
   active.current=null;
   setActiveChannel(null);
 },[]);
 const turtleEvent=useCallback((channel:string,event:Record<string,unknown>)=>{
   frame.current?.contentWindow?.postMessage({command:'turtle-event',channel,event},'*');
 },[]);
 const executorEvent=useCallback((channel:string,event:Record<string,unknown>)=>{
   if(activeEngine.current!=='kumir'||!kumirWorker.current)return;
   const type=event.type==='robot-edit'||event.type==='robot-resize'?'robot-edit':event.type==='robot-view'?'robot-view':event.type==='drawer-control'?'drawer-control':event.type==='turtle-control'?'turtle-control':event.type==='painter-control'?'painter-control':'input-event';
   if(type==='drawer-control'||type==='turtle-control'||type==='painter-control')kumirWorker.current.postMessage({type,channel,command:event.command});
   else if(type==='robot-view')kumirWorker.current.postMessage({type,channel,view:event.view});
   else kumirWorker.current.postMessage({type,channel,event});
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

type CodeEditorProps = {value:string;onChange:(v:string)=>void;language?:string;filename?:string;roomId?:string;demo?:boolean;readOnly?:boolean;runnable?:boolean;kumirWorkspace?:boolean;onActivity?:()=>void};
export default function CodeEditor(props:CodeEditorProps){
 const runtime=useContext(RuntimeContext);
 return runtime?<CodeEditorView {...props}/>:<RuntimeProvider><CodeEditorView {...props}/></RuntimeProvider>;
}

function CodeEditorView({value,onChange,language='python',filename='student.py',roomId,demo=false,readOnly=false,runnable=true,kumirWorkspace=false,onActivity}:CodeEditorProps){
 const runtime=useContext(RuntimeContext);
 if(!runtime)throw new Error('CodeEditorView must be inside a RuntimeProvider.');
 const [channel]=useState(()=>crypto.randomUUID());
 const [output,setOutput]=useState(''),[running,setRunning]=useState(false),[waiting,setWaiting]=useState(false),[input,setInput]=useState(''),[loading,setLoading]=useState(false);
 const [turtleEvents,setTurtleEvents]=useState<TurtleEvent[]>([]),[turtleVisible,setTurtleVisible]=useState(false),[qumirVisible,setQumirVisible]=useState(language==='kumir'),[qumirHasFrame,setQumirHasFrame]=useState(false),[kumirInput,setKumirInput]=useState('');
 const qumirExecutor:KumirExecutor=language==='kumir'?findKumirExecutor(value):'text';
 const [executorMenuOpen,setExecutorMenuOpen]=useState(false),[robotEditing,setRobotEditing]=useState(false),[robotTool,setRobotTool]=useState<'wall'|'paint'|'robot'>('wall'),[robotField,setRobotField]=useState<RobotFieldState>(defaultRobotField),[robotView,setRobotView]=useState<RobotView>(defaultRobotView);
 const inputs=useRef<string[]>([]),timer=useRef<ReturnType<typeof setTimeout>|null>(null),source=useRef(''),outputCharacters=useRef(0),executionElapsed=useRef(0),executionSegmentStarted=useRef<number|null>(null),outputRef=useRef<HTMLPreElement>(null),inputRef=useRef<HTMLInputElement>(null),qumirCanvas=useRef<HTMLCanvasElement>(null),highlightRef=useRef<HTMLPreElement>(null),lineNumbersRef=useRef<HTMLPreElement>(null),robotViewRef=useRef<RobotView>(defaultRobotView),robotDrag=useRef<{x:number;y:number}|null>(null);
 const syntaxTokens=useMemo(()=>language==='python'||language==='kumir'?tokenizeSource(value,language):[],[value,language]);
 const {activeChannel,ready,register,run:runProgram,stop:stopProgram}=runtime;
 const sendTurtleEvent=runtime.turtleEvent;
 const sendExecutorEvent=runtime.executorEvent;
 useEffect(()=>register(channel,message=>{
   if(message.type==='loading')setLoading(true);
   if(message.type==='executing'){setLoading(false);if(timer.current)clearTimeout(timer.current);executionSegmentStarted.current=performance.now();timer.current=setTimeout(()=>{stopProgram(channel);executionElapsed.current=10000;executionSegmentStarted.current=null;setRunning(false);setOutput(current=>(current+'\nПрограмма остановлена: превышено 10 секунд выполнения.').slice(-100000));},Math.max(1,10000-executionElapsed.current));}
   if(message.type==='robot-state'&&message.state)setRobotField(message.state);
   if(message.type==='stdout'){const text=message.text||'';outputCharacters.current+=text.length;setOutput(current=>(current+text).slice(-100000));}
   if(message.type==='turtle'&&message.event){setTurtleVisible(true);setTurtleEvents(current=>current.length<10000?[...current,message.event!]:current);}
   if(message.type==='canvas'&&message.bitmap&&qumirCanvas.current){setQumirVisible(true);setQumirHasFrame(true);const context=qumirCanvas.current.getContext('2d');context?.clearRect(0,0,qumirCanvas.current.width,qumirCanvas.current.height);context?.drawImage(message.bitmap,0,0);message.bitmap.close();}
   if(message.type==='input'){if(timer.current)clearTimeout(timer.current);if(executionSegmentStarted.current!==null){executionElapsed.current+=performance.now()-executionSegmentStarted.current;executionSegmentStarted.current=null;}setWaiting(true);setRunning(false);setTimeout(()=>inputRef.current?.focus(),50);}
   if(message.type==='done'||message.type==='error'){if(timer.current)clearTimeout(timer.current);if(executionSegmentStarted.current!==null){executionElapsed.current+=performance.now()-executionSegmentStarted.current;executionSegmentStarted.current=null;}setRunning(false);setLoading(false);if(message.type==='error')setOutput(current=>current+'\n'+(message.text||'Ошибка выполнения.'));}
 }),[channel,language,register,stopProgram]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);stopProgram(channel);},[channel,stopProgram]);
 useEffect(()=>{if(outputRef.current)outputRef.current.scrollTop=outputRef.current.scrollHeight;},[output]);
 function run(replay=false){
   if(!ready)return;
   if(!replay&&value.length>100000){setOutput('Файл слишком большой: максимум 100 000 символов.');return;}
   onActivity?.();
   const viewForRun=replay?robotView:defaultRobotView;
   if(!replay){inputs.current=[];source.current=value;outputCharacters.current=0;executionElapsed.current=0;executionSegmentStarted.current=null;setTurtleEvents([]);setTurtleVisible(false);setQumirVisible(language==='kumir');setQumirHasFrame(false);setRobotEditing(false);setRobotView(defaultRobotView);robotViewRef.current=defaultRobotView;if(qumirCanvas.current){const context=qumirCanvas.current.getContext('2d');context?.clearRect(0,0,qumirCanvas.current.width,qumirCanvas.current.height);}}
   if(!runProgram(channel,{code:source.current,language,inputs:inputs.current,outputLimit:Math.max(0,100000-outputCharacters.current),turtleSource,roomId,demo,kumirInput,robotField,robotView:viewForRun}))return;
   setOutput('');setWaiting(false);setRunning(true);setLoading(false);
   if(timer.current)clearTimeout(timer.current);
   timer.current=setTimeout(()=>{stopProgram(channel);setRunning(false);setLoading(false);setOutput(current=>current+'\nСреда не ответила. Проверь подключение и попробуй запустить снова.');},45000);
 }
 function stop(){stopProgram(channel);if(timer.current)clearTimeout(timer.current);setRunning(false);setLoading(false);setWaiting(false);setOutput(current=>current+'\nВыполнение остановлено.');}
 function sendInput(event:FormEvent){event.preventDefault();inputs.current.push(input);setInput('');run(true);}
 function chooseExecutor(executor:Exclude<KumirExecutor,'text'>){
   setExecutorMenuOpen(false);setQumirVisible(true);setQumirHasFrame(false);setRobotEditing(false);setRobotView(defaultRobotView);robotViewRef.current=defaultRobotView;robotDrag.current=null;
   const directive=executor==='robot'?'Робот':executor==='turtle'?'Черепаха':executor==='painter'?'Рисователь':'Чертежник';
   const next=value.match(/^\s*использовать\s+(?:Робот|Черепаха|Чертежник|Чертёжник|Рисователь)(?=\s|$)/im)
    ?value.replace(/^([ \t]*использовать\s+)(?:Робот|Черепаха|Чертежник|Чертёжник|Рисователь)(?=\s|$)/im,`$1${directive}`)
    :`использовать ${directive}\n${value}`;
   if(!readOnly&&next!==value)onChange(next);
 }
 useEffect(()=>{if(language==='kumir'&&qumirExecutor==='robot'&&(!qumirHasFrame||robotEditing))drawRobotFieldPreview(qumirCanvas.current,robotField,robotView);},[language,qumirExecutor,qumirHasFrame,robotEditing,robotField,robotView]);
 useEffect(()=>{if(language==='kumir'&&!qumirHasFrame&&qumirExecutor!=='robot'&&qumirCanvas.current){const context=qumirCanvas.current.getContext('2d');context?.clearRect(0,0,qumirCanvas.current.width,qumirCanvas.current.height);}},[language,qumirExecutor,qumirHasFrame]);
 function editRobotAt(event:ReactPointerEvent<HTMLCanvasElement>){
   const point=mapQumirPoint(event.currentTarget,event.clientX,event.clientY),px=point.clientX,py=point.clientY;
   const {cell,left,top}=robotFieldGeometry(robotField,robotViewRef.current),localX=px-left,localY=py-top;
   if(localX<0||localY<0||localX>=cell*robotField.width||localY>=cell*robotField.height)return;
   const x=Math.floor(localX/cell),y=Math.floor(localY/cell);let next={...robotField};let side:string|undefined;
   if(robotTool==='robot'){next={...next,x,y};}
   else if(robotTool==='paint'){
    const key=`${x},${y}`;next={...next,painted:robotField.painted.includes(key)?robotField.painted.filter(item=>item!==key):[...robotField.painted,key]};
   }else{
    const ix=localX-x*cell,iy=localY-y*cell,edge=cell*.22,distances=([['west',ix],['east',cell-ix],['north',iy],['south',cell-iy]] as [string,number][]).sort((a,b)=>a[1]-b[1]);
    if(distances[0][1]<=edge){side=distances[0][0];const key=side==='north'?`${x},${y-1}`:side==='south'?`${x},${y}`:side==='west'?`${x-1},${y}`:`${x},${y}`;const allowed=side==='north'?y>0:side==='south'?y<robotField.height-1:side==='west'?x>0:x<robotField.width-1;if(allowed){const walls=side==='north'||side==='south'?robotField.hWalls:robotField.vWalls;const updated=walls.includes(key)?walls.filter(item=>item!==key):[...walls,key];next=side==='north'||side==='south'?{...next,hWalls:updated}:{...next,vWalls:updated};}}
   }
   setRobotField(next);sendExecutorEvent(channel,{type:'robot-edit',clientX:px,clientY:py,action:robotTool,side});
 }
 function updateRobotView(next:RobotView){robotViewRef.current=next;setRobotView(next);sendExecutorEvent(channel,{type:'robot-view',view:next});}
 function zoomRobot(factor:number){const zoom=Math.max(1,Math.min(24,robotViewRef.current.zoom*factor));updateRobotView({...robotViewRef.current,zoom});}
 function moveRobotView(event:ReactPointerEvent<HTMLCanvasElement>){
   if(qumirExecutor!=='robot'||robotEditing||!robotDrag.current)return;
   const point=mapQumirPoint(event.currentTarget,event.clientX,event.clientY),previous=robotDrag.current;
   robotDrag.current={x:point.clientX,y:point.clientY};
   const current=robotViewRef.current;
   updateRobotView({...current,panX:current.panX+point.clientX-previous.x,panY:current.panY+point.clientY-previous.y});
 }
 function resizeRobotField(axis:'width'|'height',delta:number){
   const dimension=Math.max(1,Math.min(200,robotField[axis]+delta));if(dimension===robotField[axis])return;
   const next={...robotField,[axis]:dimension};next.x=Math.min(next.x,next.width-1);next.y=Math.min(next.y,next.height-1);
   next.painted=next.painted.filter(key=>{const [x,y]=key.split(',').map(Number);return x<next.width&&y<next.height;});
   next.hWalls=next.hWalls.filter(key=>{const [x,y]=key.split(',').map(Number);return x<next.width&&y<next.height-1;});
   next.vWalls=next.vWalls.filter(key=>{const [x,y]=key.split(',').map(Number);return x<next.width-1&&y<next.height;});
   setRobotField(next);sendExecutorEvent(channel,{type:'robot-resize',state:next});
 }
 return (
  <div className={'code-editor'+(kumirWorkspace?' kumir-workspace-editor':'')}>
   <div className="editor-toolbar">
    <span><FileCode2 size={14}/>{filename}{readOnly&&<LockKeyhole size={12}/>}</span>
    <div>
     <span className="editor-language">{language==='lua'?'Lua':language==='kumir'?'Кумир':'Python 3'}</span>
     {runnable&&(running
      ?<button onClick={stop} type="button" className="run-button stop"><Square size={12}/>Стоп</button>
      :<button onClick={()=>run()} type="button" className="run-button" title={language==='kumir'&&!roomId&&!demo?'Запуск Кумир доступен в рабочей комнате':''} disabled={!ready||Boolean(activeChannel&&activeChannel!==channel)||(language==='kumir'&&!roomId&&!demo)}><Play size={12}/>Запустить</button>)}
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
    <header>
     <div className="qumir-stage-heading"><span>Среда Кумир</span><strong>{executorNames[qumirExecutor]||'Кумир'}</strong></div>
     <div className="qumir-stage-controls">
      <div className="qumir-executor-picker">
       <button type="button" className="qumir-control-button executor-picker-button" aria-haspopup="menu" aria-expanded={executorMenuOpen} onClick={()=>setExecutorMenuOpen(open=>!open)}><Bot size={15}/><span>Исполнитель</span><ChevronDown size={14}/></button>
       {executorMenuOpen&&<div className="qumir-executor-menu" role="menu" aria-label="Выбрать исполнителя">
        {(['robot','turtle','drawer','painter'] as const).map(executor=><button key={executor} type="button" role="menuitem" className={qumirExecutor===executor?'selected':''} disabled={readOnly} onClick={()=>chooseExecutor(executor)}>{executorNames[executor]}{qumirExecutor===executor&&<span aria-hidden="true">✓</span>}</button>)}
       </div>}
      </div>
      {qumirExecutor==='robot'&&<button type="button" className={'qumir-control-button'+(robotEditing?' active':'')} aria-pressed={robotEditing} disabled={readOnly||running} onClick={()=>setRobotEditing(editing=>!editing)}><PenLine size={14}/>{robotEditing?'Готово':'Поле'}</button>}
      {qumirExecutor==='robot'&&<div className="qumir-zoom-controls" aria-label="Масштаб Робота">
       <button type="button" className="qumir-control-button icon-only" aria-label="Уменьшить масштаб" title="Уменьшить масштаб" disabled={robotView.zoom<=1} onClick={()=>zoomRobot(.8)}><ZoomOut size={15}/></button>
       <button type="button" className="qumir-control-button icon-only" aria-label="Увеличить масштаб" title="Увеличить масштаб" disabled={robotView.zoom>=24} onClick={()=>zoomRobot(1.25)}><ZoomIn size={15}/></button>
       <button type="button" className="qumir-control-button icon-only" aria-label="Вписать поле" title="Вписать поле" onClick={()=>updateRobotView(defaultRobotView)}><Maximize2 size={14}/></button>
      </div>}
      {qumirExecutor==='turtle'&&<div className="qumir-zoom-controls" aria-label="Масштаб Черепахи">
       <button type="button" className="qumir-control-button icon-only" aria-label="Уменьшить масштаб" title="Уменьшить масштаб" onClick={()=>sendExecutorEvent(channel,{type:'turtle-control',command:'zoom-out'})}><ZoomOut size={15}/></button>
       <button type="button" className="qumir-control-button icon-only" aria-label="Увеличить масштаб" title="Увеличить масштаб" onClick={()=>sendExecutorEvent(channel,{type:'turtle-control',command:'zoom-in'})}><ZoomIn size={15}/></button>
       <button type="button" className="qumir-control-button icon-only" aria-label="Вписать рисунок" title="Вписать рисунок" onClick={()=>sendExecutorEvent(channel,{type:'turtle-control',command:'fit'})}><Maximize2 size={14}/></button>
      </div>}
      {qumirExecutor==='drawer'&&<div className="qumir-zoom-controls" aria-label="Масштаб Чертёжника">
       <button type="button" className="qumir-control-button icon-only" aria-label="Уменьшить масштаб" title="Уменьшить масштаб" onClick={()=>sendExecutorEvent(channel,{type:'drawer-control',command:'zoom-out'})}><ZoomOut size={15}/></button>
       <button type="button" className="qumir-control-button icon-only" aria-label="Увеличить масштаб" title="Увеличить масштаб" onClick={()=>sendExecutorEvent(channel,{type:'drawer-control',command:'zoom-in'})}><ZoomIn size={15}/></button>
       <button type="button" className="qumir-control-button icon-only" aria-label="Вписать рисунок" title="Вписать рисунок" onClick={()=>sendExecutorEvent(channel,{type:'drawer-control',command:'fit'})}><Maximize2 size={14}/></button>
      </div>}
      {qumirExecutor==='painter'&&<div className="qumir-zoom-controls" aria-label="Масштаб Рисователя">
       <button type="button" className="qumir-control-button icon-only" aria-label="Уменьшить масштаб" title="Уменьшить масштаб" onClick={()=>sendExecutorEvent(channel,{type:'painter-control',command:'zoom-out'})}><ZoomOut size={15}/></button>
       <button type="button" className="qumir-control-button icon-only" aria-label="Увеличить масштаб" title="Увеличить масштаб" onClick={()=>sendExecutorEvent(channel,{type:'painter-control',command:'zoom-in'})}><ZoomIn size={15}/></button>
       <button type="button" className="qumir-control-button icon-only" aria-label="Вписать рисунок" title="Вписать рисунок" onClick={()=>sendExecutorEvent(channel,{type:'painter-control',command:'fit'})}><Maximize2 size={14}/></button>
      </div>}
     </div>
    </header>
    {qumirExecutor==='robot'&&robotEditing&&<div className="robot-field-tools" role="toolbar" aria-label="Инструменты поля Робота">
     <span>Изменить поле:</span>
     <button type="button" className={robotTool==='wall'?'selected':''} aria-pressed={robotTool==='wall'} onClick={()=>setRobotTool('wall')}>Стена</button>
     <button type="button" className={robotTool==='paint'?'selected':''} aria-pressed={robotTool==='paint'} onClick={()=>setRobotTool('paint')}><Paintbrush size={13}/>Клетка</button>
     <button type="button" className={robotTool==='robot'?'selected':''} aria-pressed={robotTool==='robot'} onClick={()=>setRobotTool('robot')}>Робот</button>
     <div className="robot-field-resize"><span>Размер</span><div><small>Столбцы</small><button type="button" aria-label="Уменьшить ширину поля" disabled={robotField.width<=1} onClick={()=>resizeRobotField('width',-1)}><Minus size={12}/></button><strong>{robotField.width}</strong><button type="button" aria-label="Увеличить ширину поля" disabled={robotField.width>=200} onClick={()=>resizeRobotField('width',1)}><Plus size={12}/></button></div><div><small>Строки</small><button type="button" aria-label="Уменьшить высоту поля" disabled={robotField.height<=1} onClick={()=>resizeRobotField('height',-1)}><Minus size={12}/></button><strong>{robotField.height}</strong><button type="button" aria-label="Увеличить высоту поля" disabled={robotField.height>=200} onClick={()=>resizeRobotField('height',1)}><Plus size={12}/></button></div></div>
     <small>{robotTool==='wall'?'Нажми на край клетки':robotTool==='paint'?'Нажми на клетку, чтобы закрасить':'Нажми на клетку, чтобы переместить Робота'}</small>
    </div>}
    {!qumirHasFrame&&qumirExecutor!=='robot'&&<div className="qumir-stage-empty"><strong>{qumirExecutor==='text'?'Текстовая программа':'Поле готово'}</strong><span>{qumirExecutor==='text'?'Ввод и вывод программы доступны слева.':'Запусти программу, чтобы увидеть исполнителя.'}</span></div>}
    <canvas ref={qumirCanvas} width={720} height={440} aria-label={qumirExecutor==='robot'&&robotEditing?'Редактируемое поле Робота':qumirExecutor==='robot'?'Поле Робота. Перетаскивай, чтобы переместить обзор.':'Поле исполнителя Кумир'} tabIndex={0} className={qumirExecutor==='robot'?(robotEditing?'robot-field-editing':'robot-field-pannable'):''} onPointerDown={event=>{event.currentTarget.setPointerCapture(event.pointerId);if(qumirExecutor==='robot'){if(robotEditing)editRobotAt(event);else{const point=mapQumirPoint(event.currentTarget,event.clientX,event.clientY);robotDrag.current={x:point.clientX,y:point.clientY};}return;}const point=mapQumirPoint(event.currentTarget,event.clientX,event.clientY);sendExecutorEvent(channel,{type:'pointerdown',...point,pointerId:event.pointerId,button:event.button,buttons:event.buttons});}} onPointerMove={event=>{if(qumirExecutor==='robot'){moveRobotView(event);return;}const point=mapQumirPoint(event.currentTarget,event.clientX,event.clientY);sendExecutorEvent(channel,{type:'pointermove',...point,pointerId:event.pointerId,buttons:event.buttons});}} onPointerUp={event=>{if(qumirExecutor==='robot'){robotDrag.current=null;return;}const point=mapQumirPoint(event.currentTarget,event.clientX,event.clientY);sendExecutorEvent(channel,{type:'pointerup',...point,pointerId:event.pointerId,button:event.button,buttons:0});}} onWheel={event=>{event.preventDefault();if(qumirExecutor==='robot')return;const point=mapQumirPoint(event.currentTarget,event.clientX,event.clientY),rect=event.currentTarget.getBoundingClientRect(),scale=Math.max(.0001,Math.min(rect.width/720,rect.height/440));sendExecutorEvent(channel,{type:'wheel',...point,deltaX:event.deltaX/scale,deltaY:event.deltaY/scale,ctrlKey:event.ctrlKey,metaKey:event.metaKey});}} onKeyDown={event=>{sendExecutorEvent(channel,{type:'keydown',key:event.key,code:event.code});}}/>
   </section>}
   {turtleVisible&&<TurtleCanvas events={turtleEvents} onEvent={event=>sendTurtleEvent(channel,event)} onClear={()=>setTurtleEvents([])}/>}
  </div>
 );
}

function robotFieldGeometry(field:RobotFieldState,view:RobotView){
 const cell=Math.min((720-48)/field.width,(440-48)/field.height)*view.zoom;
 return {cell,left:(720-cell*field.width)/2+view.panX,top:(440-cell*field.height)/2+view.panY};
}

function drawRobotFieldPreview(canvas:HTMLCanvasElement|null,field:RobotFieldState,view:RobotView){
 if(!canvas)return;const context=canvas.getContext('2d');if(!context)return;
 const {cell,left,top}=robotFieldGeometry(field,view);
 context.setTransform(1,0,0,1,0,0);context.clearRect(0,0,canvas.width,canvas.height);context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);
 const width=field.width*cell,height=field.height*cell,inset=Math.min(1,cell*.08),lineWidth=Math.max(.5,Math.min(3,cell*.12));
 context.fillStyle='#faf9f5';context.fillRect(left,top,width,height);
 context.fillStyle='#e4e8df';for(const key of new Set(field.painted)){const [x,y]=key.split(',').map(Number);context.fillRect(left+x*cell+inset,top+y*cell+inset,Math.max(0,cell-inset*2),Math.max(0,cell-inset*2));}
 context.strokeStyle='#d6d4cc';context.lineWidth=Math.min(1,lineWidth);context.beginPath();
 for(let x=0;x<=field.width;x++){const px=left+x*cell;context.moveTo(px,top);context.lineTo(px,top+height);}
 for(let y=0;y<=field.height;y++){const py=top+y*cell;context.moveTo(left,py);context.lineTo(left+width,py);}
 context.stroke();
 context.strokeStyle='#303238';context.lineWidth=lineWidth;context.beginPath();
 for(const key of new Set(field.hWalls)){const [x,y]=key.split(',').map(Number);context.moveTo(left+x*cell,top+(y+1)*cell);context.lineTo(left+(x+1)*cell,top+(y+1)*cell);}
 for(const key of new Set(field.vWalls)){const [x,y]=key.split(',').map(Number);context.moveTo(left+(x+1)*cell,top+y*cell);context.lineTo(left+(x+1)*cell,top+(y+1)*cell);}
 context.stroke();
 const cx=left+(field.x+.5)*cell,cy=top+(field.y+.5)*cell;context.fillStyle='#41634d';context.beginPath();context.moveTo(cx,cy-cell*.3);context.lineTo(cx+cell*.28,cy+cell*.25);context.lineTo(cx-cell*.28,cy+cell*.25);context.closePath();context.fill();
}

function mapQumirPoint(canvas:HTMLCanvasElement,clientX:number,clientY:number){
 const rect=canvas.getBoundingClientRect(),scale=Math.min(rect.width/720,rect.height/440);
 const offsetX=(rect.width-720*scale)/2,offsetY=(rect.height-440*scale)/2;
 return {clientX:(clientX-rect.left-offsetX)/scale,clientY:(clientY-rect.top-offsetY)/scale};
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
