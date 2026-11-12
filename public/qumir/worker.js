import { loadRuntime } from './runtime/loader.js?v=7';

const outputLimit = 100_000;
const canvasWidth = 720;
const canvasHeight = 440;
let executionSession = null;
let canvas = null;
let canvasContext = null;
let canvasFrames = 0;
let forceNextCanvasFrame = false;
let outputSize = 0;
let activeChannel = null;
let activeExecutor = 'text';
let activeRuntime = null;
let robotView = { zoom: 1, panX: 0, panY: 0 };

const frameHandlers = new Map();
const windowHandlers = new Map();
const virtualStdin = { value: '', classList: { remove() {} } };
const virtualStdout = { textContent: '', classList: { remove() {} } };

function post(type, data = {}, transfer = []) {
  self.postMessage({ channel: activeChannel, type, ...data }, transfer);
}

function writeOutput(value) {
  const text = String(value);
  outputSize += text.length;
  if (outputSize > outputLimit) throw new Error('Программа превысила предел вывода 100 000 символов.');
  if (text) post('stdout', { text });
}

function canvasAdapter() {
  const target = canvas;
  return {
    get width() { return target.width; },
    set width(value) { target.width = value; },
    get height() { return target.height; },
    set height(value) { target.height = value; },
    get style() { return {}; },
    getContext: (...args) => target.getContext(...args),
    getBoundingClientRect: () => ({ left: 0, top: 0, width: canvasWidth, height: canvasHeight, right: canvasWidth, bottom: canvasHeight }),
    addEventListener(type, callback) {
      if (!frameHandlers.has(type)) frameHandlers.set(type, new Set());
      frameHandlers.get(type).add(callback);
    },
    removeEventListener(type, callback) { frameHandlers.get(type)?.delete(callback); },
    setPointerCapture() {},
    releasePointerCapture() {},
    classList: { add() {}, remove() {}, toggle() {} },
  };
}

function installWorkerBrowserShims() {
  self.devicePixelRatio = 1;
  self.window = self;
  self.addEventListener = (type, callback) => {
    if (!windowHandlers.has(type)) windowHandlers.set(type, new Set());
    windowHandlers.get(type).add(callback);
  };
  self.removeEventListener = (type, callback) => windowHandlers.get(type)?.delete(callback);
  self.requestAnimationFrame = callback => setTimeout(() => {
    const force = forceNextCanvasFrame;
    forceNextCanvasFrame = false;
    callback(performance.now());
    sendCanvas(activeExecutor, force);
  }, 0);
  self.cancelAnimationFrame = clearTimeout;
  self.document = {
    querySelector: selector => selector === '#stdin' ? virtualStdin : selector === '#stdout' ? virtualStdout : null,
    getElementById: id => id === 'stdin' ? virtualStdin : id === 'stdout' ? virtualStdout : null,
    body: { appendChild() {}, removeChild() {} },
    createElement(type) {
      if (type === 'canvas') return new OffscreenCanvas(canvasWidth, canvasHeight);
      if (type === 'a') return { click() {}, set href(_value) {}, set download(_value) {} };
      return {};
    },
  };
}

function sendCanvas(executor = activeExecutor, force = false) {
  if (!canvas || (!force && canvasFrames >= 500)) return;
  if (!force) canvasFrames += 1;
  const bitmap = canvas.transferToImageBitmap();
  post('canvas', { bitmap, executor }, [bitmap]);
}

