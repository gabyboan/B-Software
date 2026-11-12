import { useEffect, useState } from 'react';
export function useSiteLanguage() {
  const [language,setLanguage]=useState<'es'|'en'>('es');
  useEffect(()=>{
    const sync=()=>setLanguage(document.documentElement.dataset.language==='en'?'en':'es');
    sync(); document.addEventListener('bsoftware:language',sync);
    return ()=>document.removeEventListener('bsoftware:language',sync);
  },[]);
  return language;
}
