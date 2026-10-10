import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialAppointment,validPhone,resolveBooking} from '../src/lib/appointment';
test('переход от врача выбирает его даже без даты и часа',()=>{
 assert.equal(initialAppointment(new URLSearchParams('doctor=elena-mironova'),new Date('2026-10-10T08:00:00Z')).doctor,'elena-mironova');
});
test('неизвестные параметры и занятые часы сбрасываются',()=>{
 const s=initialAppointment(new URLSearchParams('doctor=unknown&date=2000-01-01&time=03:00'),new Date('2026-10-10T08:00:00Z'));
 assert.deepEqual(s,{doctor:'pavel-krylov',date:'2026-10-10',time:''});
});
test('телефон проверяет цифры, а не только длину текста',()=>{
 assert.equal(validPhone('+7 (999) 123-45-67'),true);
 assert.equal(validPhone('          '),false);assert.equal(validPhone('12345'),false);assert.equal(validPhone('телефон1234567890'),false);
});
test('детская услуга сохраняется и выбирает своего специалиста',()=>{
 const b=resolveBooking(new URLSearchParams('service=children&doctor=pavel-krylov'),new Date('2026-10-10T08:00:00Z'));
 assert.equal(b.service,'children');assert.equal(b.doctor,'anna-lebedeva');assert.equal(b.time,'');
});
test('врач без услуги получает направление своей специализации',()=>{
 const b=resolveBooking(new URLSearchParams('doctor=irina-morozova'),new Date('2026-10-10T08:00:00Z'));
 assert.equal(b.service,'endodontics');assert.equal(b.doctor,'irina-morozova');
});
