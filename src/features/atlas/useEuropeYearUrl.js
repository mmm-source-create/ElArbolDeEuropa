import {useEffect,useRef} from 'react';
import {createEuropeYearUrlSync} from './europeYearUrl.js';

export function useEuropeYearUrl({ready,scene,year,playing}) {
  const controller=useRef(null);
  useEffect(()=>{
    const sync=createEuropeYearUrlSync(window);
    controller.current=sync;
    const finish=()=>sync.flush();
    window.addEventListener('pagehide',finish);
    return ()=>{window.removeEventListener('pagehide',finish);sync.dispose();controller.current=null;};
  },[]);
  useEffect(()=>{controller.current?.update({ready,scene,year,playing});},[ready,scene,year,playing]);
}