function drawRobot(robot, force = false) {
  const state = robot?.__getRobotState?.();
  if (!state || !canvasContext) return;
  post('robot-state', { state });
  const width = canvasWidth, height = canvasHeight;
  const cell = Math.min((width - 48) / state.width, (height - 48) / state.height) * robotView.zoom;
  const left = (width - cell * state.width) / 2 + robotView.panX;
  const top = (height - cell * state.height) / 2 + robotView.panY;
  canvasContext.setTransform(1, 0, 0, 1, 0, 0);
  canvasContext.clearRect(0, 0, width, height);
  canvasContext.fillStyle = '#fff';
  canvasContext.fillRect(0, 0, width, height);
  const fieldWidth = state.width * cell, fieldHeight = state.height * cell;
  const inset = Math.min(1, cell * 0.08);
  const lineWidth = Math.max(0.5, Math.min(3, cell * 0.12));
  canvasContext.fillStyle = '#faf9f5';
  canvasContext.fillRect(left, top, fieldWidth, fieldHeight);
  canvasContext.fillStyle = '#e4e8df';
  for (const key of new Set(state.painted)) {
    const [x, y] = key.split(',').map(Number);
    canvasContext.fillRect(left + x * cell + inset, top + y * cell + inset, Math.max(0, cell - inset * 2), Math.max(0, cell - inset * 2));
  }
  canvasContext.strokeStyle = '#d6d4cc';
  canvasContext.lineWidth = Math.min(1, lineWidth);
  canvasContext.beginPath();
  for (let x = 0; x <= state.width; x += 1) {
    const px = left + x * cell;
    canvasContext.moveTo(px, top);
    canvasContext.lineTo(px, top + fieldHeight);
  }
  for (let y = 0; y <= state.height; y += 1) {
    const py = top + y * cell;
    canvasContext.moveTo(left, py);
    canvasContext.lineTo(left + fieldWidth, py);
  }
  canvasContext.stroke();
  canvasContext.strokeStyle = '#303238';
  canvasContext.lineWidth = lineWidth;
  canvasContext.beginPath();
  for (const key of new Set(state.hWalls)) {
    const [x, y] = key.split(',').map(Number);
    canvasContext.moveTo(left + x * cell, top + (y + 1) * cell);
    canvasContext.lineTo(left + (x + 1) * cell, top + (y + 1) * cell);
  }
  for (const key of new Set(state.vWalls)) {
    const [x, y] = key.split(',').map(Number);
    canvasContext.moveTo(left + (x + 1) * cell, top + y * cell);
    canvasContext.lineTo(left + (x + 1) * cell, top + (y + 1) * cell);
  }
  canvasContext.stroke();
  const cx = left + (state.x + 0.5) * cell, cy = top + (state.y + 0.5) * cell;
  canvasContext.fillStyle = '#41634d';
  canvasContext.beginPath();
  canvasContext.moveTo(cx, cy - cell * 0.3); canvasContext.lineTo(cx + cell * 0.28, cy + cell * 0.25); canvasContext.lineTo(cx - cell * 0.28, cy + cell * 0.25); canvasContext.closePath(); canvasContext.fill();
  sendCanvas('robot', force);
}

function emitCanvas(runtime, executor) {
  if (executor === 'robot') drawRobot(runtime.robotModule);
  else {
    if (executor === 'turtle') runtime.turtleModule?.__onCanvasShown?.();
    if (executor === 'drawer') runtime.drawerModule?.__onCanvasShown?.();
    if (executor === 'painter') runtime.painterModule?.__onCanvasShown?.();
    sendCanvas(executor);
  }
}

function dispatchInput(input) {
  const type = input?.type;
  const belongsToWindow = type?.startsWith('key') || type === 'pointermove' || type === 'pointerup';
  const handlers = belongsToWindow ? windowHandlers.get(type) : frameHandlers.get(type);
  const event = { ...input, preventDefault() {}, stopPropagation() {}, target: canvasAdapter(), currentTarget: canvasAdapter() };
  for (const callback of handlers || []) callback(event);
}

function setupIO(runtime, input) {
  const tokens = String(input || '').match(/[^\s]+/g) || [];
  const lines = String(input || '').replace(/\r/g, '').split('\n');
  let tokenIndex = 0, lineIndex = 0;
  runtime.ioEnv.setInputStream({
    readToken: () => tokens[tokenIndex++] ?? '0',
    readLine: () => lines[lineIndex++] ?? '',
    hasMore: () => tokenIndex < tokens.length || lineIndex < lines.length,
    reset: () => { tokenIndex = 0; lineIndex = 0; },
  }, { makeDefault: true });
  runtime.ioEnv.setOutputStream({ write: writeOutput, clear() {} });
}

