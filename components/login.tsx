'use client';
import {useState} from 'react';
import { ArrowRight, BookOpen, LockKeyhole } from 'lucide-react';
import {Modal,Button,Brand,api} from './site-ui';
import {setAnalyticsPrivate} from '@/lib/analytics-scope';
import {User,Role} from '@/lib/domain';
export default function Login({onClose,onLogin,onDemo}:{onClose:()=>void;onLogin:(u:User)=>void;onDemo:(role:Role)=>void}){
const [login,setLogin]=useState(''),[password,setPassword]=useState(''),[loading,setLoading]=useState(false),[error,setError]=useState('');
async function submit(e:React.FormEvent){e.preventDefault();setLoading(true);setError('');try{const d=await api<{user:User}>('login','POST',{login,password});setAnalyticsPrivate('application',true);onLogin(d.user);}catch(e){setError((e as Error).message);}finally{setLoading(false);}}
return <Modal title="Вход в TutorPlace" onClose={onClose}><div style={{marginBottom:20}}><Brand/></div><span className="eyebrow">Для учеников, репетиторов и поддержки</span><h2>Войти в аккаунт</h2><p className="modal-description">Открой расписание, личные сообщения и материалы занятий.</p><form onSubmit={submit}><label className="field"><span>Логин</span><input className="ym-disable-keys" autoComplete="username" placeholder="Логин" value={login} onChange={e=>setLogin(e.target.value)} required/></label><label className="field"><span>Пароль</span><input className="ym-disable-keys" type="password" autoComplete="current-password" placeholder="Пароль" value={password} onChange={e=>setPassword(e.target.value)} required/></label>{error&&<div className="form-error" role="alert">{error}</div>}<Button type="submit" className="button-full" loading={loading}>Войти <ArrowRight size={17}/></Button></form><div className="info-box"><LockKeyhole size={16}/><span>Данные для входа выдаёт репетитор или администратор. Если не удаётся войти, обратись к ним за помощью.</span></div><div className="demo-divider">Посмотреть демоверсию</div><div className="demo-buttons"><Button className="button-outline" onClick={()=>{setAnalyticsPrivate('application',true);onDemo('student');}}><BookOpen size={15}/>Кабинет ученика</Button></div></Modal>;
}
