import Script from 'next/script';
import type {Metadata} from 'next';
import localFont from 'next/font/local';
import {Shell} from '@/components/Shell';
import './globals.css';
import './revision.css';
const manrope=localFont({src:'../../public/fonts/Manrope.ttf',variable:'--font-heading',display:'swap'});
const onest=localFont({src:'../../public/fonts/Onest.ttf',variable:'--font-body',display:'swap'});
export const metadata:Metadata={title:{default:'Avelia — современная стоматология в Москве',template:'%s · АВЕЛИЯ'},description:'Вымышленная стоматологическая клиника в Москве. Диагностика, лечение, эстетика и запись на консультацию.',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru" data-scroll-behavior="smooth" suppressHydrationWarning><head><Script id="avelia-theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{__html:"try{document.documentElement.dataset.theme=localStorage.getItem('avelia-theme')||'light'}catch(e){}"}}/></head><body className={manrope.variable+' '+onest.variable}><Shell>{children}</Shell></body></html>;}
