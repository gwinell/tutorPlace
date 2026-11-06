'use client';
import {useState,useEffect,useCallback,lazy,Suspense} from 'react';
import { Check } from 'lucide-react';
import Marketing from './marketing';
import Login from './login';
import Booking from './booking';
const Platform=lazy(()=>import('./platform'));
import {api} from './site-ui';
import {Role,User} from '@/lib/domain';
import {demoStudent,demoTeacher} from '@/lib/demo';
export default function Application(){
const [dark,setDark]=useState(false),[user,setUser]=useState<User|null>(null),[demo,setDemo]=useState(false),[view,setView]=useState('home'),[login,setLogin]=useState(false),[booking,setBooking]=useState(false),[toast,setToast]=useState(''),[refresh,setRefresh]=useState(0);
useEffect(()=>{setDark(localStorage.getItem('ct-theme')==='dark');const q=new URLSearchParams(window.location.search);const d=q.get('demo');if(d==='student'||d==='teacher'){setDemo(true);setUser(d==='student'?demoStudent:demoTeacher);setView('platform');}else api('me').then(d=>{if(d.user){setUser(d.user);if(q.get('view')==='cabinet')setView('platform');}}).catch(()=>{});},[]);
useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';},[dark]);
useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(''),4500);return()=>clearTimeout(id);},[toast]);
const toggle=()=>setDark(d=>{localStorage.setItem('ct-theme',d?'light':'dark');return !d;});
const openDemo=(role:Role)=>{setDemo(true);setUser(role==='student'?demoStudent:demoTeacher);setView('platform');setLogin(false);history.replaceState(null,'','?demo='+role);window.scrollTo(0,0);};
const home=()=>{setView('home');history.replaceState(null,'','/');window.scrollTo(0,0);};
const closeBooking=useCallback(()=>setBooking(false),[]);
const closeLogin=useCallback(()=>setLogin(false),[]);
async function logout(){if(!demo)await api('logout','POST');setUser(null);setDemo(false);home();}
return <>{view==='home'?<Marketing book={()=>setBooking(true)} login={()=>user?setView('platform'):setLogin(true)} dark={dark} toggle={toggle} openDemo={()=>openDemo('student')}/>:user&&<Suspense fallback={<div className="empty-state">Открываем твоё пространство…</div>}><Platform key={demo?'demo-'+user.role:user.id} user={user} demo={demo} dark={dark} toggle={toggle} home={home} logout={logout} notify={setToast} onUser={setUser} refresh={refresh}/></Suspense>}
{login&&<Login onClose={closeLogin} onLogin={u=>{setUser(u);setDemo(false);setView('platform');setLogin(false);history.replaceState(null,'','?view=cabinet');}} onDemo={openDemo}/>}
{booking&&<Booking onClose={closeBooking} onBooked={()=>{setRefresh(n=>n+1);}}/>}
{toast&&<div className="toast" role="status"><Check size={16}/>{toast}</div>}
</>;
}
