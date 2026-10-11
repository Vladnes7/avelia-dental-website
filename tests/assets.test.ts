import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
test('все 84 фотографии доступны в переносимом сайте и уникальны',async()=>{
 const root=process.cwd(),plan=JSON.parse(await fs.readFile(path.join(root,'_материалы/фото/photo-plan.json'),'utf8'));
 assert.equal(plan.assets.length,84);const hashes=new Set<string>();
 for(const a of plan.assets){
  assert.equal(a.status,'generated','Missing photograph '+a.id);
  const original=path.join(root,'_материалы/фото/исходники',a.id+'.png');
  const file=await fs.access(original).then(()=>original,()=>path.join(root,'public/images',a.id+'.webp'));
  const data=await fs.readFile(file),m=await sharp(data).metadata();
  // Native portrait output is 941×1672; verify its useful resolution without artificial enlargement.
  assert.ok(Math.min(m.width!,m.height!)>=900&&m.width!*m.height!>=1_500_000,'Original resolution '+a.id);
  const hash=createHash('sha256').update(data).digest('hex');assert.ok(!hashes.has(hash),'Duplicate photograph '+a.id);hashes.add(hash);
  await fs.access(path.join(root,'public/images',a.id+'.webp'));await fs.access(path.join(root,'public/images',a.id+'-small.webp'));
 }
 const publicManifest=await fs.readFile(path.join(root,'public/images/manifest.json'),'utf8');assert.ok(!publicManifest.includes('/Users/'),'Public metadata must not reveal local paths');
});
test('слои главного экрана имеют настоящий alpha',async()=>{
 for(const id of ['H01-subject','H01-foreground']){const file=path.join(process.cwd(),'public/images',id+'.webp');assert.equal((await sharp(file).metadata()).hasAlpha,true);}
});
