'use client';

import {useState} from 'react';
import {ArrowLeft,BarChart3,Check,ChevronDown,FileCode2,FolderOpen,MessageSquare} from 'lucide-react';
import {Button,Empty,Tag} from './site-ui';
import {Assignment,Submission,User,dateLabel,resultStatus} from '@/lib/domain';

type Props={
 submissions:Submission[];
 assignments:Assignment[];
 students:User[];
 mode:'review'|'history';
 busy?:boolean;
 onReview?:(submission:Submission,status:'passed'|'needs_work',feedback:string)=>Promise<void>;
};

function statusLabel(status:string){
 if(status==='passed')return {label:'Выполнено',color:'green' as const};
 if(status==='pending')return {label:'На проверке',color:'amber' as const};
 if(status==='needs_work')return {label:'На доработке',color:'red' as const};
 if(status==='failed')return {label:'Есть ошибки',color:'red' as const};
 return {label:'Ответ отправлен',color:'neutral' as const};
}

export default function StudentWorkFolders({submissions,assignments,students,mode,busy=false,onReview}:Props){
 const [feedback,setFeedback]=useState<Record<string,string>>({});
 const studentById=new Map(students.map(student=>[student.id,student]));
 const grouped=new Map<string,Submission[]>();
 for(const submission of submissions){
  const current=grouped.get(submission.student_id)||[];
  current.push(submission);
  grouped.set(submission.student_id,current);
 }
 const folders=[...grouped.entries()].map(([studentId,items])=>({
  student:studentById.get(studentId),
  studentId,
  items:items.sort((a,b)=>b.created_at.localeCompare(a.created_at)),
 })).sort((a,b)=>(a.student?.name||'').localeCompare(b.student?.name||'','ru'));

 if(!submissions.length)return <Empty icon={mode==='review'?FileCode2:BarChart3} title={mode==='review'?'Пока нет работ на проверку':'Пока нет отправленных работ'}>{mode==='review'?'Когда ученик отправит задание, оно появится в его папке.':'Ответы и результаты будут собраны по папкам учеников.'}</Empty>;

 return <div className={'student-work-folders '+(mode==='review'?'review-queue':'')}>
  {folders.map((folder,index)=><details className="student-work-folder" key={folder.studentId} open={index===0}>
   <summary>
    <span className="student-work-folder-avatar"><FolderOpen size={19}/></span>
    <span className="student-work-folder-copy"><strong>{folder.student?.name||'Ученик'}</strong><small>{mode==='review'?`${folder.items.length} ${folder.items.length===1?'работа':'работы'} на проверку`:`${folder.items.length} ${folder.items.length===1?'отправленная работа':'отправленных работ'}`}</small></span>
    <span className="student-work-folder-count">{folder.items.length}</span>
    <ChevronDown className="student-work-folder-chevron" size={18}/>
   </summary>
   <div className="student-work-folder-items">
    {folder.items.map(submission=>{
     const assignment=assignments.find(item=>item.id===submission.assignment_id);
     const status=resultStatus(submission);
     const badge=statusLabel(status);
     return <article className="student-work-item result-card" key={submission.id}>
      <div className="student-work-item-heading">
       <div><span className="eyebrow"><FileCode2 size={13}/>{assignment?.kind==='code'?'Код':assignment?.kind==='quiz'?'Квиз':'Ответ'}</span><h3>{assignment?.title||'Задание'}</h3><p>{dateLabel(submission.created_at,{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})}{assignment?.lesson_id?' · Привязано к уроку':''}</p></div>
       <Tag color={badge.color}>{badge.label}</Tag>
      </div>
      {mode==='review'&&assignment?.prompt&&<p className="review-prompt">{assignment.prompt}</p>}
      <pre className={assignment?.kind==='code'?'submitted-code':''}>{submission.content}</pre>
      {mode==='history'&&submission.feedback&&<div className="feedback-box"><strong><MessageSquare size={13}/>Комментарий репетитора</strong><p>{submission.feedback}</p>{submission.feedback_at&&<small>{dateLabel(submission.feedback_at,{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})}</small>}</div>}
      {mode==='review'&&status==='pending'&&onReview&&<div className="review-actions"><textarea placeholder="Комментарий ученику: что получилось, что поправить…" value={feedback[submission.id]||''} onChange={event=>setFeedback(current=>({...current,[submission.id]:event.target.value}))} maxLength={2000} aria-label="Комментарий к работе"/><div className="review-actions-row"><Button className="button-small button-outline" disabled={busy||!(feedback[submission.id]||'').trim()} onClick={async()=>{await onReview(submission,'needs_work',feedback[submission.id]||'');setFeedback(current=>({...current,[submission.id]:''}));}}><ArrowLeft size={15}/>Вернуть на доработку</Button><Button className="button-small" loading={busy} onClick={async()=>{await onReview(submission,'passed',feedback[submission.id]||'');setFeedback(current=>({...current,[submission.id]:''}));}}><Check size={15}/>Принять работу</Button></div></div>}
     </article>;
    })}
   </div>
  </details>)}
 </div>;
}
