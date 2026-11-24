// Animation frames are state changes, not visits. Only settled years reach
// the address bar; pagehide preserves the last visible year when leaving.
export function createEuropeYearUrlSync(browser, {delayMs=350}={}) {
  let timer=null, current=null;
  const cancel=()=>{if(timer!==null){browser.clearTimeout(timer);timer=null;}};
  const valid=()=>current?.ready && current.scene==='europa' && Number.isInteger(current.year);
  const flush=()=>{
    cancel();
    if(!valid())return false;
    const url=new URL(browser.location.href);
    url.searchParams.delete('escena');
    if(url.searchParams.get('panel')==='europa')url.searchParams.delete('panel');
    url.searchParams.set('anio',String(current.year));
    const target=url.pathname+url.search+url.hash;
    if(target===browser.location.pathname+browser.location.search+browser.location.hash)return false;
    browser.history.replaceState({...browser.history.state,eade:'atlas'},'',target);
    return true;
  };
  return {
    update(snapshot){current=snapshot;cancel();if(valid()&&!current.playing)timer=browser.setTimeout(flush,delayMs);},
    flush,
    dispose(){cancel();current=null;},
  };
}
