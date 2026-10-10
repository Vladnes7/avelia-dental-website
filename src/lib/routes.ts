import {commonRoutes,services,doctors} from './content';
import {articles} from './articles';
export const routes=[...commonRoutes,...services.map(s=>'/services/'+s.slug),...doctors.map(d=>'/doctors/'+d.slug),...articles.map(a=>'/journal/'+a.slug)];
