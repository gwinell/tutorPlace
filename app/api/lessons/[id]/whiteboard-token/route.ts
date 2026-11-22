import { apiResponse, json } from '@/lib/api-response';
import { authorizedLesson } from '@/lib/lesson-access';
import { signJwt } from '@/lib/jwt';
import { requireValue, secrets } from '@/lib/server';
type Context={params:Promise<{id:string}>};
export const GET=(request:Request,{params}:Context)=>apiResponse(request,async()=>{const {id}=await params;const {user}=await authorizedLesson(request,id);const base=String(secrets.WHITEBOPHIR_URL||'');const secret=String(secrets.WHITEBOPHIR_AUTH_SECRET||'');requireValue(base&&secret,'Локальная Whitebophir не настроена. См. docs/LOCAL-LESSON-SERVICES.md.',503);const boardName=`lesson-${id.replace(/[^a-zA-Z0-9_-]/g,'')}`;const token=await signJwt({board:boardName,username:user.name,permissions:user.role==='teacher'?['read','write','moderate']:['read','write'],exp:Math.floor(Date.now()/1000)+3600},secret);const url=new URL(`/b/${encodeURIComponent(boardName)}`,base);url.searchParams.set('token',token);return json({url:url.toString(),boardName});});
