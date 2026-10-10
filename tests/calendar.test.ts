import { test } from 'node:test';
import assert from 'node:assert/strict';
import { moscowDate, calendarDays, slotsFor, validSelection, monthGrid,doctorSchedules,doctorIds } from '../src/lib/calendar';
test('календарь и ближайший приём соблюдают рабочие дни каждого врача',()=>{
 const now=new Date('2026-10-10T06:00:00Z');
 for(const doctor of doctorIds)for(const day of calendarDays(now)){
  const weekday=new Date(day.date+'T12:00:00Z').getUTCDay();
  const slots=slotsFor(day.date,doctor,now);
  if(!doctorSchedules[doctor].includes(weekday))assert.equal(slots.length,0);
  else assert.ok(slots.length>0);
 }
});
test('московская дата пересекает полночь независимо от компьютера', () => {
  assert.equal(moscowDate(new Date('2026-10-10T22:30:00Z')), '2026-10-11');
});
test('30 дней, включая смену месяца и года', () => {
  const days = calendarDays(new Date('2026-12-30T08:00:00Z'));
  assert.equal(days.length, 30); assert.equal(days[0].date, '2026-12-30'); assert.equal(days[2].date, '2027-01-01');
});
test('прошедшие сегодня часы отсутствуют, занятый слот не выбирается', () => {
  const now = new Date('2026-10-10T15:45:00Z');
  const slots = slotsFor('2026-10-10', 'pavel-krylov', now);
  assert.ok(slots.length>0);
  assert.ok(slots.every(s => s.time > '18:45'));
  assert.equal(validSelection({date:'2026-10-09',time:'12:00',doctor:'elena-mironova'}, now), false);
  assert.equal(validSelection({date:'2026-10-11',time:'03:00',doctor:'elena-mironova'}, now), false);
});
test('расписание врача устойчиво и проверяется той же моделью', () => {
  const now = new Date('2026-10-10T06:00:00Z');
  const slots = slotsFor('2026-10-12', 'maria-belova', now);
  assert.deepEqual(slots,slotsFor('2026-10-12','maria-belova',now));
  for(const slot of slots) assert.equal(validSelection({date:'2026-10-12',time:slot.time,doctor:'maria-belova'},now),slot.available);
});
test('месячная сетка начинается с понедельника и сохраняет все дни',()=>{
 const cells=monthGrid('2026-11');assert.equal(cells.length%7,0);assert.equal(cells[6]?.date,'2026-11-01');assert.equal(cells[7]?.date,'2026-11-02');assert.equal(cells.filter(Boolean).length,30);
});
