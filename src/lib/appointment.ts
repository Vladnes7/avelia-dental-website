import {calendarDays,doctorIds,slotsFor,nextAvailable,type Selection} from './calendar';
import {services} from './content';
export function initialAppointment(params:URLSearchParams,now=new Date(),fallback='pavel-krylov'):Selection {
 const requested=params.get('doctor')||fallback;
 const doctor=doctorIds.includes(requested as typeof doctorIds[number])?requested:fallback;
 const requestedDate=params.get('date')||'';
 const date=calendarDays(now).some(d=>d.date===requestedDate)?requestedDate:nextAvailable(doctor,now)?.date||calendarDays(now)[0].date;
 const requestedTime=params.get('time')||'';
 const time=slotsFor(date,doctor,now).some(s=>s.time===requestedTime&&s.available)?requestedTime:'';
 return {doctor,date,time};
}
export function validPhone(value:string){const digits=value.replace(/\D/g,'');return digits.length>=10&&digits.length<=15&&/^\+?[0-9\s()\-]+$/.test(value);}
export function resolveBooking(params:URLSearchParams,now=new Date(),fallback='pavel-krylov'){
 const initial=initialAppointment(params,now,fallback);
 const service=services.find(s=>s.slug===params.get('service'))||services.find(s=>s.doctor===initial.doctor)||services[0];
 const doctor=service.doctor;
 const time=doctor===initial.doctor?initial.time:'';
 const date=doctor!==initial.doctor&&!params.has('date')?nextAvailable(doctor,now)?.date||initial.date:initial.date;
 return {...initial,date,doctor,time,service:service.slug};
}
