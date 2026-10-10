'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import Script from 'next/script';
import {AnimatePresence,motion,MotionConfig,useReducedMotion} from 'motion/react';
import {Menu,X,Sun,Moon,ArrowUpRight} from 'lucide-react';
import {Photo,Button,Arrow} from './ui';
import {clinic,services} from '@/lib/content';
import type {ReactNode} from 'react';
type Craft={destroy:()=>void;layout:()=>void};
declare global {interface Window{ScrollCraft?:{mount:(root:Element,opts?:object)=>Craft;instances:Craft[]}}}
const nav=[['/services','Услуги'],['/doctors','Врачи'],['/clinic','Клиника'],['/prices','Стоимость'],['/journal','Журнал'],['/contacts','Контакты']];
export function Shell({children}:{children:ReactNode}){
 const path=usePathname(),reduce=useReducedMotion();const [open,setOpen]=useState(false),[dark,setDark]=useState(false),[ready,setReady]=useState(false),[loading,setLoading]=useState(false);
 const trigger=useRef<HTMLButtonElement>(null),dialog=useRef<HTMLDivElement>(null),prevPath=useRef(path);
 useEffect(()=>{setDark(document.documentElement.dataset.theme==='dark');if(!sessionStorage.getItem('avelia-seen')){setLoading(true);const timer=setTimeout(()=>{setLoading(false);sessionStorage.setItem('avelia-seen','1');},650);return()=>clearTimeout(timer);}},[]);
 useEffect(()=>{if(prevPath.current!==path){setOpen(false);prevPath.current=path;}},[path]);
 useEffect(()=>{if(!ready||!window.ScrollCraft)return;const root=document.getElementById('site-content');if(!root)return;const instance=window.ScrollCraft.mount(root);return()=>instance.destroy();},[ready,path]);
 useEffect(()=>{if(!open)return;const saved=document.body.style.overflow;document.body.style.overflow='hidden';const main=document.getElementById('site-content'),footer=document.getElementById('footer');if(main)main.inert=true;if(footer)footer.inert=true;
  const raf=requestAnimationFrame(()=>dialog.current?.querySelector<HTMLElement>('button,a')?.focus());
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);return;}if(e.key!=='Tab')return;const nodes=Array.from(dialog.current?.querySelectorAll<HTMLElement>('a,button')||[]);const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}};
  document.addEventListener('keydown',key);return()=>{cancelAnimationFrame(raf);document.removeEventListener('keydown',key);document.body.style.overflow=saved;if(main)main.inert=false;if(footer)footer.inert=false;trigger.current?.focus();};
 },[open]);
 function theme(){const next=!dark;setDark(next);document.documentElement.dataset.theme=next?'dark':'light';try{localStorage.setItem('avelia-theme',next?'dark':'light')}catch{}}
 return <MotionConfig reducedMotion="user" transition={{duration:0.45,ease:[0.22,1,0.36,1]}}>
  <a className="skip-link" href="#site-content">Перейти к содержимому</a>
  <header className="site-header"><Link href="/" className="wordmark" aria-label="АВЕЛИЯ — главная">авелия<span>стоматология</span></Link><nav aria-label="Основная навигация">{nav.map(([href,label])=><Link key={href} href={href} aria-current={path===href?'page':undefined}>{label}</Link>)}</nav><div className="header-controls"><button className="icon-button theme-button" onClick={theme} aria-label={dark?'Светлая тема':'Тёмная тема'}>{dark?<Sun size={19}/>:<Moon size={19}/>}</button><Link className="header-book" href="/appointment">Записаться<Arrow small/></Link><button ref={trigger} className="menu-button" aria-label="Открыть меню" aria-expanded={open} onClick={()=>setOpen(true)}><Menu size={21}/><span>Меню</span></button></div></header>
  <AnimatePresence>{open&&<motion.div ref={dialog} className="menu-overlay" role="dialog" aria-modal="true" aria-label="Навигация по клинике" initial={{clipPath:reduce?'none':'inset(0 0 100% 0)'}} animate={{clipPath:'inset(0 0 0% 0)'}} exit={{clipPath:reduce?'none':'inset(0 0 100% 0)',opacity:reduce?0:1}} transition={{duration:reduce?0.1:0.6}}><Photo id="I08" alt="Светлый коридор клиники" priority sizes="100vw"/><div className="menu-scrim"/><div className="menu-head"><Link href="/" className="wordmark" onClick={()=>setOpen(false)}>авелия<span>стоматология</span></Link><button className="icon-button" aria-label="Закрыть меню" onClick={()=>setOpen(false)}><X size={25}/></button></div><div className="menu-body"><p className="eyebrow-static">Пространство заботы о вас</p><nav>{nav.map(([href,label],i)=><motion.div key={href} initial={reduce?false:{y:24,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:reduce?0:i*0.035+0.12}}><Link href={href} onClick={()=>setOpen(false)}>{label}<ArrowUpRight size={30}/></Link></motion.div>)}</nav><div className="menu-bottom"><p>{clinic.address}<br/><span>{clinic.hours}</span></p><Button href="/appointment">Выбрать время</Button></div></div></motion.div>}</AnimatePresence>
  <main id="site-content" tabIndex={-1}>{children}</main>
  <footer id="footer"><div className="footer-top"><div><p className="eyebrow-static">Будем рады знакомству</p><h2>Ваша улыбка.<br/>Наше внимание.</h2><Button href="/appointment" light>Записаться на консультацию</Button></div><div className="footer-address"><p>{clinic.address}</p><span>{clinic.hours}</span><Link href="/contacts" className="text-link">Как устроен визит<Arrow/></Link></div></div><div className="footer-links"><div><Link href="/" className="wordmark">авелия<span>стоматология</span></Link></div><div>{nav.map(([href,label])=><Link href={href} key={href}>{label}</Link>)}</div><div>{services.slice(0,5).map(s=><Link key={s.slug} href={'/services/'+s.slug}>{s.name}</Link>)}</div><div>{services.slice(5).map(s=><Link key={s.slug} href={'/services/'+s.slug}>{s.name}</Link>)}</div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} АВЕЛИЯ</span><span>Вымышленная клиника · демонстрационный сайт</span><Link href="/project">О проекте и данных</Link></div></footer>
  <AnimatePresence>{loading&&<motion.div className="preloader" initial={{opacity:1}} exit={{opacity:0}} transition={{duration:reduce?0:0.3}} aria-hidden><span className="wordmark">авелия</span><motion.div initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:0.55}}/></motion.div>}</AnimatePresence>
  <Script src="/vendor/scrollcraft.js" strategy="afterInteractive" onLoad={()=>setReady(true)} onReady={()=>setReady(true)}/>
 </MotionConfig>;
}
