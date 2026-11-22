import { apiResponse, json } from '@/lib/api-response';
import { db } from '@/lib/server';

type TutorRow = { id: string; name: string; headline: string; bio: string; subjects_json: string; experience: string; qualification: string; portrait_url: string | null; price_per_lesson: number };

export const GET = (request: Request) => apiResponse(request, async () => {
  const url = new URL(request.url);
  const subject = (url.searchParams.get('subject') || '').trim().toLocaleLowerCase('ru');
  const query = (url.searchParams.get('q') || '').trim().toLocaleLowerCase('ru');
  const rows = (await db().prepare(`
    SELECT u.id,u.name,p.headline,p.bio,p.subjects_json,p.experience,p.qualification,p.portrait_url,p.price_per_lesson
    FROM tutor_profiles p JOIN users u ON u.id=p.tutor_id
    WHERE p.published=1 AND p.approved=1 AND u.registration_status='active'
    ORDER BY u.name COLLATE NOCASE
  `).all<TutorRow>()).results;
  const tutors = rows.flatMap(row => {
    let subjects: string[] = [];
    try { const value: unknown = JSON.parse(row.subjects_json); if (Array.isArray(value)) subjects = value.filter((item): item is string => typeof item === 'string'); } catch { /* Bad profile JSON is omitted, not fatal to the directory. */ }
    const haystack = `${row.name} ${row.headline} ${row.bio} ${subjects.join(' ')}`.toLocaleLowerCase('ru');
    if ((subject && !subjects.some(item => item.toLocaleLowerCase('ru') === subject)) || (query && !haystack.includes(query))) return [];
    return [{ id: row.id, name: row.name, headline: row.headline, bio: row.bio, subjects, experience: row.experience, qualification: row.qualification, portrait_url: row.portrait_url, price_per_lesson: row.price_per_lesson }];
  });
  const subjects = [...new Set(rows.flatMap(row => { try { const value: unknown = JSON.parse(row.subjects_json); return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []; } catch { return []; } }))].sort((a,b) => a.localeCompare(b,'ru'));
  return json({ tutors, subjects });
});