function bindRuntime(runtime, executor) {
  const { instance, ioEnv, stringEnv, arrayEnv, complexEnv, futureEnv } = runtime;
  const memory = instance.exports.memory;
  ioEnv.__bindMemory(memory);
  stringEnv.__bindMemory?.(memory);
  arrayEnv.__bindMemory?.(memory);
  complexEnv.__bindMemory?.(memory);
  futureEnv.__bindWasm(instance.exports);
  futureEnv.__bindMemory?.(memory);
  runtime.resultEnv.setStringRuntime?.(stringEnv);
  for (const module of [runtime.turtleModule, runtime.robotModule, runtime.drawerModule, runtime.painterModule]) module?.__bindFutureRuntime?.(futureEnv);
  runtime.drawerModule?.__bindStringRuntime?.(stringEnv);
  runtime.painterModule?.__bindMemory?.(memory);
  runtime.painterModule?.__bindStringRuntime?.(stringEnv);
  runtime.colorsModule?.__bindMemory?.(memory);
  runtime.turtleModule?.__bindTurtleCanvas?.(canvasAdapter());
  runtime.drawerModule?.__bindDrawerCanvas?.(canvasAdapter());
  runtime.painterModule?.__bindPainterCanvas?.(canvasAdapter());
  if (executor === 'robot') {
    runtime.robotModule?.__initRobotField?.();
    runtime.robotModule?.__previewField?.();
    if (messageRobotField) runtime.robotModule?.__setRobotState?.(messageRobotField);
  }
  runtime.turtleModule?.__resetTurtle?.(true);
  runtime.drawerModule?.__resetDrawer?.(true);
  runtime.painterModule?.__resetPainter?.();
  runtime.keyboardModule?.__resetKeyboard?.();
}

let messageRobotField = null;

function editRobot(event) {
  const robot = activeRuntime?.robotModule;
  const state = robot?.__getRobotState?.();
  if (!state) return;
  const cell = Math.min((canvasWidth - 48) / state.width, (canvasHeight - 48) / state.height) * robotView.zoom;
  const left = (canvasWidth - cell * state.width) / 2 + robotView.panX;
  const top = (canvasHeight - cell * state.height) / 2 + robotView.panY;
  const localX = Number(event.clientX) - left;
  const localY = Number(event.clientY) - top;
  if (localX < 0 || localY < 0 || localX >= cell * state.width || localY >= cell * state.height) return;
  const x = Math.floor(localX / cell);
  const y = Math.floor(localY / cell);
  if (event.action === 'robot') robot.__setRobotPosition?.(x, y);
  else if (event.action === 'paint') robot.__togglePainted?.(x, y);
  else if (event.action === 'wall') {
    const inCellX = localX - x * cell;
    const inCellY = localY - y * cell;
    const edge = cell * 0.22;
    const distances = [
      ['west', inCellX], ['east', cell - inCellX],
      ['north', inCellY], ['south', cell - inCellY],
    ].sort((a, b) => a[1] - b[1]);
    if (distances[0][1] <= edge) robot.__toggleWall?.(x, y, distances[0][0]);
  }
  drawRobot(robot, true);
}

async function run(message) {
  activeChannel = message.channel;
  robotView = {
    zoom: Math.max(1, Math.min(24, Number(message.robotView?.zoom) || 1)),
    panX: Math.max(-10000, Math.min(10000, Number(message.robotView?.panX) || 0)),
    panY: Math.max(-10000, Math.min(10000, Number(message.robotView?.panY) || 0)),
  };
  outputSize = 0;
  canvasFrames = 0;
  canvas = new OffscreenCanvas(canvasWidth, canvasHeight);
  canvasContext = canvas.getContext('2d');
  frameHandlers.clear();
  installWorkerBrowserShims();
  post('loading');
  const compileUrl = message.demo
    ? '/api/demo/compile-kumir'
    : `/api/rooms/${encodeURIComponent(message.roomId)}/compile-kumir`;
  const response = await fetch(compileUrl, {
    method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: message.code }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Не удалось скомпилировать программу Кумир.');
  }
  const bytes = await response.arrayBuffer();
  const module = await WebAssembly.compile(bytes);
  const imports = WebAssembly.Module.imports(module);
  const executor = ['painter', 'turtle', 'robot', 'drawer'].find(name => imports.some(item => item.module === 'env' && item.name.startsWith(`${name}_`))) || 'text';
  activeExecutor = executor;
  const runtime = await loadRuntime(module, { render: () => emitCanvas(runtime, executor), delay: () => 0 });
  activeRuntime = runtime;
  executionSession = runtime.session;
  setupIO(runtime, message.input);
  messageRobotField = message.robotField || null;
  bindRuntime(runtime, executor);
  post('executing', { executor });
  emitCanvas(runtime, executor);
  const { instance, runtimeInfo, session } = runtime;
  if (runtimeInfo?.constructorFunction && instance.exports[runtimeInfo.constructorFunction]) await session.call(instance.exports[runtimeInfo.constructorFunction]);
  else instance.exports.__wasm_call_ctors?.();
  const entryName = runtimeInfo?.entryPoint;
  const entry = entryName && instance.exports[entryName] || Object.entries(instance.exports).find(([name, value]) => typeof value === 'function' && !name.startsWith('__'))?.[1];
  if (!entry) throw new Error('В программе не найден алгоритм для запуска.');
  if (runtimeInfo?.entryIsCoroutine) await session.call(entry, [], runtimeInfo.entryReturnType || 'void');
  else entry();
  if (runtimeInfo?.destructorFunction && instance.exports[runtimeInfo.destructorFunction]) await session.call(instance.exports[runtimeInfo.destructorFunction]);
  else instance.exports.__wasm_call_dtors?.();
  emitCanvas(runtime, executor);
  post('done');
  session.finish();
}

