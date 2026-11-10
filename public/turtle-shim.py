"""Browser-backed subset of Python's turtle module for Pyodide."""
import json as _json
import math as _math
import itertools as _itertools
from ctbridge import emit as _emit

_ids = _itertools.count(1)
_key_handlers = {}
_key_release_handlers = {}
_click_handlers = {}
_timer_handlers = {}
_key_aliases = {"arrowleft": "left", "arrowright": "right", "arrowup": "up", "arrowdown": "down", " ": "space", "enter": "return", "escape": "escape"}
_color_mode = 1


def _event(op, **data):
    _emit({"type": "turtle", "event": {"op": op, **data}})


def _reset():
    global _default_turtle
    _key_handlers.clear()
    _key_release_handlers.clear()
    _click_handlers.clear()
    _timer_handlers.clear()
    _default_turtle = _TurtleClass(visible=False)
    _default_turtle.visible = True


def _dispatch(payload):
    event = _json.loads(payload) if isinstance(payload, str) else payload
    kind = event.get("type")
    if kind == "key":
        handlers = _key_release_handlers if event.get("phase") == "keyup" else _key_handlers
        key = str(event.get("key", "")).lower()
        callback = handlers.get(_key_aliases.get(key, key))
        if callback: callback()
    elif kind == "click":
        for callback in list(_click_handlers.values()): callback(float(event.get("x", 0)), float(event.get("y", 0)))
    elif kind == "timer":
        callback = _timer_handlers.pop(str(event.get("id", "")), None)
        if callback: callback()


def _color(value):
    if isinstance(value, str): return value
    if isinstance(value, (tuple, list)) and len(value) >= 3:
        channels = [round(max(0, min(_color_mode, float(component))) * 255 / _color_mode) for component in value[:3]]
        return "rgb(%d,%d,%d)" % tuple(channels)
    return "black"


class Turtle:
    def __init__(self, shape="classic", undobuffersize=1000, visible=True):
        self._id = str(next(_ids))
        self.x, self.y, self.angle = 0.0, 0.0, 0.0
        self.down, self.visible = True, visible
        self.pen_color, self.fill_color, self.width_value = "black", "black", 1.0
        self.fill_points = None
        self.shape_name = shape
        if visible: self._emit_cursor()

    def _emit_cursor(self):
        _event("cursor", id=self._id, x=self.x, y=self.y, angle=self.angle, visible=self.visible, color=self.pen_color, shape=self.shape_name)

    def _move(self, x, y):
        x, y = float(x), float(y)
        if self.fill_points is not None: self.fill_points.append([x, y])
        if self.down: _event("line", x1=self.x, y1=self.y, x2=x, y2=y, color=self.pen_color, width=self.width_value)
        self.x, self.y = x, y
        self._emit_cursor()

    def forward(self, distance):
        radians = _math.radians(self.angle)
        self._move(self.x + _math.cos(radians) * float(distance), self.y + _math.sin(radians) * float(distance))
    fd = forward
    def backward(self, distance): self.forward(-float(distance))
    bk = backward
    back = backward
    def right(self, angle): self.angle = (self.angle - float(angle)) % 360; self._emit_cursor()
    rt = right
    def left(self, angle): self.angle = (self.angle + float(angle)) % 360; self._emit_cursor()
    lt = left
    def goto(self, x, y=None):
        if y is None: x, y = x
        self._move(x, y)
    setpos = goto
    setposition = goto
    def setx(self, x): self._move(x, self.y)
    def sety(self, y): self._move(self.x, y)
    def home(self): self.setheading(0); self.goto(0, 0)
    def setheading(self, angle): self.angle = float(angle) % 360; self._emit_cursor()
    seth = setheading
    def heading(self): return self.angle
    def pos(self): return (self.x, self.y)
    position = pos
    def xcor(self): return self.x
    def ycor(self): return self.y
    def distance(self, x, y=None):
        if y is None: x, y = x
        return _math.hypot(float(x) - self.x, float(y) - self.y)
    def towards(self, x, y=None):
        if y is None: x, y = x
        return _math.degrees(_math.atan2(float(y) - self.y, float(x) - self.x)) % 360
    def penup(self): self.down = False
    pu = up = penup
    def pendown(self): self.down = True
    pd = down = pendown
    def isdown(self): return self.down
    def pensize(self, width=None):
        if width is None: return self.width_value
        self.width_value = max(0.1, float(width))
    width = pensize
    def pencolor(self, *args):
        if not args: return self.pen_color
        self.pen_color = _color(args[0] if len(args) == 1 else args)
    def fillcolor(self, *args):
        if not args: return self.fill_color
        self.fill_color = _color(args[0] if len(args) == 1 else args)
    def color(self, *args):
        if not args: return (self.pen_color, self.fill_color)
        if len(args) == 1: self.pen_color = self.fill_color = _color(args[0])
        else: self.pen_color, self.fill_color = _color(args[0]), _color(args[1])
    def speed(self, value=None): return 0 if value is None else value
    def begin_fill(self): self.fill_points = [[self.x, self.y]]
    def end_fill(self):
        if self.fill_points and len(self.fill_points) > 2: _event("polygon", points=self.fill_points, color=self.fill_color)
        self.fill_points = None
    def circle(self, radius, extent=None, steps=None):
        radius = float(radius); arc = 360 if extent is None else float(extent)
        segments = max(2, min(720, int(steps or abs(arc) / 6) or 2))
        if radius == 0: return
        sign = 1 if radius > 0 else -1
        center_x = self.x - _math.sin(_math.radians(self.angle)) * radius
        center_y = self.y + _math.cos(_math.radians(self.angle)) * radius
        start = _math.atan2(self.y - center_y, self.x - center_x)
        for index in range(1, segments + 1):
            angle = start + _math.radians(arc * index / segments) * sign
            self._move(center_x + abs(radius) * _math.cos(angle), center_y + abs(radius) * _math.sin(angle))
        self.angle = (self.angle + arc * sign) % 360
        self._emit_cursor()
    def dot(self, size=None, *color): _event("dot", x=self.x, y=self.y, radius=max(1, float(size or max(self.width_value + 4, 2))), color=_color(color or self.pen_color))
    def clear(self): _event("clear")
    def reset(self):
        self.clear(); self.__init__()
    def hideturtle(self): self.visible = False; self._emit_cursor()
    ht = hideturtle
    def showturtle(self): self.visible = True; self._emit_cursor()
    st = showturtle
    def isvisible(self): return self.visible
    def shape(self, name=None):
        if name is not None: self.shape_name = str(name); self._emit_cursor()
        return self.shape_name
    def stamp(self): self._emit_cursor(); return self._id
    def clearstamp(self, stampid): self.clear()
    def clearstamps(self, n=None): self.clear()
    def undo(self): self.clear()
    def write(self, text, move=False, align="left", font=("Arial", 12, "normal")):
        _event("text", x=self.x, y=self.y, text=str(text), color=self.pen_color, size=int(font[1]) if len(font) > 1 else 12, align=align)
        if move: self.forward(len(str(text)) * 7)
    def onclick(self, fun, btn=1, add=None):
        key = "turtle:" + self._id
        if fun is None: _click_handlers.pop(key, None)
        else: _click_handlers[key] = fun
    def onrelease(self, fun, btn=1, add=None): return self.onclick(fun, btn, add)


