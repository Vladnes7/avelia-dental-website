'use client';
import Image from 'next/image';
import Link from 'next/link';
import {Children,isValidElement,type ReactNode} from 'react';
import {motion,useReducedMotion} from 'motion/react';
const ease=[0.23,1,0.32,1] as const;
export function AnimatedText({children}:{children:ReactNode}){
 const reduce=useReducedMotion();let index=0;
 function parts(nodes:ReactNode):ReactNode{return Children.map(nodes,node=>{
  if(typeof node==='string'||typeof node==='number')return String(node).split(/(\s+)/).map((word,i)=>/\s/.test(word)?word:<motion.span className="word-mask" key={i} initial={reduce?false:"hidden"} whileInView="show" viewport={{once:true,amount:.12}}><motion.span variants={{hidden:{y:'105%',opacity:0},show:{y:0,opacity:1}}} transition={{duration:reduce?0:.72,delay:reduce?0:Math.min(index++*.035,.3),ease}}>{word}</motion.span></motion.span>);
  if(isValidElement<{children?:ReactNode}>(node)&&node.type!=='br')return <span key={node.key}>{parts(node.props.children)}</span>;
  return node;
 });}
 return <>{parts(children)}</>;
}
export function Photo({id,alt='',className='',priority=false,sizes='(max-width: 700px) 100vw, 50vw'}:{id:string;alt?:string;className?:string;priority?:boolean;sizes?:string}){
 const reduce=useReducedMotion();
 return <div className={'photo '+className}><motion.div className="photo-image" initial={reduce?false:{opacity:0}} whileInView={{opacity:1}} viewport={{once:true,amount:.12}} transition={{duration:reduce?0:.45,ease}}><Image src={'/images/'+id+'.webp?v=2'} alt={alt} fill sizes={sizes} priority={priority}/></motion.div></div>;
}
export function Arrow({small=false}:{small?:boolean}){void small;return null;}
export function Button({href,children,light=false,className=''}:{href:string;children:ReactNode;light?:boolean;className?:string}){return <Link className={'button '+(light?'button-light ':'')+className} href={href}><span>{children}</span></Link>;}
export function Reveal({children,className='',delay=0}:{children:ReactNode;className?:string;delay?:number}){
 const reduce=useReducedMotion();return <motion.div className={className} initial={reduce?false:{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.1}} transition={{duration:reduce?0:.7,delay:reduce?0:delay,ease}}>{children}</motion.div>;
}
export function Eyebrow({children}:{children:ReactNode}){return <p className="eyebrow"><span/>{children}</p>;}
export function SectionTitle({label,title,text,link}:{label:string;title:ReactNode;text?:string;link?:{href:string;label:string}}){return <div className="section-heading"><Eyebrow>{label}</Eyebrow><div><h2><AnimatedText>{title}</AnimatedText></h2>{text&&<Reveal><p className="heading-text">{text}</p></Reveal>}</div>{link&&<Link className="text-link" href={link.href}>{link.label}</Link>}</div>;}
