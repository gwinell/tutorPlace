import test from 'node:test';
import assert from 'node:assert/strict';
import {courseProgressForStudent} from '../lib/student-progress.ts';
import {hasUnreadNotifications,markNotificationsRead} from '../lib/notifications.ts';
import {clearFeedbackAfterSuccessfulReview} from '../lib/review-feedback.ts';
import {canSubmitAssignmentResponse} from '../lib/assignment-permissions.ts';
import {trapDrawerTab} from '../lib/mobile-drawer.ts';

test('teacher progress includes only courses and topics available to the student',()=>{
 const topics=[
  {id:'root-a',course_id:'course-a',title:'Course A',description:'',format:'md'},
  {id:'sub-a',course_id:'course-a',parent_topic_id:'root-a',title:'Subtopic A',description:'',format:'md'},
  {id:'root-b',course_id:'course-b',title:'Course B',description:'',format:'md'},
  {id:'locked',course_id:'course-a',title:'Locked',description:'',format:'md'},
 ];
 const assignments=[
  {id:'task-a',topic_id:'root-a',title:'A',kind:'text',prompt:''},
  {id:'task-sub',topic_id:'sub-a',title:'Sub',kind:'text',prompt:''},
  {id:'task-b',topic_id:'root-b',title:'B',kind:'text',prompt:''},
  {id:'task-locked',topic_id:'locked',title:'Locked',kind:'text',prompt:''},
 ];
 const submissions=[{id:'submission-a',assignment_id:'task-a',student_id:'student',content:'',result:'{"status":"passed"}',created_at:'2026-01-01'}];
 const progress=courseProgressForStudent('student',topics,assignments,[],submissions,[{student_id:'student',course_id:'course-a'}],[{student_id:'student',topic_id:'root-a'},{student_id:'student',topic_id:'root-b'}]);
 assert.equal(progress.total,2);
 assert.equal(progress.passed,1);
 assert.equal(progress.percent,50);
 assert.deepEqual(progress.per.map(item=>item.topic.id),['root-a','sub-a']);
});

test('teacher progress counts only lesson-linked assignments belonging to each student',()=>{
 const topics=[{id:'topic',course_id:'course',title:'Shared topic',description:'',format:'md'}];
 const assignments=[
  {id:'shared',topic_id:'topic',title:'Shared',kind:'text',prompt:''},
  {id:'student-a-task',topic_id:'topic',lesson_id:'lesson-a',title:'A only',kind:'text',prompt:''},
  {id:'unlinked-task',topic_id:'topic',lesson_id:'lesson-unlinked',title:'Unlinked',kind:'text',prompt:''},
  {id:'dangling-task',topic_id:'topic',lesson_id:'missing-lesson',title:'Dangling',kind:'text',prompt:''},
 ];
 const lessons=[
  {id:'lesson-a',student_id:'student-a'},
  {id:'lesson-b',student_id:'student-b'},
  {id:'lesson-unlinked',student_id:null},
 ];
 const submissions=[
  {id:'a-shared',assignment_id:'shared',student_id:'student-a',content:'',result:'{"status":"passed"}',created_at:'2026-01-01'},
  {id:'a-owned',assignment_id:'student-a-task',student_id:'student-a',content:'',result:'{"status":"passed"}',created_at:'2026-01-02'},
  {id:'a-unlinked',assignment_id:'unlinked-task',student_id:'student-a',content:'',result:'{"status":"passed"}',created_at:'2026-01-03'},
  {id:'a-dangling',assignment_id:'dangling-task',student_id:'student-a',content:'',result:'{"status":"passed"}',created_at:'2026-01-04'},
  {id:'b-shared',assignment_id:'shared',student_id:'student-b',content:'',result:'{"status":"passed"}',created_at:'2026-01-01'},
  {id:'b-other-owned',assignment_id:'student-a-task',student_id:'student-b',content:'',result:'{"status":"passed"}',created_at:'2026-01-02'},
  {id:'b-unlinked',assignment_id:'unlinked-task',student_id:'student-b',content:'',result:'{"status":"passed"}',created_at:'2026-01-03'},
  {id:'b-dangling',assignment_id:'dangling-task',student_id:'student-b',content:'',result:'{"status":"passed"}',created_at:'2026-01-04'},
 ];
 const enrollments=[{student_id:'student-a',course_id:'course'},{student_id:'student-b',course_id:'course'}];
 const access=[{student_id:'student-a',topic_id:'topic'},{student_id:'student-b',topic_id:'topic'}];

 const studentA=courseProgressForStudent('student-a',topics,assignments,lessons,submissions,enrollments,access);
 const studentB=courseProgressForStudent('student-b',topics,assignments,lessons,submissions,enrollments,access);

 assert.deepEqual({total:studentA.total,passed:studentA.passed,percent:studentA.percent},{total:2,passed:2,percent:100});
 assert.deepEqual({total:studentB.total,passed:studentB.passed,percent:studentB.percent},{total:1,passed:1,percent:100});
});

test('notification dot clears after opening and marking notifications read',()=>{
 const notifications=[
  {id:'unread',title:'Unread',body:'',created_at:'',read:0},
  {id:'read',title:'Read',body:'',created_at:'',read:1},
 ];
 assert.equal(hasUnreadNotifications(notifications),true);
 const updated=markNotificationsRead(notifications);
 assert.equal(hasUnreadNotifications(updated),false);
 assert.equal(updated[0].read,1);
 assert.equal(updated[1],notifications[1]);
});

test('review feedback clears only after successful submission',async()=>{
 let clears=0;
 assert.equal(await clearFeedbackAfterSuccessfulReview(async()=>false,()=>{clears++;}),false);
 assert.equal(clears,0);
 assert.equal(await clearFeedbackAfterSuccessfulReview(async()=>true,()=>{clears++;}),true);
 assert.equal(clears,1);
 await assert.rejects(clearFeedbackAfterSuccessfulReview(async()=>{throw new Error('network');},()=>{clears++;}));
 assert.equal(clears,1);
});

test('only students with a prompt can submit an assignment response',()=>{
 assert.equal(canSubmitAssignmentResponse('teacher','Solve this'),false);
 assert.equal(canSubmitAssignmentResponse('student','   '),false);
 assert.equal(canSubmitAssignmentResponse('student','Solve this'),true);
});

test('mobile drawer keeps Tab and Shift+Tab inside its focusable controls',()=>{
 const focused:string[]=[];
 const first={focus:()=>focused.push('first')};
 const last={focus:()=>focused.push('last')};
 const makeEvent=(shiftKey=false)=>({key:'Tab',shiftKey,prevented:false,preventDefault(){this.prevented=true;}});
 const backward=makeEvent(true);
 assert.equal(trapDrawerTab(backward,first,[first,last]),true);
 assert.equal(backward.prevented,true);
 assert.deepEqual(focused,['last']);
 const forward=makeEvent();
 assert.equal(trapDrawerTab(forward,last,[first,last]),true);
 assert.deepEqual(focused,['last','first']);
 const empty=makeEvent();
 assert.equal(trapDrawerTab(empty,null,[]),true);
 assert.equal(empty.prevented,true);
});
