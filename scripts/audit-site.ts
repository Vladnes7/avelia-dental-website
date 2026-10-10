import {routes} from '../src/lib/routes';
async function main(){
 const origin=process.env.AVELIA_AUDIT_URL||'http://127.0.0.1:4173';let checked=0;
 const errors:string[]=[],images=new Set<string>(),links=new Set<string>();
 for(const route of routes){
  const r=await fetch(origin+route),html=await r.text();checked++;
  if(r.status!==200)errors.push(route+' HTTP '+r.status);
  if(!/<h1[\s>]/.test(html))errors.push(route+' lacks H1');
  for(const m of html.matchAll(/(?:src|srcSet|href)="([^"]+)"/g)){const value=m[1].replaceAll('&amp;','&');if(value.startsWith('/images/')||value.startsWith('/_next/image?'))images.add(value.split(' ')[0]);if(value.startsWith('/')&&!value.startsWith('/_next')&&!value.includes('.')&&!value.startsWith('//'))links.add(value.split('?')[0].split('#')[0]);}
 }
 for(const url of images){const r=await fetch(origin+url);if(r.status!==200)errors.push('Image '+url+' HTTP '+r.status);}
 for(const url of links){if(url&&!routes.includes(url))errors.push('Unknown link '+url);}
 const invalid=await fetch(origin+'/unknown-avelia-page');if(invalid.status!==404)errors.push('Unknown route did not return 404');
 console.log(JSON.stringify({pages:checked,imageRequests:images.size,internalLinks:links.size,errors},null,2));if(errors.length)process.exit(1);
}
main().catch(e=>{console.error(e.message);process.exit(1)});
