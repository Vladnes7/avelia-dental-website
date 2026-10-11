import {test} from 'node:test';
import assert from 'node:assert/strict';
import {clinicStatus} from '../src/lib/clinic-hours';
test('московские границы открытия и закрытия в будни',()=>{
 assert.equal(clinicStatus(new Date('2026-10-12T05:59:59Z')).open,false);
 assert.deepEqual(clinicStatus(new Date('2026-10-12T06:00:00Z')),{open:true,label:'Открыто до 21:00'});
 assert.equal(clinicStatus(new Date('2026-10-12T17:59:59Z')).open,true);
 assert.deepEqual(clinicStatus(new Date('2026-10-12T18:00:00Z')),{open:false,label:'Закрыто · завтра в 9:00'});
});
test('воскресенье и субботний вечер используют другой график',()=>{
 assert.equal(clinicStatus(new Date('2026-10-11T06:59:59Z')).label,'Откроемся в 10:00');
 assert.equal(clinicStatus(new Date('2026-10-11T07:00:00Z')).label,'Открыто до 18:00');
 assert.equal(clinicStatus(new Date('2026-10-11T15:00:00Z')).open,false);
 assert.equal(clinicStatus(new Date('2026-10-10T18:00:00Z')).label,'Закрыто · завтра в 10:00');
});
