import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {routes} from '@/lib/routes';
import {services,doctors} from '@/lib/content';
import {articles} from '@/lib/articles';
import {CommonPage,ServicePage,DoctorPage,ArticlePage,commonTitles} from '@/components/Pages';
export const dynamicParams=false;
export function generateStaticParams(){return routes.filter(r=>r!=='/').map(r=>({slug:r.slice(1).split('/')}));}
type Props={params:Promise<{slug:string[]}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const [group,item]=slug;const content=group==='services'?services.find(s=>s.slug===item):group==='doctors'?doctors.find(d=>d.slug===item):group==='journal'?articles.find(a=>a.slug===item):null;const title=content?('name'in content?content.name:content.title):commonTitles[group];return {title:title||'Страница',description:content?('intro'in content?content.intro:'lead'in content?content.lead:content.line):'АВЕЛИЯ — вымышленная стоматологическая клиника в Москве.'};}
export default async function Page({params}:Props){const {slug}=await params;const [group,item]=slug;if(slug.length===1&&commonTitles[group])return <CommonPage slug={group}/>;if(slug.length===2){if(group==='services'){const s=services.find(s=>s.slug===item);if(s)return <ServicePage service={s}/>;}if(group==='doctors'){const d=doctors.find(d=>d.slug===item);if(d)return <DoctorPage doctor={d}/>;}if(group==='journal'){const a=articles.find(a=>a.slug===item);if(a)return <ArticlePage article={a}/>;}}notFound();}
