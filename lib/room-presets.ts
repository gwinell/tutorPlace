import { PYTHON_START, TEACHER_START } from './domain';

export type RoomLanguage = 'python' | 'lua' | 'kumir';
export type RoomFile = 'student' | 'teacher';

export const ROOM_STARTERS: Record<RoomLanguage, Record<RoomFile, string>> = {
  python: { student: PYTHON_START, teacher: TEACHER_START },
  lua: {
    student: '-- Твоя первая программа\nlocal name = io.read()\nprint("Привет, " .. name .. "! Давай программировать вместе.")\n',
    teacher: '-- Разберём решение вместе\nlocal function greet(name)\n    return "Привет, " .. name .. "!"\nend\n\nprint(greet("мир"))\n',
  },
  kumir: {
    student: 'использовать Черепаха\nалг\nнач\n    вперед(100)\n    влево(90)\n    вперед(100)\n    влево(90)\n    вперед(100)\n    влево(90)\n    вперед(100)\n    влево(90)\nкон\n',
    teacher: 'использовать Робот\nалг квадрат\nнач\n    закрасить\n    вправо\n    закрасить\n    вниз\n    закрасить\n    влево\n    закрасить\nкон\n',
  },
};

export function starterLanguage(code: string, file: RoomFile): RoomLanguage | null {
  for (const language of ['python', 'lua', 'kumir'] as const) {
    if (code === ROOM_STARTERS[language][file]) return language;
  }
  return null;
}
