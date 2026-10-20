// A separate, non-interactive SVG layer: removing it restores the exact map
// underneath, including dependency and occupation patterns.
export function renderImperialOverlay(svg, ids, lookup) {
 svg.querySelector('[data-imperial-overlay]')?.remove();
 if(!ids.length)return;
 const ns='http://www.w3.org/2000/svg',group=svg.ownerDocument.createElementNS(ns,'g');
 group.setAttribute('data-imperial-overlay','');group.setAttribute('pointer-events','none');
 group.setAttribute('aria-hidden','true');
 for(const id of new Set(ids)) {
  const original=lookup(id);if(!original)continue;
  const clone=original.cloneNode(true);
  for(const node of [clone,...clone.querySelectorAll('*')]) {
   node.removeAttribute('id');node.removeAttribute('style');node.removeAttribute('class');
   node.setAttribute('fill','#D5BB65');node.setAttribute('fill-opacity','0.48');
   node.setAttribute('stroke','#756024');node.setAttribute('stroke-width','0.12');
  }
  // Keep the source coordinate system, even when regions live in groups.
  const transforms=[];
  for(let parent=original.parentElement;parent&&parent!==svg;parent=parent.parentElement)
   if(parent.hasAttribute('transform'))transforms.unshift(parent.getAttribute('transform'));
  const wrapper=svg.ownerDocument.createElementNS(ns,'g');
  if(transforms.length)wrapper.setAttribute('transform',transforms.join(' '));
  wrapper.append(clone);group.append(wrapper);
 }
 svg.append(group);
}
