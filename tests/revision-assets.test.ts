import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
test('у каждого отзыва свой портрет, у модели элайнеров настоящий alpha',async()=>{
 for(let i=1;i<=8;i++)await fs.access(path.join(process.cwd(),'public/images',`R0${i}.webp`));
 const model=path.join(process.cwd(),'public/images/JAW.webp');
 assert.equal((await sharp(model).metadata()).hasAlpha,true);
 const {data,info}=await sharp(model).raw().toBuffer({resolveWithObject:true});
 let transparent=0,visible=0;
 for(let i=info.channels-1;i<data.length;i+=info.channels){if(data[i]===0)transparent++;else visible++;}
 assert.ok(transparent>data.length/info.channels*.15);assert.ok(visible>data.length/info.channels*.15);
});