_TurtleClass = Turtle
RawTurtle = Turtle
_default_turtle = _TurtleClass(visible=False)


class Screen:
    def _key_name(self, key):
        key = str(key).lower()
        return _key_aliases.get(key, key)
    def bgcolor(self, color=None):
        if color is not None: _event("background", color=_color(color))
        return "white" if color is None else color
    def clear(self): _event("clear")
    def reset(self): _reset()
    def mode(self, mode=None): return "standard" if mode is None else mode
    def colormode(self, mode=None):
        global _color_mode
        if mode is None: return _color_mode
        if float(mode) not in (1, 255): raise ValueError("colormode должен быть 1 или 255")
        _color_mode = int(mode)
        return None
    def setup(self, width=None, height=None, startx=None, starty=None): return None
    def screensize(self, canvwidth=None, canvheight=None, bg=None):
        if bg is not None: self.bgcolor(bg)
        return (600, 400)
    def title(self, title): return None
    def delay(self, delay=None): return 10 if delay is None else delay
    def tracer(self, n=None, delay=None): return 1 if n is None else n
    def update(self): return None
    def listen(self, x=None, y=None): return None
    def onkey(self, fun, key):
        key = self._key_name(key)
        if fun is None: _key_handlers.pop(key, None)
        else: _key_handlers[key] = fun
    onkeypress = onkey
    def onkeyrelease(self, fun, key):
        key = self._key_name(key)
        if fun is None: _key_release_handlers.pop(key, None)
        else: _key_release_handlers[key] = fun
    def onclick(self, fun, btn=1, add=None):
        if fun is None: _click_handlers.pop("screen", None)
        else: _click_handlers["screen"] = fun
    onscreenclick = onclick
    def ontimer(self, fun, t=0):
        timer_id = str(next(_ids)); _timer_handlers[timer_id] = fun
        _event("timer", id=timer_id, delay=max(0, int(t)))
    def mainloop(self): return None
    done = mainloop
    def exitonclick(self): self.onclick(lambda x, y: None)
    def bye(self): _reset()
    def setworldcoordinates(self, llx, lly, urx, ury):
        _event("world", llx=float(llx), lly=float(lly), urx=float(urx), ury=float(ury))
    def getshapes(self): return ["classic", "arrow", "turtle", "circle", "square", "triangle"]
    def getcanvas(self): return None


_screen = Screen()

def getscreen(): return _screen
def getturtle(): return _default_turtle

def _delegate(name):
    def call(*args, **kwargs): return getattr(_default_turtle, name)(*args, **kwargs)
    return call

for _name in ["forward", "backward", "right", "left", "goto", "setpos", "setposition", "setx", "sety", "home", "setheading", "heading", "pos", "position", "xcor", "ycor", "distance", "towards", "penup", "pendown", "isdown", "pensize", "width", "pencolor", "fillcolor", "color", "speed", "begin_fill", "end_fill", "circle", "dot", "clear", "reset", "hideturtle", "showturtle", "isvisible", "shape", "stamp", "clearstamp", "clearstamps", "undo", "write", "onclick", "onrelease"]:
    globals()[_name] = _delegate(_name)
for _name in ["bgcolor", "mode", "colormode", "setup", "screensize", "title", "delay", "tracer", "update", "listen", "onkey", "onkeypress", "onkeyrelease", "onclick", "onscreenclick", "ontimer", "mainloop", "done", "exitonclick", "bye", "setworldcoordinates", "getshapes", "getcanvas"]:
    globals()[_name] = (lambda name: (lambda *args, **kwargs: getattr(_screen, name)(*args, **kwargs)))(_name)
fd = forward
bk = back = backward
rt = right
lt = left
pu = up = penup
pd = down = pendown
ht = hideturtle
st = showturtle
Turtle = _TurtleClass
TurtleScreen = Screen
__all__ = [name for name in globals() if not name.startswith("_")]
