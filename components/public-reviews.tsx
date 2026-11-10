'use client';
import {useState,useEffect} from 'react';
import {MessageSquare,Star} from 'lucide-react';
import {api} from './site-ui';
type PublicReview={id:string;rating:number;body:string;name:string};
export default function PublicReviews(){const [reviews,setReviews]=useState<PublicReview[]>([]);useEffect(()=>{api<{reviews:PublicReview[]}>('reviews').then(d=>setReviews(d.reviews||[])).catch(()=>{});},[]);return reviews.length?<div className="real-reviews">{reviews.map(r=><article className="real-review" key={r.id}><div className="review-rating" aria-label={r.rating+' из 5'}>{Array.from({length:5},(_,i)=><Star size={15} fill={i<r.rating?'currentColor':'none'} key={i}/>)}</div><p>{r.body}</p><strong>{r.name}</strong></article>)}</div>:<div className="review-placeholder"><span className="review-icon"><MessageSquare size={27}/></span><div className="review-empty-stars">{Array.from({length:5},(_,i)=><Star key={i} size={19}/>)}</div><h3>Пока нет опубликованных отзывов</h3><p>Отзывы появятся, когда ученики и родители поделятся впечатлениями.</p></div>;}
