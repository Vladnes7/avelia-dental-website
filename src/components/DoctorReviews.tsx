import Image from 'next/image';
import {doctorReviews} from '@/lib/doctor-reviews';
export function DoctorReviews({slug,compact=false}:{slug:string;compact?:boolean}){
 const data=doctorReviews[slug];
 return <div className={'doctor-reviews '+(compact?'doctor-reviews-compact':'')}><div className="doctor-reviews-heading"><h3>Отзывы о враче</h3><span><b>4,9</b> <span className="gold-stars" aria-label="5 звёзд">★★★★★</span><small>{data.count} отзывов</small></span></div><div className="doctor-review-grid">{data.reviews.slice(0,compact?1:2).map(r=><article className="doctor-review" key={r.name}><p>«{r.text}»</p><div><Image src={'/images/'+r.image+'-small.webp?v=2'} alt="" width={42} height={42}/><span><b>{r.name}</b><small>{r.visit}</small></span><span className="gold-stars" aria-label="5 звёзд">★★★★★</span></div></article>)}</div></div>;
}
