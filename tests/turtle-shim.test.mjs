import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

test('браузерный turtle shim рисует, заливает фигуры и принимает события экрана', () => {
  const source = readFileSync(new URL('../public/turtle-shim.py', import.meta.url), 'utf8');
  const program = String.raw`
import json, sys, types
events=[]
bridge=types.ModuleType('ctbridge')
bridge.emit=events.append
sys.modules['ctbridge']=bridge
module=types.ModuleType('turtle')
exec(compile(${JSON.stringify(source)}, 'turtle-shim.py', 'exec'), module.__dict__)
module.reset()
module.color('blue', 'orange')
module.begin_fill()
module.forward(100)
module.left(120)
module.forward(100)
module.left(120)
module.forward(100)
module.end_fill()
module.bgcolor('beige')
module.setworldcoordinates(-10, -10, 10, 10)
seen=[]
module.onkey(lambda: seen.append('left'), 'Left')
module._dispatch({'type':'key', 'key':'arrowleft'})
module.ontimer(lambda: seen.append('timer'), 0)
timer=[event['event']['id'] for event in events if event['event']['op']=='timer'][0]
module._dispatch({'type':'timer', 'id':timer})
print(json.dumps({'events':events, 'position':module.position(), 'seen':seen, 'shapes':module.getshapes()}))
`;
  const result = spawnSync('python3', ['-c', program], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout.trim());
  const events = output.events.map(item => item.event);
  assert.ok(events.some(event => event.op === 'line'));
  assert.ok(events.some(event => event.op === 'polygon' && event.color === 'orange'));
  assert.ok(events.some(event => event.op === 'background' && event.color === 'beige'));
  assert.ok(events.some(event => event.op === 'world'));
  assert.deepEqual(output.seen, ['left', 'timer']);
  assert.deepEqual(output.shapes, ['classic', 'arrow', 'turtle', 'circle', 'square', 'triangle']);
});
