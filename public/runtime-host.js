/* Runs in an opaque-origin sandbox. Never grant allow-same-origin to its iframe. */
(function(){

  let worker=null;
  const defaultChannel=window.CT_CHANNEL||new URL(document.currentScript.src).searchParams.get('channel');
  let activeChannel=defaultChannel;
  const send=(data)=>parent.postMessage(Object.assign({},data,{ctRuntime:true,channel:activeChannel}),'*');
  const origin=window.CT_ORIGIN||'';
  function workerMain(){
    let python=null,luaReady=false,turtleOpCount=0;
    const send=(d)=>self.postMessage(d);
    self.onmessage=async function(e){
      if(e.data?.kind==='turtle-event'){
        if(python){const payload=JSON.stringify(e.data.event||{});python.runPython(`import turtle; turtle._dispatch(${JSON.stringify(payload)})`);}
        return;
      }
      const {code,language,inputs,origin,luaSource,turtleSource}=e.data;let index=0,needsInput=false,size=0,outputExceeded=false;
      const outputLimit=Math.max(0,Math.min(100000,Number.isFinite(e.data.outputLimit)?e.data.outputLimit:100000));
      const output=(text)=>{size+=text.length;if(size>outputLimit){outputExceeded=true;throw Error('OUTPUT_LIMIT');}send({type:'stdout',text});};
      const input=()=>{if(index<inputs.length){const line=inputs[index++];output(line+'\n');return line;}needsInput=true;throw Error('__CT_INPUT_REQUIRED__');};
      try{
        if(typeof code!=='string'||code.length>100000)throw Error('Файл слишком большой: максимум 100 000 символов.');
        if(language==='python'){
          if(!python){send({type:'loading'});importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');python=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});python.registerJsModule('ctbridge',{emit(payload){const event=payload?.toJs?payload.toJs({dict_converter:Object.fromEntries}):payload;if(event?.type==='turtle'){turtleOpCount++;if(turtleOpCount>5000)throw Error('Рисунок слишком сложный: предел — 5 000 команд.');send(event);}}});python.runPython('import sys,types\n_ct_turtle=types.ModuleType("turtle")\nexec('+JSON.stringify(turtleSource||'')+',_ct_turtle.__dict__)\nsys.modules["turtle"]=_ct_turtle');}
          turtleOpCount=0;python.runPython('import sys; _ct_turtle=sys.modules.get("turtle"); _ct_turtle and _ct_turtle._reset()');
          send({type:'executing'});
          const decoder=new TextDecoder();
          python.setStdout({write:(bytes)=>{output(decoder.decode(bytes));return bytes.length;}});
          python.setStderr({write:(bytes)=>{output(decoder.decode(bytes));return bytes.length;}});
          python.setStdin({stdin:input});
          const globals=python.toPy({});
          try{await python.runPythonAsync(code,{globals});}finally{globals.destroy();}
        }else{
          if(!luaReady){self.fengari=(new Function(luaSource+';return fengari;'))();luaReady=true;}
          send({type:'executing'});
          const {lua,lauxlib,lualib,to_luastring,to_jsstring}=fengari;
          const L=lauxlib.luaL_newstate();lualib.luaL_openlibs(L);
          lua.lua_pushjsfunction(L,function(L){const n=lua.lua_gettop(L),parts=[];for(let i=1;i<=n;i++){lauxlib.luaL_tolstring(L,i);parts.push(to_jsstring(lua.lua_tostring(L,-1)));lua.lua_pop(L,1);}output(parts.join('\t')+'\n');return 0;});lua.lua_setglobal(L,to_luastring('print'));
          lua.lua_newtable(L);lua.lua_pushvalue(L,-1);lua.lua_setglobal(L,to_luastring('io'));
          lua.lua_pushjsfunction(L,function(L){try{const v=input();const format=lua.lua_isstring(L,1)?to_jsstring(lua.lua_tostring(L,1)):'';if(format==='*n'||format==='n')lua.lua_pushnumber(L,Number(v));else lua.lua_pushstring(L,to_luastring(v));return 1;}catch{lua.lua_pushstring(L,to_luastring('__CT_INPUT_REQUIRED__'));return lua.lua_error(L);}});lua.lua_setfield(L,-2,to_luastring('read'));
          lua.lua_pushjsfunction(L,function(L){const n=lua.lua_gettop(L);for(let i=1;i<=n;i++)output(to_jsstring(lauxlib.luaL_checkstring(L,i)));return 0;});lua.lua_setfield(L,-2,to_luastring('write'));lua.lua_pop(L,1);
          const result=lauxlib.luaL_dostring(L,to_luastring(code));if(result!==lua.LUA_OK)throw Error(to_jsstring(lua.lua_tostring(L,-1)));lua.lua_close(L);
        }
        send({type:'done'});
      }catch(err){if(needsInput)send({type:'input'});else send({type:'error',text:outputExceeded?'Слишком большой вывод программы: максимум 100 000 символов.':String(err.message||err).slice(0,1000)});}
    };
  }
  function ensure(){if(worker)return;const source='('+workerMain.toString()+')();';const url=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));worker=new Worker(url);URL.revokeObjectURL(url);const current=worker;worker.onmessage=e=>{send(e.data);if(e.data?.type==='turtle'&&e.data.event?.op==='timer'){const timer=e.data.event;setTimeout(()=>{if(worker===current)worker.postMessage({kind:'turtle-event',event:{type:'timer',id:timer.id}});},Math.min(60000,Math.max(0,Number(timer.delay)||0)));}};worker.onerror=e=>send({type:'error',text:e.message||'Среда выполнения недоступна. Проверь подключение к интернету.'});}
  window.addEventListener('message',e=>{if(e.source!==parent)return;const d=e.data;if(d.command==='init')send({type:'ready'});if(d.command==='stop'){activeChannel=d.channel||activeChannel;worker?.terminate();worker=null;send({type:'done'});}if(d.command==='turtle-event'&&worker){activeChannel=d.channel||activeChannel;worker.postMessage({kind:'turtle-event',event:d.event});}if(d.command==='run'){activeChannel=d.channel||defaultChannel;ensure();worker.postMessage({code:d.code,language:d.language,inputs:d.inputs||[],origin,luaSource:window.CT_LUA_SOURCE,turtleSource:d.turtleSource||window.CT_TURTLE_SOURCE});}});
  send({type:'ready'});
})();
