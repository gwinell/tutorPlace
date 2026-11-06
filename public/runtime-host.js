/* Runs in an opaque-origin sandbox. Never grant allow-same-origin to its iframe. */
(function(){

  let worker=null;
  const channel=window.CT_CHANNEL||new URL(document.currentScript.src).searchParams.get('channel');
  const send=(data)=>parent.postMessage(Object.assign({},data,{ctRuntime:true,channel}),'*');
  const origin=window.CT_ORIGIN||'';
  function workerMain(){
    let python=null,luaReady=false;
    const send=(d)=>self.postMessage(d);
    self.onmessage=async function(e){
      const {code,language,inputs,origin,luaSource}=e.data;let index=0,needsInput=false,size=0;
      const output=(text)=>{size+=text.length;if(size>100000)throw Error('Слишком большой вывод программы.');send({type:'stdout',text});};
      const input=()=>{if(index<inputs.length){const line=inputs[index++];output(line+'\n');return line;}needsInput=true;throw Error('__CT_INPUT_REQUIRED__');};
      try{
        if(language==='python'){
          if(!python){send({type:'loading'});importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');python=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});}
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
      }catch(err){if(needsInput)send({type:'input'});else send({type:'error',text:String(err.message||err)});}
    };
  }
  function ensure(){if(worker)return;const source='('+workerMain.toString()+')();';const url=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));worker=new Worker(url);URL.revokeObjectURL(url);worker.onmessage=e=>send(e.data);worker.onerror=e=>send({type:'error',text:e.message||'Среда выполнения недоступна. Проверь подключение к интернету.'});}
  window.addEventListener('message',e=>{if(e.source!==parent)return;const d=e.data;if(d.command==='init')send({type:'ready'});if(d.command==='stop'){worker?.terminate();worker=null;send({type:'done'});}if(d.command==='run'){ensure();worker.postMessage({code:d.code,language:d.language,inputs:d.inputs||[],origin,luaSource:window.CT_LUA_SOURCE});}});
  send({type:'ready'});
})();
