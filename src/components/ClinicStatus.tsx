'use client';
import {useEffect,useState} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {clinicStatus} from '@/lib/clinic-hours';
export function ClinicStatus(){
 const [status,setStatus]=useState<ReturnType<typeof clinicStatus>|null>(null),reduce=useReducedMotion();
 useEffect(()=>{const update=()=>setStatus(clinicStatus());update();const timer=setInterval(update,1000);document.addEventListener('visibilitychange',update);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',update)}},[]);
 return <span className="clinic-live-status" data-open={status?.open} role="status" aria-live="polite" aria-atomic="true" title="Режим работы по московскому времени"><i className="live-dot" aria-hidden="true"/><span className="clinic-status-label"><AnimatePresence mode="wait" initial={false}><motion.span key={status?.label||'loading'} initial={reduce?false:{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduce?0:-6}} transition={{duration:.18}}>{status?.label||'Часы работы · Москва'}</motion.span></AnimatePresence></span></span>;
}
