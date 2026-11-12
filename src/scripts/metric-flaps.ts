document.querySelectorAll<HTMLElement>('[data-slot-section]').forEach(section=>{
  const clocks=Array.from(section.querySelectorAll<HTMLElement>('[data-flip-clock]'));
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  let observer:IntersectionObserver|undefined,generation=0;
  const running=new Set<Animation>();
  const text=(clock:HTMLElement,selector:string,value:number)=>{const span=clock.querySelector(`${selector} > span`);if(span)span.textContent=String(value);};
  const show=(clock:HTMLElement,value:number)=>{text(clock,'[data-base-top]',value);text(clock,'[data-base-bottom]',value);clock.dataset.current=String(value);clock.classList.remove('is-flipping');};
  const settle=()=>{generation++;running.forEach(animation=>animation.cancel());running.clear();clocks.forEach(clock=>show(clock,Number(clock.dataset.flipClock)));section.dataset.state='done';observer?.disconnect();};
  const play=async(clock:HTMLElement,index:number,token:number)=>{
    const target=Number(clock.dataset.flipClock),down=clock.dataset.direction==='down';
    const values=down?[target+3,target+2,target+1,target]:Array.from({length:target+1},(_,digit)=>digit);
    show(clock,values[0]);
    for(let step=1;step<values.length&&token===generation;step++){
      const previous=values[step-1],next=values[step];
      text(clock,'[data-base-top]',down?next:previous);text(clock,'[data-base-bottom]',down?previous:next);
      text(clock,'.flip-leaf-out',previous);text(clock,'.flip-leaf-in',next);clock.classList.add('is-flipping');
      const delay=step===1?index*90:0;
      const outgoing=clock.querySelector<HTMLElement>('.flip-leaf-out')!.animate([{transform:'rotateX(0deg)'},{transform:`rotateX(${down?-90:90}deg)`}],{duration:95,delay,easing:'ease-in',fill:'both'});
      const incoming=clock.querySelector<HTMLElement>('.flip-leaf-in')!.animate([{transform:`rotateX(${down?90:-90}deg)`},{transform:'rotateX(0deg)'}],{duration:105,delay:delay+95,easing:'ease-out',fill:'both'});
      running.add(outgoing);running.add(incoming);
      try{await Promise.all([outgoing.finished,incoming.finished]);}catch{return;}
      if(token!==generation)return;
      show(clock,next);outgoing.cancel();incoming.cancel();running.delete(outgoing);running.delete(incoming);
    }
  };
  if(preference.matches||typeof IntersectionObserver==='undefined'||typeof Element.prototype.animate!=='function'){settle();return;}
  section.dataset.state='ready';
  observer=new IntersectionObserver(entries=>{
    if(!entries.some(entry=>entry.isIntersecting))return;
    observer?.disconnect();section.dataset.state='playing';const token=generation;
    Promise.all(clocks.map((clock,index)=>play(clock,index,token))).then(()=>{if(token===generation)section.dataset.state='done';});
  },{threshold:.2});
  observer.observe(section.querySelector('.numbers-grid')!);
  window.addEventListener('resize',()=>{if(section.dataset.state==='playing')settle();},{passive:true});
  preference.addEventListener('change',event=>{if(event.matches)settle();});
});
