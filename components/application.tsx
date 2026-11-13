'use client';
import {useState,useEffect,useCallback,lazy,Suspense,useSyncExternalStore} from 'react';
import { Check } from 'lucide-react';
import Marketing from './marketing';
import Login from './login';
import Booking from './booking';
const Platform=lazy(()=>import('./platform'));
import {api} from './site-ui';
import {setAnalyticsPrivate} from '@/lib/analytics-scope';
import {Role,User} from '@/lib/domain';
import {demoStudent,demoTeacher} from '@/lib/demo';

function subscribeLocation(listener:()=>void){window.addEventListener('popstate',listener);window.addEventListener('codetogether:navigate',listener);return()=>{window.removeEventListener('popstate',listener);window.removeEventListener('codetogether:navigate',listener);};}
function locationSnapshot(){return window.location.pathname+window.location.search;}
function serverLocationSnapshot(){return '/';}
function replaceLocation(path:string){history.replaceState(null,'',path);window.dispatchEvent(new Event('codetogether:navigate'));}
function subscribeTheme(listener:()=>void){window.addEventListener('storage',listener);window.addEventListener('codetogether:theme',listener);return()=>{window.removeEventListener('storage',listener);window.removeEventListener('codetogether:theme',listener);};}
function themeSnapshot(){return localStorage.getItem('ct-theme')==='dark';}
function serverThemeSnapshot(){return false;}

export default function Application(){
 const location=useSyncExternalStore(subscribeLocation,locationSnapshot,serverLocationSnapshot);
 const dark=useSyncExternalStore(subscribeTheme,themeSnapshot,serverThemeSnapshot);
 const params=new URLSearchParams(location.split('?')[1]||'');
 const requestedDemo=params.get('demo');
 const demoRole:Role|null=requestedDemo==='student'||requestedDemo==='teacher'?requestedDemo:null;
 const demo=demoRole!==null;
 const cabinetView=params.get('view')==='cabinet';
 const [user,setUser]=useState<User|null>(null),[view,setView]=useState('home'),[login,setLogin]=useState(false),[booking,setBooking]=useState(false),[toast,setToast]=useState(''),[refresh,setRefresh]=useState(0);
 const activeUser=demoRole==='student'?demoStudent:demoRole==='teacher'?demoTeacher:user;
 const platformVisible=demo||view==='platform';
 useEffect(()=>{if(demo)return;let active=true;void api<{user?:User}>('me').then(result=>{if(active&&result.user){setUser(result.user);if(cabinetView)setView('platform');}}).catch(()=>{});return()=>{active=false;};},[demo,cabinetView,location]);
 useEffect(()=>{setAnalyticsPrivate('application',demo||cabinetView||platformVisible||login||booking);},[demo,cabinetView,platformVisible,login,booking]);
 useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';},[dark]);
 useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(''),4500);return()=>clearTimeout(id);},[toast]);
 const toggle=()=>{localStorage.setItem('ct-theme',dark?'light':'dark');window.dispatchEvent(new Event('codetogether:theme'));};
 const openDemo=(role:Role)=>{setAnalyticsPrivate('application',true);setView('platform');setLogin(false);replaceLocation('?demo='+role);window.scrollTo(0,0);};
 const home=()=>{setAnalyticsPrivate('application',false);setView('home');replaceLocation('/');window.scrollTo(0,0);};
 const openLogin=()=>{setAnalyticsPrivate('application',true);if(activeUser)setView('platform');else setLogin(true);};
 const openBooking=()=>{setAnalyticsPrivate('application',true);setBooking(true);};
 const closeBooking=useCallback(()=>setBooking(false),[]);
 const closeLogin=useCallback(()=>setLogin(false),[]);
 async function logout(){if(!demo)await api('logout','POST');setUser(null);home();}
 return <>{!platformVisible?<Marketing book={openBooking} login={openLogin} dark={dark} toggle={toggle} openDemo={()=>openDemo('student')}/>:activeUser&&<Suspense fallback={<div className="empty-state">Открываем твоё пространство…</div>}><Platform key={demo?'demo-'+activeUser.role:activeUser.id} user={activeUser} demo={demo} dark={dark} toggle={toggle} home={home} logout={logout} notify={setToast} onUser={setUser} refresh={refresh}/></Suspense>}
 {login&&<Login onClose={closeLogin} onLogin={loggedIn=>{setUser(loggedIn);setView('platform');setLogin(false);replaceLocation('?view=cabinet');}} onDemo={openDemo}/>}
 {booking&&<Booking onClose={closeBooking} onBooked={()=>setRefresh(n=>n+1)}/>}
 {toast&&<div className="toast" role="status"><Check size={16}/>{toast}</div>}
 </>;
}
