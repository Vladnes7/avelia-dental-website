'use client';
import Image from 'next/image';
import Link from 'next/link';
import {motion,useReducedMotion} from 'motion/react';
import {ArrowUpRight} from 'lucide-react';
import type {ReactNode} from 'react';
export function Photo({id,alt='',className='',priority=false,sizes='(max-width: 700px) 100vw, 50vw'}:{id:string;alt?:string;className?:string;priority?:boolean;sizes?:string}){
 return <div className={'photo '+className}><Image src={'/images/'+id+'.webp'} alt={alt} fill sizes={sizes} priority={priority}/></div>;
}
export function Arrow({small=false}:{small?:boolean}){return <ArrowUpRight size={small?17:21} strokeWidth={1.6} aria-hidden/>;}
export function Button({href,children,light=false,className=''}:{href:string;children:ReactNode;light?:boolean;className?:string}){return <Link className={'button '+(light?'button-light ':'')+className} href={href}><span>{children}</span><Arrow/></Link>;}
export function Reveal({children,className='',delay=0}:{children:ReactNode;className?:string;delay?:number}){
 const reduce=useReducedMotion();
 return <motion.div className={className} initial={reduce?false:{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.12}} transition={{duration:reduce?0:0.65,delay,ease:[0.22,1,0.36,1]}}>{children}</motion.div>;
}
export function Eyebrow({children}:{children:ReactNode}){return <p className="eyebrow"><span/>{children}</p>;}
export function SectionTitle({label,title,text,link}:{label:string;title:ReactNode;text?:string;link?:{href:string;label:string}}){return <Reveal className="section-heading"><Eyebrow>{label}</Eyebrow><div><h2>{title}</h2>{text&&<p className="heading-text">{text}</p>}</div>{link&&<Link className="text-link" href={link.href}>{link.label}<Arrow/></Link>}</Reveal>;}
