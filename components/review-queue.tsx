'use client';

import {Assignment,Submission,User} from '@/lib/domain';
import StudentWorkFolders from './student-work-folders';

export default function ReviewQueue({submissions,assignments,students,busy,onReview}:{submissions:Submission[];assignments:Assignment[];students:User[];busy:boolean;onReview:(submission:Submission,status:'passed'|'needs_work',feedback:string)=>Promise<boolean>}){
 return <StudentWorkFolders submissions={submissions} assignments={assignments} students={students} mode="review" busy={busy} onReview={onReview}/>;
}
