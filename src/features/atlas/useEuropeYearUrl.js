import {useEffect,useRef} from 'react';
import {createEuropeYearUrlSync} from './europeYearUrl.js';

export function useEuropeYearUrl({ready,scene,year,playing}) {
  const controller=useRef(null);
  useEffect(()=>{
    const sync=createEuropeYearUrlSync(window);
    controller.current=sync;
    const finish=()=>sync.flush();
    // 6.2.0: a phone can discard a background tab without firing pagehide, so
    // the visible year is also saved when the page is hidden.
    const hidden=()=>{if(document.visibilityState==='hidden')sync.flush();};
    window.addEventListener('pagehide',finish);
    document.addEventListener('visibilitychange',hidden);
    return ()=>{window.removeEventListener('pagehide',finish);document.removeEventListener('visibilitychange',hidden);sync.dispose();controller.current=null;};
  },[]);
  useEffect(()=>{controller.current?.update({ready,scene,year,playing});},[ready,scene,year,playing]);
}
