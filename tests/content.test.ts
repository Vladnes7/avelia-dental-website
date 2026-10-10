import {test} from 'node:test';
import assert from 'node:assert/strict';
import {routes} from '../src/lib/routes';
import {services,doctors,reviews} from '../src/lib/content';
import {articles} from '../src/lib/articles';
test('36 уникальных страниц, каждая ссылка на врача и услугу разрешается',()=>{
 assert.equal(routes.length,36);assert.equal(new Set(routes).size,36);
 for(const s of services){assert.ok(doctors.some(d=>d.slug===s.doctor));assert.ok(s.visit!==s.detail);assert.equal(s.steps.length,4);}
 for(const a of articles){assert.ok(services.some(s=>s.slug===a.service));assert.ok(doctors.some(d=>d.slug===a.doctor));assert.equal(a.sections.length,3);assert.ok(a.sections.every(s=>s.text.length>250));}
});
test('отзывы явно вымышленные, средняя оценка округляется до4,9',()=>{
 assert.equal(reviews.length,8);assert.ok(reviews.every(r=>r.fictional));
 assert.equal((reviews.reduce((n,r)=>n+r.score,0)/reviews.length).toFixed(1),'4.9');
});