self.onmessage = event => {
  if (event.data?.type === 'robot-edit') {
    if (event.data.channel === activeChannel && activeExecutor === 'robot') {
      if (event.data.event?.type === 'robot-resize') {
        activeRuntime?.robotModule?.__setRobotState?.(event.data.event.state);
        drawRobot(activeRuntime?.robotModule, true);
      } else editRobot(event.data.event || {});
    }
    return;
  }
  if (event.data?.type === 'robot-view') {
    if (event.data.channel !== activeChannel || activeExecutor !== 'robot') return;
    const view = event.data.view || {};
    robotView = {
      zoom: Math.max(1, Math.min(24, Number(view.zoom) || 1)),
      panX: Math.max(-10000, Math.min(10000, Number(view.panX) || 0)),
      panY: Math.max(-10000, Math.min(10000, Number(view.panY) || 0)),
    };
    drawRobot(activeRuntime?.robotModule, true);
    return;
  }
  if (event.data?.type === 'drawer-control') {
    if (event.data.channel !== activeChannel || activeExecutor !== 'drawer') return;
    forceNextCanvasFrame = true;
    if (event.data.command === 'zoom-in') activeRuntime?.drawerModule?.__zoomDrawerView?.(1.25);
    else if (event.data.command === 'zoom-out') activeRuntime?.drawerModule?.__zoomDrawerView?.(0.8);
    else if (event.data.command === 'fit') activeRuntime?.drawerModule?.__fitDrawerView?.();
    return;
  }
  if (event.data?.type === 'turtle-control') {
    if (event.data.channel !== activeChannel || activeExecutor !== 'turtle') return;
    forceNextCanvasFrame = true;
    if (event.data.command === 'zoom-in') activeRuntime?.turtleModule?.__zoomTurtleView?.(1.25);
    else if (event.data.command === 'zoom-out') activeRuntime?.turtleModule?.__zoomTurtleView?.(0.8);
    else if (event.data.command === 'fit') activeRuntime?.turtleModule?.__fitTurtleView?.();
    return;
  }
  if (event.data?.type === 'painter-control') {
    if (event.data.channel !== activeChannel || activeExecutor !== 'painter') return;
    forceNextCanvasFrame = true;
    if (event.data.command === 'zoom-in') activeRuntime?.painterModule?.__zoomPainterView?.(1.25, canvasWidth / 2, canvasHeight / 2);
    else if (event.data.command === 'zoom-out') activeRuntime?.painterModule?.__zoomPainterView?.(0.8, canvasWidth / 2, canvasHeight / 2);
    else if (event.data.command === 'fit') activeRuntime?.painterModule?.__fitPainterView?.();
    sendCanvas('painter', true);
    return;
  }
  if (event.data?.type === 'input-event') {
    forceNextCanvasFrame = true;
    dispatchInput(event.data.event);
    return;
  }
  if (event.data?.type === 'stop') {
    executionSession?.stop();
    post('done');
    return;
  }
  if (event.data?.type !== 'run') return;
  run(event.data).catch(error => {
    post('error', { text: String(error?.message || error).slice(0, 4000) });
    executionSession?.finish();
  });
};
