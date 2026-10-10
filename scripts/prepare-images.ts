import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
async function main(){
 const root=process.cwd(),source=path.join(root,'_материалы/фото/исходники'),dest=path.join(root,'public/images');
 await fs.mkdir(dest,{recursive:true});
 const plan=JSON.parse(await fs.readFile(path.join(root,'_материалы/фото/photo-plan.json'),'utf8'));
 const files=(await fs.readdir(source)).filter(f=>f.endsWith('.png'));
 const manifest:Record<string,{width:number;height:number;src:string}>={};
 for(const file of files){
  const id=file.slice(0,-4),input=path.join(source,file),m=await sharp(input).metadata();
  const transparent=m.hasAlpha;
  await sharp(input).resize({width:1600,withoutEnlargement:true}).webp({quality:86,alphaQuality:100}).toFile(path.join(dest,id+'.webp'));
  await sharp(input).resize({width:640,withoutEnlargement:true}).webp({quality:82,alphaQuality:100}).toFile(path.join(dest,id+'-small.webp'));
  manifest[id]={width:m.width!,height:m.height!,src:'/images/'+id+'.webp'};
  const a=plan.assets.find((a:{id:string})=>a.id===id);
  if(a) Object.assign(a,{status:'generated',actualOriginalPath:input,width:m.width,height:m.height,alpha:transparent});
 }
 await fs.writeFile(path.join(dest,'manifest.json'),JSON.stringify(manifest,null,2));
 plan.status=plan.assets.every((a:{status:string})=>a.status==='generated')?'generated-complete':'approved-generation-in-progress';
 await fs.writeFile(path.join(root,'_материалы/фото/photo-plan.json'),JSON.stringify(plan,null,2)+'\n');
 // Contact sheet is a verification artifact, never substituted for a photograph.
 const thumbs=await Promise.all(files.map(async(file,i)=>({input:await sharp(path.join(source,file)).resize(180,140,{fit:'contain',background:'#e7ebea'}).png().toBuffer(),left:(i%8)*180,top:Math.floor(i/8)*166})));
 const height=Math.max(166,Math.ceil(files.length/8)*166);
 const labels=Buffer.from(`<svg width="1440" height="${height}">${files.map((f,i)=>`<text x="${i%8*180+8}" y="${Math.floor(i/8)*166+158}" font-family="Arial" font-size="13" fill="#101f23">${f.slice(0,-4)}</text>`).join('')}</svg>`);
 await sharp({create:{width:1440,height,channels:3,background:'#e7ebea'}}).composite([...thumbs,{input:labels,left:0,top:0}]).png().toFile(path.join(root,'_материалы/фото/contact-sheet.png'));
 console.log(`Prepared ${plan.assets.filter((a:{status:string})=>a.status==='generated').length} original photographs and ${files.length-plan.assets.length} hero layers; plan ${plan.status}`);
}
main().catch(e=>{console.error(e);process.exit(1)});
