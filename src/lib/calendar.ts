export const doctorIds = ['elena-mironova','andrey-sokolov','maria-belova','dmitry-volkov','anna-lebedeva','maxim-orlov','irina-morozova','pavel-krylov'] as const;
export type Selection = { date: string; time: string; doctor: string };
export function moscowDate(now = new Date()) {
  return new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Moscow',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}
export function calendarDays(now = new Date()) {
  const day = new Date(moscowDate(now)+'T12:00:00Z');
  return Array.from({length:30},(_,i)=> {
    const d=new Date(day.getTime()+i*86400000);
    return {date:d.toISOString().slice(0,10),day:d.getUTCDate(),weekday:new Intl.DateTimeFormat('ru',{weekday:'short',timeZone:'UTC'}).format(d),month:new Intl.DateTimeFormat('ru',{month:'long',timeZone:'UTC'}).format(d)};
  });
}
function hash(text:string) { return [...text].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7); }
export function slotsFor(date:string,doctor:string,now=new Date()) {
  if(!doctorIds.includes(doctor as typeof doctorIds[number]) || !calendarDays(now).some(d=>d.date===date)) return [];
  const sunday = new Date(date+'T12:00:00Z').getUTCDay()===0;
  const times=sunday?['10:00','11:30','13:00','14:30','16:00']:['09:00','10:30','12:00','13:30','15:00','16:30','18:00','19:30'];
  return times.filter(time=>new Date(`${date}T${time}:00+03:00`).getTime()>now.getTime()+30*60000).map(time=>({time,available:hash(`${date}|${doctor}|${time}`)%5!==0}));
}
export function validSelection(s:Selection,now=new Date()) {
  return slotsFor(s.date,s.doctor,now).some(slot=>slot.time===s.time&&slot.available);
}
export function monthGrid(key:string):({date:string;day:number}|null)[]{
 if(!/^\d{4}-\d{2}$/.test(key))return [];
 const [year,month]=key.split('-').map(Number),first=new Date(Date.UTC(year,month-1,1));
 const leading=(first.getUTCDay()+6)%7,total=new Date(Date.UTC(year,month,0)).getUTCDate();
 const cells:({date:string;day:number}|null)[]=Array(leading).fill(null);
 for(let day=1;day<=total;day++)cells.push({date:`${key}-${String(day).padStart(2,'0')}`,day});
 while(cells.length%7)cells.push(null);return cells;
}
