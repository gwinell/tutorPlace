import { readFileSync, writeFileSync } from 'node:fs';

const [manifestPath, assignmentsPath, outputPath] = process.argv.slice(2);
if (!manifestPath || !assignmentsPath || !outputPath) {
  console.error('Usage: node scripts/generate-python-course-seed.mjs <manifest.json> <assignments.json> <output.sql>');
  process.exit(64);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const exported = JSON.parse(readFileSync(assignmentsPath, 'utf8'));
const source = manifest.source;
if (source?.repository !== 'gwinell/proglang-courses' || source?.ref !== 'codetogether/python-course') {
  throw new Error('Python course manifest must reference gwinell/proglang-courses@codetogether/python-course.');
}
if (exported.source_repo !== source.repository || exported.source_branch !== source.ref) {
  throw new Error('Assignment export and course manifest must reference the same repository branch.');
}

const sqlString = value => {
  const text = String(value ?? '');
  if (text.includes('\0')) throw new Error('Seed data cannot contain NUL characters.');
  return `'${text.replaceAll("'", "''")}'`;
};
const assignmentGroups = new Map();
for (const theme of exported.topics ?? []) {
  for (const subtopic of theme.subtopics ?? []) {
    if (assignmentGroups.has(subtopic.path)) throw new Error(`Duplicate assignment source path: ${subtopic.path}`);
    assignmentGroups.set(subtopic.path, { themeTitle: theme.title, subtopic });
  }
}

const topicRows = [];
const assignmentRows = [];
const themeTitles = new Set();
const topicIds = new Set();
for (const [themePosition, theme] of manifest.themes.entries()) {
  if (!theme.id || !theme.title || themeTitles.has(theme.title) || topicIds.has(theme.id)) throw new Error(`Invalid or duplicate theme: ${theme.title}`);
  themeTitles.add(theme.title);
  topicIds.add(theme.id);
  topicRows.push({
    id: theme.id,
    parentId: null,
    courseId: manifest.course.id,
    title: theme.title,
    description: '',
    content: '',
    format: 'md',
    githubUrl: null,
    position: themePosition,
  });
  for (const [subtopicPosition, subtopic] of theme.subtopics.entries()) {
    if (!subtopic.id || !subtopic.path || topicIds.has(subtopic.id)) throw new Error(`Invalid or duplicate subtopic: ${subtopic.path}`);
    topicIds.add(subtopic.id);
    const file = subtopic.path.split('/').map(encodeURIComponent).join('/');
    topicRows.push({
      id: subtopic.id,
      parentId: theme.id,
      courseId: manifest.course.id,
      title: subtopic.title,
      description: '',
      content: '',
      format: subtopic.format,
      githubUrl: `https://github.com/${source.repository}/blob/${source.ref}/${file}`,
      position: subtopicPosition,
    });
    const exportedGroup = assignmentGroups.get(subtopic.path);
    if (!exportedGroup) throw new Error(`Assignment export is missing ${subtopic.path}`);
    if (exportedGroup.themeTitle !== theme.title || exportedGroup.subtopic.title !== subtopic.title) throw new Error(`Assignment export theme/subtopic mismatch for ${subtopic.path}`);
    const exportedSubtopic = exportedGroup.subtopic;
    for (const assignment of exportedSubtopic.assignments ?? []) {
      if (!assignment.id || !assignment.title || !assignment.prompt || !assignment.source_path?.startsWith('python/')) {
        throw new Error(`Invalid assignment in ${subtopic.path}`);
      }
      if (assignment.prompt.length > 20000) throw new Error(`Assignment prompt is too long: ${assignment.id}`);
      if (assignment.prompt.split('**Задача.**').length !== 2 || assignment.prompt.split('**Ожидаемый результат.**').length !== 2) {
        throw new Error(`Assignment prompt must contain exactly one task and expected-result section: ${assignment.id}`);
      }
      if (!['code', 'text', 'quiz'].includes(assignment.kind)) throw new Error(`Unsupported assignment kind: ${assignment.kind}`);
      assignmentRows.push({ ...assignment, topicId: subtopic.id });
    }
  }
}

const expectedPaths = new Set(manifest.themes.flatMap(theme => theme.subtopics.map(subtopic => subtopic.path)));
for (const path of assignmentGroups.keys()) if (!expectedPaths.has(path)) throw new Error(`Assignment export contains an unlisted subtopic: ${path}`);
if (new Set(assignmentRows.map(assignment => assignment.id)).size !== assignmentRows.length) throw new Error('Assignment IDs must be unique.');
if (exported.metadata?.counts?.assignments !== assignmentRows.length) throw new Error('Assignment count does not match the export metadata.');

const statements = [];
statements.push(`INSERT OR IGNORE INTO courses (id,title,description,position) SELECT ${[
  sqlString(manifest.course.id), sqlString(manifest.course.title), sqlString(manifest.course.description),
].join(',')}, COALESCE(MAX(position),-1)+1 FROM courses;`);
for (const topic of topicRows.filter(row => row.parentId === null)) {
  statements.push(`INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES (${[
    sqlString(topic.id), sqlString(topic.courseId), 'NULL', sqlString(topic.title), sqlString(topic.description), sqlString(topic.content), sqlString(topic.format), 'NULL', 'NULL', String(topic.position),
  ].join(',')});`);
}
for (const topic of topicRows.filter(row => row.parentId !== null)) {
  statements.push(`INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES (${[
    sqlString(topic.id), sqlString(topic.courseId), sqlString(topic.parentId), sqlString(topic.title), sqlString(topic.description), sqlString(topic.content), sqlString(topic.format), 'NULL', sqlString(topic.githubUrl), String(topic.position),
  ].join(',')});`);
}
for (const assignment of assignmentRows) {
  statements.push(`INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES (${[
    sqlString(assignment.id), sqlString(assignment.topicId), 'NULL', 'NULL', sqlString(assignment.title), sqlString(assignment.kind), sqlString(assignment.prompt), 'NULL', 'NULL', 'NULL',
  ].join(',')});`);
}
writeFileSync(outputPath, `${statements.join('\n--> statement-breakpoint\n')}\n`, 'utf8');
console.log(`Generated ${outputPath}: ${manifest.themes.length} themes, ${topicRows.length - manifest.themes.length} subtopics, ${assignmentRows.length} assignments.`);
