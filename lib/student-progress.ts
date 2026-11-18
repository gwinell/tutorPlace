import type {Assignment, CourseEnrollment, Submission, Topic, TopicAccess} from './domain.ts';
import {resultStatus} from './domain.ts';

type LessonOwnership = {id: string; student_id?: string | null};

export function accessibleTopicIdsForStudent(
  studentId: string,
  topics: Topic[],
  courseEnrollments: CourseEnrollment[],
  topicAccess: TopicAccess[],
) {
  const enrolledCourseIds = new Set(courseEnrollments
    .filter(enrollment => enrollment.student_id === studentId)
    .map(enrollment => enrollment.course_id));
  const accessibleRootTopicIds = new Set(topicAccess
    .filter(access => access.student_id === studentId)
    .map(access => access.topic_id));

  return new Set(topics
    .filter(topic => enrolledCourseIds.has(topic.course_id)
      && accessibleRootTopicIds.has(topic.parent_topic_id || topic.id))
    .map(topic => topic.id));
}

export function courseProgressForStudent(
  studentId: string,
  topics: Topic[],
  assignments: Assignment[],
  lessons: LessonOwnership[],
  submissions: Submission[],
  courseEnrollments: CourseEnrollment[],
  topicAccess: TopicAccess[],
) {
  const accessibleTopicIds = accessibleTopicIdsForStudent(studentId, topics, courseEnrollments, topicAccess);
  const lessonOwners = new Map(lessons.map(lesson => [lesson.id, lesson.student_id]));
  const latest = new Map<string, Submission>();
  for (const submission of submissions) {
    if (submission.student_id !== studentId) continue;
    const previous = latest.get(submission.assignment_id);
    if (!previous || submission.created_at > previous.created_at) latest.set(submission.assignment_id, submission);
  }

  const per = topics.filter(topic => accessibleTopicIds.has(topic.id)).map(topic => {
    const tasks = assignments.filter(assignment => assignment.topic_id === topic.id
      && (assignment.lesson_id == null || lessonOwners.get(assignment.lesson_id) === studentId));
    const passed = tasks.reduce((count, assignment) => count + (resultStatus(latest.get(assignment.id)) === 'passed' ? 1 : 0), 0);
    return {topic, total: tasks.length, passed};
  });
  const total = per.reduce((count, topic) => count + topic.total, 0);
  const passed = per.reduce((count, topic) => count + topic.passed, 0);
  return {per, total, passed, percent: total ? Math.round(passed / total * 100) : 0};
}
