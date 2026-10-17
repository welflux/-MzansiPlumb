import './style.css';

const icons: Record<string,string> = {
calendar:'<rect x="4" y="6" width="24" height="23" rx="3"/><path d="M10 3v6m12-6v6M4 13h24m-18 6h5m-5 5h10"/>',
clock:'<circle cx="16" cy="16" r="13"/><path d="M16 7v10l6 3"/>',
quote:'<path d="M20 3H7v26h18V9zM20 3v7h5M11 15h10m-10 5h7m-7 5h5"/>',
team:'<circle cx="12" cy="10" r="5"/><path d="M3 29v-6a9 9 0 0 1 18 0v6zM22 5a5 5 0 0 1 0 10m3 4a8 8 0 0 1 4 10"/>',
hand:'<path d="m2 12 7-7 7 3 7-3 7 7-6 6-8-6-6 5 11 10m-15-9 10 11m-6-15 8 9m-1-8 7 7M2 12l6 7m22-7-6 6"/>',
photo:'<rect x="3" y="5" width="26" height="23" rx="3"/><circle cx="11" cy="12" r="3"/><path d="m4 25 8-7 5 4 5-7 7 9"/>',
chart:'<path d="M5 29V18h5v11m4 0V12h5v17m4 0V5h5v24M3 12l9-6 6 2 10-6"/>',
phone:'<rect x="8" y="2" width="16" height="28" rx="3"/><path d="M13 6h6m-4 20h2"/>',
pin:'<path d="M26 12c0 8-10 18-10 18S6 20 6 12a10 10 0 0 1 20 0Z"/><circle cx="16" cy="12" r="4"/>',
shield:'<path d="M16 2 5 7v9c0 7 11 14 11 14s11-7 11-14V7zM10 15l4 4 8-9"/>',
headset:'<path d="M4 20v-6a12 12 0 0 1 24 0v6M4 15h5v11H4zM23 15h5v11h-5zM25 26c0 4-9 4-9 4"/>'
};
const icon = (name:string) => `<svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
const brand = () => `<a class="brand" href="#home" aria-label="MzansiPlumb home"><img src="/brand/mzansiplumb.png" alt="MzansiPlumb — Manage Today. Grow Tomorrow." width="2172" height="724"><span class="brand-fallback" hidden>MzansiPlumb<small>Smart Plumbing Business Management</small></span></a>`;
const challenges = [ ['calendar','Managing multiple<br>jobs and appointments'],['clock','Keeping track of<br>technicians and<br>work progress'],['quote','Creating quotes,<br>invoices and reports'],['hand','Following up with<br>customers'] ];
const features = [['team','Job & Customer<br>Management'],['calendar','Smart Scheduling<br>& Dispatch'],['photo','Digital Job Cards<br>with Photos'],['quote','Quotes & Invoicing'],['team','Team Management<br>& Permissions'],['calendar','Maintenance<br>Reminders'],['chart','Business Reports<br>& Insights'],['phone','Mobile Access<br>Anywhere']];
const benefits = [['pin','Designed<br>for South Africa','ZAR, local support'],['shield','Secure & Reliable','Your data, your<br>business'],['chart','Grow Your Business','Work smarter, take<br>on more jobs'],['headset','Local Support','Real people,<br>right here in SA']];
const faqs = [
['Is MzansiPlumb suitable for small businesses?','MzansiPlumb is being built for solo plumbers as well as teams. The planned workflow starts with customers, properties and jobs, with team and branch capabilities as a business grows.'],
['Can I use MzansiPlumb on my mobile phone?','This website adapts to mobile phones, tablets and desktop screens. The operations workspace supports mobile job cards for assigned technicians, including work records and completion evidence.'],
['Is my data secure?','The workspace uses authenticated sessions and company-scoped permissions. Hosting, recovery arrangements and a production security review must be verified before launch.'],
['Do you offer training and support?','Training and support arrangements will be published before launch. No live support integration is connected on this website yet.'],
['How much does MzansiPlumb cost?','Pricing has not been published. Billing and live payment processing are disabled; this website cannot charge you.']
];

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<a class="skip" href="#main">Skip to content</a>
<main id="main"><section class="hero" id="home">
<header class="header wrap">${brand()}<button class="menu-toggle" aria-expanded="false" aria-controls="navigation" aria-label="Open navigation">☰</button><nav id="navigation" aria-label="Main navigation"><a href="#home">Home</a><a href="#features">Features</a><a href="#solutions">Solutions</a><button data-dialog="pricing">Pricing</button><div class="resources"><button id="resources-toggle" aria-expanded="false" aria-controls="resources-menu">Resources <span aria-hidden="true">⌄</span></button><div id="resources-menu" hidden><a href="#faq">Frequently asked questions</a><button data-dialog="support">Support</button></div></div><button class="sign-in" data-dialog="signin">Sign In</button><button class="button nav-cta" data-dialog="signup">Get Started Free</button></nav></header>
<div class="hero-content wrap"><h1>Run a Smarter,<br>More Profitable<br>Plumbing Business<br>with <em>MzansiPlumb</em></h1><p>Manage jobs, customers, and your team — all in one<br class="desktop-break"> powerful, easy-to-use platform designed for South<br class="desktop-break"> African plumbing businesses.</p><button class="button hero-cta" data-dialog="signup">Get Started Free <span aria-hidden="true">→</span></button><small>No credit card required</small></div>
<svg class="hero-wave" viewBox="0 0 1024 90" preserveAspectRatio="none" aria-hidden="true"><path fill="#074a89" stroke="#ff8500" stroke-width="6" d="M0 70Q180 105 320 75T590 82Q700 90 840 40T1024 10V90H0Z"/><path fill="#fff" d="M0 73Q140 96 310 72T590 83Q740 82 850 68T1024 57V90H0Z"/></svg></section>
<section class="challenge wrap" aria-labelledby="challenge-title"><div class="challenge-copy"><p class="eyebrow"><span>THE</span> CHALLENGE</p><h2 id="challenge-title">Running a Plumbing Business<br>is Tough Enough...</h2><p class="intro">From missed appointments to lost job details, many<br class="desktop-break"> plumbing businesses struggle with:</p><div class="challenge-grid">${challenges.map(([i,t])=>`<div class="challenge-card">${icon(i)}<p>${t}</p></div>`).join('')}</div></div><div class="challenge-image" role="img" aria-label="A plumber managing calls and job details at his laptop"><div class="notes"><span>Too many calls?</span><span>Which job is next?</span><span>Did we send<br>the invoice?</span><span>Are we profitable?</span></div></div></section>
<section class="solution" id="solutions" aria-labelledby="solution-title"><div class="solution-inner wrap"><div class="phone-image" role="img" aria-label="MzansiPlumb mobile application design reference"></div><div class="solution-copy"><p class="eyebrow">THE MzansiPlumb SOLUTION</p><h2 id="solution-title">A Complete Plumbing<br>Operations Platform</h2><p>MzansiPlumb brings all your business operations together in one powerful system, helping you work smarter, deliver better service, and grow your business.</p><a class="button" href="#features">Discover the Features <span aria-hidden="true">→</span></a></div><div class="feature-grid" id="features" tabindex="-1">${features.map(([i,t],n)=>`<button class="feature-card" data-feature="${n}">${icon(i)}<span>${t}</span></button>`).join('')}</div></div></section>
<section class="benefits" aria-labelledby="benefits-title"><div class="wrap"><div class="benefits-copy"><p class="eyebrow">WHY CHOOSE MzansiPlumb</p><h2 id="benefits-title">Built for South African<br>Plumbing Businesses</h2><p class="intro">Whether you’re a solo plumber or a large plumbing<br class="desktop-break"> company, MzansiPlumb scales with your business.</p><div class="benefit-grid">${benefits.map(([i,t,d])=>`<div>${icon(i)}<h3>${t}</h3><p>${d}</p></div>`).join('')}</div></div></div></section>
<section class="faq" id="faq" aria-labelledby="faq-title"><div class="faq-inner wrap"><div class="faq-copy"><p class="eyebrow">FREQUENTLY ASKED QUESTIONS</p><h2 id="faq-title">Got Questions?<br>We’ve Got Answers.</h2><p>Find quick answers to the most common questions<br class="desktop-break"> about MzansiPlumb.</p><button class="button" id="all-faqs" aria-expanded="false">View All FAQs <span aria-hidden="true">→</span></button></div><div class="faq-list">${faqs.map(([q,a])=>`<details><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`).join('')}</div></div></section>
</main><footer><div class="wrap footer-inner">${brand()}<nav aria-label="Footer navigation"><a href="#home">Home</a><a href="#features">Features</a><button data-dialog="pricing">Pricing</button><button data-dialog="support">Support</button><button data-dialog="contact">Contact</button></nav><strong>Work Smarter. Grow Bigger.<svg viewBox="0 0 180 15" aria-hidden="true"><path d="M3 7Q80 22 175 2" fill="none" stroke="#ff8a00" stroke-width="3"/></svg></strong></div></footer>
<dialog id="information" aria-labelledby="dialog-title"><div class="dialog-top"><h2 id="dialog-title"></h2><button id="close-dialog" aria-label="Close dialog">×</button></div><p id="dialog-content"></p><button class="button" id="dialog-done">Got it</button></dialog>`;

