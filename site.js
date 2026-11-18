async function loadContent(){
 try{
  const r=await fetch('content.json?v='+Date.now(),{cache:'no-store'});const c=await r.json();
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v||''};
  ['heroIntro','aboutText','profileBio','companyIntro','reliability','expertiseIntro','productsIntro','portfolioIntro'].forEach(k=>set(k,c[k]));
  const portrait=document.querySelector('.portrait');if(portrait&&c.portraitImage)portrait.src=c.portraitImage;
  const logo=document.querySelector('.brand img');if(logo&&c.logoImage)logo.src=c.logoImage;
  const footerLogo=document.querySelector('.footer-brand img');if(footerLogo&&c.logoImage)footerLogo.src=c.logoImage;
  set('year',new Date().getFullYear());
  const cards=(id,arr,cls,fn)=>{const el=document.getElementById(id);if(!el)return;el.innerHTML='';(arr||[]).forEach((x,i)=>{const d=document.createElement('article');d.className=cls;d.innerHTML=fn(x,i);el.append(d)})};
  cards('expertiseGrid',c.expertise,'expertise-card',(x,i)=>`<span class="num">0${i+1}</span><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p>`);
  cards('productGrid',c.products,'product-card',x=>`<span class="category">${esc(x.category)}</span><h3>${esc(x.name)}</h3><p>${esc(x.description)}</p><div class="features">${esc(x.features||'')}</div>`);
  cards('projectGrid',c.projects,'project-card',x=>`<span class="category">${esc(x.category)}</span><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p>`);
  const g=document.getElementById('galleryGrid');g.innerHTML='';(c.gallery||[]).forEach(x=>{const img=document.createElement('img');img.src=x.image;img.alt=x.caption||'Galerie';g.append(img)});
  const cd=document.getElementById('contactDetails');cd.className='contact-details';cd.innerHTML=[c.email?`<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`:'',c.phone?`<a href="tel:${esc(c.phone)}">${esc(c.phone)}</a>`:'',c.location?`<span>${esc(c.location)}</span>`:''].filter(Boolean).join(' · ');
  await applySiteEdits();
 }catch(e){console.error('Impossible de charger le contenu du site',e)}
}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function editorSelector(el){if(el.id)return '#'+CSS.escape(el.id);const parts=[];while(el&&el.nodeType===1&&el!==document.body){let n=1;for(let s=el.previousElementSibling;s;s=s.previousElementSibling)if(s.tagName===el.tagName)n++;parts.unshift(el.tagName.toLowerCase()+':nth-of-type('+n+')');el=el.parentElement;}return 'body>'+parts.join('>')}
function assignEditorIds(){document.querySelectorAll('body *').forEach(el=>{if(!el.closest('script,style'))el.setAttribute('data-editor-id',editorSelector(el))})}
async function applySiteEdits(){
 let edits={};try{const r=await fetch('site-edits.json?v='+Date.now(),{cache:'no-store'});if(r.ok)edits=await r.json()}catch(e){}
 if(edits.newSections&&Array.isArray(edits.newSections)){const main=document.querySelector('main');edits.newSections.forEach(s=>{if(document.getElementById(s.id))return;const sec=document.createElement('section');sec.className='section custom-section';sec.id=s.id;sec.innerHTML=`<div class="section-label">${esc(s.label||'SECTION')}</div><h2>${esc(s.title||'Nouvelle section')}</h2><p>${esc(s.text||'')}</p>`;main.append(sec)})}
 assignEditorIds();
 Object.entries(edits.text||{}).forEach(([sel,val])=>{const el=document.querySelector(sel);if(el&&!el.children.length)el.textContent=val});
 Object.entries(edits.images||{}).forEach(([sel,val])=>{const el=document.querySelector(sel);if(el&&el.tagName==='IMG')el.src=val});
 Object.entries(edits.styles||{}).forEach(([sel,props])=>{const el=document.querySelector(sel);if(el)Object.entries(props).forEach(([k,v])=>el.style[k]=v)});
 if(Array.isArray(edits.hiddenSections))edits.hiddenSections.forEach(id=>{const el=document.getElementById(id);if(el)el.hidden=true});
 if(Array.isArray(edits.order)){const main=document.querySelector('main');edits.order.forEach(id=>{const el=document.getElementById(id);if(el&&el.parentElement===main)main.append(el)})}
}
document.addEventListener('DOMContentLoaded',()=>{const menu=document.querySelector('.menu');if(menu)menu.addEventListener('click',()=>document.getElementById('nav').classList.toggle('open'));loadContent()});
