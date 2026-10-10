import {test} from 'node:test';
import assert from 'node:assert/strict';
import {nextAvailable,validSelection} from '../src/lib/calendar';
test('ближайшая запись переходит на следующий день после последнего часа',()=>{
 const now=new Date('2026-10-10T18:40:00Z');
 const slot=nextAvailable('pavel-krylov',now);
 assert.ok(slot);assert.equal(slot.date,'2026-10-12');assert.equal(validSelection(slot,now),true);
});
test('ссылка ближайшей записи учитывает запас времени и отклоняет неизвестного врача',()=>{
 const now=new Date('2026-10-10T06:20:00Z');
 const slot=nextAvailable('pavel-krylov',now);assert.ok(slot);
 assert.ok(new Date(slot.date+'T'+slot.time+':00+03:00').getTime()>now.getTime()+30*60000);
 assert.equal(nextAvailable('unknown',now),null);
});