const messages: Record<string,[string,string]> = {
 signup:['Get Started Free','MzansiPlumb is under development. Account registration is not available yet. No account has been created and no payment details are collected.'],
 signin:['Sign In','Secure workspace sign-in will be available when the operations application launches. No login or password information is collected on this page.'],
 pricing:['Pricing','Pricing will be published before launch. Billing and live payment processing remain disabled.'],
 support:['Support','Support channels and service hours will be published before launch. There is currently no connected support service.'],
 contact:['Contact','Company contact details will be published before launch. This page does not send messages or collect contact information.']
};
const dialog=document.querySelector<HTMLDialogElement>('#information')!;
function show(title:string,content:string){document.querySelector('#dialog-title')!.textContent=title;document.querySelector('#dialog-content')!.textContent=content;dialog.showModal();}
document.querySelectorAll<HTMLButtonElement>('[data-dialog]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.dialog==='signup'||b.dataset.dialog==='signin'){location.href='/app?mode='+b.dataset.dialog;return;}show(...messages[b.dataset.dialog!]);}));
document.querySelectorAll<HTMLButtonElement>('[data-feature]').forEach(b=>b.addEventListener('click',()=>{const targets=['customers','schedule','jobs','quotes','team','maintenance','reports','jobs'];const target=targets[Number(b.dataset.feature)];if(target){location.href='/app#'+target;}else{show(b.textContent!.trim(),'Maintenance reminders are not implemented yet. No reminder or notification has been scheduled.');}}));
for(const id of ['close-dialog','dialog-done']) document.getElementById(id)!.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
const menuToggle=document.querySelector<HTMLButtonElement>('.menu-toggle')!;
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');document.querySelector('#navigation')!.classList.toggle('open',open);});
document.querySelectorAll('#navigation a').forEach(a=>a.addEventListener('click',()=>{menuToggle.setAttribute('aria-expanded','false');document.querySelector('#navigation')!.classList.remove('open');}));
const resources=document.querySelector<HTMLButtonElement>('#resources-toggle')!;
function closeResources(){resources.setAttribute('aria-expanded','false');document.querySelector<HTMLElement>('#resources-menu')!.hidden=true;}
resources.addEventListener('click',()=>{const open=resources.getAttribute('aria-expanded')!=='true';resources.setAttribute('aria-expanded',String(open));document.querySelector<HTMLElement>('#resources-menu')!.hidden=!open;});
document.addEventListener('click',e=>{if(!(e.target as Element).closest('.resources'))closeResources();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeResources();menuToggle.setAttribute('aria-expanded','false');document.querySelector('#navigation')!.classList.remove('open');}});
document.querySelector('#all-faqs')!.addEventListener('click',()=>{const details=[...document.querySelectorAll<HTMLDetailsElement>('.faq-list details')];const expand=details.some(d=>!d.open);details.forEach(d=>d.open=expand);document.querySelector('#all-faqs')!.setAttribute('aria-expanded',String(expand));});
document.querySelectorAll<HTMLImageElement>('.brand img').forEach(img=>{const fallback=()=>{img.hidden=true;img.nextElementSibling!.removeAttribute('hidden');};img.addEventListener('error',fallback);if(img.complete&&img.naturalWidth===0)fallback();});
