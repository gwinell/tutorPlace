import type {Role} from './domain.ts';

export function canSubmitAssignmentResponse(role: Role, prompt: string | undefined) {
  return role === 'student' && Boolean(prompt?.trim());
}
