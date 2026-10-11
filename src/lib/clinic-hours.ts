export const clinicTimeZone='Europe/Moscow';
export function clinicStatus(now=new Date()) {
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:clinicTimeZone,weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now);
 const part=(key:string)=>parts.find(p=>p.type===key)?.value||'';
 const sunday=part('weekday')==='Sun',opening=sunday?10:9,closing=sunday?18:21;
 const minutes=Number(part('hour'))*60+Number(part('minute'));
 const open=minutes>=opening*60&&minutes<closing*60;
 const label=open?`Открыто до ${closing}:00`:minutes<opening*60?`Откроемся в ${opening}:00`:`Закрыто · завтра в ${part('weekday')==='Sat'?10:9}:00`;
 return {open,label};
}
