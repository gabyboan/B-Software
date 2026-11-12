import { useEffect,useRef,useState,type ReactNode } from 'react';
import { useSiteLanguage } from './useSiteLanguage';
import '../styles/case-motion.css';

const names=['Gestión RRHH','Tiago Market','Nido'];

/** Server content stays in reading order; calendar motion enhances fitting screens. */
export default function CaseMotion({children}:{children:ReactNode}) {
  const root=useRef<HTMLDivElement>(null);
  const navigate=useRef<(index:number)=>void>(()=>{});
  const [active,setActive]=useState(0);
  const [ready,setReady]=useState(false);
  const language=useSiteLanguage();
  useEffect(()=>{
    const element=root.current;
    const pin=element?.querySelector<HTMLElement>('.calendar-pin');
    const list=element?.querySelector<HTMLElement>('.case-list');
    if(!element||!pin||!list)return;
    const cards=Array.from(list.querySelectorAll<HTMLElement>(':scope > article'));
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0,enabled=false,travel=600,selected=0;
    const top=96;
    const select=(index:number)=>{if(index!==selected){selected=index;setActive(index);}};
    const clear=()=>cards.forEach(card=>{
      card.style.removeProperty('transform');card.style.removeProperty('opacity');card.style.removeProperty('z-index');
      card.inert=false;card.removeAttribute('aria-hidden');
    });
    const paint=()=>{
      frame=0;if(!enabled)return;
      const progress=Math.max(0,Math.min(cards.length-1,(top-element.getBoundingClientRect().top)/travel));
      const current=Math.min(cards.length-1,Math.floor(progress+.5));select(current);
      cards.forEach((card,index)=>{
        const turned=Math.max(0,Math.min(1,progress-index)),waiting=Math.max(0,index-progress);
        card.style.transform=`translateY(${Math.min(waiting,2)*10}px) rotateX(${-turned*96}deg) scale(${1-Math.min(waiting,2)*.012})`;
        card.style.opacity=String(turned>.84?Math.max(0,1-(turned-.84)/.16):1);
        card.style.zIndex=String(cards.length-index);card.inert=index!==current;
        if(index!==current)card.setAttribute('aria-hidden','true');else card.removeAttribute('aria-hidden');
      });
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(paint);};
    const measure=()=>{
      const wasEnabled=enabled;element.classList.remove('calendar-enabled');clear();
      const height=Math.max(...cards.map(card=>card.offsetHeight));
      const controls=(element.querySelector<HTMLElement>('.calendar-controls')!.offsetHeight||42)+24;
      enabled=innerWidth>=1100&&!preference.matches&&height+controls<=innerHeight-top-24;
      element.classList.toggle('calendar-enabled',enabled);
      if(enabled){travel=Math.max(420,innerHeight*.65);element.style.setProperty('--calendar-height',`${height}px`);element.style.setProperty('--calendar-travel',`${travel*(cards.length-1)}px`);paint();}
      else if(wasEnabled)select(0);
    };
    navigate.current=(index:number)=>{
      const target=Math.max(0,Math.min(cards.length-1,index));
      const y=enabled?scrollY+element.getBoundingClientRect().top-top+target*travel:scrollY+cards[target].getBoundingClientRect().top-top;
      window.scrollTo({top:y,behavior:preference.matches?'instant':'smooth'});
    };
    let observer:IntersectionObserver|undefined;
    if(typeof IntersectionObserver!=='undefined'){
      observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>entry.target.classList.toggle('case-in-view',entry.isIntersecting));
        if(!enabled){const closest=cards.map((card,index)=>({index,distance:Math.abs(card.getBoundingClientRect().top-top)})).sort((a,b)=>a.distance-b.distance)[0];if(entries.some(entry=>entry.isIntersecting)&&closest)select(closest.index);}
      },{threshold:.12});cards.forEach(card=>observer!.observe(card));
    }else cards.forEach(card=>card.classList.add('case-in-view'));
    element.classList.add('motion-ready');setReady(true);measure();
    let alive=true;document.fonts?.ready.then(()=>{if(alive)measure();});
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',measure,{passive:true});
    preference.addEventListener('change',measure);document.addEventListener('bsoftware:language',measure);
    return()=>{alive=false;observer?.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',measure);preference.removeEventListener('change',measure);document.removeEventListener('bsoftware:language',measure);element.classList.remove('motion-ready','calendar-enabled');clear();};
  },[]);
  return <div ref={root} className="case-motion"><div className="calendar-pin">
    <nav className="calendar-controls" aria-label={language==='en'?'Choose a project':'Elegir un proyecto'} data-no-translate hidden={!ready}>
      <div className="calendar-tabs">{names.map((name,index)=><button type="button" key={name} aria-pressed={active===index} onClick={()=>navigate.current(index)}><span>{String(index+1).padStart(2,'0')}</span>{name}</button>)}</div>
      <div className="calendar-arrows"><span>{String(active+1).padStart(2,'0')} / 03</span><button type="button" aria-label={language==='en'?'Previous project':'Proyecto anterior'} disabled={active===0} onClick={()=>navigate.current(active-1)}>←</button><button type="button" aria-label={language==='en'?'Next project':'Proyecto siguiente'} disabled={active===2} onClick={()=>navigate.current(active+1)}>→</button></div>
    </nav>
    <div className="calendar-binding" aria-hidden="true"><i/><i/></div>{children}
  </div></div>;
}
